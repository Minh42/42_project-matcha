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

  let check = require('../library/tools');
  let user = require('../models/user');
  let messages = {};
  var username = req.body.username;
  var password = req.body.password;

  if (check.isEmpty(username) || check.isEmpty(password))
    messages.empty = "Incorrect username or password";
  else if (!check.isUsername(username) || !check.isPassword(password))
    messages.empty = "Incorrect username or password";
  else {
    messages.empty = null;
    if (user.login(username, password)) {
      
    }
  }
  return res.send(messages);
})

module.exports = router 