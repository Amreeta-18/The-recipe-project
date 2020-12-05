import React from 'react'
import {Link} from 'react-router-dom'
import Avatar from '../images/profile_icon.svg'

function PersonalPageTabs({name}) {
  return (
    <div>
      <div>
        <div class="tab-container">
          <div class="divider" />
          
          <Link to='/settings'>
            <button className='tag-btn' id="test_personal_page_personal_button">
              <span>Personal</span>
            </button>
          </Link>
          
          <Link to='/favorite-recipes'>
            <button className='tag-btn' id="test_personal_page_tabs_favorite_button">
              Favorite
            </button>
          </Link>
          
          <Link to='/ingredients'>
            <button className='tag-btn' id="test_personal_page_tabs_preferrence_button">
              Preference
            </button>
          </Link>
        </div>
      </div>

      <div class="tab">
        <div class="span-div">
          <span>Hi, {name}!</span>
        </div>
      </div>
        
      <div class="img-con">
        <img src={Avatar} alt='default avatar' />
      </div>       
        
      <style jsx='true'>
        {`
        .img-con {
          position: relative;
          right: -55px;
          display: block;
          align-items: center;
          top: -74px;
          width: 20%;
        }

        .tag-btn {
          font-size: large;
          font-family: Rambla;
          background-color: white;
          border-style: solid;
          border-color: #BC8E19;
          margin-right:10px;
          color: #7C630B;
          position: relative;
          right: 150px;
          top: 3px;
          cursor: pointer;
        }
        
        .tab-container{
          background-color: rgba(232, 217, 143, 0.6);;
          padding-top: 20px;
          width: 65%;
          height: 30px;
          position: relative;
          top: 34px;
          margin-left: auto;
        }

        .tab {
          background-color: rgba(245, 226, 127, 0.6);
          padding-top: 20px;
          position: relative;
          width: 65%;
          margin-right: auto;
          top: -42px;
          height: 30px;
        }
        
        .divider{
          width:150px;
          height:auto;
          display:inline-block;
        }

        .span-div{
          width: 20%;
          align-items: center;
          display: block;
          position: relative;
          left: 95px;
          top: 5px;
          font-size: 20px;
          font-family: Rambla;
        }
        `}
      </style>
    </div>
  )
}

export default PersonalPageTabs
