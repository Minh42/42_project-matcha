const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../server/config');

const midUser = require('../src/middlewares/midUser'); 

//PARAMETER EMAIL (nodemailer)
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'matcha.appli@gmail.com',
         pass: 'born2code'
     }
 });
 
router.get('/', (req, res) => {
  res.render('index')
})

//SIGNUP
const checkSignupValidation = [midUser.findLogin,
                              midUser.findEmail]; 
router.post('/api/signup', checkSignupValidation, function(req, res) {
  console.log(req.body);
  let user = require('../models/user.class');
  let check = require('../library/tools');

  let messages = {};

  var hashNewPassword = check.isHash(req.body.newPassword);
  let token = jwt.sign( {  foo : req.body.login } , config.jwtSecret );

  user.addUser(req.body.firstName, req.body.lastName, req.body.login, req.body.email, hashNewPassword, token)
    .then(function(ret) {
      if (ret === true)
      {
        var mail = {
					from: "matcha.appli@gmail.com",
					to: req.body.email,
					subject: "Welcome to  Matcha",
          html: '<h3> Hello ' + req.body.firstName + '</h3>' +
          '<p>To activate your account, please click on the link below.</p>' +
          '<p>http://localhost:3000/api/activationMail?login='+ req.body.login +'&token=' + token + '</p>' +
          '<p> --------------- /p>' +
          '<p>This is an automatic mail, Please do not reply.</p>'
        }
        
        transporter.sendMail(mail, function (err, info) {
          if(err)
            console.log(err)
          else
            console.log(info);
       });
       
        messages.error = null;
        messages.success = "success";
    
        console.log(messages);
        res.send(messages);
      }
      else {
        console.log('error');
      }
    })
    .catch(err => {
			console.error('loginExists error: ', err);
		})
})

//ACTIVATIOM BY EMAIL
router.get('/api/activationMail', function(req, res) {
  var login = req.param('login');
  var token = req.param('token');

  let user = require('../models/user.class');

  user.compareToken(login, token)
    .then(function(ret) {
      if (ret === true)
      {
        console.log('token in database')
        user.changeStatus(login)
          .then(function(ret){
            res.redirect('/');
        })
      }
      else {
        console.log('error');
      }
    })
    .catch(err => {
			console.error('loginExists error: ', err);
		})
})

//SIGNIN
router.post('/api/signin', function(req, res) {
  let user = require('../models/user.class');
  let messages = {};
  let { username, password } = req.body;
  user.login(username, password).then(function(ret) {
    if (ret) {
      const token = jwt.sign({ id: username }, config.jwtSecret);
      res.json({token});
    } else {
      res.sendStatus(401);
    }
  })   
})

//FORGOT PASSWORD
router.post('/api/forgotPassword', function(req, res) {
  var messages = {}
  console.log(req.body.email);
  let user = require('../models/user.class');
  user.emailExist(req.body.email)
        .then(function(ret){
          if (ret)
          {
            console.log(ret);

            user.searchByEmail(req.body.email)
              .then(function(ret){
                  console.log(ret[0].first_name);
                  console.log(ret[0].username);
                  login = ret[0].username;
                  firstname = ret[0].first_name;

                  var token_reset = jwt.sign( {  foo : req.body.login } , config.jwtSecret );
                  console.log(token_reset);

                  user.addTokenResetBDD(login, token_reset)
                    .then(function(ret){
                      if (ret)
                      {
                        var mail = {
                        from: "matcha.appli@gmail.com",
                        to: req.body.email,
                        subject: "Reset your password Matcha",
                        html: '<h3> Hello ' + firstname + '</h3>' +
                        '<p>To reset your password, please click on the link below.</p>' +
                        '<p>http://localhost:3000/api/resetPassword?login='+ login +'&token_reset=' + token_reset + '</p>' +
                        '<p> --------------- /p>' +
                        '<p>This is an automatic mail, Please do not reply.</p>'
                        }
                                  
                        transporter.sendMail(mail, function (err, info) {
                        if(err)
                          console.log(err)
                        else
                          console.log(info);
                        });
                        messages.success = true;
                        messages.error = false;
                        console.log(messages);
                        res.send(messages);
                      }
                      else {
                        res.sendStatus(401);
                      }
                    })
              })
          }
          else {
            messages.error = true;
            messages.success = false;
            res.send(messages);
          }
    })
})

//RESET PASSWORD
router.get('/api/resetPassword', function(req, res) {
  let user = require('../models/user.class');
  let messages = {};
  var login = req.param('login');
  var token_reset = req.param('token_reset');

  user.compareTokenReset(login, token_reset)
  .then(function(ret) {
    if (ret === true) {
      console.log('token_reset in database')
      res.redirect('/resetPassword/' + login);
    }
    else {
      console.log('error');
    }
  })
  .catch(err => {
    console.error('loginExists error: ', err);
  })
})

//SEND NEW PASSWORD

router.post('/api/sendNewPassword', function(req, res) {
  let user = require('../models/user.class');
  let messages= {};

  hashNewPassword = check.isHash(req.body.newPasswordReset);
  console.log(hashNewPassword);

  // user.sendNewPasswordBDD()
  //   .then (function(ret){
  //     if (ret) {

  //     }
  //   });
})

module.exports = router 