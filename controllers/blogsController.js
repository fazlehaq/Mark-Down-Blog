const Blogs = require("../models/blogs");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const { marked } = require("marked");
const dompurify = createDomPurify(new JSDOM().window);

async function getBlogs(req, res, next) {
  const ARTICLES_PER_PAGE = 4;

  // checking if params is a number
  const reg = new RegExp("^[0-9]$");
  if (!reg.test(req.params.pageNo)) return res.sendStatus(400);

  // calculate the pages
  const pageNo = req.params.pageNo;
  const totalArticles = parseInt(await Blogs.countDocuments({}));
  if (totalArticles == 0)
    return res.render("blogs/index", { msg: "No Articles" });
  const pages = parseInt(Math.ceil(totalArticles / ARTICLES_PER_PAGE));
  // corner case
  if (pageNo > pages) return res.sendStatus(400);

  const skipArticles = (pageNo - 1) * ARTICLES_PER_PAGE;

  try {
    const blogs = await Blogs.find({})
      .sort({ updatedAt: -1 })
      .skip(skipArticles)
      .limit(ARTICLES_PER_PAGE);
    req.blogs = blogs;
    req.pages = pages;
    next();
  } catch (e) {
    return res.sendStatus(400);
  }
}

async function getBlogById(req, res, next) {
  try {
    const blog = await Blogs.findById(req.params.id);
    req.blog = blog;
    next();
  } catch (e) {
    return res.sendStatus(400);
  }
}

function createBlogInstance(req, res, next) {
  const blog = {
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.body,
    updatedAt: Date.now(),
    sanitizedHtml: dompurify.sanitize(marked(req.body.body)),
  };
  req.blog = blog;
  next();
}

module.exports = { getBlogs, getBlogById, createBlogInstance };
