import React, {useState, useEffect} from 'react'
import {config} from '../lib/config'
import RecipeCard from '../components/RecipeCard'
const urlJoin = require('url-join')

function PopularRecipes() {
	const [recipes, setRecipes] = useState()
	
	const fetchPopular = async () => {
		fetch(urlJoin(config.sous.apiUrl, 'recipes', 'popular'), { 
		  method: 'GET',
		  headers: {
			'content-type': 'application/json',
			'accept': 'application/json',
		  },
		})
		  .then(res => res.json())
		  .then(data => setRecipes(data.results))
		  .catch(e => console.log(e))
	}

	useEffect(() => {
		fetchPopular()
	  }, [])

	return(
		<div>
			<div className='popular-title' id='test_popular_recipes_title'>
				<p>Popular Recipes</p>
			</div>

			<div className='popular-wrapper' id='test_popular_recipes_wrapper'>
        		{recipes && recipes.map(recipe => <RecipeCard recipe={recipe} key={recipe.id} fetchRecipes={fetchPopular} />)}
      		</div>
			
			<style jsx='true'>
				{`
				.popular-title {
					font-family: Sedan;
					color: var(--c-brown);
					font-size: 32px;
					text-align: center;
				}
				
				.popular-wrapper {
					padding: 10px 75px 50px;
					justify-content: space-around;
					display: flex;
					flex-wrap: wrap;
					align-content: space-around;
				}
				`}
      		</style>
		</div>
	)
}

export default PopularRecipes
