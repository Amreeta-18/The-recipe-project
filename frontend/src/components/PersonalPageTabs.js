import React from 'react'
import {Link} from 'react-router-dom'
import Avatar from '../images/profile_icon.svg'

function PersonalPageTabs({name}) {
  return (
    <div>
      <div>
        <img src={Avatar} alt='default avatar' />

      </div>
      <div>
      <div class="tab">
        <span>Hi, {name}!</span>
        <div class="divider">
        </div>
        <Link to='/settings'><button className='tag-btn' id="test_personal_page_personal_button">Personal</button></Link>
        <Link to='/favorite-recipes'><button className='tag-btn' id="test_personal_page_tabs_favorite_button">Favorite</button></Link>
        <Link to='/ingredients'><button className='tag-btn' id="test_personal_page_tabs_preferrence_button">Preference</button></Link>

      </div>
      </div>
      <style jsx='true'>
        {`
        .tag-btn {
          font-size: large;
          font-family: Rambla;
          background-color: white;
          border-style: solid;
          border-color: #BC8E19;
          margin-right:10px;
          color: #7C630B;
        }
        
        .tab {
          border: 1px solid #ccc;
          background-color: #E8D98F;
          padding-top: 20px;
        }
        
        .divider{
          width:150px;
          height:auto;
          display:inline-block;
        }
        
        `}
      </style>
    </div>
  )
}

export default PersonalPageTabs
