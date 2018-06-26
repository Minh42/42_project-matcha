const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', function(req, res) {
  console.log(req.body);
})

module.exports = router