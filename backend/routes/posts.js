const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');

const db = require('../sqlite/connection');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    let post = request.body
    let postInfo = {
        userId: request.currentUser.id,
        text: post.text,
        media: post.media,
    }

    // Endpoint to create a new post
    PostModel.create(postInfo, (callback) => {
        response.status(201).json(callback)
    })

});


router.put('/:postId/likes', authorize, (request, response) => {

    let userID = request.currentUser.id
    let postID = request.params.postId
    // Endpoint for current user to like a post
    PostModel.getLikesByUserIdAndPostId(userID, postID, (likes) => {
        if (!likes.length) {
            PostModel.like(userID, postID, (callback) => {
                response.status(201).json(callback)
            })
        }
    })
});

router.delete('/:postId/likes', authorize, (request, response) => {

    let userID = request.currentUser.id
    let postID = request.params.postId
    // Endpoint for current user to unlike a post

    PostModel.getLikesByUserIdAndPostId(userID, postID, (likes) => {
        if (likes.length) {
            PostModel.unlike(userID, postID, (callback) => {
                response.status(201).json(callback)
            })
        }
    })
});

module.exports = router;
