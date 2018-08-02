const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../server/config');
const midUser = require('../src/middlewares/midUser'); 

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const keys = require('../server/keys');

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

  let user = require('../models/user.class');

  user.compareToken(login, token)
    .then(function(ret) {
      if (ret) {
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
          if (ret) {
            console.log(ret);

            user.searchByEmail(req.body.email)
              .then(function(ret){
                  console.log(ret[0].user_id);
                  console.log(ret[0].firstname);
                  console.log(ret[0].username);
                  user_id = ret[0].user_id;
                  login = ret[0].username;
                  firstname = ret[0].firstname;

                  var token_reset = jwt.sign( {  foo : req.body.login } , config.jwtSecret );
                  console.log(token_reset);

                  user.addTokenResetBDD(user_id, token_reset)
                    .then(function(ret){
                      if (ret)
                      {
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
  var user_id = req.param('user_id');
  var token_reset = req.param('token_reset');

  user.compareTokenReset(user_id, token_reset)
  .then(function(ret) {
    if (ret === true) {
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

  user.sendNewPasswordBDD(hashNewPassword, req.body.user_id)
    .then (function(ret){
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

//PASSPORT GOOGLE SIGN IN

passport.serializeUser(function(user, done) {
  console.log(user)
  done(null, user[0].user_id);
});
 
passport.deserializeUser(function(id, done) {
  let user = require('../models/user.class');
  user.searchById(id)
    .then(function(user) {
      console.log(user);
      done(null, user);
    })
});

passport.use(
  new GoogleStrategy({
    clientID : keys.googleClientID,
    clientSecret : keys.googleClientSecret,
    callbackURL : '/api/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    let user = require('../models/user.class');
    var googleID = profile.id;
    var email = profile.emails[0].value;
    var name = profile.displayName;
    var username = user.makeid();
    console.log(username)

    //separate firstname & lastname
    var arrayName = (name).split(' ');
    var firstname = arrayName[0];
    var lastname = arrayName[1];

    user.googleIdExist(googleID)
      .then(function(ret) {
        if (ret) {
          console.log('googleID existe')
          user.searchByGoogleId(googleID) 
            .then(function(user) {
              done(null, user);
            })
        }
        else {
          user.emailExist(email)
            .then(function(ret) {
              if (ret) {
                console.log('utilisateur existe')
              }
              else {
                user.addUserGoogle(username, firstname, lastname, email, googleID)
                .then(function(ret) {
                  if (ret)
                  {
                    user.searchByGoogleId(googleID) 
                      .then(function(user) {
                        done(null, user);
                      })
                  }
                })
                console.log('ajout utilisateur')
              }
            })
            .catch(err => {
              console.error('emailExists error: ', err);
            })
        }
      })
      .catch(err => {
        console.error('googleIDExists error: ', err);
      })
  })
);

router.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/api/auth/google/callback',
  passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    // res.redirect('/homepage/user?user_id=' + req.user[0].user_id);
    res.redirect('/homepage');
  });

router.get(
  '/api/logout/',
  (req, res) => {
    req.logout();
    res.send(req.user);
  });

router.get(
  '/api/current_user/',
  (req, res) => {
    // console.log(req.user)
    res.send(req.user);
  });

router.get('/api/infoUser', (req, res) => {
  // console.log(req.user);
  console.log('helloyou')
  res.send(req.user);
});

module.exports = router 