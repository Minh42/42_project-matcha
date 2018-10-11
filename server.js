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
const io = require('socket.io')(server, {
  pingInterval: 1000,
  pingTimeout: 5000,
}) 

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
io.sockets.on('connection', function (socket) {

  socket.on("manual-connection", function(data) {
    console.log("User Manually connected. ID: " + data);
  });

  socket.on('joinRequested', function(user_id) {
    if (users.length === 0) {
      users.push({
        userID: user_id,
        socketID: socket.id
      });
    } else {
      for (var i = 0; i < users.length ; i++) {
        if (users[i].socketID === socket.id) {
          break;
        } else if (users[i].socketID != socket.id && i + 1 === users.length) {
          users.push({
            userID: user_id,
            socketID: socket.id
          });
          break;
        }
      }
    }

    console.log(users)
    let len = users.length;
    len--;
    io.emit('userJoined', {users: users, socketID: users[len].socketID})
  })

  socket.on('sendNotification', async function(data) {
    console.log(data.notification_object_id)

    await pool.query("UPDATE `notification_object` INNER JOIN `notification` ON notification_object.id = notification.notification_object_id SET notification_object.status = ? WHERE notification.notification_object_id = ?", [1, data.notification_object_id])
    io.to(data.notifier_socketID).emit('showNotification', {
      message: data.message
    })
  })

  socket.on('requestMessages', async function(data) {
    var conversations = [];
    for (var i = 0; i < data.conversationIDs.length; i++) {
      var res1 = await pool.query('SELECT firstname, lastname, imageProfile_path, participant_id, message FROM `message` INNER JOIN `users` ON users.user_id = message.participant_id WHERE message.conversation_id = ? ORDER BY message_id DESC LIMIT 10', [data.conversationIDs[i].conversation_id]);
      var message = JSON.parse(JSON.stringify(res1));
      var res2 = await pool.query('SELECT user_id, firstname, lastname, imageProfile_path FROM `participant` INNER JOIN `users` ON users.user_id = participant.participant_id WHERE participant.conversation_id = ?', [data.conversationIDs[i].conversation_id]);
      var user_id;
      var firstname;
      var lastname;
      var profilePicture;
      data.currentUser === res2[0].user_id ? user_id = res2[1].user_id : user_id = res2[0].user_id;
      data.currentUser === res2[0].user_id ? firstname = res2[1].firstname : firstname = res2[0].firstname;
      data.currentUser === res2[0].user_id ? lastname = res2[1].lastname : lastname = res2[0].lastname;
      data.currentUser === res2[0].user_id ? profilePicture = res2[1].imageProfile_path : profilePicture = res2[0].imageProfile_path;
      conversations.push({
        conversation_id: data.conversationIDs[i].conversation_id,
        user_id: user_id,
        firstname: firstname,
        lastname: lastname,
        profilePicture: profilePicture,
        messages: message
      })
    }
    console.log(user_id)
    io.to(data.notifier_socketID).emit('sendMessages', conversations);
  })

    
  socket.on('joinRoom', function(conversation_id) {
    socket.join(conversation_id)
  })

  socket.on('sendDirectMessage', async function(data) {
    await pool.query("INSERT INTO `message` SET `conversation_id` = ?, `participant_id` = ?, `message` = ?", [data.conversationID, data.participantID, data.input]);
    io.sockets.in(data.conversationID).emit('showDirectMessage', data.conversations);
  })

  socket.on('disconnect', function() {
    let user = require('./models/user.class');
    for(let i = 0; i < users.length; i++) {
      if(users[i].socketID === socket.id) {
        user.updateLastLogin(users[i].userID);
        users.splice(i,1);
      }
    }
    io.emit('userLeft', {users: users});
  })

  socket.on("manual-disconnection", function(data) {
    console.log("User Manually Disconnected. ID: " + data);
  });

});