import React from 'react'
import {Link} from 'react-router-dom'
import Avatar from '../images/profile_icon.svg'

function PersonalPageTabs({name}) {
  return (
    <div>
      <div>
        <img src={Avatar} alt='default avatar' />
        <span>Hi, {name}!</span>
      </div>
      <div>
        <Link to='/settings'><button className='tag-btn' id="test_personal_page_personal_button">Personal</button></Link>
        <Link to='/favorite-recipes'><button className='tag-btn' id="test_personal_page_tabs_favorite_button">Favorite</button></Link>
        <Link to='/ingredients'><button className='tag-btn' id="test_personal_page_tabs_preferrence_button">Preferrence</button></Link>
      </div>
      <style jsx='true'>
        {`
        .tag-btn {
          font-family: Rambla;
          background-color: white;
        }
        `}
      </style>
    </div>
  )
}

export default PersonalPageTabs
