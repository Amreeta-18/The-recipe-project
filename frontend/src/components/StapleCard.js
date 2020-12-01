import React from 'react'
import DeleteButton from '../images/close.svg' // image from Fontawesome

function StapleCard({ingredient, toggleStaple}) {
  return (
    <div className='staple-item'>
      {ingredient.ingredientName}
      <img src={DeleteButton} alt='close button' className='delete-button' onClick={() => toggleStaple(ingredient.ingredientId)} />
      <style jsx='true'>
        {`
        .staple-item {
          margin: 2px;
          background-color: #F4DB9B;
        }

        .delete-button {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        `}
      </style>
    </div>
  )
}

export default StapleCard
