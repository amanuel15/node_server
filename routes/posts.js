const router = require('express').Router();
const verify = require('./verifyToken');
const postController = require('../controllers/postController')

router.post('/create_post',verify,postController.create_post);

router.delete('/delete_post',verify,postController.delete_post);

router.post('/like_unlike_post',verify,postController.like_unlike_post);

router.post('/create_comment',verify,postController.create_comment);

router.get('/get_feed',verify,postController.get_feed);

router.get('/get_my_posts', verify, postController.get_my_posts);

router.put('/update_post',verify,postController.update_post);

module.exports = router;