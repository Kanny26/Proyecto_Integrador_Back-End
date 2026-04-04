import pool from '../config/db.js'

export const login = async (req, res) => {
  try {
    const { documento } = req.body
    if (!documento) {
      return res.status(400).json({ error: 'El campo documento es requerido' })
    }

    // Buscamos el usuario en MySQL por su documento
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE documento = ?',
      [documento]
    )

    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

    // Verificamos que esté activo (el campo es ENUM: 'activo' | 'inactivo')
    if (user.estado !== 'activo') {
      return res.status(403).json({ error: 'Usuario inactivo' })
    }

    // Token simple en base64 (sin librería externa)
    const payload = { id: user.id, documento: user.documento, rol: user.rol }
    const token = Buffer.from(JSON.stringify(payload)).toString('base64')

    res.json({
      token,
      usuario: {
        id: user.id,
        nombre_completo: user.name,
        rol: user.rol,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Error en la autenticación' })
  }
}
