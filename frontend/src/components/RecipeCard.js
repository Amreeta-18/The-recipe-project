import React, {useContext, useEffect} from 'react'
import FavoriteImg from '../components/FavoriteImg'
import Star from '../images/perfect-match-star.png'
import {Link} from 'react-router-dom'
import {UserInfo} from './UserContext'

function RecipeCard({recipe, fetchRecipes, matchPerfect}) {
  const userInfo = useContext(UserInfo)
  
  return (
    <div className='form-recipe'>
      <div className='recipe-card' id='test_search_result_recipe_card'>
        <Link to={`/recipes/${recipe.id}`}>
          <img src={recipe.imgurl} className='recipe-img' id='test_search_result_recipe_image' alt={recipe.name} />
          <div className='reicpe-text'>
            <p className='recipe-name' id='test_search_result_recipe_title'> {recipe.name}</p>
          </div>
        </Link>

        <div className='favorite-heart' id='test_search_result_recipe_favorite'>
          <FavoriteImg
            hasFavorited={recipe.favoritedByCurrentUser}
            userId={userInfo.info.id}
            recipeId={recipe.id}
            refresh={fetchRecipes}
            width={30}
            height={30}
          />
        </div>

        {
         recipe.total == recipe.total_matched && matchPerfect
          ? <div className='match-container'>
              <img className='match-star' src={Star}/>
              <p className='match-text'>Perfect Match</p>
              <img className='match-star' src={Star}/>
            </div>
          : <div/>
        }
      </div>
      <style jsx='true'>
        {`        
        .form-recipe {
          max-width:100%;
          justify-content: center;
        }

        .recipe-card {
          padding: 15px;
          background-color: white;
          max-height: 250px;
          max-width: 240px;
          justify-content:center;
          border-radius: 15px;
          margin-bottom: 20px;
          margin-left: auto;
          margin-right: auto;
          overflow-y: hidden;
        }

        .recipe-img {
          max-width: 100%;
          align: center;
          border-radius: 10px;
        }

        .reicpe-text {
          display: flex;
          justify-content: space-between;
          min-height: 40px;
          max-width: 210px;
          display:inline-block;
        }

        .match-container {
          text-align: center;
        }

        .favorite-heart {
          float: right;
        }

        .match-star {
          height: 25px;
          width: 25px
          display:inline-block;
        }

        .match-text{
          display:inline-block;
          margin: 0px;
          font-family: Sedan;
          color: rgba(108, 108, 108, 1);
          font-size: 15px;
          padding: 0px 5px 0px 5px;
        }

        .recipe-name {
          margin: 0px;
          font-family: Sedan;
          color: rgba(108, 108, 108, 1);
          font-size: 15px;
        }

        .like-icon {
          width: 20px;
          z-index: 1;
        }
        `}
      </style>
    </div>
  )
}

export default RecipeCard
