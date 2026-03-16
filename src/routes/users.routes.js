import express from 'express'
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.get('/:id', getUser)
userRouter.post('/', createUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter
