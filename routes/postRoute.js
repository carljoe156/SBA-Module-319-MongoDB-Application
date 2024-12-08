const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");

// To create a new post
router.post("/", async (req, res) => {
  const { title, content, userId } = req.body;
  try {
    const user = await User.findById(userId);
    const newPost = new Post({ title, content, user: user._id });
    await newPost.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error can't create post.`);
  }
});

// To Get a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username")
      .populate("comments")
      .exec();
    res.render("show", { post });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error fetching post.`);
  }
});

// Edit a post
router.get("/:id/edit", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("edit", { post });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching post for editing.");
  }
});

router.post("/:id/edit", async (req, res) => {
  const { title, content } = req.body;
  try {
    await Post.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect(`/posts/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating post.");
  }
});

// Delete a post
router.post("/:id/delete", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting post.");
  }
});

module.exports = router;
