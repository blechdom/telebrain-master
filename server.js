//BACKBONE JS APP LAYOUT FROM Christophe Coenraets' WINE CELLAR DEMO

var express = require('express')
  , path = require('path')
  , http = require('http')
  , osc = require('omgosc')
  , ch = require('./public/js/chronometer')
  , module = require('./routes/modules')
  , sys = require("sys")
  , url = require("url")
  , fs = require("fs")
  , events = require("events")
  , paperboy = require('paperboy')
  , request = require('request');


var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var sender = new osc.UdpSender('127.0.0.1', 7777);

var da = new Date(); var dtstring = da.getFullYear()+ '-' + da.getMonth()+ '-' + da.getDate();

app.configure(function () {
    app.set('port', process.env.PORT || 8888);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));

});
//this doesn't seem efficient on this end or in the exports in modules.js -> more efficient way to do this?
app.get('/create', module.findAllContent);
//app.get('/create/:id', module.findContentByType);

app.get('/modules', module.findAllModules);
app.get('/modules/:id', module.findModuleById);
app.post('/modules', module.addModule);
app.put('/modules/:id', module.updateModule);
app.delete('/modules/:id', module.deleteModule);

app.get('/imageURLs', module.findAllImageURLs);
app.get('/imageURLs', module.findAllTeleprompts);
app.get('/imageURLs/:type', module.findImageURLById);
app.post('/imageURLs', module.addImageURL);
app.put('/imageURLs/:id', module.updateImageURL);
app.delete('/imageURLs/:id', module.deleteImageURL);

app.get('/teleprompts', module.findAllTeleprompts);
app.get('/teleprompts/:id', module.findTelepromptById);
app.post('/teleprompts', module.addTeleprompt);
app.put('/teleprompts/:id', module.updateTeleprompt);
app.delete('/teleprompts/:id', module.deleteTeleprompt);

app.get('/tts', module.findAllTTS);
app.get('/tts/:id', module.findTTSById);
app.post('/tts', module.addTTS);
app.put('/tts/:id', module.updateTTS);
app.delete('/tts/:id', module.deleteTTS);

app.get('/audioURLs', module.findAllAudioURLs);
app.get('/audioURLs/:id', module.findAudioURLById);
app.post('/audioURLs', module.addAudioURL);
app.put('/audioURLs/:id', module.updateAudioURL);
app.delete('/audioURLs/:id', module.deleteAudioURL);

//app.get('/build', module.findAllModules);
app.get('/build', module.findAllModules);
app.get('/networks', module.findAllNetworks);
app.get('/imageUploads', module.findAllImageUploads);
app.get('/audioURLs', module.findAllAudioURLs);
app.get('/audioUploads', module.findAllAudioUploads);
app.get('/phrases', module.findAllPhrases);
app.get('/troupes', module.findAllTroupes);
app.get('/controls', module.findAllControls);
app.get('/schedules', module.findAllSchedules);
app.get('/roles', module.findAllRoles);
app.get('/units', module.findAllPerformanceUnits);
app.get('/programs', module.findAllPerformancePrograms);

app.get('/database/content', module.findAllContent);
app.get('/database/modules', module.findAllModules);
app.get('/database/imageURLs', module.findAllImageURLs);
app.get('/database/imageUploads', module.findAllImageUploads);
app.get('/database/audioURLs', module.findAllAudioURLs);
app.get('/database/audioUploads', module.findAllAudioUploads);
app.get('/database/phrases', module.findAllPhrases);
app.get('/database/troupes', module.findAllTroupes);
app.get('/database/permissions', module.findAllPermissions);
app.get('/database/teleprompts', module.findAllTeleprompts);
app.get('/database/controls', module.findAllControls);
app.get('/database/schedules', module.findAllSchedules);
app.get('/database/networks', module.findAllNetworks);
app.get('/database/roles', module.findAllRoles);
app.get('/database/performanceUnits', module.findAllPerformanceUnits);
app.get('/database/performancePrograms', module.findAllPerformancePrograms);

server.listen(app.get('port'), function () {
    console.log("Welcome to telebrain.org");
    console.log("Listening on port " + app.get('port'));
});

//below is all from Performgramming App

// usernames which are currently connected to the chat
var usernames = {};

function sendHeartbeat(){
    setTimeout(sendHeartbeat, 5000);
    io.sockets.emit('ping', { beat : 1 });
}

