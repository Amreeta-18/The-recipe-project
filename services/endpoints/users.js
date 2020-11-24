const express = require('express')
const router = express.Router()
const {endpointError, logError, generateParamErroes} = require('../util')
const validate = require('../validation')
// DB connection to Heroku's PostgreSQL
const pgConn = require('../dbConnection')

// Body Parser Middleware
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

router.route('/login').all(jsonParser).post(async (req, res) => {
  const validationDefinition = {
    email: [
      validate.notEmpty,
    ],
    password: [
      validate.notEmpty,
    ],
  }
  
  const errorMsg = await validate.run(validationDefinition, req.body.userInfo)
  if (errorMsg) return res.status(400).json(errorMsg)

  try {
    const userInfo = req.body.userInfo
    const result = await pgConn.query(`SELECT id, email, first_name, last_name, created_at, modified_at FROM users WHERE email = $1 and password = $2;`, [userInfo.email, userInfo.password])
    if(!result.rows[0]) return endpointError(res, 400, 'BadRequest', 'Incorrect email or password.')
    return res.send({
      ok: true,
      userInfo: result.rows[0],
    })
  }
  catch(err) {
    // handle unexpected errors caused by server or any other places that is not related to user's action
    logError(500, 'Exception occurs in endpoint while searching for user info by email and password', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and the user info could not be found by email and password.')
  }
})

router.route('/register').all(jsonParser).post(async (req, res) => {
  const validationDefinition = {
    email: [
      validate.notEmpty,
      validate.validEmailFormat,
      validate.uniqueEmail,
    ],
    password: [
      validate.notEmpty,
      validate.noSpace,
    ],
  }
  
  const errorMsg = await validate.run(validationDefinition, req.body.userInfo)
  if (errorMsg) return res.status(400).json(errorMsg)
  
  try {
    const userInfo = req.body.userInfo
    const now = new Date()
    const newUserInfo = await pgConn.query(`INSERT INTO users (email, password, created_at) VALUES ($1, $2, $3) RETURNING id, email, first_name, last_name, created_at, modified_at;`, [userInfo.email, userInfo.password, now])
    return res.send({
      ok: true,
      userInfo: newUserInfo.rows[0],
    })
  }
  catch(err) {
    // unexpected errors
    logError(500, 'Exception occurs in endpoint while searching for user info by email and password', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and the user info could not be found by email and password.')
  }
})

router.route('/favorite').all(jsonParser).post(async (req, res) => {
  const validationDefinition = {
    userId: [
      validate.notEmpty,
      validate.isInt,
    ],
    recipeId: [
      validate.notEmpty,
      validate.isInt,
    ],
  }
  
  const errorMsg = await validate.run(validationDefinition, req.body)
  if (errorMsg) return res.status(400).json(errorMsg)
  
  try {
    const userId = req.body.userId
    const recipeId = req.body.recipeId
    // check if this record exist
    const exist = await pgConn.query(`SELECT * FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2;`, [userId, recipeId])
    // delete the record if it's already exist (unlike)
    if(exist.rows[0]) await pgConn.query(`DELETE FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2;`, [userId, recipeId])
    // add record if nothing was found (like)
    else await pgConn.query(`INSERT INTO favorite_recipes (user_id, recipe_id, created_at) VALUES ($1, $2, NOW());`, [userId, recipeId])
    return res.send({ok: true})
  }
  catch(err) {
    // unexpected errors
    logError(500, 'Exception occurs in endpoint while user trying to favorite a recipe', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and the recipe could not be added to the favorite list of the user.')
  }
})

module.exports = router
