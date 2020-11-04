var mongoose = require('mongoose')

var {Schema} = mongoose

var userSchema = new Schema({
  email: String,
  password: String,
  nick_name: String
})

// setting the created_at() and updated_at() entries into db.
userSchema.set('timestamps', true)

mongoose.model('user', userSchema)
