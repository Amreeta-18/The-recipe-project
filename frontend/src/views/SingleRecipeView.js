import React, {useState, useEffect, useContext} from 'react'
import SearchBar from '../components/SearchBar'
import FavoriteImg from '../components/FavoriteImg'
import {config} from '../lib/config'
import {useHistory} from 'react-router-dom'
import {UserInfo} from '../components/UserContext'
// icons
import TitleIcon from '../images/pg3_recipename.svg'
import NutritionIcon from '../images/pg3_nutritionfacts.png'
import CalIcon from '../images/pg3_calorie.svg'
import YieldIcon from '../images/pg3_yield.svg'
import TimeIcon from '../images/pg3_time.svg'
const urlJoin = require('url-join')

function SingleRecipeView({match}) {
  const history = useHistory()
  const userInfo = useContext(UserInfo)
  const [queryString, setQueryString] = useState()
  const [recipe, setRecipe] = useState()
  const displayedNutrients = [
    'Protein',
    'Carbohydrates',
    'Fat',
    'Cholesterol',
    'Sodium',
  ]

  const fetchOneRecipe = async () => {
    const recipeId = match.params.id
    fetch(urlJoin(config.sous.apiUrl, `/recipes/${recipeId}`), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        userId: userInfo.info.id,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if(data.ok) setRecipe(data.result)
      })
  }

  useEffect(() => {
    fetchOneRecipe()
  }, [])

  const submitHandler = (e) => {
    // e.preventDefault()
    // when user hit enter, redirect them to /result page with what they typed in the search bar
    history.push({pathname: `/result`, state: {queryString: queryString}})
  }

  const handleFavorite = (recipeId) => {
    if(userInfo?.isLoggedIn) {
      fetch(urlJoin(config.sous.apiUrl, 'users', 'favorite'), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.info.id,
          recipeId: recipeId,
        }),
      })
        .catch(e => console.log(e))
      // get the recipe info again to change the color of the heart when the user favorites the recipe successfully
      fetchOneRecipe()  
    }
  }

  return (
    <div>
      <div className='searchbar-container'>
        <SearchBar onSubmit={submitHandler} queryString={queryString} setQueryString={setQueryString} />
      </div>
      <div className='stripe' />
      {recipe && (
        <div className='recipe-container'>
          <div className='row'>
            <div>
              <img src={recipe.imgurl} alt={recipe.name} className='recipe-img' id='test_single_recipe_image'/><br />
              <FavoriteImg
                hasFavorited={recipe.favoritedByCurrentUser}
                userId={userInfo.info.id}
                recipeId={recipe.id}
                refresh={fetchOneRecipe}
                width={30}
                height={30}
              />
            </div>
            <div>
              <div className='row'>
                <img src={TitleIcon} alt='title icon' className='header-icon' id='test_single_recipe_title_icon' />
                <p className='title-text' id='test_single_recipe_title'>{recipe.name}</p>
              </div>
              {/* title, and other information */}
              <div className='row'>
                <div className='header-icon'>
                  <img src={NutritionIcon} alt='nutrition icon' className='nutrition-icon' />
                </div>
                <div>
                  <p className='header-sub-title nutrition-title'>Nutritional Facts (per serving):</p>
                  {/* only list the nutritions that we want to show to users */}
                  {recipe.nutrition.map(nutruent => {
                    if(displayedNutrients.includes(nutruent.title)) {
                      return <p 
                        key={nutruent.title} 
                        className='header-container' 
                        id='test_single_recipe_nutrients'>
                          <div className='header-content'>{nutruent.title} {nutruent.amount}{nutruent.unit} </div>
                          <div className='header-content'>{nutruent.percentOfDailyNeeds}% DV</div>
                        </p>
                    }
                    else return null
                  })}
                  <p className='daily-value'>*Percent Daily Values are based on a 2,000 calorie diet. </p>
                  <div className='row recipe-misc-container'>
                    {/* calories */}
                    <div className='row recipe-misc'>
                      <img src={CalIcon} alt='calorie icon' />
                      <div>
                        <p className='header-sub-title'>CALORIES:</p>
                        <p className='misc-content' id='test_single_recipe_calories'>{recipe.nutrition[0].amount} Calories</p>
                        <p className='misc-content'>Per Serving</p>
                      </div>
                    </div>
                    {/* yield */}
                    <div className='row recipe-misc'>
                      <img src={YieldIcon} alt='yield icon' />
                      <div>
                        <p className='header-sub-title'>YIELD:</p>
                        <p className='misc-content' id='test_single_recipe_serving'>{recipe.servings} Serving{recipe.servings > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {/* timing */}
                    <div className='row recipe-misc'>
                      <img src={TimeIcon} alt='time icon' />
                      <div>
                        <p className='header-sub-title'>TIMING:</p>
                        <p className='misc-content' id='test_single_recipe_cook_time'>{recipe.ready_in_minutes} Minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row body-container'>
            <div className='instruction-container'>
              <p className='body-title'>Directions:</p>
              {recipe.instructions?.map((instruction, idx) => {
                return (
                  <div key={idx + 1}>
                    <p className='body-text'>Step {idx + 1}</p>
                    <p className='instruction-step' id='test_single_recipe_instructions'>{instruction.step}</p>
                  </div>
                )
              })}
            </div>
            <div className='ingredient-container'>
              <div className='sticky'>
                <p className='body-title'>Ingredients:</p>
                {recipe.ingredients.map((ingredient, idx) => {
                  const amountDesc = /\D*\d+\D*/.test(ingredient.original_desc) ? '' : `${ingredient.amount} ${ingredient.unit} `
                  return <p key={idx} className='body-text' id='test_single_recipe_ingredients'>{amountDesc}{ingredient.original_desc}</p>
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx='true'>
        {`
        .searchbar-container {
          display: flex;
          justify-content: center;
          padding-top: 30px;
          padding-bottom: 45px;
        }

        .stripe {
          width: 100%;
          height: 460px;
          background-color: var(--c-light-brown);
          position: absolute;
          z-index: -1;
          opacity: 0.6;
        }

        .daily-value {
          font-family: Shanti;
          font-size: 13px;
          color: #584E4E;
        }

        .recipe-container {
          padding: 30px 11vw;
        }

        .recipe-img {
          width: 370px;
          height: 320px;
          object-fit: cover;
          margin-right: 65px;
          padding-top: 20px;
        }

        .header-icon {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }

        .title-text {
          font-family: Signika SC;
          font-size: 40px;
          margin: 0px;
          color: #6C6868;
          margin-top: -5px;
        }

        .nutrition-icon {
          width: 30px;
          height: 30px;
          padding: 10px 5px 0px 5px;
        }

        .header-sub-title {
          font-family: Shanti;
          font-size: 20px;
          color: #767676;
          margin: 15px 0px 2px 0px;
        }

        .nutrition-title {
          font-weight: bold;
        }

        .header-container {
          display: grid;
          grid-template-columns: 200px auto;
        }

        .header-content {
          font-family: Shanti;
          font-size: 15px;
          color: #584E4E;
        }

        .recipe-misc-container {
          margin-top: 20px;
          margin-left: -6px;
        }

        .recipe-misc {
          align-items: start;
          margin-right: 80px;
        }

        .misc-content {
          font-family: Shanti;
          font-size: 15px;
          color: #584E4E;
          margin: 2px 0px;
        }

        .body-title {
          font-family: Shanti;
          font-size: 32px;
          font-weight: bold;
          color: #584E4E;
        }

        .body-container {
          justify-content: space-between;
        }

        .instruction-container {
          width: 63%;
        }

        .ingredient-container {
          width: 18%;
        }
        .ingredient-text{
          font-family: Shanti;
          font-size: 20px;
          color: #584E4E;
        }

        .body-text {
          font-family: Shanti;
          font-size: 20px;
          color: #584E4E;
          font-weight: bold;
        }

        .instruction-step {
          margin-top: 35px;
          margin-bottom: 60px;
          font-size: 20px;
        }

        .sticky {
          position: -webkit-sticky;
          position: sticky;
          top: 20px;
        }
        `}
      </style>
    </div>
  )
}

export default SingleRecipeView
