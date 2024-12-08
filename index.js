const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const postRoutes = require("./routes/postRoute");
const commentRoutes = require("./routes/commentRoute");
const userRoutes = require("./routes/userRoute");

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

// Home route that renders out index.ejs file
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home page",
    message: "Welcome to ServeSpoon Blog!",
  });
});

// This can help with displaying everything Homepage route
// app.get("/", async (req, res) => {
//     try {
//       const posts = await mongoose.model("Post").find().populate("user", "username").exec();
//       res.render("index", { posts });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Error fetching posts.");
//     }
//   });

// Define your other routes here
// app.use("/api/fruits", fruitRoutes);
// app.use("/api/vegetables", vegetableRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Our Server is listening on http://localhost:${PORT}`);
});
