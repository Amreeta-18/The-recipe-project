import React, {useState, useEffect, useContext} from 'react'
import useInput from '../hooks/useInput'
import {UserInfo} from '../components/UserContext'
import {config} from '../lib/config'
import FormField from '../components/Form/FormField'
import ErrMessage from '../components/ErrMessage'
import PersonalPageTabs from '../components/PersonalPageTabs'
const urlJoin = require('url-join')

function PersonalSetting() {
  const [errors, setErrors] = useState()
  const [paramErrors, setParamErrors] = useState()
  const [email, bindEmail, resetEmail] = useInput('')
  const [password, bindPassword] = useInput('')
  const [firstName, bindFirstName, resetFirstName] = useInput('')
  const [lastName, bindLastName, resetLastName] = useInput('')
  const userInfo = useContext(UserInfo)

  const onSubmit = (e) => {
    e.preventDefault()
    const userNewInfo = {
      id: userInfo.info.id,
      email: email,
      firstName: firstName,
      lastName: lastName
    }
    // only update the password if user enter the value
    // since our frontend doesn't remember user's password
    // we neither want to show it (we can't) nor want to wipe it out
    if(password) userNewInfo['password'] = password

    fetch(urlJoin(config.sous.apiUrl, 'users', 'update'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        userInfo: userNewInfo,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if(result.ok) {
          // set user info to localstorage
          userInfo.userLogIn(result.userInfo)
        }
        else {
          // set the general error message
          setErrors(result.errors)
          // set the detailed error message for specific fields
          setParamErrors(result.paramErrors)
        }
      })
      .catch(e => console.log(e))
  }
  
  useEffect(() => {
    if(userInfo.isLoggedIn){
      resetEmail(userInfo.info.email)
      resetFirstName(userInfo.info.firstName)
      resetLastName(userInfo.info.lastName)
    }
  }, [userInfo])

  return (
    <div className='content-container'>
      <PersonalPageTabs name={userInfo.info.name}/>
      <span>ABOUT ME</span>
      <ErrMessage
        errors={errors}
        defaultMessage='Something went wrong and could not log in. Please try again.'
      />
      <form onSubmit={onSubmit}>
        <div className='form-field-container'>
          <div>
            <FormField errorMsg={paramErrors?.email[0]?.message}>
              <label htmlFor='email'>Email</label><br />
              <input {...bindEmail} value={email} id='email' type="text"/><br />
            </FormField>
            <label htmlFor='first-name'>First Name</label><br />
            <input {...bindFirstName} value={firstName} id='first-name' type="text"/>
          </div>
          <div>
            <FormField errorMsg={paramErrors?.password[0]?.message}>
              <label htmlFor='password'>Password</label><br />
              <input {...bindPassword} value={password} id='password' type="text"/><br />
            </FormField>
            <label htmlFor='last-name'>Last Name</label><br />
            <input {...bindLastName} value={lastName} id='last-name' type="text"/>
          </div>
        </div>
        <button type='submit'>Set Up</button>
      </form>
      <style jsx='true'>
          {`
          .form-field-container {
            display: flex;
          `}
      </style>
    </div>
  )
}

export default PersonalSetting
