import express from 'express'
import { signup } from '../controlers/auth.controler.js'
import { login } from '../controlers/auth.controler.js'
import { logout } from '../controlers/auth.controler.js'

const router = express.Router()

router.get('/signup', signup)

router.get('/login', login)

router.get('/logout', logout)


export default router