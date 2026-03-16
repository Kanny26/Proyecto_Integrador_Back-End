import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '../../db.json')

const readDB = async () => {
  const data = await readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

const writeDB = async (data) => {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export const getAll = async () => {
  const db = await readDB()
  return db.usuarios
}

export const getById = async (id) => {
  const db = await readDB()
  return db.usuarios.find((u) => u.id === id) ?? null
}

export const create = async (userData) => {
  const db = await readDB()
  const newUser = {
    id: Date.now().toString(),
    ...userData,
  }
  db.usuarios.push(newUser)
  await writeDB(db)
  return newUser
}

export const update = async (id, userData) => {
  const db = await readDB()
  const index = db.usuarios.findIndex((u) => u.id === id)
  if (index === -1) return null
  db.usuarios[index] = { ...db.usuarios[index], ...userData }
  await writeDB(db)
  return db.usuarios[index]
}

export const remove = async (id) => {
  const db = await readDB()
  const index = db.usuarios.findIndex((u) => u.id === id)
  if (index === -1) return null
  const [removed] = db.usuarios.splice(index, 1)
  await writeDB(db)
  return removed
}
