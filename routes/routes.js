const express = require('express');
const router = express.Router();

const midUser = require('../src/middlewares/midUser');

router.get('/', (req, res) => {
  res.render('index')
})

const checkSignupValidation = [midUser.empty,
                              midUser.regex,
                              midUser.findLogin,
                              midUser.findEmail,
                              midUser.comparePassword]; 

router.post('/api/signup', checkSignupValidation, function(req, res) {
  console.log(req.body);
  let user = require('../models/user.class');
  let check = require('../library/tools');

  let messages = {};

  var hashNewPassword = check.isHash(req.body.newPassword);
  console.log(hashNewPassword);

  user.addUser(req.body.firstname, req.body.lastname, req.body.login, req.body.email, hashNewPassword)
    .then(function(ret) {
      if (ret === true)
      {
        messages.error = null;
        messages.newUser = true;
    
        res.send(messages);
      }
      else
      {
        console.log('error');
      }
    })
    .catch(err => {
			console.error('loginExists error: ', err);
		})
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