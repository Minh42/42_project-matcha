const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
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

  if (!check.isEmpty(firstname) || !check.isEmpty(lastname) || !check.isEmpty(login) 
  || !check.isEmpty(email) || !check.isEmpty(newPassword) || !check.isEmpty(confirmedPassword))
  {
    messages.empty = "Veuillez remplir les champs vide";
  }
  else 
  {
    if (!check.isFirstname(firstname))
      messages.errorFirstname = "Votre prenom n'est pas valide";
    else
      messages.errorFirstname = null;
    if (!check.isLastname(lastname))
      messages.errorLastname = "Votre nom n'est pas valide";
    else
      messages.errorLastname = null;
    if (!check.isUsername(login))
      messages.errorLogin = "Votre login n'est pas valide";
    else
      messages.errorLogin = null;
    if (!check.isEmail(email))
      messages.errorEmail = "Votre email n'est pas valide";
    else
      messages.errorEmail = null;
    if (!check.isPassword(newPassword))
      messages.errorPassword = "Votre password n'est pas valide";
    else
      messages.errorPassword = null;
    if (!check.isPassword(confirmedPassword))
      messages.errorConfirmedPassword = "Votre password n'est pas valide";
    else
      messages.errorConfirmedPassword = null;
    
    if (check.isFirstname(firstname) && check.isLastname(lastname) && check.isUsername(login)
    && check.isEmail(email) && check.isPassword(newPassword) && check.isPassword(confirmedPassword))
    {
      if (newPassword === confirmedPassword)
      {
        var hashNewPassword = check.isHash(newPassword);
        console.log(hashNewPassword);

        let user = require('../models/user.class');

        user.addUser(firstname, lastname, login, email, hashNewPassword);
        messages.errorConfirmedPassword = null;
        messages.newUser = true;
      }
      else
        messages.errorConfirmedPassword = "your password not match";
    }

    messages.empty = null;
  }
  console.log(messages);
  return res.send(messages);
})

router.put('/auth/forgot', function(req, res) {
  let user = require('../models/user.class');
  user.forgot
})
  
router.post('/api/signin', function(req, res) {
  let check = require('../library/tools');
  let user = require('../models/user.class');
  let messages = {};
  let username = req.body.username;
  let password = req.body.password;

  if (check.isEmpty(username) || check.isEmpty(password)) 
    messages.error = "Incorrect username or password";
  else if (!check.isUsername(username) || !check.isPassword(password))
    messages.error = "Incorrect username or password";
  else {
    user.login(username, password).then(function(ret) {
      if (ret) {
        // console.log('Login successful');
        messages.error = "Login successful";
        res.send(messages);
      }
      else {
        // console.log('Incorrect username or password');
        messages.success = "Incorrect username or password";
        res.send(messages);
      }
    })   
  }
})

module.exports = router 