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
  return db.tareas
}

export const getById = async (id) => {
  const db = await readDB()
  return db.tareas.find((t) => t.id === id) ?? null
}

export const create = async (taskData) => {
  const db = await readDB()
  const newTask = {
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
    ...taskData,
  }
  db.tareas.push(newTask)
  await writeDB(db)
  return newTask
}

export const update = async (id, taskData) => {
  const db = await readDB()
  const index = db.tareas.findIndex((t) => t.id === id)
  if (index === -1) return null
  db.tareas[index] = { ...db.tareas[index], ...taskData }
  await writeDB(db)
  return db.tareas[index]
}

export const remove = async (id) => {
  const db = await readDB()
  const index = db.tareas.findIndex((t) => t.id === id)
  if (index === -1) return null
  const [removed] = db.tareas.splice(index, 1)
  await writeDB(db)
  return removed
}
