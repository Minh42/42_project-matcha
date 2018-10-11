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
var request = require("request");

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

  if (req.body.newPassword)
  {
    if (req.body.newPassword === req.body.confirmedPassword) {
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
        
            res.send(messages);
          }
          else {
            console.log('error');
          }
        })
        .catch(err => {
          console.error('loginExists error: ', err);
        })
    } else {
      messages.error = "Your passwords not match";
      res.send(messages);
    }
  } else {
    messages.error = "Please enter all the informations";
    res.send(messages);
  }
})

//ACTIVATIOM BY EMAIL
router.get('/api/activationMail', function(req, res) {
  var login = req.param('login');
  var token = req.param('token');
  let user = require('../models/user.class');

  try {
    user.compareToken(login, token).then(function(ret) {
      if (ret) {
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
  let { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.sendStatus(401);
  } else {
    user.login(username, password).then(function(ret) {
      if (ret) {
        user.searchByColName("username", username).then(function(ret) {
          const token = jwt.sign({ user: ret }, config.jwtSecret);
          res.json({token})
        })
      } else {
        res.sendStatus(401);
      }
    })   
  }
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

  user.sendNewPasswordBDD(hashNewPassword, req.body.user_id).then (function(ret){
    if (ret) {
      res.send({redirect: '/'});
    }
    else {
      res.sendStatus(401);
    }
  });
})

// AUTH GOOGLE + FACEBOOK

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

// router.get('/api/current_user', authenticate, (req, res) => {
//   if (req.currentUser === null) 
//     res.send(req.currentUser);
//   else 
//     res.send(req.currentUser[0]);
// });

router.get('/api/current_user', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  if (req.currentUser === null) {
    res.send(req.currentUser);
  }
  else {
    let user_id = req.currentUser[0].user_id;
    const ret = await user.selectAllUsersInformations(user_id);
    if (ret) {
      res.send(ret);
    } else {
      res.sendStatus(404);
    }  
  }
});

router.get('/api/homepage', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  let id = req.currentUser[0].user_id;
  const ret = await user.selectAllUsers(id);
    if (ret) {
      res.json(ret);
    } else {
      res.sendStatus(404);
    }
});

//ONBOARDING
router.get('/api/onboarding', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id;
  user.onboardingState(user_id).then((ret) => {
    if (ret === 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  })
});

router.post('/api/addTags', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  const tag = req.body.text

  function processArray(tag, user_id) 
  {
      user.findOneTag("name", tag)
        .then((ret) => {
          if (ret) { // TAG EXIST
            user.searchByColNameTag("name", tag)
              .then((ret) => {
                var tag_id = ret[0].tag_id // id_tag
                user.findOneUserTags(tag_id, user_id)
                  .then((ret) => {
                    if (ret === false) {
                      user.addInsideUserTag(tag_id, user_id)
                        .then((ret) => {
                          
                      })
                    }

                  })
                
              })
          }
          else { // TAG NOT EXIST
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
  }

  if (tag.length > 32) {
    res.send("error")
  } else {
    processArray(tag, user_id);
    res.send("success")
  }
})

// FIND TAGS USER BDD
router.post('/api/findTags', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id

  var array = [];
  var i = 0;

  const ret = await user.findTags(user_id);
  for (var i = 0; i < ret.length; i++) {
    array.push(ret[i].name)
  }
  res.json(array)
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

//SEARCH IF USER ADD TAG
router.post('/api/searchTags', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  user.findUserId("user_tags", user_id)
    .then((ret) => {
      res.json(ret)
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
    const sharp = require('sharp');
    let image = require('../models/image.class');

    sharp(fs.readFileSync(req.file.path))
      .resize(800, null)
      .toBuffer(function(err, buffer) {
      fs.writeFile(req.file.path, buffer, function(e) {
      })
    });

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

router.get('/api/displayPicture', authenticate, (req, res) => {
  let user = require('../models/user.class');
  let id = req.currentUser[0].user_id;
  user.selectAllUserPhotos(id).then((ret) => {
    if (ret) {
      res.status(200).send(ret);
    } else {
      return res.send({
        error: "Unable to retrieve files"
      });
    }
  })
})

router.post('/api/deletePicture', authenticate, (req, res) => {
  let image = require('../models/image.class'); 
  let id = req.currentUser[0].user_id;
  let path = req.body.picture.replace('http://localhost:8080/', '');
  image.deletePicture(id, path).then((ret) => {
    if (ret) {
      res.status(200).send('Record deleted');
    } else {
      return res.send({
        error: "Unable to delete file"
      });
    }
  })
});

router.get('/api/profile', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  async function getData() {
    const id = req.currentUser[0].user_id;
    const infos = JSON.parse(JSON.stringify(await user.selectAllUserInfos(id)));
    const photos = await user.selectAllUserPhotos(id);
    const tags = await user.selectAllUserTags(id);
    const interest = await user.selectNameGenders(id);
    const relationship = await user.selectNameRelationship(id)
  
    const customData = {
      infos: infos[0],
      photos: photos,
      tags: tags,
      interest: interest,
      relationship: relationship
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
  const user_id = req.currentUser[0].user_id
  console.log('address', address)

  var options = { method: 'GET',
  url: 'https://maps.googleapis.com/maps/api/geocode/json',
  qs: { 
  address: address,
   key: 'AIzaSyBjuKElQlsRx1YhCfTHe-tN7kXVk4nL1r0'
  },
 };

  if (check.isAddress(address) === true)
  {
    request(options, function (error, response, body) {
    //   if (error) throw new Error(error);
      var bodyParse = JSON.parse(body)
      if (bodyParse.results[0] === undefined) {
        messages.error = "address doesn't exist"
        res.json(messages)
      } else {
        const newData = bodyParse.results[0].geometry
        const lat = newData.location.lat
        location.lat = lat
        const lng = newData.location.lng
        location.lng = lng
        user.addLatLng(lat, lng, user_id)
          .then ((ret) => {
          if (ret) {
              res.json(location)
          }
        })
      }
    })
  } else {
    messages.error = "ex: 18 rue de la paix Paris"
    res.json(messages)
    }
})

router.get('/api/findLocalisation', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const localisation = {}
  const user_id = req.currentUser[0].user_id
  user.findLatLngBDD(user_id)
    .then((ret) => {
    const lat = ret[0].latitude
    const lng = ret[0].longitude
    const geolocalisationAllowed = ret[0].geolocalisationAllowed

    if (geolocalisationAllowed === 1) {
      localisation.message = "Disable Localisation"
    } else {
      localisation.message = "Allow localisation"
    }

    localisation.lat = lat
    localisation.lng = lng
    res.json(localisation)
    })
})


// ALLOWED OR NOT LOCALISATION
router.post('/api/localisationAllowedORnot', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  user.findLatLngBDD(user_id)
    .then((ret) => {
      const localisationAllowed = ret[0].geolocalisationAllowed
      res.json(localisationAllowed)
    })
})

router.post('/api/localisationAllowed', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const lat = req.body.lat
  const lng = req.body.lng
  const user_id = req.currentUser[0].user_id
  user.changeGeolocalisationAllow(user_id, 1)
    .then((ret) => {
      user.addIP(user_id, req.body.ip)
        .then ((ret) => {
          user.addLatLng(lat, lng, user_id) 
            .then((ret) => {
              res.json("success")
            })
        })
    })
})

router.post('/api/localisationNotAllowed', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const lat = req.body.lat
  const lng = req.body.lng
  const user_id = req.currentUser[0].user_id
  user.addIP(user_id, req.body.ip)
    .then ((ret) => {
      user.addLatLng(lat, lng, user_id) 
        .then((ret) => {
            res.json("success")
        })
    })
})

router.post('/api/localisationDisable', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  user.changeGeolocalisationAllow(user_id, 0)
    .then((ret) => {
      // user.addIP(user_id, req.body.ip)
      //   .then ((ret) => {
      //     user.addLatLng(req.body.lat, req.body.lng, user_id) 
      //       .then((ret) => {
              res.json("success")
            })
    //     })
    // })
})


//NEW INFO BDD FROM ONBOARDING
router.post('/api/addNewinfoBDD', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id

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
    var relationship_id = ret[0].relationship_type_id
    user.findUserId("interested_in_relation", user_id)
    .then((ret1) => {
      if (ret1 === true) {
        user.updateInterestedInRelation(user_id, relationship_id)
        .then((ret2) => {
          res.send("success")
        })
      } else {
        user.addInsideinterestedInRelation(relationship_id, user_id)
          .then((ret2) => {
            res.send("success")
          })
      }
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

//CHANGE BASIC INFO USER
router.post('/api/modifData', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.currentUser[0].user_id
  const login = req.body.login
  const firstname = req.body.firstName
  const lastname = req.body.lastName
  const email = req.body.email
  user.changeUserInfo(user_id, login, firstname, lastname, email)
    .then(function(ret) {
      if (ret) {
        res.send("success");
      }
      else {
        res.send("failure");
      }
    })
})

//CHANGE PASSWORD
router.post('/api/changePassword', authenticate, (req, res) => {
  let user = require('../models/user.class');
  let check = require('../library/tools');
  const user_id = req.currentUser[0].user_id
  var message = {}

  hashNewPassword = check.isHash(req.body.newPassword);

  user.sendNewPasswordBDD(hashNewPassword, user_id)
    .then (function(ret){
      if (ret) {
        message.success = "Your password is updated"
        res.send(message);
      }
      else {
        res.sendStatus(401);
      }
    });
})

router.get('/api/otherProfile', async (req, res) => {
  let user = require('../models/user.class');
  var id = req.param('user_id');

  const ret = await user.findOne("user_id", id)
   if (ret === true) {
    async function getData() {
      const infos = JSON.parse(JSON.stringify(await user.selectAllUserInfos(id)));
      const photos = await user.selectAllUserPhotos(id);
      const tags = await user.selectAllUserTags(id);
      const interest = await user.selectNameGenders(id);
      const relationship = await user.selectNameRelationship(id)
    
      const customData = {
        infos: infos[0],
        photos: photos,
        tags: tags,
        interest: interest,
        relationship: relationship
      };
      return customData;
    }
  
    var promise = await getData();
    res.json(promise);
   } else {
      res.send("error")
   }
});

// LIKES
router.post('/api/addLike', authenticate, (req, res) => {
  let user = require('../models/user.class');
  const id_actual_user = req.currentUser[0].user_id;
  const user_like = req.body.user_id;
  user.findLikeUser(id_actual_user, user_like).then((ret) => {
    if (ret === false) {
      user.addLikeBDD(id_actual_user, user_like).then((ret) => {
        res.send(ret);
      })
    }
    else {
      user.deleteLikeBDD(id_actual_user, user_like).then((ret) => {
        res.send(ret);
      })
    }
  })
})

router.get('/api/searchLikeProfileUser', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var user_id = req.currentUser[0].user_id;
  user.searchUserWhoLike(user_id)
    .then((ret) => {
      res.json(ret)
    })
})

router.post('/api/savePicture', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var user_id = req.currentUser[0].user_id;
  var path;
  if (req.body.picture.includes("cloudinary")) {
    path = req.body.picture;
  } else {
    path = req.body.picture.replace('http://localhost:8080/', '');
  }
  user.addProfilePicture(user_id, path).then((ret) => {
    res.send("success");
  })
})

router.post('/api/addUserViews', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  var user_id = req.body.user_id;
  user.addUserViews(current_user, user_id).then((ret) => {
    if(ret) {
      res.send(ret);
    }
  })
})

router.get('/api/showBlockProfile', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  var id = req.param('user_id');
  user.searchBlockedUser(current_user).then((ret) => {
    var result = JSON.parse(JSON.stringify(ret));
    var count = 0; 
    for (var i = 0; i < result.length; i++) {
      if (result[i]['user_id_blocked'] == id) {
        count += 1;
      } 
    }
    if (count > 1) {
      res.send('blocked');
    } else {
      res.send('unblocked');
    }
  });
});

router.get('/api/showReportProfile', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var user_id = req.param('user_id');
  user.searchReportedUser(user_id).then((ret) => {
    if (ret) {
      res.send('reported');
    } else {
      res.send('unreported');
    }
  });
});

router.post('/api/blockProfile', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  var user_id = req.param('user_id');
  user.blockUser(current_user, user_id).then((ret) => {
    if (ret === "blocked") {
      res.send('blocked');
    } else if (ret === "unblocked") {
      res.send('unblocked')
    }
  })
});

