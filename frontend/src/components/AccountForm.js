import React from 'react'
import FormField from './Form/FormField'

function AccountForm({onSubmit, paramErrors, buttonText, email, setEmail, password, setPassword}) {
  const buttonId = buttonText.toLowerCase().replace(' ', '-')

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePassChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div className='container'>
      <form onSubmit={onSubmit}>
        {/* FormField is only for error message displaying, don't need to style it now */}
        <FormField errorMsg={paramErrors?.email[0]?.message}>
          <p><input type="text" placeholder='Email' id="test_account_form_email_input" value={email} onChange={handleEmailChange} /></p>
        </FormField>
        <FormField errorMsg={paramErrors?.password[0]?.message}>
          <p><input type="password" placeholder='Password' id="test_account_form_password_input" value={password} onChange={handlePassChange} /></p>
        </FormField>
        <button type='submit' className='form-confirm-btn' id="test_account_form_submit_button"> {buttonText} </button>
      </form>
    
      <style jsx='true'>
      {`
        .container{
          font-family: Sedan;
          color: #776e6e;
          font-size:18px
        }

        .form-confirm-btn{
          width: 99px;
          background: #FDFDFD;
          border: 2px solid #c6b155;
          box-sizing: border-box;
          font-family: Sedan;
          color: #8f8888;
          cursor: pointer;
        } 
      `}
      </style>
    </div>
  )
}

export default AccountForm
