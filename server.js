//BACKBONE JS APP LAYOUT FROM Christophe Coenraets' WINE CELLAR DEMO

var express = require('express')
  , path = require('path')
  , assert = require('assert')
  , http = require('http')
  , osc = require('omgosc')
  , ch = require('./public/js/chronometer')
  , module = require('./routes/modules')
  , sys = require("sys")
  , url = require("url")
  , fs = require("fs")
  , color = require('colors')
  , events = require("events")
  , spawn = require('child_process').spawn
  , request = require('request')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);




var sender = new osc.UdpSender('127.0.0.1', 7777);

var da = new Date(); var dtstring = da.getFullYear()+ '-' + da.getMonth()+ '-' + da.getDate();

app.configure(function () {
    app.set('port', process.env.PORT || 8888);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));

});

//chat demo
app.use("/styles", express.static(__dirname + '/chatdemo/public/styles'));
app.use("/scripts", express.static(__dirname + '/chatdemo/public/scripts'));
app.use("/images", express.static(__dirname + '/chatdemo/public/images'));
//end chat demo




console.log("__dirname: ".red + __dirname.red);
var savepublic = path.resolve(__dirname, "public");
console.log("savepath: ".red + savepublic.red);
process.chdir(__dirname);
console.log("process cwd: ".red + process.cwd().red);

app.get('/create/:parent_id/:id', module.findContentByParent);
app.post('/create/:parent_id', module.addContentByParent);
app.put('/create/:parent_id/:id', module.updateContent);
app.delete('/create/:parent_id/:id', module.deleteContent);

app.get('/perform/:parent_id/:id', module.findContentByParent);
app.post('/perform/:parent_id', module.addContentByParent);
app.put('/perform/:parent_id/:id', module.updateContent);
app.delete('/perform/:parent_id/:id', module.deleteContent);

app.get('/program/:parent_id/:id', module.findAllContent);
app.post('/program/:parent_id', module.addContentByParent);
app.put('/program/:parent_id/:id', module.updateContent);
app.delete('/program/:parent_id/:id', module.deleteContent);

app.get('/performance', module.findAllContent);
app.get('/performance/:parent_id/:id', module.findAllContent);

app.get('/performance2', module.findAllContent);
app.get('/performance2/:parent_id/:id', module.findAllContent);
app.post('/performance2/:parent_id', module.addLivePerformanceContent);
app.put('/performance2/:parent_id/:id', module.updateContent);
app.delete('/performance2/:parent_id/:id', module.deleteContent);

app.get('/structure/:parent_id/:id', module.findAllContent);
app.post('/structure/:parent_id', module.addContentByParent);
app.put('/structure/:parent_id/:id', module.updateContent);
app.delete('/structure/:parent_id/:id', module.deleteContent);

app.get('/database/telebrain', module.findAllTelebrain);
app.get('/database/content', module.findAllContent);
//app.get('/database/content/:type_id', module.findContentByType);
app.get('/database/content/:type_id/:id', module.findContentById);

server.listen(app.get('port'), function () {
    console.log("Welcome to telebrain.org");
    console.log("Listening on port " + app.get('port'));
});

//below is all from Performgramming App

