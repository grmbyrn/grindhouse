import dotenv from 'dotenv'
dotenv.config()
import validateEnv from './config/env.js'
import connectDB from './config/db.js'
import app from './app.js'
const port = process.env.PORT || 5000

validateEnv()
connectDB()

app.listen(port, () => console.log(`Server running on port ${port}`))
