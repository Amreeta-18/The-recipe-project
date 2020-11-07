import React, {useState, useEffect, useContext} from 'react'
import Logo from '../images/chef_logo.png'
import {useLocation, Link} from 'react-router-dom'
import {UserInfo} from './UserContext'
import DropdownMenu from './DropdownMenu'

function Nav() {
  const [showButton, setShowButton] = useState(true)
  const location = useLocation()
  const userInfo = useContext(UserInfo)
  // the content of the dropdown menu, only contains string and function
  const dropdownMenuContent = [
    ['Log out', userInfo.userLogOut],
  ]

  // hide login button if user's in the login page
  useEffect(() => {
    if(location.pathname === '/login') setShowButton(false)
    else setShowButton(true)
  }, [location])

  return (
    <div className='nav-container'>
      <Link to='/'>
        <div className='logo-container'>
          <img src={Logo} alt='App Logo' className='logo-img' id="test_nav_logo_image"/>
          <p className='logo-text' id="test_nav_logo_text">Sous Chef</p>
        </div>
      </Link>
      {/* first check the path, hide button if current page is the login page */}
      {/* then show different button depends on whether user is logged in */}
      {showButton
      ? userInfo?.isLoggedIn
        ? <DropdownMenu button={<div>Hi, {userInfo.info.userName}!</div>} content={dropdownMenuContent} />
        : <Link to='/login'>
            <button className='login-btn' id="test_nav_login_button">Log in</button>
          </Link>
      : null
      }
      <style jsx='true'>
        {`
        .nav-container {
          height: 140px;
          padding: 0px 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-container {
          display: flex;
          height: 100%;
          text-decoration: none;
          align-items: flex-end;
        }

        .logo-img {
          height: 130px;
          margin-right: -10px;
        }

        .logo-text {
          font-family: Sedan;
          margin: 0px;
          font-size: 48px;
          color: var(--c-brown);
          text-decoration: none;
        }

        .login-btn {
          height: 30px;
          width: 80px;
          border: 2px solid var(--c-brown);
          border-radius: 20px;
          background-color: white;
          color: var(--c-brown);
          font-size: 18px;
          margin-right: 20px;
          cursor: pointer;
        }
        `}
      </style>
    </div>
  )
}

export default Nav
