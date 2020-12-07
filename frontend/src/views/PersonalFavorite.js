import React, {useState, useEffect, useContext} from 'react'
import RecipeCard from '../components/RecipeCard'
import PersonalPageTabs from '../components/PersonalPageTabs'
import {UserInfo} from '../components/UserContext'
import {config} from '../lib/config'
import BackgroundImg from '../images/Pumpkin Cinnamon Bread6.png' 
const urlJoin = require('url-join')

function PersonalFavorite() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const userInfo = useContext(UserInfo)
  
  const imgs = [
    BackgroundImg
  ]

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
        setFavoriteRecipes(data.results)})
      .catch(e => console.log(e))
  }
  
  useEffect(() => {
    getPersonalFavorites()
  }, [userInfo])

  return (
    <div className='content-container'>
      <PersonalPageTabs name={userInfo.info.name}/>
			<div className='popular-title'>
				<p>FAVORITE RECIPES</p>
        <div className='horizontal-line'/>
			</div>

      <div className='recipe-container'>
        {favoriteRecipes[0]
          ? favoriteRecipes.map(recipe => <RecipeCard recipe={recipe} key={recipe.id} fetchRecipes={getPersonalFavorites} matchPerfect={false}/>)
          : <p>You haven't added any favorite recipe yet!</p>
          }
      </div>

      <style jsx='true'>
        {`
        .horizontal-line{
          position: relative;
          width: 30%;
          height: 0.5px;
          background: #282c34;
          top: -26px;
          right: -54px;
        }

        .recipe-container {
          display: flex;
          text-align: center;
          position: absolute;
          top: 41%;
          left: 18%;
          color: #998848;
          }

    		.popular-title {
					font-family: Rambla;
          color: #7C630B;
          font-size: 32px;
          text-align: left;
          padding: 0px 13px 13px 172px;
          position: relative;
          font-weight: bolder;
          top: -65px;
				}
        `}
      </style>  
    </div>
  )
}

export default PersonalFavorite
