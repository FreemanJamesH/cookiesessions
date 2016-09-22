var express = require('express');
var router = express.Router();
// needs knex
// needs bcrypt

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', {
    title: 'Express'
  });
});

module.exports = router;