router.post('/api/reportProfile', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  var user_id = req.param('user_id');
  user.reportUser(current_user, user_id).then((ret) => {
    if (ret) {
      res.send('reported')
    }
  })
});

// TCHAT/CONVERSATION

router.post('/api/createConversationParticipant', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  var participant1 = req.currentUser[0].user_id;
  var participant2 = req.body.user_match;
  const ret = await user.addNewConversation(participant1, participant2);
  if (ret) {
    res.send('success');
  } else {
    res.send('failure')
  }
})

router.post('/api/findAllConversations', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  const ret = await user.findAllConversationtionID(current_user);
  res.send(ret);
})

router.post('/api/findAllConversation', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  user.findAllConversation(current_user).then( async (ret) => {
    if(ret) {
      var allUserID = new Array();
      for(var i = 0; i < ret.length; i++) {
        var ret1 = await user.findIdParticipantConversation(ret[i].conversation_id, current_user)
        allUserID.push(ret1[0].participant_id)
      }
      res.json(allUserID) // tous les user avec qui le current user a une conversation en cours
    }
  })
})

router.post('/api/addMessageBDD', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  var message = req.body.message
  user.addMessageBDD(current_user, message).then((ret) => {
    res.send('success')
  })
})

router.post('/api/findConversationID', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  var convers = [];
  id_other = req.body.user_id
  user.findAllConversationtionID(current_user).then((convers1) => {
    user.findAllConversationtionID(id_other).then((convers2) => {
      for (var i = 0; i < convers1.length; i++) {
        for (var y = 0; y < convers2.length; y++) {
          if (convers1[i].conversation_id === convers2[y].conversation_id) {
            convers.push(convers1[i].conversation_id)
            convers.push(current_user)
            res.send(convers)
          }
        }
      }
    })
  })
})
// NOTIFICATIONS

