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

chatClients = new Object();

io.set('log level', 2); //ignores heartbeats
io.set('transports', [ 'websocket', 'xhr-polling' ]); //socket fallback xhr-polling, may not be necessary
io.sockets.on('connection', function (socket) {
	console.log("connected client id: " + socket.id);
	
	socket.emit("getClientId");

	var receiver = new osc.UdpReceiver(8888);
	
	receiver.on('', function(e) {
		console.log(e);
		io.sockets.emit('dataReceived', e.params[0]);
	});

	socket.on("clientConnect", function (client){
		console.log("reconnecting client : ".red + client.clientId + " " + client.nickname);
		reconnectNewSocket(socket, client); 
	});
	socket.on("checkForClientData", function() {
		//console.log("chatClients : " + JSON.stringify(chatClients, null, 2));
		if (chatClients[socket.id] == undefined)
		{
			socket.emit("unregisteredPerformer");
			console.log("Unregistered Performer");
		}
		else {
			console.log("check for socket " + socket.id);
			console.log("check for client " + chatClients[socket.id].roomId);
			console.log("chatClient info : " + JSON.stringify(chatClients[socket.id], null, 2));
			socket.emit("registeredPerformer", chatClients[socket.id]);
			console.log("Registered Performer");
		}
	});
	socket.on("unregisterPerformer", function() {
		if (chatClients[socket.id] != undefined)
		{	
			console.log("unregister Performer");
			unsubscribe(socket, "offline");
		}
		console.log("create new performance");
		socket.emit("unregisteredPerformer");
	});
	socket.on("doesClientDataExist", function() {
		if (chatClients[socket.id] == undefined)
		{
			console.log("Unregistered Performer");
			socket.emit("clientDataDoesNotExist");
		}
		else {
			console.log("check for socket " + socket.id);
			console.log("check for client " + chatClients[socket.id].roomId);
			socket.emit("clientDataExists", chatClients[socket.id]);
			console.log("Registered Performer reJoining: " + chatClients[socket.id]);
		}
	});
	socket.on('saveNewSocket', function (room, roomId){
		console.log("save socket venue: " + room + " id: " + roomId);
		if (chatClients[socket.id] != undefined) {
			console.log("socket exists, unsubscribing")
			unsubscribe(socket, 'safeDisconnect');
			connect(socket, room, roomId);
		}
		else{
			console.log("socket doesn't exit connecting")
			connect(socket, room, roomId);
		}	
	});
	socket.on('joinRoomSocket', function (client){
		connectRoom(socket, client);
	});
	socket.on('reJoinRoomSocket', function (client){
		reconnectRoom(socket, client);
	});
	socket.on('textmessage', function (data){
		textmessage(socket, data);
	});
	socket.on('fragmentmessage', function (data){
		fragmentmessage(socket, data);
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
	socket.on('getRoomsList', function () { 
		socket.emit('liveRoomslist', { rooms: getRooms() });
	});
	socket.on('getRoomsList2', function () { 
		socket.emit('liveRoomslist2', { rooms: getRooms() });
	});
	socket.on('getClientsInRoom', function (data) { 
		console.log("data " + data + " clients " + getNicknameList(data).length);
		socket.emit('clientsInRoom', getNicknameList(data));
	});
	socket.on('leavePerformance', function(){
		console.log("client leaving performance");
		unsubscribe(socket, "offline");
		socket.emit("leftPerformance");
	});
	socket.on('end', function(){   
		console.log("ended");
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
	socket.on('getPerformanceInfo', function() {
		console.log("in server socket");
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

	function connect(socket, room, roomId){
		console.log("socket ready");
		socket.emit('ready');
	}

	function connectRoom(socket, client){

			var generatedId = generateId();
			console.log("new client id: " + generatedId );

			chatClients[socket.id] = { nickname : client.nickname, clientId: generatedId, roleName: client.roleName, roleId: client.roleId, room: client.room, roomId: client.roomId };

			socket.emit('readyToPerform', chatClients[socket.id]);

			subscribe(socket, "online");
	}
	function reconnectRoom(socket, client){

			console.log("reconnecting client id: " + client.clientId );
			chatClients[socket.id] = { nickname : client.nickname, clientId: client.clientId, roleName: client.roleName, roleId: client.roleId, room: client.room, roomId: client.roomId };

			socket.emit('reconnectPerformance', chatClients[socket.id]);

			subscribe(socket, "reconnect");
	}
	function reconnectNewSocket(socket, client){

			chatClients[socket.id] = { nickname : client.nickname, clientId: client.clientId, roleName: client.roleName, roleId: client.roleId, room: client.room, roomId: client.roomId };

			socket.emit('reconnectNewSocket', chatClients[socket.id]);

			subscribe(socket, "reconnect");
	}

	function disconnect(socket){

		var rooms = io.sockets.manager.roomClients[socket.id];
		console.log("disconnect rooms list: " + rooms);
		
		for(var room in rooms){
			if(room && rooms[room]){	
				console.log("disconnect in room is in rooms list, so unsubscribe");
				unsubscribe(socket, "offline");
			}
		}
	}

	function textmessage(socket, data){
		
		var client = chatClients[socket.id];
		console.log("CHAT DELIVERY from " + client.nickname);
		var allFlag = 0;
		if (data.sendRoleList!=0)
		{
			for (var i=0; i<data.sendRoleList.length; i++) 
			{
		        if (data.sendRoleList[i] == "All") 
		        {
		        	io.sockets.in(client.room).emit('textmessage', { client: client, message: data.message});
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
			       	io.sockets.in(client.room + "/role/" + data.sendRoleList[i]).emit('textmessage', { client: chatClients[socket.id], message: data.message });
			    }
			}
			if (data.sendPerformerList!=0)
			{
			    for (var i=0; i<data.sendPerformerList.length; i++) 
				{
			       	io.sockets.in(client.room + "/priv/" + data.sendPerformerList[i]).emit('textmessage', { client: chatClients[socket.id], message: data.message });
			    }
			}
	    }
	}
	function imagemessage(socket, data){

		var client = chatClients[socket.id];
		console.log("IMAGE DELIVERY from " + client.nickname);

		var allFlag = 0;
		if (data.sendRoleList!=0)
		{
			for (var i=0; i<data.sendRoleList.length; i++) 
			{
		        if (data.sendRoleList[i] == "All") 
		        {
		        	io.sockets.in(client.room).emit('imagemessage', { client: client, message: data.message, imageName: data.imageName });
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
			       	io.sockets.in(client.room + "/role/" + data.sendRoleList[i]).emit('imagemessage', { client: client, message: data.message, imageName: data.imageName });
			    }
			}
			if (data.sendPerformerList!=0)
			{
			    for (var i=0; i<data.sendPerformerList.length; i++) 
				{
			       	io.sockets.in(client.room + "/priv/" + data.sendPerformerList[i]).emit('imagemessage', { client: client, message: data.message, imageName: data.imageName });
			    }
			}
	    }
	}
	function audiomessage(socket, data){

		var client = chatClients[socket.id];
		console.log("AUDIO DELIVERY from " + client.nickname + " delivering " + data.audioName);
		
		var allFlag = 0;
		if (data.sendRoleList!=0)
		{
			for (var i=0; i<data.sendRoleList.length; i++) 
			{
		        if (data.sendRoleList[i] == "All") 
		        {
		        	io.sockets.in(client.room).emit('audiomessage', { client: client, message: data.message, audioName: data.audioName});
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
			       	io.sockets.in(client.room + "/role/" + data.sendRoleList[i]).emit('audiomessage', { client: client, message: data.message, audioName: data.audioName });
			    }
			}
			if (data.sendPerformerList!=0)
			{
			    for (var i=0; i<data.sendPerformerList.length; i++) 
				{
			       	io.sockets.in(client.room + "/priv/" + data.sendPerformerList[i]).emit('audiomessage', { client: client, message: data.message, audioName: data.audioName });
			    }
			}
	    }
	}
	function fragmentmessage(socket, data){

		var client = chatClients[socket.id];
		console.log("FRAGMENT DELIVERY from " + client.nickname);

		//console.log("fragment data: " + JSON.stringify(data, null, 2));

	    io.sockets.in(client.room + "/role/" + data.sendRoleList).emit('fragmentmessage', { client: client, fragmentData: data.fragmentData, fragmentName: data.fragmentName, contentName: data.contentName });

	}
	function ttsmessage(socket, data){

		var client = chatClients[socket.id];
		console.log("TTS DELIVERY from " + client.nickname);

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
			        	io.sockets.in(client.room).emit('ttsmessage', { client: client, message: "/snd/ttsaudio/" + newName, ttsContents: data.ttsContents });
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
				       	io.sockets.in(client.room + "/role/" + data.sendRoleList[i]).emit('ttsmessage', { client: client, message: "/snd/ttsaudio/" + newName, ttsContents: data.ttsContents });
				    }
				}
				if (data.sendPerformerList!=0)
				{
				    for (var i=0; i<data.sendPerformerList.length; i++) 
					{
				       	io.sockets.in(client.room + "/priv/" + data.sendPerformerList[i]).emit('ttsmessage', { client: client, message: "/snd/ttsaudio/" + newName, ttsContents: data.ttsContents });
				    }
				}
		    }
		});
		fileStream.on('end', function() {
			console.log('Done with ' + newName);	
		});
	}

	function subscribe(socket, state){

		var client = chatClients[socket.id];

		socket.join(client.room);
		socket.join(client.room + '/priv/' + client.nickname);
		socket.join(client.room + '/role/' + client.roleName);

		var rooms = getRooms();
		console.log("room list: " + rooms);

		updatePresence(client.room, socket, state);

		socket.emit('roomclients', { room: client.room });

		io.sockets.in(client.room).emit('updateRoomclients', getAllClients(client.room));
		console.log("updating live rooms list");
		
		socket.broadcast.emit('updateRoomslist', { room: client.room, roomId: client.roomId, rooms: getRooms() });
	}

	function unsubscribe(socket, state){

		var client = chatClients[socket.id];

		console.log("leave " + client.room);
		console.log("leave " + client.room + '/priv/' + client.nickname);
		console.log("leave " + client.room + '/role/' + client.roleName);

		socket.leave(client.room);
		socket.leave(client.room + '/priv/' + client.nickname);
		socket.leave(client.room + '/role/' + client.roleName);

		updatePresence(client.room, socket, state);

		delete chatClients[socket.id];
		io.sockets.in(client.room).emit('updateRoomclients', getAllClients(client.room));
		socket.broadcast.emit('compareNewRoomslist', { rooms: getRooms() });
		console.log("room list after client leaves: " + getRooms());
		console.log("client list after client leaves: " + getAllClients(client.room));
	}

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
	function getNicknameList(room){
		// get array of socket ids in this room
		var socketIds = io.sockets.manager.rooms['/' + room];
		var clients = [];
		
		if(socketIds && socketIds.length > 0){
			
			// push every client to the result array
			for(var i = 0; i < socketIds.length; i++){
				clients.push(chatClients[socketIds[i]].nickname);
			}
		}
		return clients;
	}

	function getAllClients(room){
		// get array of socket ids in this room
		var socketIds = io.sockets.manager.rooms['/' + room];
		var clients = [];
		
		if(socketIds && socketIds.length > 0){
			socketsCount = socketIds.length;
			
			// push every client to the result array
			for(var i = 0, len = socketIds.length; i < len; i++){
				
					clients.push(chatClients[socketIds[i]]);
				
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

	function updatePresence(room, socket, state){
		
		socket.broadcast.to(room).emit('presence', { client: chatClients[socket.id], state: state});
	}
	function checkConnect(socketId){
		
		console.log("chatClients : " + JSON.stringify(chatClients, null, 2));
		if (chatClients[socketId]){console.log("SOCKET ACTIVE");}else{console.log("SOCKET INACTIVE");}
	}
	function generateId(){
		
		var S4 = function () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}
});








