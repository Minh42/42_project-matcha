const path = require('path')
const express = require('express')
const routes = require('./routes/routes.js')
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require('express-session')
const mustacheExpress = require('mustache-express')
const fileUpload = require('express-fileupload');
const helmet = require('helmet')
// const csrf = require('csurf')

const passport = require('passport')
const cookieSession = require('cookie-session')
const keys = require('./server/config/keys')

const app = express()
const PORT = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'))
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

const middlewares = [
  cors(),
  helmet(),
  // csrf({ cookie: true }),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  }),
  passport.initialize(),
  passport.session(),
  fileUpload()
]

app.use(middlewares)
app.use('/public', express.static(__dirname + '/public'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', routes)

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
    console.log('App running at http://localhost:8080')
})