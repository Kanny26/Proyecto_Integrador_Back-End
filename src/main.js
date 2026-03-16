import express from 'express'
import userRouter from './routes/users.routes.js'
import taskRouter from './routes/tasks.routes.js'

const app = express()
const port = process.env.PORT ?? 3001

app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/tasks', taskRouter)

app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`))
