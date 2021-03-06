require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')


const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.use('/api', authRouter)

const PORT = process.env.PORT
const URL = process.env.MONGO_URL

mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB!!!')
    }
)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:8080`)
})

