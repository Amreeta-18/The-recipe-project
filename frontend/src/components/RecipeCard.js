import React, {useContext} from 'react'
import FavoriteImg from '../components/FavoriteImg'
import {Link} from 'react-router-dom'
import {UserInfo} from './UserContext'

function RecipeCard({recipe, fetchRecipes}) {
  const userInfo = useContext(UserInfo)
  
  return (
    <div className='form-recipe'>
      <div className='recipe-card' id='test_search_result_recipe_card'>
        <Link to={`/recipes/${recipe.id}`}>
          <div>
            <img src={recipe.imgurl} className='recipe-img' id='test_search_result_recipe_image' alt={recipe.name} />
            <div className='reicpe-text'>
              <p className='recipe-name' id='test_search_result_recipe_title'> {recipe.name}</p>
            </div>
          </div>
        </Link>
        <div>
          <FavoriteImg
            hasFavorited={recipe.favoritedByCurrentUser}
            userId={userInfo.info.id}
            recipeId={recipe.id}
            refresh={fetchRecipes}
            width={30}
            height={30}
          />
        </div>
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
        }

        .recipe-img {
          max-width: 100%;
          align: center;
          border-radius: 10px;
        }

        .reicpe-text {
          display: flex;
          justify-content: space-between;
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
