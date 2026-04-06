import { getAll, getById, create, update, remove, toggleStatus } from '../models/user.model.js'
import { getTasksByUser } from '../models/task.model.js'

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

    // Validar que el rol sea uno de los permitidos por la BD
    const rolesValidos = ['admin', 'user']
    if (rol && !rolesValidos.includes(rol)) {
      return res.status(400).json({ error: "El rol debe ser 'admin' o 'user'" })
    }

    const newUser = await create({ nombre_completo, documento, rol: rol ?? 'user', activo: activo ?? true })
    res.status(201).json(newUser)
  } catch (error) {
     // Documento duplicado → 409 Conflict en vez de 500
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El documento ya está registrado' })
    }
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
    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    let payload
    // try {
    //   const token = authHeader.split(' ')[1]
    //   payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    // } catch {
    //   return res.status(401).json({ error: 'Token inválido' })
    // }

    // Solo admin puede eliminar usuarios
    if (payload.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para eliminar usuarios' })
    }

    // Un administrador no puede eliminarse a sí mismo
    if (String(payload.id) === String(req.params.id)) {
      return res.status(403).json({ error: 'No puedes eliminar tu propio usuario' })
    }

    // No se puede eliminar un usuario con tareas asignadas
    const tareas = await getTasksByUser(req.params.id)
    if (tareas.length > 0) {
      return res.status(409).json({ error: 'No se puede eliminar el usuario porque tiene tareas asignadas' })
    }

    const removed = await remove(req.params.id)
    if (!removed) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ message: 'Usuario eliminado correctamente', usuario: removed })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' })
  }
}

export const toggleUserStatus = async (req, res) => {
  try {
    const updated = await toggleStatus(req.params.id)
    if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado del usuario' })
  }
}
