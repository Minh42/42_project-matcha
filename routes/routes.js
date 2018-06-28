const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  console.log(req.session)
  res.render('index')
})

router.post('/api/signup', function(req, res) {
  console.log(req.body);
  firstname = req.body.firstname;
  lastname = req.body.lastname;
  login = req.body.login;
  email = req.body.email;
  password = req.body.password;
  confirmedPassword = req.body.confirmedPassword;
  console.log(login);
  console.log(login);  
})

router.post('/api/signin', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  let check = require('../library/tools')

  if (check.isUsername(username)) {
    console.log('HEY')
  }
  else {
    console.log('WTF')
  }

  if (check.isPassword(password)) {
    console.log('HEY')
  }
  else {
    console.log('WTF')
  }

  // const User = new User();
  // if (User.login(username, password)) {

  // }

  // if (req.body.username === undefined || req.body.username === '') {
  //   req.flash('error', "incorrect username")
  // }
  // else {
  //   let Check = require('../models/check')
  // }
  // res.redirect('/')
})

module.exports = router 