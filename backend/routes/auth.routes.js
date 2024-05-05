import express from 'express'
import { getMe, signup } from '../controlers/auth.controler.js'
import { login } from '../controlers/auth.controler.js'
import { logout } from '../controlers/auth.controler.js'
import { User } from '../models/user.model.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.get('/me', protectRoute, getMe)

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)




export default router