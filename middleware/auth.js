const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Check authentication
const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log('error in check auth', err.message)
        res.redirect('/login')
      }
      else {
        // console.log("decoded token in check auth", decodedToken)
        next()
      }
    })
  }
  else {
    res.redirect('/login')
  }
}

// Check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log('Error message in check user', err.message)
        res.locals.user = null
        req.user = null
        next()
      }
      else {
        // console.log("decoded token in check user", decodedToken)
        let user = await User.findById(decodedToken.id)
        // console.log('user in check user: ', user)
        res.locals.user = user
        req.user = user
        next()
      }
    })
  }
  else {
    res.locals.user = null
    req.user = null
    next()
  }
}

module.exports = { checkAuth, checkUser }