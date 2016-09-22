var express = require('express');
var router = express.Router();

var knex = require('../db/knex');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/public', function(req, res, next) {
  res.render('public');
});

router.get('/private', function(req, res, next) {
  if (!req.session.userInfo) {
    res.render('error', {
      message: 'Private page, not authorized.'
    })
  } else {
    var userInfo = req.session.userInfo
    res.render('private', {username: userInfo.user_name, firstname: userInfo.first_name, lastname: userInfo.last_name})
  }
});

router.get('/admin', function(req, res, next) {
  if (!req.session.userInfo.is_admin){
    res.render('error', {message: 'Only admins, you hacker smacker.'})
  } else {
    res.render('admin')
  }
});

router.get('/logout', function(req, res, next){
  req.session = null
  res.redirect('/')
})

router.post('/login', function(req, res, next) {
  knex('users').where('user_name', req.body.username).then(function(results) {
    if (results.length == 0) {
      res.render('error', {
        message: 'Username or password incorrect.'
      })
    } else {
      var user = results[0];
      var passwordMatch = bcrypt.compareSync(req.body.password, user.password)
      delete user.password;
      if (passwordMatch === false) {
        res.render('error', {
          message: 'Username or password incorrect.'
        })
      } else {
        req.session.userInfo = user
        res.redirect('/private')
      }
    }
  })
})

router.post('/signup', function(req, res, next) {
  knex('users').where('user_name', req.body.username).then(function(results) {
    console.log(results);
    if (results.length >= 1) {
      res.render('error', {
        message: 'Username is already being used.'
      })
    } else {
      var user = req.body;
      var hash = bcrypt.hashSync(req.body.password, 12)
      knex('users')
        .returning('*')
        .insert({
          user_name: user.username,
          first_name: user.firstname,
          last_name: user.lastname,
          password: hash,
          is_admin: false
        })
        .then(function(results) {
          console.log(results);
          // delete results.password;
          req.session.userInfo = results
          res.redirect('/private')
        })
    }
  })
})

module.exports = router;
