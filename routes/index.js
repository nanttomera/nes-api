var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var users = require('./users.json');
const Gamedig = require('gamedig');
// const SteamAPI = require('steamapi');
// const steam = new SteamAPI('5A7156714F8A3DC54F0C8582AC5C05E4');

// steam.resolve('https://steamcommunity.com/id/nanttomera').then(id => {
// 	console.log(id);
// });

// const checkServerStatus = steam.getServers('51.38.145.171').then((serversArray)=>{
//   console.log(serversArray);
// });
let serverStatus;
Gamedig.query({
  type: 'arkse',
  host: '51.38.145.171',
  port: 7777
}).then((state) => {
  serverStatus = state;
  console.log(state);
}).catch((error) => {
  console.log("Server is offline");
});



/* GET home page. */
router.get('/hello', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/core', function(req, res, next){
  res.send(serverStatus);
});

router.get('/users', function(req, res, next) {
  res.send(users);
});

module.exports = router;
