import pool from '../config/db.js'

// ─── SQL Helpers ────────────────────────────────────────────────────────────

// Obtiene los IDs de usuarios asignados para una o varias tareas
const getUsersForTasks = async (taskIds) => {
  if (taskIds.length === 0) return {}
  
  const [rows] = await pool.query(
    'SELECT task_id, user_id FROM task_assignments WHERE task_id IN (?)',
    [taskIds]
  )
  
  // Agrupar por task_id: { "1": ["102", "105"], "2": ["102"] }
  return rows.reduce((acc, row) => {
    if (!acc[row.task_id]) acc[row.task_id] = []
    acc[row.task_id].push(String(row.user_id))
    return acc
  }, {})
}

const normalizeTask = (task, assignments = []) => {
  if (!task) return null
  return {
    ...task,
    fecha: task.created_ud, // El frontend espera 'fecha'
    usuariosAsignados: assignments
  }
}

// ─── Obtener todas las tareas ────────────────────────────────────────────────
export const getAll = async () => {
  const [tasks] = await pool.query('SELECT * FROM tasks')
  if (tasks.length === 0) return []

  const assignmentsMap = await getUsersForTasks(tasks.map(t => t.id))
  return tasks.map(t => normalizeTask(t, assignmentsMap[t.id] || []))
}

// ─── Obtener una tarea por ID ────────────────────────────────────────────────
export const getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id])
  if (rows.length === 0) return null

  const assignmentsMap = await getUsersForTasks([id])
  return normalizeTask(rows[0], assignmentsMap[id] || [])
}

// ─── Crear una nueva tarea ───────────────────────────────────────────────────
export const create = async (taskData) => {
  const {
    title,
    description = '',
    status = 'pendiente',
    usuariosAsignados = [],
  } = taskData

  const [result] = await pool.query(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
    [title, description, status]
  )

  const taskId = result.insertId

  if (usuariosAsignados.length > 0) {
    const assignValues = usuariosAsignados.map((userId) => [taskId, userId])
    await pool.query(
      'INSERT INTO task_assignments (task_id, user_id) VALUES ?',
      [assignValues]
    )
  }

  const [created] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId])
  return normalizeTask(created[0], usuariosAsignados.map(String))
}

// ─── Actualizar una tarea ────────────────────────────────────────────────────
export const update = async (id, taskData) => {
  const { title, description, status, usuariosAsignados } = taskData

  const fields = []
  const values = []

  if (title       !== undefined) { fields.push('title = ?');       values.push(title)       }
  if (description !== undefined) { fields.push('description = ?'); values.push(description) }
  if (status      !== undefined) { fields.push('status = ?');      values.push(status)      }

  // Actualizar campos básicos
  if (fields.length > 0) {
    values.push(id)
    await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
  }

  // Actualizar asignaciones si se envían en el body
  if (usuariosAsignados !== undefined) {
    // Borramos asignaciones previas
    await pool.query('DELETE FROM task_assignments WHERE task_id = ?', [id])

    // Insertamos las nuevas
    if (Array.isArray(usuariosAsignados) && usuariosAsignados.length > 0) {
      const assignValues = usuariosAsignados.map((userId) => [id, userId])
      await pool.query(
        'INSERT INTO task_assignments (task_id, user_id) VALUES ?',
        [assignValues]
      )
    }
  }

  return getById(id)
}

// ─── Eliminar una tarea ──────────────────────────────────────────────────────
export const remove = async (id) => {
  const task = await getById(id)
  if (!task) return null

  // Primero borramos las asignaciones
  await pool.query('DELETE FROM task_assignments WHERE task_id = ?', [id])
  await pool.query('DELETE FROM tasks WHERE id = ?', [id])
  
  return task
}

// ─── Cambiar solo el estado de una tarea ────────────────────────────────────
export const updateStatus = async (id, status) => {
  const [result] = await pool.query(
    'UPDATE tasks SET status = ? WHERE id = ?',
    [status, id]
  )
  if (result.affectedRows === 0) return null

  return getById(id)
}

