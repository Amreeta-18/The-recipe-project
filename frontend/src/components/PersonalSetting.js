import React from 'react'

function PersonalSetting() {

  const onSubmit = (params) => {
    console.log('submit something')
  }
  
  return (
    <div>
      <h1>ABOUT ME</h1>
      <form onSubmit={onSubmit}>
        <div className='form-field-container'>
          <div>
            <label htmlFor='email'>Email</label><br />
            <input id='email'type="text"/><br />
            <label htmlFor='first-name'>First Name</label><br />
            <input id='first-name'type="text"/>
          </div>
          <div>
            <label htmlFor='password'>Password</label><br />
            <input id='password'type="text"/><br />
            <label htmlFor='last-name'>Last Name</label><br />
            <input id='last-name'type="text"/>
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
