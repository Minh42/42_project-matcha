const express = require('express');
const fs = require('fs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../server/config/keys');

const authenticate = require('../src/middlewares/midAuth');
const midUser = require('../src/middlewares/midUser'); 

const passport = require('passport');
const passportConfig = require('../server/services/passport');

const multer  = require('multer');
const readChunk = require('read-chunk');
const path = require('path');
const uuidv4 = require('uuid/v4');

//LOCALISATION
var geocoder = require('geocoder');

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
  user.login(username, password).then(function(ret) {
    if (ret) {
      user.searchByColName("username", username).then(function(ret) {
        const token = jwt.sign({ user: ret }, config.jwtSecret);
        console.log("inside api/signin")
        console.log(token)
        res.json({token})
      })
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
      user.searchByColName("email",req.body.email).then(function(ret) {   
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
})

//CHANGE NEW INFO USER
router.post('/api/changeNewInfo', (req, res) => {
  let user = require('../models/user.class');
  const tags = req.body.tags;

  const birthdate = req.body.values.birthdate
  const sex = req.body.values.sex
  const interest = req.body.values.interest
  const bio = req.body.values.bio
  const relationship = req.body.values.relationship
})

//CHANGE NEW INFO USER
router.post('/api/changeNewInfo', (req, res) => {
  let user = require('../models/user.class');
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
  let check = require('../library/tools');
  let messages= {};

  hashNewPassword = check.isHash(req.body.newPassword);

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
		successRedirect : '/onboarding',
		failureRedirect : '/'
	})
);

router.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/api/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/onboarding',
    failureRedirect : '/'
  })
);

router.get('/api/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/api/current_user', authenticate, (req, res) => {
  res.send(req.currentUser);
});

router.get('/api/homepage', authenticate, (req, res) => {
  let user = require('../models/user.class');
  user.selectAllUsers().then(function(ret) {
    if (ret) {
      res.json(ret);
    } else {
    res.sendStatus(404);
    }
  })
});

//ONBOARDING
router.get('/api/onboarding', authenticate, (req, res) => {
  console.log(req.currentUser[0])
  let user = require('../models/user.class');
  if (req.currentUser[0].onboardingDone === 0) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.post('/api/addTags', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  // console.log(user_id)

  function processArray(tags, user_id) 
  {
    tags.forEach((element) => { 
      var tag = element.text
      // console.log(tag)
      user.findOneTag("name", tag)
        .then((ret) => {
          console.log("tag exist")
          if (ret) { // TAG EXIST
            user.searchByColNameTag("name", tag)
              .then((ret) => {
                tag_id = ret[0].tag_id // id_tag
                // console.log(tag_id)
                user.findOneUserTags(tag_id, user_id)
                  .then((ret) => {
                    // console.log(ret)
                    if (ret === false) {
                      user.addInsideUserTag(tag_id, user_id)
                        .then((ret) => {
                      })
                    }

                  })
                
              })
          }
          else { // TAG NOT EXIST
            console.log("tag not exist")
            user.addTagBDD(tag) //add new tag BDD
              .then((ret) => {
                if (ret) {
                  user.searchByColNameTag("name", tag)
                    .then((ret) => {
                      // console.log(ret)
                      tag_id = ret[0].tag_id
                      // console.log(tag_id) // tag_id
                      user.addInsideUserTag(tag_id, user_id)
                        .then((ret) => {
                        // console.log(ret)
                        })
                    })
                }   
              })
          }
        })
    })
  }
  processArray(req.body, user_id);
  res.send("success")
})

// FIND TAGS USER BDD
router.post('/api/findTags', authenticate, (req, res) => {
  // console.log("here")
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  // console.log(user_id)

  var array = [];
  var i = 0;

  user.findIdTagUser(user_id)
    .then((ret) => {
      ret.forEach(element => {
        tag_id = element.tag_id
        user.findTagName(tag_id)
          .then((ret1) => {
            name = ret1[0].name
            array.push(name)
            i++;
            if (i === ret.length) {
              // console.log("array", array)
              res.json(array)
            }
          })
      });
    })
})

//DELETE TAG user BDD
router.post('/api/deleteTags', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  const tag_name = req.body.text

  user.searchByColNameTag("name", tag_name)
    .then((ret) => {
      const tag_id = ret[0].tag_id
      user.deleteTagInsideUserTags(user_id, tag_id)
        .then((ret) => {
          if (ret) {
            res.send("success")
          }
        })
  }) 
})

//PROFILE PICTURE

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

router.post('/api/upload', upload.single('file'), authenticate, function(req, res) {
  if (!req.file) {
    return res.send({
      error: "Upload file not found"
    });
  } else {
    let image = require('../models/image.class');
    let buffer = fs.readFileSync(req.file.path)
    let mimetype = req.file.mimetype;
    let size = req.file.size;

    if(image.isValid(buffer, mimetype, size)) {
      let id = req.currentUser[0].user_id;
      let oldPath = req.file.path;
      let targetPath = `public/img/profile/${id}/${req.file.filename}`;
    
      const targetDir = 'public/img/profile/' + id;
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir)
      }

      fs.rename(oldPath, targetPath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });

      image.savePicture(id, targetPath).then((ret) => {
        if(ret) {
          res.json({file: targetPath});
        } else {
          return res.send({
            error: "Unable to save file"
          });
        }  
      })

    } else {
      return res.send({
        error: "Upload file is invalid"
      });
    }
  }
})

