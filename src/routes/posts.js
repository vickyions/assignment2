const router = require('express').Router();
const Post = require('../models/post');
const { body, param, validationResult } = require('express-validator');

//req.tokenPayload : {email, id}

router.get('/', async (_req, res) => {
    try {
        const posts = await Post.find({}).populate('user', { password: 0 });
        res.json({
            status: 'success',
            message: 'all posts',
            posts,
        });
    } catch (err) {
        console.log('posts get endpoint:: ', err);
        res.status(500).json({
            status: 'failed',
            message: 'server error',
        });
    }
});

router.get('/:postId', param('postId').isString(), async (req, res) => {
    try {
        //Input validation results
        const inputErrors = validationResult(req);
        if (!inputErrors.isEmpty()) {
            return res.status(400).json({ errors: inputErrors.array() });
        }
        //
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            res.status(400).json({
                status: 'failed',
                message: 'give a valid post Id',
            });
            return;
        }
        res.json({
            status: 'success',
            message: 'all posts',
            post: await post.populate('user', { password: 0 }),
        });
    } catch (err) {
        console.log('posts get endpoint:: ', err);
        res.status(500).json({
            status: 'failed',
            message: 'server error',
        });
    }
});

router.post(
    '/',
    body('title').isString(),
    body('body').isString(),
    body('image').isURL(),
    async (req, res) => {
        try {
            //Input validation results
            const inputErrors = validationResult(req);
            if (!inputErrors.isEmpty()) {
                return res.status(400).json({ errors: inputErrors.array() });
            }
            //
            const { title, body, image } = req.body;
            const { id: userId } = req.tokenPayload;
            //create post
            const post = await Post.create({
                title,
                body,
                image,
                user: userId,
            });
            res.json({
                status: 'success',
                message: 'post successfully created',
                post: await post.populate('user', { password: 0 }),
            });
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                errors: err.message,
            });
        }
    }
);

router.put(
    '/:postId',
    body('title').isString(),
    body('body').isString(),
    body('image').isURL(),
    param('postId').isString(),
    async (req, res) => {
        try {
            //Input validation results
            const inputErrors = validationResult(req);
            if (!inputErrors.isEmpty()) {
                return res.status(400).json({ errors: inputErrors.array() });
            }
            //
            const { title, body, image } = req.body;
            const { postId } = req.params;
            const { email: userEmail, id: userId } = req.tokenPayload;
            //update post
            const post = await Post.findById(postId);
            if (!post) {
                res.status(400).json({
                    status: 'failed',
                    message: 'give a valid post Id',
                });
                return;
            }
            //console.log(post.user.valueOf(), userId);
            if (post.user.toString() !== userId) {
                res.status(401).json({
                    status: 'failed',
                    message: 'you are not authorized to change this post',
                });
                return;
            }

            const newPost = await Post.findByIdAndUpdate(
                postId,
                { $set: { title, body, image } },
                { new: true }
            );
            res.json({
                status: 'success',
                message: 'post successfully updated',
                post: await newPost.populate('user', { password: 0 }),
            });
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                errors: err.message,
            });
        }
    }
);

router.delete('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { id: userId } = req.tokenPayload;
        const post = await Post.findById(postId);
        if (!post) {
            res.status(400).json({
                status: 'failed',
                message: 'give a valid post Id',
            });
            return;
        }
        if (post.user.toString() !== userId) {
            res.status(401).json({
                status: 'failed',
                message: 'you are not authorized to delete this post',
            });
            return;
        }

        const result = await Post.findByIdAndDelete(postId);
        console.log('post delete route::', result);
        res.json({
            status: 'success',
            message: 'post successfully deleted',
            post: await post.populate('user', { password: 0 }),
        });
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            errors: err.message,
        });
    }
});
module.exports = router;
