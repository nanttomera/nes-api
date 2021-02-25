var express = require("express");
var router = express.Router();
const Gamedig = require("gamedig");
const User = require("../models/User");
const moment = require("moment");
const Posts = require("../models/Post");

let serverStatus;
let whenSaved;

const serverCheck = async () => {
  try {
    const now = moment();
    if (whenSaved && !now.isAfter(whenSaved.add(10, "minutes"))) {
      return;
    }
    const state = await Gamedig.query({
      type: "arkse",
      host: "51.38.145.171",
      port: 7777,
    });
    serverStatus = state;
    whenSaved = moment();
  } catch (error) {
    console.log("Server is offline");
  }
};

/* GET home page. */
router.get("/hello", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/core", async function (req, res, next) {
  await serverCheck();
  res.send(serverStatus);
});

router.get("/user/:id", async function (req, res, next) {
  const users = await User.findOne({
    _id: req.params.id,
  });
  res.send(users);
});

//dodawanie usera

router.post("/user", async function (req, res, next) {
  try {
    const { email, name, password } = req.body;
    const user = new User({
      email,
      name,
      password,
    });
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, error });
  }
});

router.put("/user", async function (req, res, next) {
  const user = await User.findOne({
    _id: req.body._id,
  });
  // const passwordOk = await user.checkPassword(req.body.password);
  // if (!passwordOk){
  //   return res.json({success: false, message: "Incorrect password"})
  // };

  user.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;
  await user.save();
  res.json({ success: true, user });
});

router.get("/users", async function (req, res, next) {
  const users = await User.find();
  res.send(users);
});

//POSTS ROUTES

router.post("/post", async function (req, res, next) {
  try {
    const { postHead, postBody, Author } = req.body;
    const post = new Posts({
      postHead,
      postBody,
      Author,
    });
    await post.save();
    res.json({ success: true, post });
  } catch (error) {
    res.json({ success: false, error });
  }
});
//GET POST WITH EXACT _id
router.get("/post/:id", async function (req, res, next) {
  const posts = await Posts.findOne({
    _id: req.params.id,
  });
  res.send(posts);
});
// GET ALL THE POSTS
router.get("/posts", async function (req, res, next) {
  const posts = await Posts.find();
  res.send(posts);
});

router.put("/post", async function (req, res, next) {
  const post = await Posts.findOne({
    _id: req.body._id,
  });
  post.postHead = req.body.postHead;
  post.postBody = req.body.postBody;
  post.Author = req.body.Author;
  await post.save();
  res.json({ success: true, post });
});


module.exports = router;

// await User.create({
//   email,
//   name,
//   password,
// });
