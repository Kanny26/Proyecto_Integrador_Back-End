import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import './config/db.js' // Inicializa y prueba la conexión MySQL al arrancar
import userRouter from './routes/users.routes.js'
import taskRouter from './routes/tasks.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import authRouter from './routes/auth.routes.js'
import { getTasksByUserHandler } from './controllers/task.controller.js'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.use(express.static('dist'))
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/dashboard', dashboardRouter)

// RF-B17: GET /api/users/:userId/tasks
app.get('/api/users/:userId/tasks', getTasksByUserHandler)

app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`))
