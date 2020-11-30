require('dotenv').config()
const config = {
  sous: {
    domain: process.env.sousDomain,
    apiUrl: process.env.sousAPI + '/api/v1/',
  },
  postgreUrl: process.env.DATABASE_URL
}

module.exports = config
