const User = require("../models/User")
const jwt = require('jsonwebtoken')

// Handling errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { name: '', email: '', password: ''}
  
  //blank name
  if (err.message === 'name should not be empty') {
    errors.name = 'name should not be empty'
  }

  //incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'that email is not registered'
  }

  //incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'that password is incorrect'
  }

  // if (err.message === 'incorrect file extension') {
  //   errors.message = 'please use either jpeg or png image'
  // }

  //duplicate error code
  if (err.code === 11000) {
    errors.email = 'that email is already registered'
    return errors
  }

  //validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }

  return errors
}

const maxAge = 1 * 24 * 60 * 60

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  })
}

module.exports.register_page = (req, res) => {
  if (req.user && req.user != null) {
    res.redirect('/dashboard')
  }
  else {
    res.render('register')
  }
}

module.exports.login_page = (req, res) => {
  if (req.user && req.user != null) {
    res.redirect('/dashboard')
  }
  else {
    res.render('login')
  }  
}

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body
  let avatar
  if (req.file) {
      avatar = req.file.location
    } 
  
  // console.log('name: ', name)
  if(name.trim() === '') throw Error('name should not be empty')
  try {
    
    const user = await User.create({ name, email, password, avatar }) 
    const token = createToken(user._id)
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })
    // res.redirect('/login')
    res.status(201).json({ user: user._id })
  } catch (error) {
    const errors = handleErrors(error)
    res.status(400).json({ errors })
  }
}

module.exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: maxAge * 1000
    })
    // res.redirect('/dashboard')
    res.status(200).json({ user: user._id })
  } catch (error) {
    const errors = handleErrors(error)
    res.status(400).json({ errors })
  }
}

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/login')
}