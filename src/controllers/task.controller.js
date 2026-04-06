import { getAll, getById, create, update, remove, updateStatus, assignUsers, getAssignedUsers, removeAssignedUser, filterTasks, getTasksByUser, getDashboardStats } from '../models/task.model.js'

export const getTasks = async (req, res) => {
  try {
    const tasks = await getAll()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' })
  }
}

export const getTask = async (req, res) => {
  try {
    const task = await getById(req.params.id)
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' })
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea' })
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description, status, usuariosAsignados } = req.body
    if (!title) {
      return res.status(400).json({ error: 'El campo title es requerido' })
    }
    const newTask = await create({
      title,
      description: description ?? '',
      status: status ?? 'pendiente',
      usuariosAsignados: usuariosAsignados ?? [],
    })
    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' })
  }
}

export const updateTask = async (req, res) => {
  try {
    const updated = await update(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const removed = await remove(req.params.id)
    if (!removed) return res.status(404).json({ error: 'Tarea no encontrada' })
    res.json({ message: 'Tarea eliminada correctamente', tarea: removed })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' })
  }
}

export const patchTaskStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'El campo status es requerido' })
    const updated = await updateStatus(req.params.id, status)
    if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado de la tarea' })
  }
}

export const assignTaskUsers = async (req, res) => {
  try {
    const { userIds } = req.body
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds debe ser un arreglo con al menos un id' })
    }
    const updated = await assignUsers(req.params.taskId, userIds)
    if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar usuarios a la tarea' })
  }
}

export const getTaskUsers = async (req, res) => {
  try {
    const users = await getAssignedUsers(req.params.taskId)
    if (users === null) return res.status(404).json({ error: 'Tarea no encontrada' })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios de la tarea' })
  }
}

export const removeTaskUser = async (req, res) => {
  try {
    const updated = await removeAssignedUser(req.params.taskId, req.params.userId)
    if (!updated) return res.status(404).json({ error: 'Tarea o asignación no encontrada' })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la asignación' })
  }
}

export const filterTasksHandler = async (req, res) => {
  try {
    const { status, userId, fechaInicio, fechaFin } = req.query
    const tasks = await filterTasks({ status, userId, fechaInicio, fechaFin })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar las tareas' })
  }
}

export const getTasksByUserHandler = async (req, res) => {
  try {
    const tasks = await getTasksByUser(req.params.userId)
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas del usuario' })
  }
}

export const getDashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' })
  }
}
