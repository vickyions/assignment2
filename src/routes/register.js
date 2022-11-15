const router = require('express').Router();
const { hash } = require('bcrypt');
const User = require('../models/user');
const sanitizeInput = require('./utils/sanitizeInput');
const { body, validationResult } = require('express-validator');

const saltRound = process.env.Salt_Round || 10;

router.post(
    '/',
    body('name').isAlpha("en-US", {ignore: " "}),
    body('password').isString().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }),
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
            const { name, email, password } = req.body;

            //check duplicate email
            const user = await User.findOne({ email });
            if (user) {
                res.status(400).json({
                    status: 'failed',
                    message: 'email already exists',
                });
            } else {
                //hashing the password
                const hashedPass = await hash(password, saltRound);
                const user = await User.create({
                    name,
                    email,
                    password: hashedPass,
                });
                res.json({
                    status: "success",
                    message: "successfully registered the user",
                    user
                });
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