router.post('/api/notifications', authenticate, async (req, res) => {
  let { entity_type_id, entity_id, actor_id, notifier_id } = req.body;
  let user = require('../models/user.class');
  const ret = await user.insertNotification(entity_type_id, entity_id, actor_id, notifier_id);
  if (ret) {
    res.json(ret)
  }
});

router.get('/api/searchLikeProfileUser', authenticate, (req, res) => {
  let user = require('../models/user.class');
  var user_id = req.currentUser[0].user_id
  user.searchUserWhoLike(user_id)
    .then((ret) => {
      res.json(ret)
    })
});

router.post('/api/lastNotification', authenticate, async (req, res) => {
  let notification_object_id = req.body.notification_object_id;
  let user = require('../models/user.class');
  const ret = await user.getNotification(notification_object_id);
  if (ret) {
    res.json(ret)
  }
});

router.post('/api/findUserByID', async (req, res) => {
  let user = require('../models/user.class');
  const user_id = req.body.user_id
  const ret = await user.findUserByID(user_id)
  if (ret) {
    res.json(ret)
  }
});

router.post('/api/notificationMessage', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  const ret = await user.insertNotification(req.body.entity_type_id, req.body.entity_id, req.body.actor_id, req.body.notifier_id);
  if (ret) {
    res.json(ret)
  }
});

