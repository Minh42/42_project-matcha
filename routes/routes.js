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
  // console.log(req.body);
  console.log(req.body.username);
  console.log(req.body.password);
  if (req.body.username === undefined || req.body.username === '') {
    req.flash('error', "incorrect username")
  }
  else {
    let Check = require('../models/check')
  }
  res.redirect('/')
})

module.exports = router 