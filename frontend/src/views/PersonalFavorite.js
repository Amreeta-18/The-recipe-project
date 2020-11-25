import React, {useState, useEffect, useContext} from 'react'
import RecipeCard from '../components/RecipeCard'
import {UserInfo} from '../components/UserContext'
import {config} from '../lib/config'
const urlJoin = require('url-join')

function PersonalFavorite() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const userInfo = useContext(UserInfo)

  const getPersonalFavorites = async () => {
    fetch(urlJoin(config.sous.apiUrl, 'users', 'personalFavorites'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        userId: userInfo.info.id,
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
  }, [userInfo])

  return (
    <div className='content-container'>
      <span>FAVORITE RECIPES</span>
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
