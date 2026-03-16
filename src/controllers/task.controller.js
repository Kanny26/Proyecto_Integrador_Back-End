import { getAll, getById, create, update, remove } from '../models/task.model.js'

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
