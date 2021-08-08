// Configuring .env file
require('dotenv').config({ path: './config/config.env' })

// Initializing express server
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')

// Importing database connection file and invoking it
const connectDB = require('./config/database')
connectDB()

const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const { checkUser } = require('./middleware/auth')

// Middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// Set view engine
app.set('view engine', 'ejs')

// Logging for dev env
app.use(morgan('dev'))

// Routes
app.use('*', checkUser)
app.get('/', (req, res) => res.render('login'))
app.use(authRoutes)
app.use(postRoutes)
app.get('*', (req, res) => res.render('error/404'))

// Port set up
const port = process.env.PORT || 8000

// Starting server
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
})