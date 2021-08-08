const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
  avatar: {
    type: String,
    default: 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png'
  }
})

UserSchema.post('save', (doc, next) => {
  // doc.select({password: 0})
  console.log('user was created and saved ')
  next()
})

UserSchema.pre('save', async function (next) {
  console.log('encrypting')
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  console.log('user about to be created and saved')
  next()
})

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
}

const User = mongoose.model('user', UserSchema);

module.exports = User;