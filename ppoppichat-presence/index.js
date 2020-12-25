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

function updateOnline(bool,uid){
		db.collection('users').doc(uid).update({
		online: bool
	})
}

io.on('connection', (socket) => {
  
  let addedUser = false;


  // when the client emits 'add user', this listens and executes
  socket.on('add user', (uid) => {
    if (addedUser) return;
    console.log('a user connected: ',uid)
    // we store the username in the socket session for this client
    socket.uid = uid;
    addedUser = true;
    
	//update firebase of user status
	updateOnline(true,uid)


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

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
     console.log('a user disconnected: ',uid)
	updateOnline(false,socket.uid)
      //update firebase that user is offline
      
    }
  });
});


io.listen(port)
console.log('listening on port ', port);