// usernames which are currently connected to the chat
var usernames = {};
chatClients = new Object();
io.set('log level', 2); //ignores heartbeats
io.set('transports', [ 'websocket', 'xhr-polling' ]); //socket fallback xhr-polling, may not be necessary
io.sockets.on('connection', function (socket) {

	var receiver = new osc.UdpReceiver(8888);
	
	receiver.on('', function(e) {
		console.log(e);
		io.sockets.emit('dataReceived', e.params[0]);
	});
	//multiroom chat sockets
	//sets username through connect multi-room
	socket.on('saveSocket', function (room, roomId){
		console.log("data from connect: " + room + " " + roomId);
		connect(socket, room, roomId);
	});

	socket.on('joinRoomSocket', function (nickname, room, roomId, playerRole, playerRoleId){
		console.log("data from connect: " + nickname + " " + room + " " + roomId + " " + playerRole + " " + playerRoleId);
		connectRoom(socket, nickname, room, roomId, playerRole, playerRoleId);
	});
	socket.on('chatmessage', function (data){
		chatmessage(socket, data);
	});
	socket.on('imagemessage', function (data){
		imagemessage(socket, data);
	});
	socket.on('audiomessage', function (data){
		audiomessage(socket, data);
	});

	socket.on('ttsmessage', function (data) {
		ttsmessage(socket, data);
	});
	
	// client subscribtion to a room
	socket.on('subscribe', function(data){
		subscribe(socket, data);
	});

	// client unsubscribtion from a room
	socket.on('unsubscribe', function(data){
		unsubscribe(socket, data);
	});
	
	// when a client calls the 'socket.close()'
	// function or closes the browser, this event
	// is built in socket.io so we actually dont
	// need to fire it manually
	socket.on('disconnect', function(){    //potential name conflict
		disconnect(socket);
	});
	//end mutliroom chat sockets

	socket.on('message', function (message) {
        console.log("Got message: " + message);
        io.sockets.emit('pageview', { 'url': message });
    });
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);

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
	socket.on('sendaudio', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updateaudio', socket.username, data);
//    say.speak('Alex', data);
		sender.send('/chat_audio',
		              'ss',			//'sfiTFNI', set data types to be separated by commas below or spaces in msg.
		              [socket.username, data]);
	});
	socket.on('urlTTS', function (urlString) {
			var downloadfile = urlString;
			console.log("Downloading file: " + downloadfile);

			var currentTime = new Date();
			var newName = currentTime.getTime() + ".mp3";
			var savePath = savepublic + "/snd/ttsaudio/" + newName;
			console.log("save TTS to: ".red + savePath.red);
			var fileStream = fs.createWriteStream(savePath);
			request(downloadfile).pipe(fileStream);  
    		
    		request(downloadfile).on('end', function() {
    			console.log('Ending ' + downloadfile);
    			io.sockets.emit('playAudio', "/snd/ttsaudio/" + newName);
			});
    		fileStream.on('end', function() {
    			console.log('Done with ' + newName);	
			});
	});
	socket.on('saveNewTTS', function (urlString, tts_id) {
			var downloadfile = urlString;
			console.log("Downloading file: " + downloadfile);
			var newName = tts_id + ".mp3";
			var savePath = savepublic + "/snd/ttsdb/" + newName;
			console.log("save New TTS to: ".red + savePath.red);
			var fileStream = fs.createWriteStream(savePath);
			request(downloadfile).pipe(fileStream);  
    		
    		request(downloadfile).on('end', function() {
    			console.log('Ending ' + downloadfile);
			});
    		fileStream.on('end', function() {
    			console.log('Done with ' + newName);	
			});
	});
	socket.on('deleteTTSbyID', function (tts_id) {
			console.log('delete tts audio');
			try {
			    var stats = fs.lstatSync(savepublic + "/snd/ttsdb/" + tts_id + ".mp3"); 
			    console.log(savepublic + "/snd/ttsdb/" + tts_id + ".mp3");
			    if (stats.isFile()) {
			        console.log("is file");
			        fs.unlink(savepublic + "/snd/ttsdb/" + tts_id + ".mp3", function (err) {
			  			if (err) throw err;
			  			console.log('successfully deleted /snd/ttsdb/' + tts_id + '.mp3');
					});
			    }
			}
			catch (e) {
			   console.log("NOT file");
			}
	});
	socket.on('saveURLAudio', function (urlString, url_id) {
			var downloadfile = urlString;
			var urlExistsFlag = 0;
			console.log("saving URL AUDIO: ".red + urlString.red);
			var audioRequest = request(downloadfile, function (error, response, body) {
				console.log("in request");
				  if (!error && response.statusCode == 200) {
				    console.log("AUDIO EXISTS");
				    urlExistsFlag = 1;
				    socket.emit("urlAudioError", urlExistsFlag);
				    console.log("Downloading file: " + downloadfile);
					var newName = url_id + ".mp3";
					var savePath = savepublic + "/snd/urls/" + newName;
					console.log("save URL audio to: ".red + savePath.red);
					var fileStream = fs.createWriteStream(savePath);
					request(downloadfile).pipe(fileStream);
					
					request(downloadfile).on('end', function() {
						console.log('Ending ' + downloadfile);
					});
					fileStream.on('end', function() {
						console.log('Done with ' + newName);	
					});
				  }
				  else {
				  	console.log("AUDIO DOES NOT EXIST");
				  	socket.emit("urlAudioError", urlExistsFlag);
				  }
				});
			audioRequest.on('socket', function (socket) {
				console.log("in request.on");
			    socket.setTimeout(5000);  
			    socket.on('timeout', function() {
			        socket.emit("urlAudioError", 2);
			        audioRequest.abort();
			    });
			});
			console.log(urlExistsFlag);

	});
	socket.on('deleteURLAudioByID', function (url_id) {
			console.log('delete url audio');
			try {
			    var stats = fs.lstatSync(savepublic + "/snd/urls/" + url_id + ".mp3"); 
			    if (stats.isFile()) {
			        console.log("is file");
			        fs.unlink(savepublic + "/snd/urls/" + url_id + ".mp3", function (err) {
			  			if (err) throw err;
			  			console.log('successfully deleted /snd/urls/' + url_id + ".mp3");
					});
			    }
			}
			catch (e) {
			   console.log("NOT file");
			}
			
	});
	socket.on('deletePhraseByID', function (phrase_id) {
			console.log('delete phrase audio');
			try {
			    var stats = fs.lstatSync(savepublic + "/snd/phrases/" + phrase_id + ".mp3"); 
			    if (stats.isFile()) {
			        console.log("is file");
			        fs.unlink(savepublic + "/snd/phrases/" + phrase_id + ".mp3", function (err) {
			  			if (err) throw err;
			  			console.log('successfully deleted /snd/phrases/' + phrase_id + ".mp3");
					});
					fs.unlink(savepublic + "/snd/phrases/" + phrase_id + ".ogg", function (err) {
					  if (err) throw err;
					  console.log('successfully deleted /snd/phrases/' + phrase_id + ".ogg");
					});
					fs.unlink(savepublic + "/snd/phrases/" + phrase_id + ".json", function (err) {
					  if (err) throw err;
					  console.log('successfully deleted /snd/phrases/' + phrase_id + ".json");
					});
			    }
			}
			catch (e) {
			   console.log("NOT file");
			}
	});
	
	socket.on('phraseList', function (phraseList, phrase_id) {
		console.log("all: " + phraseList);
		
		//AUDIOSPRITE BEGIN
		var AUDIOSPRITE_PATH = path.join(__dirname, './public/lib/audiosprite/audiosprite.js')
		  , OUTPUT = phrase_id
		var spritedir = path.resolve(__dirname, "public/snd/phrases");
		console.log('Spritedir: '.red + spritedir.red);
		console.log('Starting directory: '.red + process.cwd().red);
		try {
		  process.chdir(spritedir);
		  console.log('Save Phrase directory: '.red + process.cwd().red);
		}
		catch (err) {
		  console.log('chdir: ' + err);
		}
		var spriteArray = [ AUDIOSPRITE_PATH
	      , '--rawparts='
	      , '-o'
	      , OUTPUT
	      , '-l'
	      , 'debug'
	      ];

		for(var i=0; i<phraseList.length; i++)
		{
			var phrase = phraseList[i];
			console.log("get audio from: ".red + path.resolve(__dirname, "public", phrase.audio).red);
			spriteArray.push(path.resolve(__dirname, "public", phrase.audio));	
		}
		
		console.log(spriteArray);
		
		var audiosprite = spawn('node',
	      spriteArray)

		var out = ''
	    audiosprite.stdout.on('data', function(dt) {
	      out += dt.toString('utf8')
	    })

	    var err = ''
	    audiosprite.stderr.on('data', function(dt) {
	      err += dt.toString('utf8')
	    })


	    audiosprite.on('exit', function(code, signal) {
	      console.log(out)

	      var file, stat;

	      if (code) {
	        assert.fail(code, 0, 'audiosprite returned with error code. debug = ' + err, '==');
	      }

	      var jsonFile = path.join(spritedir, OUTPUT + '.json')
	      assert.ok(fs.existsSync(jsonFile), 'JSON file does not exist')

	      var json;
	      assert.doesNotThrow(function() {
	        json = JSON.parse(fs.readFileSync(jsonFile))
	      }, 'invalid json')

	      console.log(json)
	    });

//AUDIOSPRITE END
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
    }, 100000)

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
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has left the performance');
	});
	socket.on('getRoomsList', function () { 
		socket.emit('liveRoomslist', { rooms: getRooms() });
	});

	//multiroom chat functions
	function connect(socket, room, roomId){
		console.log(socket + " " + room + " " + roomId)
		socket.emit('ready');
	}

	function connectRoom(socket, nickname, room, roomId, playerRole, playerRoleId){
	//generate clientId
			var generatedId = generateId();
			console.log("clientId: " + generatedId );
			//nickname.clientId = generatedId;

			console.log("why is this undefined? " + nickname.clientId + " and data: " + nickname);
			chatClients[socket.id] = { nickname : nickname, clientId: generatedId, roleName: playerRole, roleId: playerRoleId };

			//console.log("clients object " + chatClients[socket.id].clientId);
			//console.log(nickname);

			// make private room for individual messages to be sent

			socket.join(room + '/priv/' + nickname);
			socket.join(room + '/role/' + playerRole);

			socket.emit('readyToPerform', { clientId: chatClients[socket.id].clientId, nickname: chatClients[socket.id].nickname, roleName: playerRole, roleId: playerRoleId });

			console.log("chat clients in room: " + chatClients[socket.id]);

			// auto subscribe the client to the 'lobby'
			subscribe(socket, { room: room, roomId: roomId });
	}