io.sockets.on('connection', function (socket) {
	socket.on('pong', function(data){
        console.log("Pong received from client");
    });

	var receiver = new osc.UdpReceiver(8888);
	
	receiver.on('', function(e) {
		console.log(e);
		io.sockets.emit('dataReceived', e.params[0]);
//    say.speak('Alex', e.params[0]);
	});
//  play.sound('snd/MTBrain.wav');
	socket.on('message', function (message) {
        console.log("Got message: " + message);
        io.sockets.emit('pageview', { 'url': message });
    });
    socket.on('performViewLoaded', function(data) {
    	socket.emit('performInitializer', (data));
    });
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
//    say.speak('Alex', data);
		sender.send('/chat_data',
		              'ss',			//'sfiTFNI', set data types to be separated by commas below or spaces in msg.
		              [socket.username, data]);
	});
	socket.on('sendimage', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updateimage', socket.username, data);
//    say.speak('Alex', data);
		sender.send('/chat_image',
		              'ss',			//'sfiTFNI', set data types to be separated by commas below or spaces in msg.
		              [socket.username, data]);
	});
	socket.on('urlTTS', function (urlString) {
			var downloadfile = urlString;
			console.log(downloadfile);

			var currentTime = new Date();
			var newName = currentTime.getTime() + ".mp3";
			var savePath = "./public/lib/node-parlez-master/" + newName;
			var fileStream = fs.createWriteStream(savePath);
			request(downloadfile).pipe(fileStream);  
    		
    		request(downloadfile).on('end', function() {
    			console.log('Ending ' + downloadfile);
    			socket.emit('audioTTS', newName);
    			//fileStream.close();
    	
			});
    		fileStream.on('end', function() {
    			console.log('Done with ' + newName);
    			
			});
			

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
		socket.emit('updatechatme', 'SERVER', 'you, aka: *' + username + '* - have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		sender.send('/newusername',
		              's',			//'sfiTFNI', set data types to be separated by commas below or spaces in msg.
		              [socket.username]);
	});
	
	//TIMING CODE FROM ROB CANNING'S NODESCORE APP
	xdatetime =  setInterval(function () {
		d =  ch.xdateTime()
		socket.broadcast.emit('dateTime', d)
		socket.emit('dateTime', d)
    }, 1000)

	var chronstate=0;
	
    socket.on('stopWatch', function (state) { stopWatch(state);}); 
    // if not already started start the chronometer    
    function stopWatch(state) { if (chronstate !== 1) {
		if (state==1){
		    chronstate = 1; 
		    chronCtrl(1,100);}
	    }

		if (state==0){
		    chronstate = 0; 
		    clearInterval(xstopwatch);
		}

		if (state==2){
		    chronstate = 0; 
		    c=ch.zeroChron()
		    socket.broadcast.emit('chronFromServer', c)
		    socket.emit('chronFromServer', c)
		}
    } 
    function chronCtrl (state,interval){
		console.log("=========================== chronstate=" + chronstate)
		if (state==1){
		    var date = new Date()
		    var starttime = new Date().getTime() / 1000;
		    //var interval = 1020 - date.getMilliseconds();
		    xstopwatch =  setInterval(function () {
			    var nowtime = new Date().getTime() / 1000;
			    now = nowtime-starttime
			    hours = parseInt( now / 3600 ) % 24;
			    minutes = parseInt( now / 60 ) % 60;
			    seconds = parseInt(now  % 60);
			    milliseconds = Math.floor((now-seconds)*10)%60;

			    time = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds) + "."+milliseconds;
			    console.log(time)
			socket.broadcast.emit('chronFromServer', time)
			socket.emit('chronFromServer', time)
		    }, 200)
	    }
		if (state==0) {
		    clearInterval(xstopwatch);
		     }	
	    }


    // stop the chronometer   
    socket.on('stopChr', function () { stopChr();});    
    function stopChr() {console.log("stop chron................................................")
			chronCtrl(0)
			chronstate=0
	}  
    
    function pad(number) { return (number < 10 ? '0' : '') + number }

    socket.on('resetChr', function () { resetChr();});
    function resetChr() {//clearInterval();
		chronstate = 0;
		zecsec = 0; seconds = 0; 
		mins = 0; hours = 0; 
		chronstate = 0; 
		var chron = pad(hours) +":"+pad(mins)+ ':'+ pad(seconds)+ ":"+ zecsec
		// send 0.0.0 values to display
		socket.broadcast.emit('chronFromServer', chron)
		socket.emit('chronFromServer', chron)
	}

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		console.log('Good Bye from Performgramming');
		// remove the username from global usernames list
		delete usernames[socket.username];
		socket.emit('playerDisconnected', 1);
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});
setTimeout(sendHeartbeat, 5000);








