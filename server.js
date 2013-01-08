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
  , events = require("events")
  , spawn = require('child_process').spawn
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
console.log(__dirname);
var savepublic = path.resolve("public");

app.get('/create/:parent_id/:id', module.findContentByParent);
app.post('/create/:parent_id', module.addContentByParent);
app.put('/create/:parent_id/:id', module.updateContent);
app.delete('/create/:parent_id/:id', module.deleteContent);

app.get('/perform', module.findAllContent);

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
	});
	socket.on('message', function (message) {
        console.log("Got message: " + message);
        io.sockets.emit('pageview', { 'url': message });
    });
    socket.on('performViewLoaded', function(data) {
    	console.log("Perform View Loading");
    	socket.emit('performInitializer', (data));
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
	socket.on('urlTTS', function (urlString) {
			var downloadfile = urlString;
			console.log("Downloading file: " + downloadfile);

			var currentTime = new Date();
			var newName = currentTime.getTime() + ".mp3";
			var savePath = savepublic + "/snd/ttsaudio/" + newName;
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
			request(downloadfile, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    console.log("AUDIO EXISTS");
				    urlExistsFlag = 1;
				    console.log("Downloading file: " + downloadfile);
					var newName = url_id + ".mp3";
					var savePath = savepublic + "/snd/urls/" + newName;
					
					var fileStream = fs.createWriteStream(savePath);
					request(downloadfile).pipe(fileStream);
					
					request(downloadfile).on('end', function() {
						console.log('Ending ' + downloadfile);
					});
					fileStream.on('end', function() {
						console.log('Done with ' + newName);	
					});
				  }
				  socket.emit("urlAudioError", urlExistsFlag);
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
		console.log('Spritedir: ' + spritedir);
		console.log('Starting directory: ' + process.cwd());
		try {
		  process.chdir(spritedir);
		  console.log('New directory: ' + process.cwd());
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
			console.log(path.resolve(__dirname, "public", phrase.audio));
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
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});
setTimeout(sendHeartbeat, 5000);








