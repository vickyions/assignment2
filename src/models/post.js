const mongoose = require("mongoose");
const User = require("./user");

const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    image: {type: String, required: true},
    user: {type: ObjectId, ref: User, required: true}
});

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