router.get('/api/searchNotifications', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  const ret = await user.searchNotifications(current_user);
    if (ret) {
      res.send(ret)
    }
})

router.post('/api/changeStatusNotification', async (req, res) => {
  let user = require('../models/user.class');
  var notification_id = req.body.notification_id
  const ret = await user.changeStatusNotification(notification_id);
  if (ret) {
    res.send(true)
  }
})

router.post('/api/blockedUsers', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  let user_id = req.body.notifier_id;
  const ret = await user.selectAllUsersInformations(user_id);
  res.send(ret);
})

router.post('/api/getConversationsList', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  var conversation_id = req.body.conversation_id;
  const ret = await user.getConversationsList(conversation_id);
    if (ret) {
      res.send(ret)
    }
})

router.post('/api/getLastParticipantID', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  var conversation_id = req.body.conversation_id;
  const ret = await user.getLastParticipantID(conversation_id);
    if (ret) {
      res.json(ret)
    }
})

router.get('/api/findLike', authenticate, async (req, res) => {
  let user = require('../models/user.class');
  var current_user = req.currentUser[0].user_id;
  var otherUser_id = req.param('user_id');

  const ret = await user.findLikeUser(current_user, otherUser_id);
  if (ret) {
    res.send(ret);
  }
})

module.exports = router 
