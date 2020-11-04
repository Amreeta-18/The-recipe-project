const express = require('express')
const path = require("path");
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

// For inheriting the DB schema models, we should require the schema files in the models folder 
require("./models/dbSchema.js")
// Inheriting the user schema
require("../models/users.js")
// Once the schema file is loaded we need to instantiate the model using mongoose package like this
var Data = mongoose.model("data") //check for this "data" variable in /models/dbSchema.js then u can understand

var User = mongoose.model("user");
;

//MongoDB configuration 
const MONGOURI = "mongodb://recipeAdmin:recipe123@ds233571.mlab.com:33571/recipedb"

const connect = mongoose.connect(
  MONGOURI
)
.then((res,err)=>{
  if(err) console.log(err)
  console.log("connected to the MongoDB")
})

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
const endpoints = require('./services/endpoints.js') // file name doesn't affect
app.use('/api/v1', endpoints)

// deployment
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './frontend/build')))
  app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'))
  })
}



// let us create a collection(i.e like table in sql) in the MongoDB now

//instantiating the model with dummy data
var dataModel =  new Data({
  ID : "234",
  Total_system_power_factor: "34",
  power_consumed: "23",
  Time : "22:34",
 
})
//creating the collection and insert the data
Data.create(dataModel)
.then((res,err)=>{
  if(err) console.log(err)
  console.log("datas collection created");
})

// Setting up server
const Port = process.env.PORT || 8080
app.listen(Port, () => {
  console.log('App now running on port', Port)
})