// when a client disconnect, unsubscribe him from
// the rooms he subscribed to
function disconnect(socket){
	// get a list of rooms for the client
	var rooms = io.sockets.manager.roomClients[socket.id];
	
	// unsubscribe from the rooms
	for(var room in rooms){
		if(room && rooms[room]){
			unsubscribe(socket, { room: room });
		}
	}

	// client was unsubscribed from the rooms,
	// now we can selete him from the hash object
	delete chatClients[socket.id];
}

// receive chat message from a client and
// send it to the relevant room
function chatmessage(socket, data){
	//test roleList 1st --- if all is on role list, ignore the rest
	//else parse through both lists socket emitting accordingly
	var allFlag = 0;
	if (data.sendRoleList!=0)
	{
		for (var i=0; i<data.sendRoleList.length; i++) 
		{
	        if (data.sendRoleList[i] == "All") 
	        {
	        	io.sockets.in(data.room).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });
	        	allFlag = 1;
	        }
	    }
	}
    if (allFlag == 0)
    {
    	if (data.sendRoleList!=0)
		{
	    	for (var i=0; i<data.sendRoleList.length; i++) 
			{
		       	io.sockets.in(data.room + "/role/" + data.sendRoleList[i]).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });
		    }
		}
		if (data.sendPerformerList!=0)
		{
		    for (var i=0; i<data.sendPerformerList.length; i++) 
			{
		       	io.sockets.in(data.room + "/priv/" + data.sendPerformerList[i]).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });
		    }
		}
    }
                   

	//data.sendRoleList 
	//data.sendPerformerList
	//data.room + "/priv/" + data.sendPerformerList[i]
	//data.room + "/role/" + data.sendRoleList[i]

	//io.sockets.in(data.room).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });
}
function imagemessage(socket, data){
	// by using 'socket.broadcast' we can send/emit
	// a message/event to all other clients except
	// the sender himself
	console.log("IMAGE RECEIVED");
	var allFlag = 0;
	if (data.sendRoleList!=0)
	{
		for (var i=0; i<data.sendRoleList.length; i++) 
		{
	        if (data.sendRoleList[i] == "All") 
	        {
	        	io.sockets.in(data.room).emit('imagemessage', { client: chatClients[socket.id], message: data.message, room: data.room });
	        	allFlag = 1;
	        }
	    }
	}
    if (allFlag == 0)
    {
    	if (data.sendRoleList!=0)
		{
	    	for (var i=0; i<data.sendRoleList.length; i++) 
			{
		       	io.sockets.in(data.room + "/role/" + data.sendRoleList[i]).emit('imagemessage', { client: chatClients[socket.id], message: data.message, room: data.room });
		    }
		}
		if (data.sendPerformerList!=0)
		{
		    for (var i=0; i<data.sendPerformerList.length; i++) 
			{
		       	io.sockets.in(data.room + "/priv/" + data.sendPerformerList[i]).emit('imagemessage', { client: chatClients[socket.id], message: data.message, room: data.room });
		    }
		}
    }
}
function audiomessage(socket, data){
	// by using 'socket.broadcast' we can send/emit
	// a message/event to all other clients except
	// the sender himself
	var allFlag = 0;
	if (data.sendRoleList!=0)
	{
		for (var i=0; i<data.sendRoleList.length; i++) 
		{
	        if (data.sendRoleList[i] == "All") 
	        {
	        	io.sockets.in(data.room).emit('audiomessage', { client: chatClients[socket.id], message: data.message, room: data.room });
	        	allFlag = 1;
	        }
	    }
	}
    if (allFlag == 0)
    {
    	if (data.sendRoleList!=0)
		{
	    	for (var i=0; i<data.sendRoleList.length; i++) 
			{
		       	io.sockets.in(data.room + "/role/" + data.sendRoleList[i]).emit('audiomessage', { client: chatClients[socket.id], message: data.message, room: data.room });
		    }
		}
		if (data.sendPerformerList!=0)
		{
		    for (var i=0; i<data.sendPerformerList.length; i++) 
			{
		       	io.sockets.in(data.room + "/priv/" + data.sendPerformerList[i]).emit('audiomessage', { client: chatClients[socket.id], message: data.message, room: data.room });
		    }
		}
    }
}
function ttsmessage(socket, data){
	var downloadfile = data.message;
		console.log("Downloading file: " + downloadfile);

		var currentTime = new Date();
		var newName = currentTime.getTime() + ".mp3";
		var savePath = savepublic + "/snd/ttsaudio/" + newName;
		console.log("save TTS to: ".red + savePath.red);
		var fileStream = fs.createWriteStream(savePath);
		request(downloadfile).pipe(fileStream);  
		
		request(downloadfile).on('end', function() {
			console.log('Ending ' + downloadfile);

			var allFlag = 0;
			if (data.sendRoleList!=0)
			{
				for (var i=0; i<data.sendRoleList.length; i++) 
				{
			        if (data.sendRoleList[i] == "All") 
			        {
			        	io.sockets.in(data.room).emit('ttsmessage', { client: chatClients[socket.id], message: "/snd/ttsaudio/" + newName, room: data.room });
			        	allFlag = 1;
			        }
			    }
			}
		    if (allFlag == 0)
		    {
		    	if (data.sendRoleList!=0)
				{
			    	for (var i=0; i<data.sendRoleList.length; i++) 
					{
				       	io.sockets.in(data.room + "/role/" + data.sendRoleList[i]).emit('ttsmessage', { client: chatClients[socket.id], message: "/snd/ttsaudio/" + newName, room: data.room });
				    }
				}
				if (data.sendPerformerList!=0)
				{
				    for (var i=0; i<data.sendPerformerList.length; i++) 
					{
				       	io.sockets.in(data.room + "/priv/" + data.sendPerformerList[i]).emit('ttsmessage', { client: chatClients[socket.id], message: "/snd/ttsaudio/" + newName, room: data.room });
				    }
				}
		    }
		});
		fileStream.on('end', function() {
			console.log('Done with ' + newName);	
		});
}



