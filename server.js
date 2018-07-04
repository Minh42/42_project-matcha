const path = require('path')
const express = require('express')
const routes = require('./routes/routes.js')
const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const session = require('express-session')
// const flash = require('express-flash');
const mustacheExpress = require('mustache-express')
const app = express()

require('./config/db');

app.set('views', path.join(__dirname, 'views'))
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

const middlewares = [
  express.static(path.join(__dirname, 'public')),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  // cookieParser(),
  session({
    secret: 'abcdef',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }),
  require('./src/middlewares/flash')
]

app.use(middlewares)
app.use('/', routes)

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log(`App running at http://localhost:8080`)
})
