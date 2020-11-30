const express = require('express')
const path = require('path');
const app = express()
const cors = require('cors')

// general settings
app.use(cors())
app.use((req, res, next) => {
  // Enabling CORS
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, PATCH')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// API
const endpoints = require('./services/endpoints/recipes.js') // file name doesn't affect
app.use('/api/v1/recipes', endpoints)
const userEndpoints = require('./services/endpoints/users.js')
app.use('/api/v1/users', userEndpoints)
const ingredientEndpoints = require('./services/endpoints/ingredients.js')
app.use('/api/v1/ingredients', ingredientEndpoints)

// deployment
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './frontend/build')))
  app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'))
  })
}

// Setting up server
const Port = process.env.PORT || 8080
app.listen(Port, () => {
  console.log('App now running on port', Port)
})
