const express = require('express')
const router = express.Router()
const validate = require('../validation')

// Body Parser Middleware
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const {endpointError, logError} = require('../util')
const pgConn = require('../dbConnection')

router.route('/findByIngredients').all(jsonParser).post(async (req, res) => {
  try {
    // if user is logged in, find all their favorited recipes and staple ingredients
    const userId = req.body.userId
    const userFavorites = await pgConn.query(`SELECT * FROM favorite_recipes WHERE user_id = $1;`, [userId])
    const favoriteRecords = {}
    // turn the result array into object so that later we can search connection by recipe id
    userFavorites.rows.forEach(favorite => favoriteRecords[favorite.recipe_id] = true)

    // get staple ingredients
    const staples = await pgConn.query(`
      SELECT
        i.id,
        i.name
      FROM staple_ingredients AS si
      JOIN ingredients AS i ON i.id = si.ingredient_id
      WHERE si.user_id = $1;`, [userId])
    const stapleIngredients = staples.rows.map(ingredient => ingredient.name)

    const queryIngredients = req.body.queryIngredients
    // combine user's staple ingredients with their query ingredients
    const allUserIngredients = queryIngredients.concat(stapleIngredients)
    // SQL: WHERE name SIMILAR TO '%string1|string2%'
    const newQuery = `%(${allUserIngredients.join('|').toLowerCase()})%`
    const findIngredientResults = await pgConn.query(`SELECT * FROM ingredients WHERE name SIMILAR TO $1;`,[newQuery])
    const ingredientIds = findIngredientResults.rows.map(ingredient => ingredient.id)
    const results = await pgConn.query(`
      SELECT rc.id,
             rc.name,
             rc.imgurl,
             COALESCE(COUNT(i.id), 0) + COALESCE(MAX(i.score), 0) AS total,
             COALESCE((SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id = rc.id), 0) - COALESCE(COUNT(i.id), 0) AS total_matched
      FROM (
        SELECT ir.recipe_id
        FROM recipe_ingredients AS ir
        WHERE ingredient_id = ANY ($1)
        GROUP BY ir.recipe_id
      ) AS r
      LEFT JOIN (
        SELECT * FROM recipe_ingredients
        WHERE NOT (ingredient_id = ANY ($1))
      ) AS ir
        ON ir.recipe_id = r.recipe_id
      LEFT JOIN ingredients AS i ON i.id = ir.ingredient_id
      JOIN recipes AS rc ON rc.id = r.recipe_id
      GROUP BY rc.id
      ORDER BY total_matched DESC, total ASC
      `, [ingredientIds])
      // ORDER BY total_matched DESC, total ASC
    if(!results.rows[0]) return endpointError(res, 400, 'BadRequest', 'Incorrect email or password.')

    const finalResult = results.rows.map(result => {
      return {
        ...result,
        favoritedByCurrentUser:favoriteRecords[result.id] ? true : false
      }
    })

    return res.send({
      ok: true,
      results: finalResult,
    })
  }
  catch(err) {
    // handle unexpected errors caused by server or any other places that is not related to user's action
    logError(500, 'Exception occurs in endpoint while searching for recipes by ingredients', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and recipes could not be found by ingredients.')
  }
})

router.route('/popular').get(async (req, res) => {
  try {
    // get recipe info
    const rawResults = await pgConn.query(`SELECT id, name, imgurl FROM recipes ORDER BY spoonacular_score DESC LIMIT 12;`)
    return res.send({
      ok: true,
      results: rawResults.rows,
    })
  }
  catch(err) {
    logError(500, 'Exception occurs in endpoint while trying to read popular recipes.', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and popular recipes could not be read.')
  }
})

router.route('/:id').all(jsonParser).post(async (req, res) => {
  const recipeId = req.params.id
  try {
    // get recipe info
    const rawResult = await pgConn.query(`SELECT * FROM recipes WHERE id = $1;`,[recipeId])
    const parsedInstruction = JSON.parse(rawResult.rows[0].instructions)
    const parsedNutrition = JSON.parse(rawResult.rows[0].nutrition)

    // get user id and check have this user favorited this recipe or not
    const userId = req.body.userId
    const hasFavorited = await pgConn.query(`SELECT * FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2;`, [userId, recipeId])

    // get related ingredients
    const rawIngredients = await pgConn.query(`
      SELECT
        i.name,
        i.unit,
        ri.amount,
        ri.original_desc
      FROM recipe_ingredients AS ri
      JOIN ingredients AS i ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = $1;
      `,[recipeId])
    const parsedIngredients = rawIngredients.rows.map(ingredient => {return {...ingredient, amount: ingredient.amount / 100}})

    // combine them into 1 object and return
    const fullResult = {
      // copy all items
      ...rawResult.rows[0],
      // replace the original string with the parsed object
      instructions: parsedInstruction,
      nutrition: parsedNutrition,
      ingredients: parsedIngredients,
      favoritedByCurrentUser: hasFavorited.rows[0] ? true : false,
    }
    return res.send({
      ok: true,
      result: fullResult,
    })
  }
  catch(err) {
    logError(500, 'Exception occurs in endpoint while trying to read this recipe.', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and this recipe could not be read.')
  }
})

module.exports = router
