// const Router = require('express')
import Router from 'express'
const router = new Router()

// const userRouter = require("./userRouter");
import userRouter from './userRouter.js'

router.use("/user", userRouter)

export default router
