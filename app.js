require("dotenv").config();
const express = require("express");
const blogsRouter = require("./routes/blogs");
const methodeOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();

// middlewares
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodeOverride("_method"));

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use("/blogs", blogsRouter);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log("Server is listening....");
    });
  })
  .catch((e) => {
    console.log(e);
  });
