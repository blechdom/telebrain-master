var express = require('express')
  , path = require('path')
  , http = require('http')
  , stylus = require('stylus')
  , nib = require('nib')
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
    //app.use(express.static(path.join(__dirname, 'public')));
//from performgramming
	app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
	app.use(express.static(__dirname + '/public'));
	app.set('views', __dirname);
	function compile (str, path) {
    	return stylus(str)
      		.set('filename', path)
      		.use(nib());
  	};

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
var nicknames = {};

io.sockets.on('connection', function (socket) {
	//OSC receiver	
	var receiver = new osc.UdpReceiver(8888);
	receiver.on('', function(e) {
		console.log(e);
		io.sockets.emit('dataReceived', e.params[0]);
	//    say.speak('Alex', e.params[0]);
	});
	//  play.sound('snd/MTBrain.wav');

	// when the client emits 'sendchat', this listens and executes
	socket.on('user message', function (msg) {
    	socket.broadcast.emit('user message', socket.nickname, msg);
    	sender.send('/chat_data',
		              'ss',			//'sfiTFNI', set data types to be separated by commas below or spaces in msg.
		              [socket.nickname, msg]);
  	});

	socket.on('nickname', function (nick, fn) {
	    if (nicknames[nick]) {
	      fn(true);
	    } else {
	      fn(false);
	      nicknames[nick] = socket.nickname = nick;
	      socket.broadcast.emit('announcement', nick + ' connected');
	      io.sockets.emit('nicknames', nicknames);
	      sender.send('/newusername',
		              's',			//'sfiTFNI', set data types to be separated by commas below or spaces in msg.
		              [socket.nickname]);
	    }
	  });
		
	socket.on('disconnect', function () {
	    if (!socket.nickname) return;

	    delete nicknames[socket.nickname];
	    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
	    socket.broadcast.emit('nicknames', nicknames);
	  });
});
