const router = require('express').Router();
const { compare } = require('bcrypt');
const User = require('../models/user');
const sanitizeInput = require('./utils/sanitizeInput');
const { body, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'this is a secret passage';
const expiresIn = '15m';

router.post(
    '/',
    body('password').isString(),
    body('email').isEmail(),
    sanitizeInput,
    async (req, res) => {
        try {
            //Input validation results
            const inputErrors = validationResult(req);
            if (!inputErrors.isEmpty()) {
                return res.status(400).json({ errors: inputErrors.array() });
            }
            //
            const { email, password } = req.body;

            //check user exists?
            const user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({
                    status: 'failed',
                    message: 'no such user exists',
                });
            } else {
                //compare the password
                const result = await compare(password, user.password);
                if (!result) {
                    res.status(400).json({
                        status: 'failed',
                        message: 'wrong credentials',
                    });
                } else {
                    //user exists and correct password
                    //generate accessToken with id
                    const accessToken = jwt.sign(
                        { email: user.email, id: user.id },
                        secret,
                        { expiresIn: expiresIn }
                    );

                    res.json({
                        status: 'success',
                        message: 'succefully logged in',
                        token: accessToken,
                    });
                }
            }
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                errors: err.message,
            });
        }
    }
);

module.exports = router;
