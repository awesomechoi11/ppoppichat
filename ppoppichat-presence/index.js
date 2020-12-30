var admin = require("firebase-admin");
var isEqual = require('lodash.isequal');
var serviceAccount = require("./ppoppi-firebase-adminsdk-lav8j-8443ea803c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ppoppi.firebaseio.com"
});

const db = admin.firestore()


const io = require('socket.io')({
  cors: {
    origin: "http://localhost:8085",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 8086;


// Chatroom

function updateOnline(bool, uid) {
  db.collection('users').doc(uid).update({
    online: bool
  })
}

function setNextVideo(currentVideo, videoroomID) {
  let docRef = db.doc('/videorooms/' + videoroomID + '/videoState/queue')
  docRef.get().then(value => {
    if (value.exists) {
      //console.log(value.data().queue[0])
      //console.log(currentVideo)
      if (value.data().queue.length > 1) {

        if (isEqual(value.data().queue[0], currentVideo)) {
          docRef.update({
            queue: admin.firestore.FieldValue.arrayRemove(currentVideo)
          })
        }
      }


      //this.player.source = this.buildSource(value.data().currentVideo)
    }
  })
}


//manual tracker of google uid and socket ids and people in room
class roomstracker {
  constructor() {
    this.roomlist = new Map()//map of maps with roomid and uid as keys
  }

  addRoom(roomid) {//creates room if it doenst exist
    if (!this.roomExists(roomid)) {
      console.log('adding room ', roomid)
      this.roomlist.set(roomid, new Map())
    }
  }

  roomExists(roomid) {
    return this.roomlist.has(roomid)
  }

  isInRoom(socket, roomid) {
    if (this.roomExists(roomid)) {
      return this.roomlist.get(roomid).has(socket.uid)
    } else {
      this.addRoom(roomid)
      return false;
    }
  }

  removeUserFromRoom(socket, roomid) {
    if (this.isInRoom(socket, roomid)) {
      console.log('removing user ', socket.uid, " from ", roomid)
      this.roomlist.get(roomid).delete(socket.uid)
    }
  }

  addUserToRoom(socket, roomid) {
    if (!this.isInRoom(socket, roomid)) {
      console.log('adding user ', socket.uid, ' to room ', roomid)
      this.roomlist.get(roomid).set(socket.uid, socket.id)
    }
  }



  //assumes room exists
  isFirst(roomid) {
    return this.roomlist.get(roomid).size < 2
  }
  getSomeguy(socket, roomid) {
    for (const user of rooms.roomlist.get(roomid).values()) {
      if (user !== socket.id) {
        return user
      }

    }
  }

}

var rooms = new roomstracker;

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


    socket.on('joinVideoroom', (videoroomID) => {
      socket.videoroomID = videoroomID;

      console.log(socket.uid, ' is joining room: ', videoroomID)
      socket.videoroomID = videoroomID
      socket.join(videoroomID)


      rooms.addRoom(videoroomID)
      rooms.addUserToRoom(socket, videoroomID)
      //if somone else is already in room.
      //request new times
      if (!rooms.isFirst(videoroomID)) {
        //request to someguy for videostate with my id
        console.log('not first, need to request videostate ', rooms.getSomeguy(socket, videoroomID))
        socket.to(rooms.getSomeguy(socket, videoroomID)).emit('requestVideoState', socket.id)
      }

    });

    socket.on('leaveVideoroom', (videoroomID) => {
      console.log(socket.uid, ' is leaving room: ', videoroomID)
      if (rooms.isInRoom(socket, socket.videoroomID)) {
        rooms.removeUserFromRoom(socket, socket.videoroomID)
      }
      socket.leave(socket.videoroomID)
    });
    socket.on('videoControl', (videoState) => {
      console.log(videoState)
      socket.to(socket.videoroomID).emit('videoControl', videoState)
    });

    socket.on('requestNextVideo', (data) => {
      console.log('requesting next video for ', data.videoroomID)
      //socket.to(socket.videoroomID).emit('videoControl', videoState)
      setNextVideo(data.currentVideo, data.videoroomID)
    });


  });
  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      console.log('a user disconnected: ', socket.uid)
      updateOnline(false, socket.uid)
      //update firebase that user is offline

      console.log(socket.uid, ' is leaving room: ', socket.videoroomID)
      if (rooms.isInRoom(socket, socket.videoroomID)) {
        rooms.removeUserFromRoom(socket, socket.videoroomID)
      }
      socket.leave(socket.videoroomID)
    }
  });
});


io.listen(port)
console.log('listening on port ', port);


    // // when the client emits 'typing', we broadcast it to others
    // socket.on('typing', () => {
    //   socket.broadcast.emit('typing', {
    //     username: socket.username
    //   });
    // });

    // // when the client emits 'stop typing', we broadcast it to others
    // socket.on('stop typing', () => {
    //   socket.broadcast.emit('stop typing', {
    //     username: socket.username
    //   });
    // });