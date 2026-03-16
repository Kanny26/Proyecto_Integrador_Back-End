import { getAll, getById, create, update, remove } from '../models/user.model.js'

export const getUsers = async (req, res) => {
  try {
    const users = await getAll()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await getById(req.params.id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' })
  }
}

export const createUser = async (req, res) => {
  try {
    const { nombre_completo, documento, rol, activo } = req.body
    if (!nombre_completo || !documento) {
      return res.status(400).json({ error: 'nombre_completo y documento son requeridos' })
    }
    const newUser = await create({ nombre_completo, documento, rol: rol ?? 'user', activo: activo ?? true })
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' })
  }
}

export const updateUser = async (req, res) => {
  try {
    const updated = await update(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const removed = await remove(req.params.id)
    if (!removed) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ message: 'Usuario eliminado correctamente', usuario: removed })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' })
  }
}