router.get('/api/profile', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  async function getData() {
    const infos = req.currentUser[0];
    const photos = await user.selectAllUserPhotos(req.currentUser[0].user_id);
    const tags = await user.selectAllUserTags(req.currentUser[0].user_id);
  
    const customData = {
      infos: infos,
      photos: photos,
      tags: tags
    };
    return customData;
  }

  var promise = await getData();
  res.json(promise);
});


//LOCALISATION

router.get('/api/geocoder/', authenticate, (req, res) => {
  let user = require('../models/user.class');
  let check = require('../library/tools');
  const location= {}
  const messages= {}

  const address = req.param('address')
  console.log(address)
  const user_id = req.currentUser[0].user_id

  if (check.isAddress(address) === true)
  {
    geocoder.geocode(address, function ( err, data ) {
    console.log(data)
    if (data.results[0] === undefined) {
      messages.error = "address doesn't exist"
      res.json(messages)
      } else {
        console.log(data.results[0])
        const newData = data.results[0].geometry
        const lat = newData.location.lat
        location.lat = lat
        const lng = newData.location.lng
        location.lng = lng
        user.addLatLng(lat, lng, user_id)
          .then ((ret) => {
          if (ret) {
            console.log(location)
              res.json(location)
          }
        })
      }
    });
  } else {
    messages.error = "wrong address"
    res.json(messages)
    }
})

router.get('/api/findLocalisation', authenticate, (req, res) => {
  const localisation = {}
  const lat = req.currentUser[0].latitude
  const lng = req.currentUser[0].longitude
  const geolocalisationAllowed = req.currentUser[0].geolocalisationAllowed

  if (geolocalisationAllowed === 1) {
    localisation.message = "Disable Localisation"
  } else {
    localisation.message = "Allow localisation"
  }

  localisation.lat = lat
  localisation.lng = lng
  res.json(localisation)
})

router.post('/api/addNewinfoBDD', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id

  console.log(req.body)
  const birthdate = req.body.birthdate
  const gender = req.body.sex
  const occupation = req.body.occupation
  const interest = req.body.interest
  const bio = req.body.bio

  user.addNewinfoUser(birthdate, gender, occupation, bio, user_id)
    .then((ret) => {
      if (ret) {
        user.searchIdGenders(interest)
          .then((ret) => {
          var gender_id = ret[0].gender_id
          user.findUserId("interested_in_gender", user_id)
          .then((ret) => {
            if (ret) {
              user.updateInterestedInGender(user_id, gender_id)
              .then((ret) => {
                res.send("success")
              })
            } else {
              user.addInsideInterestedInGender(gender_id, user_id)
              .then((ret) => {
                res.send("success")
              })
            }
          })
        })
      }
    })
})

router.post('/api/addRelationshipBDD', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id

  const relationship = req.body.relationship
  user.searchRelationshipId(relationship)
    .then((ret) => {
    console.log(ret)
    var relationship_id = ret[0].relationship_type_id
    user.findUserId("interested_in_relation", user_id)
    .then((ret) => {
      console.log(ret)
      if (ret) {
        user.updateInterestedInRelation(user_id, relationship_id)
        .then((ret) => {
          res.send("success")
        })
      } else {
      console.log(relationship_id)
      user.addInsideinterestedInRelation(relationship_id, user_id)
        .then((ret) => {
          res.send("success")
        })
      }
    })
})


})

// ALLOWED OR NOT LOCALISATION
router.post('/api/localisationAllowedORnot', authenticate, (req, res) => {
  console.log(req.currentUser[0])
  const localisationAllowed = req.currentUser[0].geolocalisationAllowed
  console.log(localisationAllowed)
  res.json(localisationAllowed)
})

router.post('/api/localisationAllowed', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  console.log(req.body)
  user.changeGeolocalisationAllow(user_id, 1)
    .then((ret) => {
      user.addIP(user_id, req.body.ip)
        .then ((ret) => {
          user.addLatLng(req.body.lat, req.body.lng, user_id) 
            .then((ret) => {
              res.json("success")
            })
        })
    })
})

router.post('/api/localisationDisable', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  console.log(req.body)
  user.changeGeolocalisationAllow(user_id, 0)
    .then((ret) => {
      user.addIP(user_id, req.body.ip)
        .then ((ret) => {
          user.addLatLng(req.body.lat, req.body.lng, user_id) 
            .then((ret) => {
              res.json("success")
            })
        })
    })
})

//CHANGE ONBOARDING STATUS
router.post('/api/changeOnboardingStatus', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id

  user.changeStatusOnboarding(user_id)
  res.send("success")
})

// var ip = require('ip');

// router.get('/api/findIP', (req, res) => {
//   ipAddress = ip.address()
//   console.log(ipAddress)
//   res.send(ipAddress)
// })

// router.get('/api/findIP', function(req, res) {

//   var ipOS = require('os').networkInterfaces().en0[1].address;
//   console.log(ipOS)

//   var ipv6 = req.connection.remoteAddress
//   console.log(ipv6)
//   var address = new Address6(ipOS);
 
// address.isValid(); // true
 
// var teredo = address.inspectTeredo();
 
// var ip = teredo.client4   // '157.60.0.1'
// console.log(ip)
// res.json(ipv6)
// });


module.exports = router 
