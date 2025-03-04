import express from "express";
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json())

app.get('/', (req, res)=>{
    console.log("hello there")
})

app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`)
})