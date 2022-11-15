const express = require('express');
const app = express();
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const postRouter = require('./routes/posts');
const authenticate = require('./routes/utils/auth.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.use("/register", registerRouter);
app.use("/login", loginRouter);

//auth routes
app.use("/posts", authenticate);
app.use("/posts", postRouter);

app.get("/", (_req, res) => {
    res.json({message: "Hey"});
})

module.exports = app;
