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
      userInfo: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
      }
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
      userInfo: {
        id: newUserInfo.rows[0].id,
        email: newUserInfo.rows[0].email,
        firstName: newUserInfo.rows[0].first_name,
        lastName: newUserInfo.rows[0].last_name,
      },
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

router.route('/personalFavorites').all(jsonParser).post(async (req, res) => {
  try {
    const userId = req.body.userId
    const rawResults = await pgConn.query(`
      SELECT recipes.id,
             recipes.name,
             recipes.imgurl
      FROM favorite_recipes AS fr
      JOIN recipes ON recipes.id = fr.recipe_id
      WHERE user_id = $1
      ORDER BY fr.created_at DESC;`
      , [userId])
    const favoriteRecipes = rawResults.rows.map(recipe => {
      return {
        ...recipe,
        favoritedByCurrentUser: true,
      }
    })
    return res.send({
      ok: true,
      results: favoriteRecipes,
    })
  }
  catch(err) {
    // unexpected errors
    logError(500, 'Exception occurs in endpoint while user trying to favorite a recipe', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and the recipe could not be added to the favorite list of the user.')
  }
})

router.route('/update').all(jsonParser).post(async (req, res) => {
  const validationDefinition = {
    email: [
      validate.notEmpty,
      validate.addCondition(validate.uniqueEmail, req.body.userInfo.id),
      validate.validEmailFormat,
    ],
    password: [
      validate.noSpace,
    ],
  }
  
  const errorMsg = await validate.run(validationDefinition, req.body.userInfo)
  if (errorMsg) return res.status(400).json(errorMsg)

  try {
    const userInfo = req.body.userInfo
    const queryParams = [userInfo.email, userInfo.firstName, userInfo.lastName, userInfo.id]

    // since we didn't store user's password, users can't see it on the frontend
    // so only update the password when the user really change it (type something in the password field)
    const updatePassword = userInfo.password ? 'password = $5,' : ''
    if(userInfo.password) queryParams.push(userInfo.password)

    const updateResult = await pgConn.query(`
      UPDATE users
      SET email = $1,
          ${updatePassword}
          first_name = $2,
          last_name = $3,
          modified_at = NOW()
      WHERE id = $4
      RETURNING id, email, first_name, last_name, created_at, modified_at;`
      , queryParams)
    return res.send({
      ok: true,
      userInfo: {
        id: updateResult.rows[0].id,
        email: updateResult.rows[0].email,
        firstName: updateResult.rows[0].first_name,
        lastName: updateResult.rows[0].last_name,
      },
    })
  }
  catch(err) {
    // unexpected errors
    logError(500, 'Exception occurs in endpoint while user trying to update their personal information', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and the personal information could not be updated by the user.')
  }
})

router.route('/stapleIngredientList').all(jsonParser).post(async (req, res) => {
  try {
    const userId = req.body.userId
    const rawStapleIngredients = await pgConn.query(`
      SELECT 
        i.id,
        i.name
      FROM staple_ingredients AS si
      JOIN ingredients AS i ON i.id = si.ingredient_id
      WHERE user_id = $1
      ORDER BY si.created_at ASC`
      , [userId])

    // reformat the array since PostgreSQL can't return camel case { ingredientId: xxx, ingredientName: xxx,} 
    const finalStapleIngredients = rawStapleIngredients.rows.map(ingredient => {
      return {
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
      }
    })
    return res.send({
      ok: true,
      results: finalStapleIngredients
    })
  }
  catch(err) {
    // unexpected errors
    logError(500, 'Exception occurs in endpoint while user trying to read all their staple ingredients', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and the list of staple ingredients could not be read by the user.')
  }
})

router.route('/updateStaple').all(jsonParser).post(async (req, res) => {
  const validationDefinition = {
    userId: [
      validate.notEmpty,
      validate.isInt,
    ],
    ingredientId: [
      validate.notEmpty,
      validate.isInt,
    ],
  }

  const errorMsg = await validate.run(validationDefinition, req.body)
  if (errorMsg) return res.status(400).json(errorMsg)
  
  try {
    const userId = req.body.userId
    const ingredientId = req.body.ingredientId
    const recordExist = await pgConn.query(`SELECT 1 FROM staple_ingredients WHERE user_id = $1 AND ingredient_id = $2;`, [userId, ingredientId])
    // if the staple record already exist, delete it; otherwise add it
    if(recordExist.rows[0]) {
      await pgConn.query(`DELETE FROM staple_ingredients WHERE user_id = $1 AND ingredient_id = $2;`, [userId, ingredientId])
    }
    else {
      await pgConn.query(`INSERT INTO staple_ingredients (user_id, ingredient_id, created_at) VALUES ($1, $2, NOW());`, [userId, ingredientId])
    }
    return res.send({ok: true})
  }
  catch(err) {
    // unexpected errors
    logError(500, 'Exception occurs in endpoint while user trying to toggle an staple ingredient', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and an staple ingredient could not be toggled by the user.')
  }
})

module.exports = router
