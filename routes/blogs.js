const express = require("express");
const router = express.Router();
const Blogs = require("../models/blogs");
const blogsController = require("../controllers/blogsController");

// const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");

// routes
router.get("/", (req, res) => {
  res.redirect("blogs/page-1");
});

// pagination for articles
router.get("/page-:pageNo", blogsController.getBlogs, (req, res) => {
  res.render("blogs/index", {
    blogsArray: req.blogs,
    pages: req.pages,
    pageNo: req.params.pageNo,
  });
});

router.get("/newBlog", (req, res) => {
  res.render("blogs/newBlog");
});

router.put(
  "/edit/:id",
  blogsController.createBlogInstance,
  async (req, res) => {
    try {
      await Blogs.findByIdAndUpdate(req.params.id, req.blog);
      res.redirect("/");
    } catch (e) {
      res.sendStatus(400);
    }
  }
);

router.post(
  "/newBlog",
  blogsController.createBlogInstance,
  async (req, res) => {
    try {
      await Blogs.create(req.blog);
      res.redirect("/");
    } catch (e) {
      // Duplicate Title Error -> Repopulating Form and sending the error
      console.log(req.blog);
      console.log(e.message);
      if (e.code == 11000)
        res.render("blogs/newBlog", {
          blog: req.blog,
          errMsg: {
            title: e.message,
            // body: "This title is already in use. Use Different Title!",
          },
        });
      // else res.send(e.message);
    }
  }
);

// router.get("/show/:slug", blogsController.getBlogBySlug, (req, res) => {
//   res.render("blogs/show", { blog: req.blog });
// });

router.get("/show/:id", blogsController.getBlogById, (req, res) => {
  res.render("blogs/show", { blog: req.blog });
});

router.get("/edit/:id", blogsController.getBlogById, (req, res) => {
  res.render("blogs/edit", { blog: req.blog });
});

router.delete("/:id", async (req, res) => {
  try {
    await Blogs.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
