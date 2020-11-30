import React from 'react'

// if message has something, display it
function FieldErrors({message}) {
  return (
    <>
      {message ? <p className='error-message'>{message}</p> : null}
      <style jsx='true'>
        {`
        .error-message {
          color: #cf2f2f;
          margin: 0px;
          height: 20px;
          font-size:15px;
        }
        `}
      </style>
    </>
  )
}

export default FieldErrors
