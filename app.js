const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const app = express()

if (config.MONGODB_URI) {
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message)
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1)
      }
    })
}

app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

// Health check and version endpoints for monitoring & CI/CD
app.get('/health', (req, res) => {
  res.send('ok')
})

app.get('/version', (req, res) => {
  res.send('1')
})

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

/*
  Serve frontend build
*/
app.use(express.static(path.join(__dirname, 'frontend/dist')))

/*
  React Router fallback (Express 5 compatible)
*/
app.get('/{*path}', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'frontend/dist/index.html')
  )
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
