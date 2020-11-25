import React, {useState} from 'react'
import BackgroundImg1 from '../images/splash4.jpg'
import BackgroundImg2 from '../images/splash3.jpg'
import {Carousel} from 'react-responsive-carousel'
import {useHistory} from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PopularRecipes from '../components/PopularRecipes'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

function Landing() {
  const history = useHistory()
  const [queryString, setQueryString] = useState()
  // import the image from src/images for Carousel to show
  const imgs = [
    BackgroundImg1,
    BackgroundImg2,
  ]

  const submitHandler = (e) => {
    // e.preventDefault()
    // when user hit enter, redirect them to /result page with what they typed in the search bar
    history.push({pathname: `/result`, state: {queryString: queryString}})
  }
  
  return (
    <div className='landing-container'>
      <div className='search-container'>
        <div className='carousel-container'>
          <Carousel showThumbs={false} showStatus={false} showArrows={false} infiniteLoop autoPlay dynamicHeight={false}>
			      {/* generate img tags for Carousel to show */}
			      {imgs.map((imgurl, idx) => <img src={imgurl} alt='background' id="test_landing_carousel_images" key={idx} className='slide-img' />)}
			    </Carousel>
		    </div>
		    {/* I turned this search bar into a component since we'll use it twice */}
		    <SearchBar onSubmit={submitHandler} queryString={queryString} setQueryString={setQueryString} />
		  </div>
      <div className='popular-container'>
        <PopularRecipes />
      </div>
      <style jsx='true'>
        {`
        .landing-container {
          margin: 0px;
        }
        .search-container {
          width: 100vw;
          height: calc(100vh - 75px);
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .carousel-container {
          height: 100%;
          width: 100%;
          opacity: 0.6;
          position: absolute;
        }
        
        .slide-img-container{
          overflow: hidden; 
          object-fit: cover;
          height: 100%;
        }

        .slide-img {
          height: calc(100vh - 140px);
          object-fit: cover;
        }

        `}
      </style>
    </div>
  )
}

export default Landing
