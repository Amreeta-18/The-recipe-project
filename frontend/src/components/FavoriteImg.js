import React, {useState, useEffect} from 'react'
import LikeIcon from '../images/like.svg'
import RedLikeIcon from '../images/like_red.png'
import {config} from '../lib/config'
import {useHistory} from 'react-router-dom'
import {Dialog} from '@reach/dialog'
const urlJoin = require('url-join')

function FavoriteImg({hasFavorited, userId, recipeId, refresh, width, height}) {
  // for changing the heart color immediately
  const [isFavorited, setIsFavorited] = useState(hasFavorited)
  // for showing the confirm dialog if user is not logged in
  const [showDialog, setShowDialog] = useState(false)
  const closeModal = () => setShowDialog(false)
  const openModal = () => setShowDialog(true)
  // for redirect user to login or register page
  const history = useHistory()

  const handleFavorite = () => {
    if(userId){
      fetch(urlJoin(config.sous.apiUrl, 'users', 'favorite'), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          recipeId: recipeId,
        }),
      })
        .catch(e => console.log(e))
      // refresh to change the color of the heart when the user favorites the recipe successfully
      setIsFavorited(!isFavorited)
      refresh()
    }
    else openModal()
  }

  // since the value of hasFavorited changed slightly later than recipe
  // let React listen to it and change heart color when its value updated
  useEffect(() => {
    setIsFavorited(hasFavorited)
  }, [hasFavorited])

  const redirectToLoginPage = () => {
    history.push({pathname: `/login`})
  }

  // the CSS of this content should be placed in 'frontend/src/index.css'
  const modalContent = (
    <div>
      <p>
        You haven't logged in yet<br />
        Do you want to log in or register an account?
      </p>
      <div className='modal-buttons'>
        <button onClick={redirectToLoginPage} className='modal-btn btn-large-solid'>Yes</button>
        <button onClick={closeModal} className='modal-btn btn-large-outline'>Later</button>
      </div>
    </div>
  )

  return (
    <>
      {isFavorited
        ? <img src={RedLikeIcon} alt='like icon' className='favorite-img' id='test_search_result_recipe_like' onClick={() => handleFavorite(recipeId)} />
        : <img src={LikeIcon} alt='like icon' className='favorite-img' id='test_search_result_recipe_like' onClick={() => handleFavorite(recipeId)} />}
      {showDialog && (
        <Dialog onDismiss={closeModal} aria-label='Warning about the delete action'>
          {modalContent}
        </Dialog>)}
      <style jsx='true'>
        {`
          .favorite-img {
            width: ${width}px;
            height: ${height}px;
            cursor: pointer;
          }
        `}
        </style>  
    </>
  )
}

export default FavoriteImg
