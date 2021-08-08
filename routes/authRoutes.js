const { Router } = require('express')
const authController = require('../controllers/authController')
const router = Router()
const { upload } = require('../config/awsConfig')

router.get('/register', authController.register_page)
router.post('/register', upload.single('avatar'), authController.register)
router.get('/login', authController.login_page)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router