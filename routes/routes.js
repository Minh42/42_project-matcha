const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../server/config/keys');
const midUser = require('../src/middlewares/midUser'); 

const passport = require('passport');
const passportConfig = require('../server/services/passport');

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
      if (ret) {
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
  console.log(login)
  console.log(token)

  let user = require('../models/user.class');

  try {
    user.compareToken(login, token).then(function(ret) {
      if (ret) {
        console.log('token in database')
        user.changeStatus(login).then(function(ret){
          res.redirect('/');
        })
      }
    })
  } catch(err) {
    throw new Error(err)
  } 
})

//SIGNIN
router.post('/api/signin', function(req, res) {
  let user = require('../models/user.class');
  let messages = {};
  let { username, password } = req.body;
  user.login(username, password)
    .then(function(ret) {
    console.log('IM FUCKING HERE');
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
  let user = require('../models/user.class');
  user.findOne("email", req.body.email).then(function(ret){
    if (ret) {
      user.searchByColName("email",req.body.email).then(function(ret){   
        user_id = ret[0].user_id;
        login = ret[0].username;
        firstname = ret[0].firstname;

        var token_reset = jwt.sign( {  foo : req.body.login } , config.jwtSecret );
          
        user.addTokenResetBDD(user_id, token_reset).then(function(ret){
          if (ret) {
            var mail = {
              from: "matcha.appli@gmail.com",
              to: req.body.email,
              subject: "Reset your password Matcha",
              html: '<h3> Hello ' + firstname + '</h3>' +
              '<p>To reset your password, please click on the link below.</p>' +
              '<p>http://localhost:3000/api/resetPassword?user_id='+ user_id +'&token_reset=' + token_reset + '</p>' +
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
  var user_id = req.param('user_id');
  var token_reset = req.param('token_reset');

  user.compareTokenReset(user_id, token_reset).then(function(ret) {
    if (ret) {
      console.log('token_reset in database')
      res.redirect('/resetPassword/' + user_id);
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
  let check = require('../library/tools');
  let messages= {};

  hashNewPassword = check.isHash(req.body.newPasswordReset);
  console.log(hashNewPassword);

  user.sendNewPasswordBDD(hashNewPassword, req.body.user_id).then (function(ret){
    if (ret) {
      res.send({redirect: '/'});
    }
    else {
      res.sendStatus(401);
    }
  });
})

//CHANGE BASIC INFO USER
router.post('/api/modifData', (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.body.user_id
  const login = req.body.login
  const firstname = req.body.firstName
  const lastname = req.body.lastName
  const email = req.body.email
  user.changeUserInfo(user_id, login, firstname, lastname, email)
    .then(function(ret) {
      res.send({redirect: '/ModifProfile'});
    })
  console.log(req.body);
})

//CHANGE NEW INFO USER
router.post('/api/changeNewInfo', (req, res) => {
  let user = require('../models/user.class');
  console.log(req.body)
  const tags = req.body.tags;

  const birthdate = req.body.values.birthdate
  const sex = req.body.values.sex
  const interest = req.body.values.interest
  const bio = req.body.values.bio
  const relationship = req.body.values.relationship
  console.log(birthdate)
})

//CHANGE 
router.post('/api/changeNewInfo', (req, res) => {
  let user = require('../models/user.class');
  console.log(req.body)
  const user_id = req.body.values.user_id
  const tags = req.body.tags;
  const birthdate = req.body.values.birthdate
  const sex = req.body.values.sex
  const interest = req.body.values.interest
  const bio = req.body.values.bio
  const relationship = req.body.values.relationship
  user.changeBirthdateGender(user_id, birthdate, sex)
    .then(function(ret){
  if (ret) {
    user.changeInterest(user_id, interest)
  .then(function(ret){
  
        });
      }
    }); 
  });


//CHANGE PASSWORD
router.post('/api/changePassword', function(req, res) {
  let user = require('../models/user.class');
  console.log(req.body)
  let check = require('../library/tools');
  let messages= {};

  hashNewPassword = check.isHash(req.body.newPassword);
  console.log(hashNewPassword);

  user.sendNewPasswordBDD(hashNewPassword, req.body.user_id)
    .then (function(ret){
      if (ret) {
        res.send({redirect: '/ModifProfile'});
      }
      else {
        res.sendStatus(401);
      }
    });
})

router.get('/api/auth/facebook',
  passport.authenticate('facebook', { display: 'popup' }, { scope: ['public_profile', 'email'] })
);

router.get('/api/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect : '/homepage',
		failureRedirect : '/'
	})
);

router.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/api/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/homepage',
    failureRedirect : '/'
  })
);

router.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
});

router.get('/api/profile', (req, res) => {
  res.send(req.user);
});

router.get('/api/infoUser', (req, res) => {
  // console.log(req.user);
  console.log('helloyou')
  res.send(req.user);
});

module.exports = router 