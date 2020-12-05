import React, {createContext, useState, useEffect} from 'react'
import {useLocation, useHistory} from 'react-router-dom'

export const UserInfo = createContext(null)

function UserContext({children}) {
  // user is not logged in by default
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState()
  const [userId, setUserId] = useState()
  const [userEmail, setUserEmail] = useState()
  const [userFirstName, setUserFirstName] = useState()
  const [userLastName, setUserLastName] = useState()
  const history = useHistory()
  const location = useLocation()
  const pathsToRedirect = ['/settings', '/favorite-recipes', '/ingredients']
  
  const info = {
    id: userId,
    name: userName,
    email: userEmail,
    firstName: userFirstName,
    lastName: userLastName,
  }

  // since React will lose all its state value if user refresh the page
  // I put user's info in local storage to keep user logged in if they refresh the page or come back next time
  const userLogIn = (userInfo) => {
    const name = userInfo.firstName || userInfo.email.split('@')[0]
    setIsLoggedIn(true)
    setUserName(name)
    setUserId(userInfo.id)
    setUserEmail(userInfo.email)
    setUserFirstName(userInfo.firstName || '')
    setUserLastName(userInfo.lastName || '')
    localStorage.setItem('accessToken', JSON.stringify(userInfo))
  }
  
  const userLogOut = () => {
    setIsLoggedIn(false)
    setUserName('')
    setUserId(null)
    localStorage.removeItem('accessToken')
    if(pathsToRedirect.includes(location.pathname)) history.push('/')
  }

  // check whether local storage has user's info or not
  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))
    if(accessToken) {
      userLogIn(accessToken)
    }
  }, [])

  return (
    <UserInfo.Provider value={{info, isLoggedIn, userLogIn, userLogOut}}>
      {children}
    </UserInfo.Provider>
  )
}

export default UserContext
