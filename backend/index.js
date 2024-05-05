import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()

const link = process.env.URL

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



app.use('/api/auth', authRoutes)

app.listen(5000, ()=>{
    console.log('Running')
    mongoose.connect(link).then(
        console.log('Connected')
    )
    
})