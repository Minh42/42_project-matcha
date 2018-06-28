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
  newPassword = req.body.newPassword;
  confirmedPassword = req.body.confirmedPassword; 

  let check = require('../library/tools');

  let messages = {};

  if (check.isEmpty(firstname) || check.isEmpty(lastname) || check.isEmpty(login) 
  || check.isEmpty(email) || check.isEmpty(newPassword) || check.isEmpty(confirmedPassword))
  {
    messages.empty = "Veuillez remplir les champs vide";
  }
  else {
    console.log('IM HERE');
    messages.empty = null;
  }
  return res.send(messages);
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