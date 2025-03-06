import express from "express";
import dotenv from 'dotenv'
import { router } from "./routes/routes";

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json())

app.use('/api/v1', router)

app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`)
})