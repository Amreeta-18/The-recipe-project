import React from 'react'
import DeleteButton from '../images/delete.png' // image from Fontawesome

function StapleCard({ingredient, toggleStaple}) {
  return (
    <div className='staple-item'>
      {ingredient.ingredientName}
      <img src={DeleteButton} alt='close button' className='delete-button' onClick={() => toggleStaple(ingredient.ingredientId)} />
      <style jsx='true'>
        {`
        .staple-item {
          margin: 7px;
          background-color: #F4DB9B;
          border: 2px solid#976B16;
          border-radius: 9px;
          color: rgba(101, 84, 24, 1);
        }

        .delete-button {
          width: 20px;
          height: 20px;
          cursor: pointer;
          position: relative;
          top: -3px;
          right: -2px;
        }
        `}
      </style>
    </div>
  )
}

export default StapleCard
