const path = require('path')
const express = require('express')
const routes = require('./routes/routes.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const mustacheExpress = require('mustache-express')
const helmet = require('helmet')
// const csrf = require('csurf')
const pool = require('./server/db')

const passport = require('passport')
const cookieSession = require('cookie-session')
const keys = require('./server/config/keys')

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
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
  passport.session()
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

server.listen(PORT, () => {
  console.log('App running at http://localhost:8080')
})

var users = [];
var messages = [];
io.sockets.on('connection', function (socket) {
  
  socket.on('join', function(user_id) {
    console.log(user_id)
    users.push({
      userID: user_id,
      socketID: socket.id
    });
  })

  // socket.on('new_user', function(user_id) {
  //   console.log(user_id)
  //   socket.join(user_id)
  // })


  // socket.on('new_notification', async function(data) {
  //   var notification_object_id = data.notification;
  //   console.log(notification_object_id);

  //   let requete = "SELECT `notifier_id` FROM `notification` WHERE notification_object_id = ?";
  //   let ret = await pool.query(requete, [notification_object_id]);
  //   var user_id = ret[0].notifier_id;
  //   console.log(ret[0].notifier_id);

  //   io.to(user_id).emit('show_notification', {
  //     type: '',
  //     text: 'hello world' 
  //   })
  // })


  socket.on('new_notification', async function(data) {
    var notification_object_id = data.notification;
    console.log(notification_object_id);

    let requete = "SELECT `notifier_id` FROM `notification` WHERE notification_object_id = ?";
    const ret = await pool.query(requete, [notification_object_id]);
    var user_id = ret[0].notifier_id;

    console.log(ret[0].notifier_id);
    console.log(users);

    var socketID;
    for(var i = 0; i < users.length; i++) {
      if(users[i].userID === ret[0].notifier_id) {
        socketID = users[i].socketID;
      }
    }
    console.log(socketID);

    // generate notification message
    // {actor_username} {action_type}

    // io.sockets.connected[socketID].emit('show_notification', {
    //   type: '',
    //   text: 'hello world' 
    // });

    // socket.broadcast.to(socketID).emit('show_notification', {
    //   type: '',
    //   text: 'hello world' 
    // });


    io.to(socketID).emit('show_notification', {
      type: '',
      text: 'hello world' 
    });
  })

  socket.on('disconnect', function() {
    for(let i = 0; i < users.length; i++) {
      if(users[i].socketID === socket.id) {
        users.splice(i,1); 
      }
    }
  })
});





