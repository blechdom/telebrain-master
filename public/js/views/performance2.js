window.PerformanceMasterView2 = Backbone.View.extend({

    initialize: function (options) {
        
        //this.model.set(this.model.defaults);
        var performanceId = this.options.performanceId;
        var parentId = this.options.parentId; 
        var client;

        _.bindAll(this, 'render'
                        , 'bindSocketEvents'
                        , 'chatSubmit'
                        , 'insertMessage'
                        , 'buildVenue'
                        , 'joinPerformance'
                        , 'addRoom'
                        , 'addRole'
                        , 'addRoomShow'
                        , 'validateJoin'
                        , 'removeRoom'
                        , 'createRoom'
                        , 'beforeSave'
                        , 'showImage'
                        , 'saveModule'
                        , 'deleteModule'
                        , 'updateSocket'
                        , 'change'
                        , 'TTSChat'
                        , 'updateImage'
                        , 'renderAudioMenus'
                        , 'renderImageMenus'
                        , 'addClient'
                        , 'removeClient'); //must bind before rendering
        
        if (parentId == 15) {
            var programModel = this.options.programModel;

            console.log("initialize programModel : " + JSON.stringify(programModel, null, 2));

            this.collection.each(function(programModel) {
                
                if(programModel.get('_id')==performanceId) 
                { 
                    this.model.set({"programId": programModel.get("_id")
                                    , "programName": programModel.get("name")
                                    , "programImage": programModel.get("image")
                                    , "programNetwork": programModel.get("network")
                                    , "programRolelist": programModel.get("rolelist")
                                    , "_id": null
                                    , "parent_id": 99});
                }
            }, this);

            console.log("initialize model : " + JSON.stringify(this.model, null, 2));

            this.render();
        }
        else {
            this.collection.each(function(model) {
                if(model.get('_id')==performanceId) 
                { 
                    this.model.set(model.attributes);
                 }
            }, this);

            console.log("joining model : " + JSON.stringify(this.model, null, 2));
            this.buildVenue();
        }
        this.model.set("sendRoleList", ["All"]);
        
    },

    render: function (options) {
        if (!this.performanceView2) {
            this.performanceView2 = new PerformanceView2();
        }
        $(this.el).append(this.performanceView2.el);

        var performanceId = this.options.performanceId;
        var parentId = this.options.parentId;

        this.$('newPerformance').empty().append('<div class="row-fluid"><form class="form-horizontal span12"><fieldset><div class="row"><div class="span12">');

        if (parentId == 15) {

            $('#legendTitle').empty().append('<legend>' + this.model.get("programName") + "</legend>");

            this.$('#newPerformance').append('<div class="control-group"><label for="performanceName" class="control-label">Enter a New Performance Name:</label><div class="controls"><input type="text" name="livePerformanceName" id="addRoomInput"/><span class="help-inline"></span></div></div><div class="form-actions"><a class="btn btn-primary" id="buildVenue">Create New Venue</a></div>');
        }
        else {
            
            var rolesArray = this.model.get("programRolelist");
            console.log(JSON.stringify(this.model, null, 2));
            $('#legendTitle').empty().append('<legend>Joining ' + this.model.get("performanceName") + "</legend>");
            this.$("#newPerformance").append('<select id="performanceRoleMenu" name="playerRoles"><option value="0">--SELECT ROLE-</option>');

            for(var i =0; i<rolesArray.length;i++)
            {
                 this.collection.each(function(model) {
                    if(model.get('_id')==rolesArray[i]){
                        console.log("got the model yo"); 
                        this.$('#performanceRoleMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
                    }
                }, this);
            }

            this.$('#newPerformance').append('<div class="control-group"><label for="nicknames" class="control-label">Enter a Nickname:</label><div class="controls"><input type="text" name="nicknames" id="nicknameInput"/><span class="help-inline"></span></div></div><div class="form-actions"><a class="btn btn-primary" id="joinPerformance">Join Performance</a></div>');
        }
        this.$('newPerformance').append('<div id="sentenceAlert" class="alert" style="display: none"></div></div></div></fieldset></form></div>');
        this.$("#renderPerformance").hide();
        this.model.set("serverDisplayName", "telebrain");  

        return this;
    },
    
    events: {
     
        "click #buildVenue"             : "beforeSave",
        "click #joinPerformance"        : "validateJoin",
        "click #textSubmit"             : "chatSubmit",
        "click #TTSSubmit"              : "TTSSubmit",
        "click #addRoomBtn"             : "addRoomShow",
        "click #createRoom"             : "createRoom",
        "scroll .chat-venues select"    : "roomScroll",
        "scroll .chat-messages"         : "messageScroll",
        "chage #addRoomInput"           : "change",
        "change #nicknameInput"         : "change",
        "change #imageURLMenu"          : "updateImage",
        "change #imageUploadMenu"       : "updateImage",
        "change #telepromptMenu"        : "updateImage",
        "change #imagePhraseMenu"       : "updateImage",
        "change #audioURLMenu"          : "updateAudio",
        "change #audioUploadMenu"       : "updateAudio",
        "change #TTSMenu"               : "updateAudio",
        "change #audioSentenceMenu"     : "updateAudio",
        "click #rolesCheckboxes input[type='checkbox']"         : "setSendToRole",
        "click #performerCheckboxes input[type='checkbox']"     : "setSendToPerformer",
        "change #performanceRoleMenu"                           : "change"

    },
    beforeSave: function () {
        var perfName = $('#addRoomInput').val(); 
        console.log("Create Venue named " + perfName);
        this.model.set("performanceName", perfName);

        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }

        this.saveModule();

        return false;
    },
    saveModule: function () {
        var self = this;
        console.log('before save');
        //this.$('#addedAudio').empty();
        this.model.save(null, {
            success: function (model) {
                //self.render();
                app.navigate('performance2/' + model.get("parent_id") + '/' + model.get('_id'), true);
                utils.showAlert('Success!', 'Phrase saved successfully', 'alert-success');

            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {
        this.model.destroy({
            success: function () {
                alert('Phrase deleted successfully');
                //window.history.back();
                window.location.replace('#create/8/58');

            }
        });
        return false;
    },
    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;

        console.log("target-val: " + target.value);
        console.log("target-name: " + target.name);
        console.log("target-id: " + target.id);
        console.log("change: " + change[target.name]);

        this.model.set(change);
        console.log(JSON.stringify(this.model, null, 2));

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },
    buildVenue: function() {
        console.log("buildingVenue");

        var performanceName = this.model.get("performanceName");
        var performanceId = this.model.get("_id");
        var nickname = "owner";  //CHECK - NICKNAMES SHOULD BE UNIQUE

        //SAVE NEW ROOM TO DATABASE - WITH NEW _ID THAT SHOULD ALSO BE SENT WITH THIS INITIAL SOCKET

        console.log("save socket data: " + " saveSocket " + nickname + " " + performanceName + " " + performanceId);

        socket.emit("saveSocket", performanceName, performanceId);
        // now that we have the socket we can bind events to it
        //this.bindSocketEvents();
        socket.on('ready', function(){
            // hiding the 'connecting...' message
            //$('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
                //$(this).hide();
                //$('.chat input').focus();

            //});
            console.log("socket and room ready");
            // saving the clientId localy
            //this.model.set("clientId", data.clientId);
            this.render();
        }.bind(this));
    },
    validateJoin: function () {
        console.log("validating join data");

        //WHERE ARE THE ERRORS ?!?!?!

        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            console.log("why no display validation?");
            utils.displayValidationErrors(check.messages);
            return false;
        }

        this.joinPerformance();

        //return false;
    },
    joinPerformance: function() {

        var nickname = $('#nicknameInput').val(); 
        var performanceName = this.model.get("performanceName");
        var performanceTypeId = this.model.get("performanceId"); 
        var playerRoleId = $('#performanceRoleMenu').val();
        var playerRole = $('#performanceRoleMenu').find('option:selected').text();

        this.model.set("nickname", nickname);

        if(nickname && nickname.length <= 15){  // test for uniqueness too
            console.log('joining performance');

            socket.emit("joinRoomSocket", nickname, performanceName, performanceTypeId, playerRole, playerRoleId);
            // now that we have the socket we can bind events to it
            this.bindSocketEvents();
        }
        else {
            //throw error
        }
    },
    updateSocket: function() {
        
        var client = this.model.get("client");
        $('.chat-messages ul').prepend('<br>' + client.nickname + " UPDATING SOCKET");
        var performanceName = this.model.get("performanceName");
        var performanceId = this.model.get("_id");
        socket.emit("clientConnect", client, performanceName, performanceId);
         
    },

    bindSocketEvents: function() {
       
        var nickname = this.model.get("nickname");
        
        /*socket.on("performHeartbeat", function(){

            setTimeout(function() {
              socket.emit('performHeartbeat');
              console.log("send perform heartbeat");
            }, 15000 );
         
        }.bind(this));
*/
        socket.on("getClientId", function(){
            $('.chat-messages ul').prepend('<br>' + nickname + " RECONNECTING");
            this.updateSocket();
            
        }.bind(this));

        socket.on("reconnectPerformance", function(){
            $('.chat-messages ul').prepend('<br>' + nickname + " RECONNECTED");
        }.bind(this));
        
        // after the server created a client for us, the ready event
        // is fired in the server with our clientId, now we can start 
        socket.on('readyToPerform', function (data){
            console.log("socket ready and clientID: " + data.clientId + " " + data.nickname + " " + data.roleName + " " + data.roleId);
            // saving the clientId localy
            this.clientId = data.clientId;
            this.model.set("client", { "id": data.clientId, "nickname": data.nickname, "roleName": data.roleName, "roleId": data.roleId});
            $("#renderPerformance").show();
            this.collection.each(function(roleModel) {
                if(roleModel.get('_id')==data.roleId) {
                        console.log("ROLE MODEL: " + JSON.stringify(roleModel, null, 2));
                        if (roleModel.get("showMenu")=="checked"){
                            console.log("show menu yes");
                            //$("#textSend").show();
                        }
                        else {  
                            $('#bottomHeader').hide();
                            console.log("text send no");
                        }
                        if (roleModel.get("showTitle")=="checked"){
                            console.log("show title yes");
                            //$("#textSend").show();
                        }
                        else {  
                            $('#legendTitle').hide();
                            console.log("show title no");
                        }
                        if (roleModel.get("textSend")=="checked"){
                            console.log("text send yes");
                            $("#textSend").show();
                        }
                        else {  
                            $("#textSend").hide();
                            console.log("text send no");
                        }
                        if (roleModel.get("TTSSend")=="checked"){
                            console.log("TTS send yes");
                            $("#TTSSend").show();
                        }
                        else {  
                            $("#TTSSend").hide();
                            console.log("TTS send no");
                        }
                        if (roleModel.get("imageSend")=="checked"){
                            console.log("image send yes");
                            $("#imageSend").show();
                            this.$('#imageSend').empty().append('<div id="imageURLMenuDiv"></div><div id="imageUploadMenuDiv"></div><div id="telepromptMenuDiv"></div><div id="imagePhraseMenuDiv"></div>'); 
                            this.renderImageMenus();
                        }
                        else {  
                            $("#imageSend").hide();
                            console.log("image send no");
                        }
                        if (roleModel.get("audioSend")=="checked"){
                            console.log("audio send yes");
                            $("#audioSend").show();
                            this.$('#audioSend').empty().append('<div id="audioURLMenuDiv"></div><div id="audioUploadMenuDiv"></div><div id="TTSMenuDiv"></div><div id="audioSentenceMenuDiv"></div>'); 
                            this.renderAudioMenus();
                        }
                        else {  
                            $("#audioSend").hide();
                            console.log("audio send no");
                        }
                        if (roleModel.get("textReceive")=="checked"){
                            console.log("text receive yes");
                            $("#textReceive").show();
                        }
                        else {  
                            $("#textReceive").hide();
                            console.log("text receive no");
                        }
                        if (roleModel.get("TTSReceive")=="checked"){
                            console.log("TTS receive yes");
                            $("#TTSReceive").show();
                            $("#TTSReceive").empty().append("<div id='audioAlert' class='alert alert-info'>TTS RECEIVE: Turn Audio On</div>");
                            socket.on('ttsmessage', function (data) {
                                console.log('receiveurl ', data);
                                var nickname = data.client.nickname;
                                var audio = data.message;
                                console.log("Play this: " + audio);
                                playAudio(audio);
                            }.bind(this));
                        }
                        else {  
                            $("#TTSReceive").hide();
                            console.log("TTS receive no");
                        }
                        if (roleModel.get("imageReceive")=="checked"){
                            console.log("image receive yes");
                            $("#imageReceive").show();
                            socket.on('imagemessage', function (data) {
                                console.log("imagemessage" + data);
                                var nickname = data.client.nickname;
                                var message = data.message;
                                this.showImage(message);
                            }.bind(this));
                        }
                        else {  
                            $("#imageReceive").hide();
                            console.log("image receive no");
                        }
                        if (roleModel.get("audioReceive")=="checked"){
                            console.log("audio receive yes");
                            $("#audioReceive").show();
                            $("#audioReceive").empty().append("<div id='audioAlert2' class='alert alert-info'>AUDIO RECEIVE: Turn Audio On</div>");
                            socket.on('audiomessage', function (data) {
                                console.log('receiveaudio', data);
                                var nickname = data.client.nickname;
                                var message = data.message;
                                var audio = message.split(',');
                                console.log("updating audio " + nickname + " data " + audio);
                                playAudio(audio[[0]]);
                            }.bind(this));
                        }
                        else {  
                            $("#audioReceive").hide();
                            console.log("audio receive no");
                        }
                        if (roleModel.get("performerList")=="checked"){
                            console.log("performer List yes");
                            $("#performerList").show();
                        }
                        else {  
                            $("#performerList").hide();
                            console.log("performer List no");
                        }
                        if (roleModel.get("activityLog")=="checked"){
                            console.log("activity Log yes");
                            $("#activityLog").show();
                        }
                        else {  
                            $("#activityLog").hide();
                            console.log("activity Log no");
                        }
                        if (roleModel.get("tester")=="checked"){
                            console.log("tester yes");
                            $("#tester").show();
                        }
                        else {  
                            $("#tester").hide();
                            console.log("tester no");
                        }
                }
            }, this);
        }.bind(this));

        // after the initialize, the server sends a list of
        // all the active rooms
        socket.on('roomslist', function(data){
            for(var i = 0, len = data.rooms.length; i < len; i++){
                // in socket.io, their is always one default room
                // without a name (empty string), every socket is automaticaly
                // joined to this room, however, we don't want this room to be
                // displayed in the rooms list
                if(data.rooms[i] != ''){
                    this.addRoom(data.rooms[i], false);
                }
            }
        }.bind(this));

        // when someone sends a message, the sever push it to
        // our client through this event with a relevant data
        socket.on('chatmessage', function(data){
            var nickname = data.client.nickname;
            var message = data.message;

            console.log(nickname + " chatmessage " + message)
            
            //display the message in the chat window
            this.insertMessage(nickname, message, true, false, false);
        }.bind(this));
        
        // when we subscribes to a room, the server sends a list
        // with the clients in this room
        socket.on('roomclients', function(data){
            
            // add the room name to the rooms list
            //this.addRoom(data.room, false);
            // set the current room
            this.setCurrentRoom(data.room);
            
            // announce a welcome message
            $("#newPerformance").empty();
            this.addRole();
            $('#legendTitle').empty().append("<legend>" + data.room + "   (LIVE)</legend>");
            this.insertMessage(this.model.get("serverDisplayName"), 'The <b>"' + data.room + '"</b> Performance has begun!', true, false, true);
            $('.chat-clients ul').empty();
            
            var client = this.model.get("client");
            //var clientId = client.id;
           // var nickname = clientId.nickname;
            //var clientId = this.model.get("clientId");

            //console.log(client.nickname + " " + client.id);
            // add the clients to the clients list
            this.addClient(client, false, true);
            for(var i = 0, len = data.clients.length; i < len; i++){
                console.log(data.clients[i].clientId);
                if(data.clients[i]){
                    this.addClient(data.clients[i], false, false);
                }
            }
        }.bind(this));
        
        // if someone creates a room the server updates us
        // about it
        socket.on('addroom', function(data){
            console.log("add room: " + data);
            this.addRoom(data.room, true);
        }.bind(this));
        
        // if one of the room is empty from clients, the server,
        // destroys it and updates us
        socket.on('removeroom', function(data){
            this.removeRoom(data.room, true);
        }.bind(this));
        
        // with this event the server tells us when a client
        // is connected or disconnected to the current room
        socket.on('presence', function(data){
            if(data.state == 'online'){
                this.addClient(data.client, true);
            } else if(data.state == 'offline'){
                this.removeClient(data.client, true);
            }
        }.bind(this));
    },
    chatSubmit: function() {
        utils.hideAlert();
        console.log("SEND THAT CHAT MESSAGE");
        var currentRoom = this.model.get('currentRoom');

        var message = $('#composeTextMessage').val().trim();

        var sendRoleList = this.model.get("sendRoleList");
        var sendPerformerList = this.model.get("sendPerformerList");

        
        if((message)&&((sendRoleList.length!=0)||(sendPerformerList!=0)))
        {

            // send the message to the server with the room name
            socket.emit('chatmessage', { message: message, room: currentRoom, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList});
            //var nickname = this.model.get("nickname");
            // display the message in the chat window
           // var client = this.model.get("client");
           // this.insertMessage(client.nickname, message, true, true);
            $('#composeMessage').val('');
        } else {
            //throw error
        }

        //handleMessage();
        
        //composeMessage
    },
    TTSSubmit: function() {
        utils.hideAlert();
        console.log("SEND THAT CHAT MESSAGE");
        var currentRoom = this.model.get('currentRoom');

        var message = $('#composeTTSMessage').val().trim();

        var sendRoleList = this.model.get("sendRoleList");
        var sendPerformerList = this.model.get("sendPerformerList");

        
        if((message)&&((sendRoleList.length!=0)||(sendPerformerList!=0)))
        {

            // send the message to the server with the room name
            //socket.emit('chatmessage', { message: message, room: currentRoom, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList});
            //var nickname = this.model.get("nickname");
            // display the message in the chat window
            var googleTts = new GoogleTTS('en');
                var urlString = googleTts.url(message, 'en');
                console.log("Speak URL: " + urlString);
                socket.emit("ttsmessage", { message: urlString, room: currentRoom, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList });

           // var client = this.model.get("client");
           // this.insertMessage(client.nickname, message, true, true);
            $('#composeMessage').val('');
        } else {
            //throw error
        }

        //handleMessage();
        
        //composeMessage
    },
    insertMessage: function(sender, message, showTime, isMe, isServer){
        
        var time = showTime ? getTime() : '';
        var htmlString = '<li class="cf"><div class="fl sender">' + sender + ': </div><div class="fl text">' + message + '</div><div class="pull-right time">' + time + '</div></li>';
        // if isMe is true, mark this message so we can
        // know that this is our message in the chat window
        if(isMe){
            htmlString = '<div class="marker">' + htmlString + '</div>';
            //$html.addClass('marker');
        }

        // if isServer is true, mark this message as a server
        // message
        if(isServer){
            //htmlString.find('.sender').css('color', serverDisplayColor);
            htmlString = '<div class="marker" style="color:"#FF0000;">' + htmlString + '</div>';
        }
        $('.chat-messages ul').prepend(htmlString);
        $('.chat-messages').animate({ scrollTop: $('.chat-messages ul').height() }, 100);
        //this.renderMessageTemplate(sender, message, time);
    },
    addRoomShow: function(){
            console.log("clicked add room");

            $('#addRoomInput').val("");
            $('#renderPerformance').hide();
            $('#addRoom').show();
    },
    addRoom: function(room, announce){

        // clear the trailing '/'
        //var room = name.replace('/','');
        var currentRoom = this.model.get("currentRoom");
        if (room == currentRoom)
        {
            var htmlString = '<option value="' + room + '" selected>' + room + '</option>';
        }
        else
        {
             var htmlString = '<option value="' + room + '">' + room + '</option>';
        }
       
        if($('.chat-venues select option[value="' + room + '"]').length == 0){

            $('.chat-venues select').append(htmlString);

            /*if(announce){
                this.insertMessage(this.model.get("serverDisplayName"), 'The room `' + room + '` created...', true, false, true);
            }*/
        }
    },
    removeRoom: function (name, announce){
        $('.chat-venues select option[value="' + name + '"]').remove();

       /* if(announce){
            this.insertMessage(this.model.get("serverDisplayName"), 'The room `' + name + '` destroyed...', true, false, true);
        }*/
    },
    createRoom: function (){
        utils.hideAlert();
        var room = $('#addRoomInput').val().trim();
        var currentRoom = this.model.get("currentRoom");

        if(room && room.length <= 10 && room != currentRoom){
            
            $('.chat-shadow').show().find('.content').html('Creating room: ' + room + '...');
            $('.chat-shadow').animate({ 'opacity': 1 }, 200);
            
            socket.emit('unsubscribe', { room: currentRoom });

            this.model.set("currentRoom", room);

            socket.emit('subscribe', { room: room });
            $("#addRoom").hide();
            $('#renderPerformance').show();
        } else {
           //throw error
        }
    },
    addClient: function (client, announce, isMe){
        console.log("add client: " + client + " " + client.nickname + " " + client.id);
        var clientName = client.nickname;
        // add checkbox for each user in room contactable via... io.sockets.in('priv/' + nickname).emit('message', { msg: 'hello world!' });
         if(isMe){
            clientName = '<font style="color:#FF0000;">ME: ' + clientName + '</font>';
        }
        

        var htmlString = '<li data-clientId="' + client.id + '"><div id="performerCheckboxes" class="form-horizontal"><label class="checkbox"><input type="checkbox" id="' + client.nickname + '" onclick="$(this).val(this.checked ? 1 : 0)">  <b>' + clientName + '</b> (' + client.roleName + ')</lable></div></li>';
        
        socket.emit("performHeartbeat");
        /*if(announce){
            this.insertMessage(this.model.get("serverDisplayName"), client.nickname + ' has joined the room...', true, false, true);
        }*/
        $('.chat-clients ul').append(htmlString);
    },
    addRole: function (){
        console.log("add roles");

        var rolesArray = this.model.get("programRolelist");
        console.log(JSON.stringify(this.model, null, 2));
        
        for(var i =0; i<rolesArray.length;i++)
        {
             this.collection.each(function(model) {
                if(model.get('_id')==rolesArray[i]){
                    this.$('.chat-roles ul').append('<li data-roleId="' + rolesArray[i] + '"><div id="rolesCheckboxes" class="form-horizontal"><label class="checkbox"><input type="checkbox" id="' + model.get("name") + '" onclick="$(this).val(this.checked ? 1 : 0)">  <b>' + model.get("name") + '</b></lable></div></li>');
                }
            }, this);
        }
    },

    // remove a client from the clients list
    removeClient: function (client, announce){
        $('.chat-clients ul li[data-clientId="' + client.clientId + '"]').remove();
        
        // if announce is true, show a message about this room
        if(announce){
            this.insertMessage(this.model.get("serverDisplayName"), client.nickname + ' has left the room...', true, false, true);
        }
    },
    setCurrentRoom: function (room){
        var currentRoom = room;
        this.model.set("currentRoom", currentRoom);
        $('.chat-venues select option.selected').removeClass('selected');
        $('.chat-venues select option[value="' + room + '"]').addClass('selected');
    },

    roomScroll: function(){
        $('.chat-venues select option.selected').css('top', $(this).scrollTop());
    },

    messageScroll: function(){
        var self = this;
        window.setTimeout(function(){
            if($(self).scrollTop() + $(self).height() < $(self).find('ul').height()){
                $(self).addClass('scroll');
            } else {
                $(self).removeClass('scroll');
            }
        }, 50);
    },

    TTSChat: function(e) {

        var ttsFlag = $(e.currentTarget).val();
        this.model.set("ttsFlag", ttsFlag);
        console.log("ttsFlag " + this.model.get("ttsFlag"));
    },
    setSendToRole: function(e) {
        var sendRoleList = this.model.get("sendRoleList");
        var check=e.currentTarget;
        var flagVal = $(e.currentTarget).val();
        console.log("id " + check.id + " current val " + flagVal);
        if (flagVal == 1) 
        {
            sendRoleList.push(check.id);
        }
        else
        {
            for (var i=sendRoleList.length-1; i>=0; i--) {
                if (sendRoleList[i] == check.id) {
                    sendRoleList.splice(i, 1);
                    // break;       //<-- Uncomment  if only the first term has to be removed
                }
            }
        }
        this.model.set("sendRoleList", sendRoleList);
        console.log("sendRoleList " + this.model.get("sendRoleList"));
    },
    setSendToPerformer: function(e) {
        var sendPerformerList = this.model.get("sendPerformerList");
        var check=e.currentTarget;
        var flagVal = $(e.currentTarget).val();
        console.log("id " + check.id + " current val " + flagVal);
        if (flagVal == 1) 
        {
            sendPerformerList.push(check.id);
        }
        else
        {
            for (var i=sendPerformerList.length-1; i>=0; i--) {
                if (sendPerformerList[i] == check.id) {
                    sendPerformerList.splice(i, 1);
                    // break;       //<-- Uncomment  if only the first term has to be removed
                }
            }
        }
        this.model.set("sendPerformerList", sendPerformerList);
        console.log(this.model.get("sendPerformerList"));
    },
    updateImage: function(e) {
        
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var updateImage = $(e.currentTarget).find('option:selected').data('image');
            console.log(updateImage);
            var currentRoom = this.model.get('currentRoom');
            console.log('sendimage', updateImage + "room: " + currentRoom);
            
            var sendRoleList = this.model.get("sendRoleList");
            var sendPerformerList = this.model.get("sendPerformerList");

        
            if((updateImage)&&((sendRoleList.length!=0)||(sendPerformerList!=0)))
            {
                console.log("update image: " + updateImage);
                socket.emit('imagemessage', { message: updateImage, room: currentRoom, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList});
            }
            //this.showImage(updateImage);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    showImage: function(message) {
            var image = message.split(',');

            $('#imageViewer').empty();
            if(image[1]==19)
            {
                $('#imageViewer').append("<div id='internalViewer'><div class='breakword' style='width:100%;margin: 0px auto; background-color:" + image[5] + "; font-size:" + image[6] + "px; color:" + image[4] + ";font-family:" + image[3] + "; line-height:" + image[6] + "px;'>" + image[2] + "</div></div>");
            }
            else {
                $('#imageViewer').append('<p><img id="picture" src="' + image[0] + '" width = 100% /></p>');
            }
    },
    updateAudio: function(e) {
        
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var updateAudio = $(e.currentTarget).find('option:selected').data('audio');
            console.log(updateAudio);
            var currentRoom = this.model.get('currentRoom');
            console.log('sendaudio', updateAudio + "room: " + currentRoom);
            
            var sendRoleList = this.model.get("sendRoleList");
            var sendPerformerList = this.model.get("sendPerformerList");

        
            if((updateAudio)&&((sendRoleList.length!=0)||(sendPerformerList!=0)))
            {
                socket.emit('audiomessage', { message: updateAudio, room: currentRoom, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList});
            }


            //var audio = updateAudio.split(',');
            //playAudio(audio[[0]]);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    renderImageMenus: function() {
         
       console.log("render menus");
       this.$("#imageURLMenuDiv").prepend('<select id="imageURLMenu"><option value="0">--SELECT IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==17)&&(model.get('permissions')!=1)){ 
             this.$('#imageURLMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',17">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#imageUploadMenuDiv").prepend('<select id="imageUploadMenu"><option value="0">--SELECT IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==18)&&(model.get('permissions')!=1)){ 
             this.$('#imageUploadMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',18">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#telepromptMenuDiv").prepend('<select id="telepromptMenu"><option value="0">--SELECT TELEPROMPT--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==19)&&(model.get('permissions')!=1)){ 
             this.$('#telepromptMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',19,' + model.get("text") + ',' + model.get("font") + ',' + model.get("color") + ',' + model.get("bgcolor") + ','  + model.get("size") + '">' + model.get("name") + '</option>');
            }
        }, this);

        /*this.$("#imagePhraseMenuDiv").prepend('<select id="imagePhraseMenu"><option value="0">--SELECT PHRASE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==57)&&(model.get('permissions')!=1)&&(model.get('_id')!=this.phraseId)){ 
             this.$('#imagePhraseMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',57">' + model.get("name") + '</option>');
            }
        }, this);*/
    },
    renderAudioMenus: function() {
        
        this.$("#audioURLMenuDiv").prepend('<select id="audioURLMenu"><option value="0">--SELECT AUDIO--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==21)&&(model.get('permissions')!=1)){ 

             this.$('#audioURLMenu').append('<option value="' + model.get("_id") + '" data-audio="snd/urls/' + model.get("_id") + '.mp3,21">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioUploadMenuDiv").prepend('<select id="audioUploadMenu"><option value="0">--SELECT AUDIO--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==22)&&(model.get('permissions')!=1)){ 
             this.$('#audioUploadMenu').append('<option value="' + model.get("_id") + '" data-audio="' + model.get("audio") + ',22">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#TTSMenuDiv").prepend('<select id="TTSMenu"><option value="0">--SELECT TTS--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==23)&&(model.get('permissions')!=1)){ 
             this.$('#TTSMenu').append('<option value="' + model.get("_id") + '" data-audio="snd/ttsdb/' + model.get("_id") + '.mp3,23">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioSentenceMenuDiv").prepend('<select id="audioSentenceMenu"><option value="0">--SELECT SENTENCE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==58)&&(model.get('permissions')!=1)&&(model.get('_id')!=this.phraseId)){ 
             this.$('#audioSentenceMenu').append('<option value="' + model.get("_id") + '" data-audio="snd/phrases/' + model.get("_id") + '.mp3,58">' + model.get("name") + '</option>');
            }
        }, this);
    }

});
window.PerformanceView2 = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});