const express = require("express");
const router = express.Router();
const User = require("../models/users");

// To create a new user  For registration purposes
router.post("/register", async (req, res) => {
  const { username, email } = req.body;
  try {
    const newUser = new User({ username, email });
    await newUser.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user.");
  }
});

// To Get user profile from our data base
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const posts = await Post.find({ user: user._id });
    res.render("userProfile", { user, posts });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error fetching user profile.`);
  }
});

module.exports = router;
