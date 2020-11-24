import React, {useState, useEffect} from 'react'
import RecipeCard from './RecipeCard'
import {config} from '../lib/config'
const urlJoin = require('url-join')

function PersonalFavorite({userId}) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([])

  const getPersonalFavorites = async () => {
    fetch(urlJoin(config.sous.apiUrl, 'users', 'personalFavorites'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setFavoriteRecipes(data.results)})
      .catch(e => console.log(e))
  }
  
  useEffect(() => {
    getPersonalFavorites()
  }, [userId])

  return (
    <div>
      <h1>FAVORITE RECIPES</h1>
      <div className='recipe-container'>
        {favoriteRecipes[0]
          ? favoriteRecipes.map(recipe => <RecipeCard recipe={recipe} key={recipe.id} fetchRecipes={getPersonalFavorites} />)
          : <p>You haven't added any favorite recipe yet!</p> }
      </div>
      <style jsx='true'>
        {`
          .recipe-container {
            display: flex;
          }
        `}
        </style>  
    </div>
  )
}

export default PersonalFavorite
