const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../server/config');

const midUser = require('../src/middlewares/midUser');

router.get('/', (req, res) => {
  res.render('index')
})

const checkSignupValidation = [midUser.findLogin,
                              midUser.findEmail]; 

router.post('/api/signup', checkSignupValidation, function(req, res) {
  console.log(req.body);
  let user = require('../models/user.class');
  let check = require('../library/tools');

  let messages = {};

  var hashNewPassword = check.isHash(req.body.newPassword);
  console.log(hashNewPassword);

  user.addUser(req.body.firstName, req.body.lastName, req.body.login, req.body.email, hashNewPassword)
    .then(function(ret) {
      if (ret === true)
      {
        messages.error = null;
        messages.sucess = true;
    
        console.log(messages);
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
  let user = require('../models/user.class');
  let messages = {};
  let { username, password } = req.body;
  user.login(username, password).then(function(ret) {
    if (ret) {
      const token = jwt.sign({ id: username }, config.jwtSecret);
      res.json({token});
    } else {
      res.status(401).json( { errors: { form: 'Incorrect username or password'} });
    }
  })   
})

module.exports = router 