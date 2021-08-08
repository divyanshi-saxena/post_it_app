const express = require('express')
const router = express.Router()
const { checkAuth } = require('../middleware/auth')
const { upload } = require('../config/awsConfig')
const postController = require('../controllers/postController')

router.get('/dashboard', checkAuth, postController.dashboard_page)
router.get('/create_post', checkAuth, postController.create_post_page)
router.post('/create_post', checkAuth, upload.single('image'), postController.create_post)
router.get('/get_all_posts', checkAuth, postController.get_all_posts)
router.get('/single_post/:id', checkAuth, postController.get_single_post)
router.get('/edit_post/:id', checkAuth, postController.edit_post_page)
router.post('/edit_post/:id', checkAuth, upload.single('image'), postController.edit_post)
router.get('/delete_post/:id', checkAuth, postController.delete_post)
router.get('/video', checkAuth, postController.stream_video)

module.exports = router