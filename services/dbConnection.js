const config = require('./config')

const { Client } = require('pg')
const pgConn = new Client({
  connectionString: config.postgreUrl,
  ssl: {
    rejectUnauthorized: false
  }
})

pgConn.connect()

module.exports = pgConn