const express = require('express')
const router = express.Router()

// Body Parser Middleware
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const {endpointError, logError} = require('../util')
const pgConn = require('../dbConnection')

router.route('/').get(async (req, res) => {
  try {
    const results = await pgConn.query(`
      SELECT 
        id,
        name
      FROM ingredients;`)
    return res.send({
      ok: true,
      results: results.rows,
    })
  }
  catch(err) {
    // handle unexpected errors caused by server or any other places that is not related to user's action
    logError(500, 'Exception occurs in endpoint while searching for the list of all ingredients', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and the list of all ingredients could not be found.')
  }
})

router.route('/unscored').all(jsonParser).get(async (req, res) => {
  try {
    const result = await pgConn.query(`
      SELECT 
        id,
        name,
        aisle,
        consistency,
        unit,
        score
      FROM ingredients 
      WHERE score IS NULL;`)
    if(!result.rows[0]) return res.send({message: 'All ingredients has a score!'})
    return res.send({
      ok: true,
      result: result.rows,
    })
  }
  catch(err) {
    // handle unexpected errors caused by server or any other places that is not related to user's action
    logError(500, 'Exception occurs in endpoint while searching for unscored ingredients', err)
    return endpointError(res, 500, 'InternalServerError', 'Something went wrong and unscored ingredients could not be found.')
  }
})

module.exports = router
