import React, {useState, useEffect, useContext} from 'react'
import StapleCard from '../components/StapleCard'
import SearchableDropdown from '../components/SearchableDropdown'
import PersonalPageTabs from '../components/PersonalPageTabs'
import {UserInfo} from '../components/UserContext'
import {config} from '../lib/config'
const urlJoin = require('url-join')

function PersonalIngredients() {
  const userInfo = useContext(UserInfo)
  const [stapleList, setStapleList] = useState()
  const [ingredients, setIngredients] = useState([])
  const [choosenIngredientId, setChoosenIngredientId] = useState()

  // get user's list of staple ingredient
  const getStapleList = () => {
    fetch(urlJoin(config.sous.apiUrl, 'users', 'stapleIngredientList'), {
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
      .then(data => setStapleList(data.results))
      .catch(e => console.log(e))
  }

  const getAllIngredients = () => {
    fetch(urlJoin(config.sous.apiUrl, 'ingredients'), {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setIngredients(data.results))
      .catch(e => console.log(e))
  }

  const updateStaple = (ingredientId) => {
    fetch(urlJoin(config.sous.apiUrl, 'users', 'updateStaple'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        userId: userInfo.info.id,
        ingredientId: ingredientId,
      }),
    })
      .then(() => getStapleList())
      .catch(e => console.log(e))
  }

  useEffect(() => {
    if(choosenIngredientId) {
      updateStaple(choosenIngredientId)
      // getStapleList()
    }
    return () => {
      setChoosenIngredientId('')
    }
  }, [choosenIngredientId])

  useEffect(() => {
    getAllIngredients()
    // we only need to get all ingredients once so useEffect is not listen to any variable
  }, [])
  
  useEffect(() => {
    if(userInfo.isLoggedIn) getStapleList()
  }, [userInfo])

  return (
    <div className='content-container'>
      <PersonalPageTabs name={userInfo.info.name}/>
      <span>Staples</span><br />
      <span>What’s always available in your pantry? Tell us what’s staple in your kitchen and we will curate our recommendadtions accordingly!</span>
      <SearchableDropdown options={ingredients} setResult={setChoosenIngredientId} placeholder='Enter ingredient...' />
      <div className='staple-container'>
        {stapleList && stapleList.map((ingredient, idx) => <StapleCard ingredient={ingredient} key={idx} toggleStaple={updateStaple} />)}
      </div>
      <style jsx='true'>
        {`
        .staple-container {
          display: flex;
          flex-wrap: wrap;
        }
        `}
      </style>
    </div>
  )
}

export default PersonalIngredients
