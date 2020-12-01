import React, {useState, useEffect} from 'react'
import SearchBar from '../components/SearchBar'
import {config} from '../lib/config'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {Link} from 'react-router-dom'
import LikeIcon from '../images/like.svg'
const urlJoin = require('url-join')

function SearchResult({location}) {
  // when redirected form landing page, the user's query will be put in location.state.queryString
  const [queryString, setQueryString] = useState(location.state.queryString)
  const [recipes, setRecipes] = useState()
  const [resultPerPage] = useState(6) // The number of results to show on a "page"
  const [pageNum, setPageNum] = useState(1) // The current page number, in terms of what group of results are shown
  const [pageRecipes, setPageRecipes] = useState() // Array of recipes shown in quantity of resultPerPage


  const submitHandler = (e) => {
    e.preventDefault()
    // when user hit enter, redirect them to /result page with what they typed in the search bar
    fetchRecipes()
  }

  const fetchRecipes = async () => {
    const queryIngredients = queryString.replace(', ', ',').split(',')
    fetch(urlJoin(config.sous.apiUrl, 'recipes', 'findByIngredients'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        queryIngredients: queryIngredients,
      }),
    })
      .then(res => res.json())
      .then(data => setRecipes(data.results))
      .catch(e => console.log(e))
  }

  const getShowRecipes = () => {
    if(recipes) {
      setPageRecipes(recipes.slice((pageNum - 1) * resultPerPage, (pageNum - 1) * resultPerPage + resultPerPage))
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  // After recipes or pageNum are changed, get the correct group of recipes to show
  useEffect(() => {
    getShowRecipes()
  }, [recipes, pageNum])

  //Change the current page
  const changePage = (nextPage) => {
    // Out of scope check
    // First page to last page
    if (nextPage === 0) {
      setPageNum(Math.ceil(recipes.length / resultPerPage))
    }

    // Out of scope check
    // Last page to first page
    else if (nextPage === Math.ceil(recipes.length / resultPerPage) + 1) {
      setPageNum(1)
    }

    // Go to the page requested
    else {
      setPageNum(nextPage)
    }
  }

  return (
    <div>
      <div className='searchbar-container' id='test_search_result_searchbar'>
        <SearchBar onSubmit={submitHandler} queryString={queryString} setQueryString={setQueryString} />
      </div>
      {/* if recipes has value, print all recipes' title */}
      {/* we need "recipes &&" to not show anything since recipes will recieve data later (in useEffect) */}
      
      <div className='result-wrapper'>
        {pageRecipes && pageRecipes.map(recipe => {
          return (
            <div className='form-recipe' key={recipe.id}>
              <div className='recipe-card' id='test_search_result_recipe_card'>
                <Link to={`/recipes/${recipe.id}`}>
                  <div>
                    <img src={recipe.imgurl} className='recipe-img' id='test_search_result_recipe_image' alt={recipe.name} />
                    <div className='reicpe-text'>
                      <p className='recipe-name' id='test_search_result_recipe_title'> {recipe.name}</p>
                      <img src={LikeIcon} alt='like icon' className='like-icon' id='test_search_result_recipe_like'/>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    
      <div className='button-container'>
        <div className='button-wrapper'>
          <button className='nav-button' id='test_search_result_navbutton_prev' onClick={() => changePage(pageNum - 1)}>previous</button>
          <button className='nav-button' id='test_search_result_navbutton_next' onClick={() => changePage(pageNum + 1)}>next</button>
        </div>
      </div>

      <style jsx='true'>
        {`
        .searchbar-container {
          display: flex;
          justify-content: center;
          padding-top: 30px;
          padding-bottom: 45px;
        }
        
        .result-wrapper {
          background: rgba(252, 209, 127, 0.26);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          padding: 50px 65px 25px 65px;
          min-height: calc(100vh - 400px);
        }

        .button-container{
          background: rgba(252, 209, 127, 0.26);
          padding-bottom: 15px;
        }

        .button-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .nav-button {
          background-color: white;
          border: 2px solid #e7e7e7;
          border-radius: 20px;
          border: none;
          color: black;
          height: 30px;
          width: 80px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          cursor: pointer;
          margin: 0px 180px;
          transition-duration: 0.4s;
          front-family: Sedan
        }

        .nav-button:hover {
          background-color: var(--c-brown);
          color: white;
        }

        .container-fluid{
          padding: 50px;
          align: center;
        }

      .form-recipe {
          max-width:100%;
          //disply:flex;
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
        }
        `}
      </style>
    </div>
  )
}

export default SearchResult
