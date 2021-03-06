var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const _User = require("./models/User");
const passport = require("passport");
const SteamStrategy = require("passport-steam");
const session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// steam login

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

const STEAM_API_KEY = "5A7156714F8A3DC54F0C8582AC5C05E4";
passport.use(
  new SteamStrategy(
    {
      returnURL: "https://api.nes-ark.pl/auth/steam/return",
      realm: "https://api.nes-ark.pl/",
      apiKey: STEAM_API_KEY,
    },
    //tutaj odbywa sie validate user funkcja
    async function (identifier, profile, done) {
      let user = await _User.findOne({ openId: identifier });

      if (!user) {
        user = new _User({
          openId: identifier,
          profile,
        });
        await user.save();
      }
      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.

      //User.findByOpenID({ openId: identifier }, function (err, user) {
      // return done(err, user);
      // profile.identifier = identifier;
      return done(null, user);
    }
  )
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  cors({
    origin: "https://nes-ark.pl",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "dupa",
    name: "nes",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//session na passporcie po zalogowaniu tworzy cookies (w tle sie dzieje?)

app.use("/", indexRouter);
app.use("/users", usersRouter);
//app.use users mozna chyba wyebac
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
