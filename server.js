var express = require('express')
  , path = require('path')
  , http = require('http')
  , osc = require('omgosc')
  , module = require('./routes/modules');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var sender = new osc.UdpSender('192.168.0.7', 7777);

app.configure(function () {
    app.set('port', process.env.PORT || 8888);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));

});

app.get('/modules', module.findAll);
app.get('/modules/:id', module.findById);
app.post('/modules', module.addModule);
app.put('/modules/:id', module.updateModule);
app.delete('/modules/:id', module.deleteModule);

server.listen(app.get('port'), function () {
    console.log("Welcome to Performgramming");
    console.log("Listening on port" + app.get('port'));
});

//below is all from Performgramming App

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {
	var receiver = new osc.UdpReceiver(8888);
	
	receiver.on('', function(e) {
		console.log(e);
		io.sockets.emit('dataReceived', e.params[0]);
//    say.speak('Alex', e.params[0]);
	});
//  play.sound('snd/MTBrain.wav');

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
//    say.speak('Alex', data);
		sender.send('/chat_data',
		              'ss',			//'sfiTFNI', set data types to be separated by commas below or spaces in msg.
		              [socket.username, data]);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		console.log("ADDUSER");
		// we store the username in the socket session for this client
		delete usernames[socket.username];
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		sender.send('/newusername',
		              's',			//'sfiTFNI', set data types to be separated by commas below or spaces in msg.
		              [socket.username]);
	});
	
	

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		console.log('Good Bye from Performgramming');
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});