// ─── Asignar usuarios a una tarea ───────────────────────────────────────────
export const assignUsers = async (taskId, userIds) => {
  const [task] = await pool.query('SELECT id FROM tasks WHERE id = ?', [taskId])
  if (task.length === 0) return null

  const values = userIds.map((uid) => [taskId, uid])
  await pool.query(
    'INSERT IGNORE INTO task_assignments (task_id, user_id) VALUES ?',
    [values]
  )

  return getById(taskId)
}

// ─── Obtener usuarios asignados a una tarea (objetos de usuario completos) ──
export const getAssignedUsers = async (taskId) => {
  const [tasks] = await pool.query('SELECT id FROM tasks WHERE id = ?', [taskId])
  if (tasks.length === 0) return null

  const [users] = await pool.query(
    `SELECT 
      u.id, 
      u.name AS nombre_completo, 
      u.documento, 
      u.rol, 
      (u.estado = 'activo') AS activo
     FROM users u
     INNER JOIN task_assignments ta ON ta.user_id = u.id
     WHERE ta.task_id = ?`,
    [taskId]
  )
  
  return users.map(u => ({ ...u, activo: Boolean(u.activo) }))
}

// ─── Quitar un usuario de una tarea ─────────────────────────────────────────
export const removeAssignedUser = async (taskId, userId) => {
  const [result] = await pool.query(
    'DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?',
    [taskId, userId]
  )
  if (result.affectedRows === 0) return null

  return getById(taskId)
}

// ─── Filtrar tareas ──────────────────────────────────────────────────────────
export const filterTasks = async ({ status, priority, userId, fechaInicio, fechaFin }) => {
  let query = 'SELECT DISTINCT t.* FROM tasks t'
  const params = []

  if (userId) {
    query += ' INNER JOIN task_assignments ta ON ta.task_id = t.id'
  }

  const conditions = []
  if (status)      { conditions.push('t.status = ?');              params.push(status)     }
  if (userId)      { conditions.push('ta.user_id = ?');            params.push(userId)     }
  if (fechaInicio) { conditions.push('t.created_ud >= ?');         params.push(fechaInicio)}
  if (fechaFin)    { conditions.push('t.created_ud <= ?');         params.push(fechaFin)   }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }

  const [tasks] = await pool.query(query, params)
  if (tasks.length === 0) return []

  const assignmentsMap = await getUsersForTasks(tasks.map(t => t.id))
  return tasks.map(t => normalizeTask(t, assignmentsMap[t.id] || []))
}

// ─── Obtener tareas de un usuario ────────────────────────────────────────────
export const getTasksByUser = async (userId) => {
  const [tasks] = await pool.query(
    `SELECT t.* FROM tasks t
     INNER JOIN task_assignments ta ON ta.task_id = t.id
     WHERE ta.user_id = ?`,
    [userId]
  )
  
  if (tasks.length === 0) return []

  const assignmentsMap = await getUsersForTasks(tasks.map(t => t.id))
  return tasks.map(t => normalizeTask(t, assignmentsMap[t.id] || []))
}

// ─── Estadísticas del dashboard ─────────────────────────────────────────────
export const getDashboardStats = async () => {
  const [[{ totalUsuarios }]] = await pool.query(
    'SELECT COUNT(*) AS totalUsuarios FROM users'
  )
  const [[{ usuariosActivos }]] = await pool.query(
    "SELECT COUNT(*) AS usuariosActivos FROM users WHERE estado = 'activo'"
  )
  const [[{ totalTareas }]] = await pool.query(
    'SELECT COUNT(*) AS totalTareas FROM tasks'
  )
  const [[{ pendiente }]] = await pool.query(
    "SELECT COUNT(*) AS pendiente FROM tasks WHERE status = 'pendiente'"
  )
  const [[{ en_proceso }]] = await pool.query(
    "SELECT COUNT(*) AS en_proceso FROM tasks WHERE status = 'en proceso'"
  )
  const [[{ completada }]] = await pool.query(
    "SELECT COUNT(*) AS completada FROM tasks WHERE status = 'completada'"
  )

  return {
    totalUsuarios,
    usuariosActivos,
    totalTareas,
    tareasPorEstado: {
      pendiente,
      'en proceso': en_proceso,
      completada,
    },
  }
}
