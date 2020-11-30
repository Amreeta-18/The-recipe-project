import React, {useEffect, useState} from 'react'

function ErrMessage({errors, defaultMessage}) {
  const [errMsg, setErrMsg] = useState()

  useEffect(() => {
    if(errors && errors.length) setErrMsg(errors[0].message)
    else if(errors) setErrMsg(defaultMessage)
    else setErrMsg() // clean up the error message if there's no error
  }, [errors])

  return (
    <>
      {errMsg ? <p className='main-error-message'>{errMsg}</p> : null}
      <style jsx='true'>
        {`
        .main-error-message {
          color: #cf2f2f;
          font-size:15px
        }
        `}
      </style>
    </>
  )
}

export default ErrMessage
