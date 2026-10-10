console.log('[DEBUG] app.js: script started')

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

console.log('[DEBUG] app.js: all requires completed')

const app = express()

console.log('[DEBUG] app.js: connecting to MongoDB URI:', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('[DEBUG] app.js: mongoose.connect resolved successfully')
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    console.error('[DEBUG] app.js: mongoose.connect rejected with error:', error.message)
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.json())

if (process.env.NODE_ENV === 'test') {
  console.log('[DEBUG] app.js: loading testing router')
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

console.log('[DEBUG] app.js: module export ready')

module.exports = app