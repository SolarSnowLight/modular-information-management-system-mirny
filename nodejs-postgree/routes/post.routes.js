const Router = require('express')
const router = new Router
const postController = require('../controllers/post.controller')

router.post('/post', postController.createPost)
router.get('/post', postController.getPostsByUser)


module.exports = router