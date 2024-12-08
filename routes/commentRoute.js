// routes/comments.js
const express = require("express");
const Comment = require("../models/comments");
const Post = require("../models/posts");
const User = require("../models/users");
const router = express.Router();

// Add a new comment to a post
router.post("/:postId", async (req, res) => {
  const { content, userId } = req.body;
  try {
    const user = await User.findById(userId);
    const post = await Post.findById(req.params.postId);
    const newComment = new Comment({ content, user: user._id, post: post._id });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res.redirect(`/posts/${post._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error adding comment.`);
  }
});

// Delete a comment
router.post("/:commentId/delete", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    const post = await Post.findById(comment.post);
    post.comments = post.comments.filter(
      (c) => c.toString() !== comment._id.toString()
    );
    await post.save();
    res.redirect(`/posts/${post._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error deleting comment.`);
  }
});

module.exports = router;
