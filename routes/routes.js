const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/signup', function(req, res) {
  console.log(req.body);
  firstname = req.body.firstname;
  lastname = req.body.lastname;
  login = req.body.login;
  email = req.body.email;
  password = req.body.password;
  confirmedPassword = req.body.confirmedPassword;
  console.log(login);
  console.log(login);  
})

module.exports = router 