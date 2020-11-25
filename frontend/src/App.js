import React from 'react'
import Nav from './components/Nav.js'
import Footer from './components/Footer.js'
import Landing from './views/Landing.js'
import SearchResult from './views/SearchResult'
import SingleRecipeView from './views/SingleRecipeView'
import LoginAndRegister from './views/LoginAndRegister'
import PersonalSetting from './views/PersonalSetting'
import PersonalFavorite from './views/PersonalFavorite'
import PersonalIngredients from './views/PersonalIngredients'
import UserContext from './components/UserContext'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <UserContext>
        <Nav />
        <Route path='/' exact component={Landing} />
        <Route path='/result' component={SearchResult} />
        <Route path='/recipes/:id' component={SingleRecipeView} />
        <Route path='/login' component={LoginAndRegister} />
        <Route path='/settings' component={PersonalSetting} />
        <Route path='/favorite-recipes' component={PersonalFavorite} />
        <Route path='/ingredients' component={PersonalIngredients} />
        <Footer />
      </UserContext>
    </Router>
  )
}

export default App
