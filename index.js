const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const postRoutes = require("./routes/postRoute");
const commentRoutes = require("./routes/commentRoute");
const userRoutes = require("./routes/userRoute");
const User = require("./models/users"); // For our Temp Seed
const Post = require("./models/posts"); // For our Temp Seed
const Comment = require("./models/comments"); // For our Temp Seed

// Import DB connection to connect it to MongoDB)
const db = require("./db/conn");

const bodyParser = require("body-parser");
// Sets the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// To Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Use express.json() for parsing JSON bodies
app.use(express.json()); // No need for body-parser.json()

// My routes
app.use("/postRoute", postRoutes);
app.use("/commentRoute", commentRoutes);
app.use("/userRoute", userRoutes);

// Custom middleware to log requests
app.use((req, res, next) => {
  console.log("Middleware: I run for all routes");
  next();
});

app.use((req, res, next) => {
  const time = new Date();
  console.log(
    `-----
          ${time.toLocaleDateString()}: Received a ${req.method} request to ${
      req.url
    }.`
  );

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Our Seed Sample Data
// Our Sample Users
const seedData = async (req, res) => {
  try {
    // Sample Users
    const users = [
      {
        username: "john_doe",
        email: "john.doe@example.com",
        password: "password123",
      },
      {
        username: "jane_smith",
        email: "jane.smith@example.com",
        password: "securepassword456",
      },
      {
        username: "bob_jones",
        email: "bob.jones@example.com",
        password: "mypassword789",
      },
    ];

    // Sample Posts
    const posts = [
      { title: "First Post Title", content: "Content of the first post." },
      { title: "Second Post Title", content: "Content of the second post." },
    ];

    // Sample Comments
    const comments = [
      { content: "This is a great post!" },
      { content: "Thanks for sharing, very insightful!" },
      { content: "I disagree with some points, but nice work!" },
      { content: "Great perspective, keep it up!" },
    ];

    // Insert Users into DB
    const insertedUsers = await User.insertMany(users);

    // Insert Posts and associate each post with a user
    const insertedPosts = await Post.insertMany(
      posts.map((post, index) => ({
        ...post,
        user: insertedUsers[index % insertedUsers.length]._id,
      }))
    );

    // Insert Comments and associate each comment with a post and a user
    const insertedComments = await Comment.insertMany(
      comments.map((comment, index) => ({
        ...comment,
        post: insertedPosts[index % insertedPosts.length]._id,
        user: insertedUsers[index % insertedUsers.length]._id,
      }))
    );

    // Update Posts with the inserted comments
    await Promise.all(
      insertedPosts.map(async (post) => {
        post.comments = insertedComments
          .filter((comment) => comment.post.toString() === post._id.toString())
          .map((comment) => comment._id);
        await post.save();
      })
    );

    // Send success response after seeding
    res.status(200).json({ message: "Sample data seeded successfully!" });
  } catch (err) {
    // Log error and send failure response
    console.error(err);
    res.status(400).json({ error: "Error seeding sample data" });
  }
};
app.get("/seed", seedData);

// Home route that renders out our index.ejs file- without temp seed
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home page",
    message: "Welcome to ServeSpoon Blog!",
  });
});

// This can help with displaying everything Homepage route
// app.get("/", async (req, res) => {
//   try {
//     // Fetch posts with populated user data
//     const posts = await Post.find()
//       .populate("user", "username email") // Populate the user field with 'username' and 'email'
//       .populate("comments"); // Optional: populate comments

//     // Render the EJS view and pass posts data
//     res.render("home", { posts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching posts.");
//   }
// });
// Define your other routes here
// app.use("/api/fruits", fruitRoutes);
// app.use("/api/vegetables", vegetableRoutes);

// Get our Posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email") // Populating the user field with 'username' and 'email'
      .populate("comments"); // Optionally, populate comments too if needed
    res.json(posts);
  } catch (err) {
    res.status(500).send("Error fetching posts.");
  }
});

// Gets our Users and Comments
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "username email") // Populate the user field with 'username' and 'email'
      .populate("post", "title"); // Populate the post field with 'title' (or any other fields)
    res.json(comments);
  } catch (err) {
    res.status(500).send("Error fetching comments.");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Our Server is listening on http://localhost:${PORT}`);
});
