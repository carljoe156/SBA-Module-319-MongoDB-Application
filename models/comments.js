// models/comment.js
// Here is added validation in the schema
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // calls my reference to the Post model
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //  calls my Reference to the User model, the person who made the comment
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
