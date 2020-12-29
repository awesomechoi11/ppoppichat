var admin = require("firebase-admin");

var serviceAccount = require("./ppoppi-firebase-adminsdk-lav8j-8443ea803c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ppoppi.firebaseio.com"
});

const db = admin.firestore()


const io = require('socket.io')({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3001;


// Chatroom

function updateOnline(bool, uid) {
  db.collection('users').doc(uid).update({
    online: bool
  })
}

//manual tracker of socket ids and people in room
var rooms = {
  roomid: new Set([1, 2, 3])
}


io.on('connection', (socket) => {

  let addedUser = false;


  // when the client emits 'add user', this listens and executes
  socket.on('add user', (uid) => {
    if (addedUser) return;
    console.log('a user connected: ', uid)
    // we store the username in the socket session for this client
    socket.uid = uid;
    addedUser = true;

    //update firebase of user status
    updateOnline(true, uid)


  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('joinVideoroom', (videoroomID) => {
    console.log(socket.uid, ' is joining room: ', videoroomID)
    socket.videoroomID = videoroomID
    //socket.emit('requestVideoState')
    socket.join(videoroomID)
    console.log(socket.rooms)
    rooms[videoroomID] ?
      rooms[videoroomID].add(socket.id) :
      rooms[videoroomID] = new Set([socket.id]);
    console.log(rooms)

    //if somone else is already in room.
    //request new times
    if (rooms[videoroomID].size > 1) {
      let someguy
      for (const entry of rooms[videoroomID].values()) {
        if (entry !== socket.id) {
          if (!someguy) { //if someguy is not set, set it with an entry that is not curr socket
            someguy = entry
            console.log(someguy, socket.id)
          }
        }
      }
      //request to someguy for videostate with my id
      socket.to(someguy).emit('requestVideoState', socket.id)
    }

  });

  socket.on('leaveVideoroom', (videoroomID) => {
    console.log(socket.uid, ' is leaving room: ', videoroomID)
    socket.leave(videoroomID)
  });
  socket.on('videoControl', (videoState) => {
    //console.log(socket.uid, ' ', videoroomID)
    //socket.leave(videoroomID)
    console.log(videoState)
    socket.to(socket.videoroomID).emit('videoControl', videoState)
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      console.log('a user disconnected: ', socket.uid)
      updateOnline(false, socket.uid)
      //update firebase that user is offline

      if (rooms[socket.videoroomID]) {
        try {
          rooms[socket.videoroomID].remove(socket.id)
        } catch (err) {
          console.log(err)
        }
      }


    }
  });
});


io.listen(port)
console.log('listening on port ', port);