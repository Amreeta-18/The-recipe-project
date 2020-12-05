import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import AccountForm from '../components/AccountForm'
import ErrMessage from '../components/ErrMessage'
import {UserInfo} from '../components/UserContext'
import {config} from '../lib/config'
const urlJoin = require('url-join')

function LoginAndRegister() {
  const history = useHistory()
  // login
  const [loginEmail, setLoginEmail] = useState()
  const [loginpassword, setLoginPassword] = useState()
  const [loginErrors, setLoginErrors] = useState()
  const [loginParamErrors] = useState()
  // register
  const [registerEmail, setRegisterEmail] = useState()
  const [registerpassword, setRegisterPassword] = useState()
  const [registerErrors, setRegisterErrors] = useState()
  const [registerParamErrors, setRegisterParamErrors] = useState()
  // get the user's information from context
  const userInfo = useContext(UserInfo)

  const onLoginSubmit = (e) => {
    // since the page would refresh when a form is submitted
    // we need to call e.preventDefault() to prevent the refresh and display the error message
    e.preventDefault()
    fetch(urlJoin(config.sous.apiUrl, 'users', 'login'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        userInfo: {
          email: loginEmail,
          password: loginpassword,
        },
      }),
    })
      .then(res => res.json())
      .then(result => {
        if(result.ok) {
          // set user info to localstorage
          userInfo.userLogIn(result.userInfo)
          history.push('/')
        }
        else {
          // set the general error message
          setLoginErrors(result.errors)
        }
      })
      .catch(e => console.log(e))
  }
  
  const onRegisterSubmit = (e) => {
    e.preventDefault()
    fetch(urlJoin(config.sous.apiUrl, 'users', 'register'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        userInfo: {
          email: registerEmail,
          password: registerpassword,
        },
      }),
    })
      .then(res => res.json())
      .then(result => {
        if(result.ok) {
          // set user info to localstorage
          userInfo.userLogIn(result.userInfo)
          history.push('/')
        }
        else {
          // set the general error message
          setRegisterErrors(result.errors)
          // set the detailed error message for specific fields
          setRegisterParamErrors(result.paramErrors)
        }
      })
      .catch(e => console.log(e))
  }

  return (
   <div className='all-container' >
    <div className='container'>
      <div className='result-wrapper'>
        <div className='form-container'>
          <div className='login' id='test_login_sign_in_container'>
            <p>Welcome Back !</p>
            <p>Sign In</p>
            {/* since the form part is repeated, I put them into another component */}
            
            <ErrMessage
              errors={loginErrors}
              defaultMessage='Something went wrong and could not log in. Please try again.'
            />
            
            <AccountForm 
              onSubmit={onLoginSubmit}
              paramErrors={loginParamErrors}
              buttonText='LOGIN'
              loginEmail={loginEmail}
              setEmail={setLoginEmail}
              loginpassword={loginpassword}
              setPassword={setLoginPassword}
            />
          </div>
          
          <div className='vertical-col' />
          
          <div className='account' id='test_login_create_account_container'>
            <p>New to Sous Chef ?</p>
            <p>Create New Account</p>
            
            <ErrMessage
              errors={registerErrors}
              defaultMessage='Something went wrong and the new account could not be created. Please try again.'
            />
            
            <AccountForm 
              onSubmit={onRegisterSubmit}
              paramErrors={registerParamErrors}
              buttonText='SIGN UP'
              loginEmail={registerEmail}
              setEmail={setRegisterEmail}
              loginpassword={registerpassword}
              setPassword={setRegisterPassword}
            />
          </div>
        </div>
      </div>
      
      <style jsx='true'>
        {`
        .all-container {
          height: calc(100vh - 190px);
        }

        .container {
          //height: calc(100vh - 190px);
          text-align:center;
          height: auto;
        }
        
        .login {
          //text-align:left;
          //float: left;
          width: 40%;
          top: 900px;
          margin-right: auto;
          margin-left: auto;
          margin-top: auto;
          margin-bottom: auto;
        }

        .account {
          width: 40%;
          top: 900px;
          margin-right: auto;
          margin-left: auto;
          margin-top: auto;
          margin-bottom: auto;
        }
	    
        .vertical-col {
          height: 100%;
          width: 0.5px;
          background: #928d8d;
          justify-content: center;
        } 
        
        .result-wrapper {
          display: inline-block;
          width: 921px;
          height: 430px;
          left: 151px;
          top: 400px;
          background: rgb(252 209 127 / 44%);
          display: center;
        }

        .form-container {
          margin: 100px;
          height: 50%;
          text-align: center;
          margin-right: auto;
          margin-left: auto;
          display: flex;
        }
        `}
      </style>
    </div>
  </div>
  )
}

export default LoginAndRegister
