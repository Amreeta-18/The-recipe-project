import React, {useState, useEffect, useContext} from 'react'
import useInput from '../hooks/useInput'
import {UserInfo} from '../components/UserContext'
import {config} from '../lib/config'
import FormField from '../components/Form/FormField'
import ErrMessage from '../components/ErrMessage'
import PersonalPageTabs from '../components/PersonalPageTabs'
import Splash from '../images/splash-person.svg'
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
      
      <div className="person-back">
        <img src={Splash} alt='default splash' width="72%" />
      </div>
      
      <div className='popular-title'>
				<p>ABOUT ME</p>
        <div className='horizontal-line'></div>
			</div>

      <div className='btn-container'>		
        <ErrMessage
          errors={errors}
          defaultMessage='Something went wrong and could not log in. Please try again.'
        />
      </div>
      
      <div className='big-form-container'>
        <form onSubmit={onSubmit}>
          <div className='form-field-container'>
            <div>
              <FormField errorMsg={paramErrors?.email[0]?.message}>
                <div className="name">
                  <label htmlFor='email'>Email</label><br />
                  <input {...bindEmail} value={email} id='test_personal_page_setting_email' type="text"/><br />
                </div>
              </FormField>

              <div className="name">
                <label htmlFor='first-name'>First Name</label><br />
                <input {...bindFirstName} value={firstName} id='test_personal_page_setting_first_name' type="text"/>
              </div>
            </div>
            
            <div>
              <FormField errorMsg={paramErrors?.password[0]?.message}>
                <div className="name">
                  <label htmlFor='password'>Password</label><br />
                  <input {...bindPassword} value={password} id='test_personal_page_setting_password' type="text"/><br />
                </div>
              </FormField>

              <div className="name">
                <label htmlFor='last-name'>Last Name</label><br />
                <input {...bindLastName} value={lastName} id='test_personal_page_setting_last_name' type="text"/>
              </div>
            </div>
          </div>

          <div className='classy-button'>
            <button className='submit-btn' id='test_personal_page_setting_submit_button' type='submit'>Set Up</button>
          </div>
        </form>
      </div>

      <div class="right"></div>

      <style jsx='true'>
        {`
        .person-back{
          float: right;
          text-align: right;
          margin-top: -50px;
          max-width: 65%;
        }

        .btn-container{
          position: relative;
          top: 135px;
          right: -253px;
          width: 35%;
        }

        .horizontal-line{
          position: relative;
          width: 22%;
          height: 0.5px;
          background: #282c34;
          top: -26px;
          right: -54px;
        }

        .big-form-container{
          right: -140px;
          top: -110px;
          position: relative;
        }

        .form-field-container {
          display: flex;
          height: 100%;
          justify-content: center;
          width: 50%;
        }
        
        .popular-title {
					font-family: Rambla;
					color: #7C630B;
					font-size: 32px;
					text-align: left;
          padding: 0px 13px 13px 13px;
          position: relative;
          padding-left: 159px;
          font-weight: bolder;
          top: -65px;
				}
				
				.name{
				  margin: 10px;
				  color: #7D7B7B;
          border-color: #7D7B7B;
          font-size: 17px;
        }

        .classy-button{
          text-align: center;
        }
        
        .submit-btn {
          font-size: large;
          font-family: Rambla;
          background-color: white;
          border-style: solid;
          border-color: #BC8E19;
          color: #7C630B;
        }
				
				.btn{
				  text-align: center;
          margin-left: 100px;
          background-color: white;
          position: relative;
          left: 460px;
          top: -100px;
          border-color: #a29f9f;
          width: 73px;
          height: 20px;
          color: #7D7B7B;
          border-radius: 6px;
        }

        .left {float:left;
        padding: 10px;
        }

        .right {
          float:left;
          padding: 10px;
        }
        `}  
      </style>
    </div>
  )
}

export default PersonalSetting