// subscribe a client to a room
function subscribe(socket, data){
	// get a list of all active rooms
	var rooms = getRooms();
	console.log("room list " + rooms + " data.room " + data.room);
	// check if this room is exist, if not, update all 
	// other clients about this new room
	if(rooms.indexOf('/' + data.room) < 0){
		socket.broadcast.emit('addroom', { room: data.room });
		socket.emit('liveRoomslist', { rooms: getRooms() });
	}

	// subscribe the client to the room
	socket.join(data.room);

	// update all other clients about the online
	// presence
	updatePresence(data.room, socket, 'online');

	// send to the client a list of all subscribed clients
	// in this room
	socket.emit('roomclients', { room: data.room, clients: getClientsInRoom(socket.id, data.room) });
}

// unsubscribe a client from a room, this can be
// occured when a client disconnected from the server
// or he subscribed to another room
function unsubscribe(socket, data){
	// update all other clients about the offline
	// presence
	updatePresence(data.room, socket, 'offline');
	
	// remove the client from socket.io room
	socket.leave(data.room);

	// if this client was the only one in that room
	// we are updating all clients about that the
	// room is destroyed
	if(!countClientsInRoom(data.room)){

		// with 'io.sockets' we can contact all the
		// clients that connected to the server
		io.sockets.emit('removeroom', { room: data.room });
	}
}

