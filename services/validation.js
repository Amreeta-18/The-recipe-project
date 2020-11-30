// DB connection to Heroku's PostgreSQL
const pgConn = require('./dbConnection')

const notEmpty = (value) => {
  return value
    ? Promise.resolve(true)
    : Promise.resolve({code: 'is-empty', message: 'Please provide a value.'})
}

const isInt = (value) => {
  return /^\d+$/.test(value)
    ? Promise.resolve(true)
    : Promise.resolve({code: 'not-number', message: 'Please provide a number.'})
}

const uniqueEmail = async (value, userId) => {
  const result = await pgConn.query('SELECT 1 FROM users WHERE email = $1 AND id != $2;', [value, userId])
  return !result.rows[0]
    ? true
    : {code: 'duplicate-value', message: 'Please provide a different email.'}
}

const validEmailFormat = (value) => {
  return /^\S+@\S+[.]\S+$/.test(value)
    ? Promise.resolve(true)
    : Promise.resolve({code: 'wrong-format', message: 'Please provide a valid email.'})
}

const noSpace = (value) => {
  return /^\S+$/.test(value)
    ? Promise.resolve(true)
    : Promise.resolve({code: 'wrong-format', message: 'Password can not conatin space.'})
}

// const urlFileFormat = async (url, formats) => {
//   // let the empty url pass the check and endpoint will assign a default image later
//   if(!url) return true
//   return await fetch(url)
//     .then(result => {
//       const currentContentType = result.headers.get('Content-Type').split('/')[1]
//       return formats.includes(currentContentType)
//         ? true
//         : {code: 'wrong-image-type', message: 'Please provide an image in JPEG or PNG format.'}
//     })
//     .catch(() => { return {code: 'not-valid-url', message: 'Please provide a valid url.'} })
// }

const addCondition = (fn, value) => {
  return (...args) => {
    return fn(...args, value)
  }
}

const check = async (validationDefinition, params) => {
  const results = await Promise.all(
    Object.entries(validationDefinition).map(async ([paramName, validators]) => {
      const value = Object.prototype.hasOwnProperty.call(params, paramName)
        ? params[paramName]
        : undefined
      for(const validator of validators) {
        const validatorResult = await validator(value)
        if(validatorResult !== true) {
          return {
            paramName,
            isValid: false,
            validatorResult,
          }
        }
      }
      return {
        paramName,
        isValid: true,
      }
    }),
  )
  let isAllValid = true
  const paramErrors = {}
  for(const result of results) {
    paramErrors[result.paramName] = []
    if(!result.isValid) {
      isAllValid = false
      paramErrors[result.paramName].push(result.validatorResult)
    }
  }
  return {
    isAllValid,
    paramErrors,
  }
}

const run = async (validationDefinition, body) => {
  const validationResult = await check(validationDefinition, body)
  if(!validationResult.isAllValid) {
    return ({
      errors: [
        {
          code: 'BadRequest',
          message: 'There were some problems with the values you provided. Please see errors below.',
        },
      ],
      paramErrors: validationResult.paramErrors,
    })
  }
  else {
    return false
  }
}

module.exports = {notEmpty, isInt, uniqueEmail, validEmailFormat, noSpace, addCondition, run}
