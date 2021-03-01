var express = require("express");
var router = express.Router();
const Gamedig = require("gamedig");
const _User = require("../models/User");
const moment = require("moment");
const Posts = require("../models/Post");
const passport = require("passport");
const SteamStrategy = require("passport-steam");

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

//steam-passport

router.get("/auth/steam", passport.authenticate("steam"));

router.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.json(req.user);
    // res.redirect('http://localhost:3000/');
  }
);

router.get("/dupa", (req, res, next) => {
  res.send(
    req.isAuthenticated()
      ? "Siema " + req.user.profile.displayName
      : "Spierdalaj"
  );
});

// steam passport end

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
    const user = new _User({
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
  const user = await _User.findOne({
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
  const users = await _User.find();
  res.send(users);
});

//

//POSTS ROUTES

router.post("/post", async function (req, res, next) {
  try {
    const { postHead, postBody, Author, password } = req.body;
    if (password === "dupa123cycki") {
      const post = new Posts({
        postHead,
        postBody,
        Author,
      });
      await post.save();
      res.json({ success: true, post });
    } else {
      throw new Error("Wrong password");
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
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
//POST CHANGE
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