// 'io.sockets.manager.rooms' is an object that holds
// the active room names as a key, returning array of
// room names
function getRooms(){
	return Object.keys(io.sockets.manager.rooms);
}

// get array of clients in a room
function getClientsInRoom(socketId, room){
	// get array of socket ids in this room
	var socketIds = io.sockets.manager.rooms['/' + room];
	var clients = [];
	
	if(socketIds && socketIds.length > 0){
		socketsCount = socketIds.length;
		
		// push every client to the result array
		for(var i = 0, len = socketIds.length; i < len; i++){
			
			// check if the socket is not the requesting
			// socket
			if(socketIds[i] != socketId){
				clients.push(chatClients[socketIds[i]]);
			}
		}
	}
	
	return clients;
}

// get the amount of clients in aroom
function countClientsInRoom(room){
	// 'io.sockets.manager.rooms' is an object that holds
	// the active room names as a key and an array of
	// all subscribed client socket ids
	if(io.sockets.manager.rooms['/' + room]){
		return io.sockets.manager.rooms['/' + room].length;
	}
	return 0;
}

// updating all other clients when a client goes
// online or offline. 
function updatePresence(room, socket, state){
	// socket.io may add a trailing '/' to the
	// room name so we are clearing it
	//room = room.replace('/','');

	// by using 'socket.broadcast' we can send/emit
	// a message/event to all other clients except
	// the sender himself
	socket.broadcast.to(room).emit('presence', { client: chatClients[socket.id], state: state, room: room });
}

// unique id generator
function generateId(){
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	console.log("generateID " + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
//end multiroom chat functions
});








