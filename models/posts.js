// models/post.js
// Here is added validation in the schema
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (author of the post)
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Reference to comments
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
