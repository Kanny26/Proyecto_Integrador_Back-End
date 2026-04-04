import pool from '../config/db.js'

// Alias SQL que traduce los nombres de columna de la BD
// al formato que espera el frontend (nombre_completo, activo)
const SELECT_USER = `
  SELECT
    id,
    name          AS nombre_completo,
    documento,
    rol,
    (estado = 'activo') AS activo
  FROM users
`

// ─── Obtener todos los usuarios ─────────────────────────────────────────────
export const getAll = async () => {
  const [rows] = await pool.query(SELECT_USER)
  return rows.map(normalizar)
}

// ─── Obtener un usuario por ID ───────────────────────────────────────────────
export const getById = async (id) => {
  const [rows] = await pool.query(`${SELECT_USER} WHERE id = ?`, [id])
  return rows[0] ? normalizar(rows[0]) : null
}

// ─── Obtener un usuario por documento (para login) ──────────────────────────
export const getByDocumento = async (documento) => {
  const [rows] = await pool.query(`${SELECT_USER} WHERE documento = ?`, [documento])
  return rows[0] ? normalizar(rows[0]) : null
}

// ─── Crear un nuevo usuario ──────────────────────────────────────────────────
export const create = async (userData) => {
  const { nombre_completo, documento, rol = 'user', activo = true } = userData
  const estado = activo ? 'activo' : 'inactivo'

  const [result] = await pool.query(
    'INSERT INTO users (name, documento, rol, estado) VALUES (?, ?, ?, ?)',
    [nombre_completo, documento, rol, estado]
  )

  const [created] = await pool.query(`${SELECT_USER} WHERE id = ?`, [result.insertId])
  return normalizar(created[0])
}

// ─── Actualizar un usuario ───────────────────────────────────────────────────
export const update = async (id, userData) => {
  const { nombre_completo, documento, rol, activo } = userData

  const fields = []
  const values = []

  if (nombre_completo !== undefined) { fields.push('name = ?');      values.push(nombre_completo) }
  if (documento       !== undefined) { fields.push('documento = ?'); values.push(documento)       }
  if (rol             !== undefined) { fields.push('rol = ?');        values.push(rol)             }
  if (activo          !== undefined) {
    fields.push('estado = ?')
    values.push(activo ? 'activo' : 'inactivo')
  }

  if (fields.length === 0) return null

  values.push(id)
  const [result] = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  )

  if (result.affectedRows === 0) return null

  const [updated] = await pool.query(`${SELECT_USER} WHERE id = ?`, [id])
  return normalizar(updated[0])
}

// ─── Eliminar un usuario ─────────────────────────────────────────────────────
export const remove = async (id) => {
  const [rows] = await pool.query(`${SELECT_USER} WHERE id = ?`, [id])
  if (rows.length === 0) return null

  await pool.query('DELETE FROM users WHERE id = ?', [id])
  return normalizar(rows[0])
}

// ─── Alternar estado activo/inactivo ────────────────────────────────────────
export const toggleStatus = async (id) => {
  const [rows] = await pool.query('SELECT estado FROM users WHERE id = ?', [id])
  if (rows.length === 0) return null

  const nuevoEstado = rows[0].estado === 'activo' ? 'inactivo' : 'activo'
  await pool.query('UPDATE users SET estado = ? WHERE id = ?', [nuevoEstado, id])

  const [updated] = await pool.query(`${SELECT_USER} WHERE id = ?`, [id])
  return normalizar(updated[0])
}

// ─── Helper: convierte activo de 0/1 (BIT) a boolean real ──────────────────
const normalizar = (user) => {
  if (!user) return null
  return { ...user, activo: Boolean(user.activo) }
}
