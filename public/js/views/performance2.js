window.PerformanceMasterView2 = Backbone.View.extend({

    initialize: function (options) {

        socket.removeAllListeners("clientDataExists");
        socket.removeAllListeners("clientDataDoesNotExist");
        socket.removeAllListeners("liveRoomslist2");
        socket.removeAllListeners('ready'); 
        socket.removeAllListeners('getClientId');
        socket.removeAllListeners('reconnectPerformance');
        socket.removeAllListeners('readyToPerform');
        socket.removeAllListeners('ttsmessage'); 
        socket.removeAllListeners('leftPerformance');
        socket.removeAllListeners('audiomessage');
        socket.removeAllListeners('updateRoomclients');
        socket.removeAllListeners('imagemessage');
        socket.removeAllListeners('roomslist'); 
        socket.removeAllListeners('textmessage');
        socket.removeAllListeners('roomclients');
        socket.removeAllListeners('presence');
        socket.removeAllListeners('clientsInRoom');
        socket.removeAllListeners('fragmentmessage');
        socket.removeAllListeners('fractionmessage');
        
        var performanceId = this.options.performanceId;
        var parentId = this.options.parentId; 
        var client;

        _.bindAll(this, 'render'
                        , 'bindSocketEvents'
                        , 'textSubmit'
                        , 'insertMessage'
                        , 'textReceive'
                        , 'saveSocket'
                        , 'joinPerformance'
                        , 'reJoinPerformance'
                        , 'addRoom'
                        , 'readySoRender'
                        , 'addRole'
                        , 'validateJoin'
                        , 'beforeSave'
                        , 'checkRoomName'
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

            console.log("initialize default program model : " + JSON.stringify(programModel, null, 2));

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

            console.log("initialize new performance program : " + JSON.stringify(this.model, null, 2));

            this.render();
        }
        else {
            this.model.set("performanceId", performanceId)
            this.model.set("joinFlag", 0);

            this.collection.each(function(model) {
                    if(model.get('_id')==this.model.get("performanceId")) 
                    { 
                        this.model.set(model.attributes);
                    }
            }, this);

            socket.emit("doesClientDataExist");
            this.bindSocketEvents();
        }
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

            this.$('#newPerformance').append('<div class="control-group"><label for="performanceName" class="control-label">Enter a New Performance Name:</label><div class="controls"><input type="text" name="livePerformanceName" id="addRoomInput"/><span class="help-inline"></span></div></div><div class="alert alert-success" style="display: none"></div><div class="form-actions"><a class="btn btn-primary" id="buildVenue">Create New Venue</a></div>');
        }
        else {
            
            var rolesArray = this.model.get("programRolelist");

            $('#legendTitle').empty().append('<legend>Joining ' + this.model.get("performanceName") + "</legend>");
            this.$("#newPerformance").append('<select id="performanceRoleMenu" name="playerRoles"><option value="0">--SELECT ROLE-</option>');

            for(var i =0; i<rolesArray.length;i++)
            {
                 this.collection.each(function(model) {
                    if(model.get('_id')==rolesArray[i]){
                        this.$('#performanceRoleMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
                    }
                }, this);
            }

            this.$('#newPerformance').append('<div class="control-group"><label for="nicknames" class="control-label">Enter a Nickname:</label><div class="controls"><input type="text" name="nicknames" id="nicknameInput"/><span class="help-inline"></span></div></div><div class="alert alert-success" style="display: none"></div><div class="form-actions"><a class="btn btn-primary" id="joinPerformance">Join Performance</a></div>');
        }
        this.$('newPerformance').append('<div id="sentenceAlert" class="alert" style="display: none"></div></div></div></fieldset></form></div>');
        this.$("#renderPerformance").hide();
        this.model.set("serverDisplayName", "telebrain");  

        return this;
    },
    
    events: {
     
        "click #buildVenue"             : "checkRoomName",
        "click #joinPerformance"        : "validateJoin",
        "click #textSubmit"             : "textSubmit",
        "click #TTSSubmit"              : "TTSSubmit",
        "scroll .chat-venues select"    : "roomScroll",
        "scroll .chat-messages"         : "messageScroll",
        "change #addRoomInput"          : "change",
        "change #nicknameInput"         : "change",
        "change #imageURLMenu"          : "updateImage",
        "change #imageUploadMenu"       : "updateImage",
        "change #telepromptMenu"        : "updateImage",
        "change #imagePhraseMenu"       : "updateImage",
        "change #audioURLMenu"          : "updateAudio",
        "change #audioUploadMenu"       : "updateAudio",
        "change #TTSMenu"               : "updateAudio",
        "change #audioSentenceMenu"     : "updateAudio",
        "change #fragmentMenu"          : "updateFragment",
        "change #fractionMenu"          : "updateFraction",
        "click #rolesCheckboxes input[type='checkbox']"         : "setSendToRole",
        "click #performerCheckboxes input[type='checkbox']"     : "setSendToPerformer",
        "change #performanceRoleMenu"                           : "change",
        "change #ttsLanguage"           : "setLanguage"

    },
    beforeLeaving: function() {
        console.log("leaving page");
    },
    checkRoomName: function() {
        var perfName = $('#addRoomInput').val();
        var venueFlag = 1; 
        console.log("Check Venue named " + perfName);
        socket.emit('getRoomsList2');
        socket.on('liveRoomslist2', function (data){
            for(var i = 1; i < data.rooms.length; i++){

                var roomString = data.rooms[i];
                console.log("list rooms: " + data.rooms[i]);
                while(roomString.charAt(0) === '/')
                    roomString = roomString.substr(1);
                console.log(roomString + " == " + perfName);

                if (roomString == perfName) {

                    venueFlag=0;
                    console.log("totally equal dude " + venueFlag);
                }
            }
            this.collection.each(function(model) {
                if(perfName == model.get("performanceName") ){
                    venueFlag=0;
                }
            }, this);
            console.log("venue " + venueFlag);
            if (venueFlag == 0) {
                 utils.showAlert('Oops', 'This Name is Already in Use', 'alert-info');
            }
            else {
                this.model.set("performanceName", perfName);
                this.beforeSave();
            }
        }.bind(this));
    },
    beforeSave: function () {

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
        this.model.save(null, 
            {
            success: function (model) {
                //self.render();
                app.navigate('performance2/' + model.get("parent_id") + '/' + model.get('_id'), true);
                utils.showAlert('Success!', 'Phrase saved successfully', 'alert-success');

            },
            error: function () {
                utils.showAlert('Error', 'Venue name already exists. Try and new venue name.', 'alert-error');
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
        utils.hideAlert();

        var target = event.target;
        var change = {};
        change[target.name] = target.value;

        this.model.set(change);

        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },
    saveSocket: function() {
        console.log("buildingVenue");
        var performanceName = this.model.get("performanceName");
        var performanceId = this.model.get("_id");

        console.log("saveNewSocket: " + performanceName + " id: " + performanceId);

        socket.emit("saveNewSocket", performanceName, performanceId);
        
        //this.bindSocketEvents();
    },
    validateJoin: function () {

        var performanceName = this.model.get("performanceName");
        var roleVal = $('#performanceRoleMenu').val();
        var nickname = $('#nicknameInput').val();
        console.log("validating join role id: " + roleVal + " and nickname " + nickname + " in room name " + performanceName);
        var clientFlag = 1; 

        if (roleVal != 0) {

            socket.emit('getClientsInRoom', performanceName);
            socket.on('clientsInRoom', function (data){
                console.log("# of clients retrieved " + data.length);
                for(var i = 0; i < data.length; i++){
                    console.log("list clients: " + data[i]);
                    
                    if (nickname == data[i]) {

                        clientFlag=0;
                        console.log("totally equal dude " + clientFlag);
                    }
                }
                console.log("client flag " + clientFlag);
                if (clientFlag == 0) {
                     utils.showAlert('Oops', 'This nickname is Already in Use', 'alert-info');
                }
                else {
                    var self = this;
                    var check = this.model.validateAll();
                    if (check.isValid === false) {
                        utils.displayValidationErrors(check.messages);
                        return false;
                    }
                    this.joinPerformance();
                }
            }.bind(this));
        }
        else {
            console.log("show error");
            utils.showAlert('Ooops', 'A role must be selected before joining the performance', 'alert-info');
        }
    },
    joinPerformance: function() {

        var nickname = $('#nicknameInput').val(); 
        var performanceName = this.model.get("performanceName");
        var performanceTypeId = this.model.get("_id"); 
        var playerRoleId = $('#performanceRoleMenu').val();
        var playerRole = $('#performanceRoleMenu').find('option:selected').text();

        this.model.set("client", { "nickname": nickname, "roleName": playerRole, "roleId": playerRoleId, "room": performanceName, "roomId": performanceTypeId});

        var client = this.model.get("client");

        console.log('joining performance: ' + performanceName);

        socket.emit("joinRoomSocket", client);

    },
    reJoinPerformance: function() {
        if (!this.performanceView2) {
            this.performanceView2 = new PerformanceView2();
        }
        $(this.el).append(this.performanceView2.el);

        var performanceName = this.model.get("performanceName");
        var performanceTypeId = this.model.get("_id"); 

        var client = this.model.get("client");

        console.log("initialize default program model : " + JSON.stringify(client, null, 2));

        console.log('client id: ' + client.clientId + ' reJoining performance ' + performanceName);

        socket.emit("reJoinRoomSocket", client);
    },
    updateSocket: function() {
        
        var client = this.model.get("client");
        this.insertMessage(this.model.get("serverDisplayName"), '<b>"' + client.nickname + '"</b> updating socket.', true, false, true);
        socket.emit("clientConnect", client);
        //app.navigate('performance2/99/' + client.performanceId, true);
         
    },

    bindSocketEvents: function() {

        socket.on("clientDataExists", function (client) {
            this.model.set("client", client);
            this.model.set("joinFlag", 1);
            this.model.set("sendRoleList", ["All"]);
            console.log("join flag: " + this.model.get("joinFlag"));
            this.reJoinPerformance();
        }.bind(this)); 

        socket.on("clientDataDoesNotExist", function (client) {
            var joinFlag = this.model.get("joinFlag");
            console.log("join flag: " + joinFlag);

            //first join socket established
            if (joinFlag == 0) {

                console.log("joining performance : " + JSON.stringify(this.model, null, 2));
                this.saveSocket();
            }
            this.model.set("sendRoleList", ["All"]);
        }.bind(this));
        
        socket.on('ready', function(){
            console.log("socket and venue ready");
            this.render();
        }.bind(this));

        socket.on("getClientId", function(){
            console.log("updating socket");
            this.updateSocket();
        }.bind(this));

        socket.on("reconnectPerformance", function (client){
            this.model.set("client", client);
            this.readySoRender(client);
            console.log("testingReconnect : " + JSON.stringify(client, null, 2));
        }.bind(this));

        socket.on("reconnectNewSocket", function (client){
            this.model.set("client", client);
            //this.addRole();
            //this.readySoRender(client);
            //console.log("testingReconnect : " + JSON.stringify(client, null, 2));
        }.bind(this));
        
        socket.on('readyToPerform', function (data){
            
            var client = this.model.get("client");

            client.clientId = data.clientId;

            this.model.set("client", client);

            this.readySoRender(client);
            console.log("testingReadyToPerform : " + JSON.stringify(client, null, 2));

        }.bind(this));

        socket.on('leftPerformance', function () {
            console.log("left performance");
            app.navigate('performance2', true);
        }.bind(this));


        // after the initialize, the server sends a list of
        // all the active rooms
        socket.on('roomslist', function(data){

            console.log("roomslist " + data);
            for(var i = 0, len = data.rooms.length; i < len; i++){
                // in socket.io, their is always one default room
                // without a name (empty string), every socket is automaticaly
                // joined to this room, however, we don't want this room to be
                // displayed in the rooms list
                if(data.rooms[i] != ''){
                    this.addRoom(data.rooms[i]);
                }
            }
        }.bind(this));

        socket.on('textmessage', function(data){
            var nickname = data.client.nickname;
            var message = data.message;

            console.log(nickname + " chatmessage " + message)

            this.textReceive(nickname, message);
            
            this.insertMessage(nickname, message, true, false, false);
        }.bind(this));
        
        socket.on('roomclients', function(data){
            console.log("room clients " + JSON.stringify(data, null, 2));
            $("#newPerformance").empty();
            this.addRole();
            $('#legendTitle').empty().append("<legend>" + data.room + "   (LIVE)</legend>");
            this.insertMessage(this.model.get("serverDisplayName"), 'The <b>"' + data.room + '"</b> Performance has begun!', true, false, true);
        
        }.bind(this));

        socket.on('updateRoomclients', function(clients){

            $('.chat-clients ul').empty();
            for(var i = 0, len = clients.length; i < len; i++){
                console.log(clients[i].clientId);
                if(clients[i]){
                    this.addClient(clients[i]);
                }
            }
        }.bind(this));

        socket.on('fragmentmessage', function (data){
            console.log("fragment receive socket");
            console.log("fragment message : " + JSON.stringify(data, null, 2));
            var dataInfo = data.fragmentData;
            var dataArray = dataInfo.split(',');
            console.log("data info " + dataArray[1]);

            if((dataArray[1]==19)||(dataArray[1]==18)||(dataArray[1]==17)){
                this.showImage(dataInfo);
            }
            else if((dataArray[1]==21)||(dataArray[1]==22)||(dataArray[1]==23)||(dataArray[1]==58)){
                var audio = dataInfo.split(',');        
                playAudio(audio[[0]]);
            }
            this.insertMessage(data.client.nickname, "fragment: " + data.fragmentName + " content: " + data.contentName, true, false, false);
            
        }.bind(this));

        socket.on('clientsByRole', function (nicknameArray, fractionData){
            console.log("clients by role receive socket");
            console.log("fraction message : " + nicknameArray);
            this.sendFraction(nicknameArray, fractionData);
            
        }.bind(this));

        socket.on('fractionmessage', function (data){
            //{ client: client, fractionName: data.fractionName, contentName: data.contentName, contentId: data.clientId }
            console.log("fraction receive socket");
            console.log("fraction message : " + JSON.stringify(data, null, 2));
            this.insertMessage(data.client.nickname, "fraction: " + data.fractionName + " content: " + data.contentName, true, false, false);
            this.parseAudioImagePair(data.contentId);
        }.bind(this));

        socket.on('presence', function(data){

            console.log("presence " + data.client.nickname + " in state " + data.state);
            if(data.state == 'online'){
                this.insertMessage(this.model.get("serverDisplayName"), '<b>"' + data.client.nickname + '"</b> has joined the performance', true, false, true);
            } else if(data.state == 'offline'){
                this.insertMessage(this.model.get("serverDisplayName"), '<b>"' + data.client.nickname + '"</b> has left the performance', true, false, true);
            } else if(data.state == 'reconnect'){
                this.insertMessage(this.model.get("serverDisplayName"), '<b>"' + data.client.nickname + '"</b> has reconnected', true, false, true);
            } else if(data.state == 'safeDisconnect'){
               // this.insertMessage(this.model.get("serverDisplayName"), '<b>"' + data.client.nickname + '"</b> has left the performance', true, false, true);
            }
        }.bind(this));
    },
    readySoRender: function(data){
        $("#renderPerformance").show();
        console.log("render Performance GO!");
        var audioFlag = 0;

        this.collection.each(function(roleModel) {
            if(roleModel.get('_id')==data.roleId) {
                console.log("render role model: " + JSON.stringify(roleModel, null, 2));
                if (roleModel.get("showMenu")=="checked"){
                    $('#bottomHeader').append('<div id="performanceHeader"></div>');
                    console.log("show menu yes");
                }
                else {  
                    $('#bottomHeader').empty().append('<div id="performanceHeader"></div>');
                    console.log("text send no");
                }
                if (roleModel.get("showTitle")=="checked"){
                    console.log("show title yes");
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
                    $('#ttsLanguages').show();
                    $("#TTSSend").show();
                }
                else {  
                    $("#TTSSend").hide();
                    $('#ttsLanguages').hide();
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
                if (roleModel.get("fragmentSend")=="checked"){
                    console.log("fragment send yes");
                    $("#fragmentSend").show();
                    this.$('#fragmentSend').empty().append('<div id="fragmentMenuDiv"></div>'); 
                    this.renderFragmentMenu();
                }
                else {  
                    $("#fragmentSend").hide();
                    console.log("fragment send no");
                }
                if (roleModel.get("fractionSend")=="checked"){
                    console.log("fraction send yes");
                    $("#fractionSend").show();
                    this.$('#fractionSend').empty().append('<div id="fractionMenuDiv"></div>'); 
                    this.renderFractionMenu();
                }
                else {  
                    $("#fractionSend").hide();
                    console.log("fraction send no");
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
                    audioFlag = 1;
                    //$("#TTSReceive").show();
                    socket.on('ttsmessage', function (data) {
                        var nickname = data.client.nickname;
                        var audio = data.message;
                        var ttsContents = data.ttsContents;
                        this.insertMessage(nickname, "text-to-speech audio: " + ttsContents, true, false, false);
                        console.log("TTS received: " + audio + " " + ttsContents);
                        playAudio(audio);
                    }.bind(this));
                }
                else {  
                    //$("#TTSReceive").hide();
                    console.log("TTS is not enabled");
                }
                if (roleModel.get("imageReceive")=="checked"){
                    console.log("image receive yes");
                    $("#imageReceive").show();
                    socket.on('imagemessage', function (data) {
                        console.log("imagemessage received " + data.message);
                        var nickname = data.client.nickname;
                        var message = data.message;
                        var imageName = data.imageName;
                        this.insertMessage(nickname, "show image: " + imageName, true, false, false);
                        this.showImage(message);
                    }.bind(this));
                }
                else {  
                    $("#imageReceive").hide();
                    console.log("image receive no");
                }
                if (roleModel.get("audioReceive")=="checked"){
                    console.log("audio receive yes");
                    audioFlag = 1;
                    //$("#audioReceive").show();
                    socket.on('audiomessage', function (data) {
        
                        var nickname = data.client.nickname;
                        var message = data.message;
                        var audioName = data.audioName;
                        var audio = message.split(',');
                        this.insertMessage(nickname, "play audio: " + audioName, true, false, false);
                        console.log("play audio from " + nickname + " name " + audioName + " data " + audio);
                        playAudio(audio[[0]]);
                    }.bind(this));
                }
                else {  
                    //$("#audioReceive").hide();
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
        console.log("audio flag is " + audioFlag);
        if(audioFlag ==1){
            $('#performanceHeader').empty().append('<div id="audioReminder"><a id="leavePerformance"><i class="icon-remove"></i> Leave Performance</a>&nbsp;&nbsp;<a id="audioPerformanceToggle" style="color: black;"><i class="icon-volume-up audio-black"></i> Audio Required</a></div>');
        }
        else {
            $('#performanceHeader').empty().append('<a id="leavePerformance"><i class="icon-remove"></i> Leave Performance</a>');
        }
    },
    textSubmit: function() {
        utils.hideAlert();
        
        var message = $('#composeTextMessage').val().trim();

        var sendRoleList = this.model.get("sendRoleList");
        var sendPerformerList = this.model.get("sendPerformerList");
        console.log("send message to " + sendRoleList + " " + sendPerformerList);
        
        if((message)&&((sendRoleList.length!=0)||(sendPerformerList!=0)))
        {
            socket.emit('textmessage', { message: message, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList});
            $('#composeTextMessage').val('');
        } else {
            //throw error
        }
    },
    setLanguage: function(e) {
        var ttsLanguage = $(e.currentTarget).val();
        console.log(ttsLanguage);
        this.model.set("language", ttsLanguage);
    },
    TTSSubmit: function() {
        utils.hideAlert();
        console.log("SEND THAT CHAT MESSAGE");
        var currentRoom = this.model.get('currentRoom');

        var message = $('#composeTTSMessage').val().trim();

        var sendRoleList = this.model.get("sendRoleList");
        var sendPerformerList = this.model.get("sendPerformerList");
        var language = this.model.get("language");
        
        if((message)&&((sendRoleList.length!=0)||(sendPerformerList!=0)))
        {

            // send the message to the server with the room name
            //socket.emit('chatmessage', { message: message, room: currentRoom, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList});
            //var nickname = this.model.get("nickname");
            // display the message in the chat window
            var googleTts = new GoogleTTS(language);
                var urlString = googleTts.url(message, language);
                console.log("Speak URL: " + urlString);
                socket.emit("ttsmessage", { message: urlString, ttsContents: message, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList });

           // var client = this.model.get("client");
           // this.insertMessage(client.nickname, message, true, true);
            $('#composeMessage').val('');
        } else {
            //throw error
        }
        $('#composeTTSMessage').val('');
        //handleMessage();
        
        //composeMessage
    },
    textReceive: function(sender, message){
        var textMessage = '<b>' + sender + ': </b>' + message;
        var textToggle = this.model.get("textToggle");
        console.log("text toggle " + textToggle);
        if (textToggle==0) {
            textMessage = '<li><div class="textMessage-positive">' + textMessage + '</div></li>';
            this.model.set("textToggle", 1);
        }
        else {
            textMessage = '<li><div class="textMessage-negative">' + textMessage + '</div></li>';
            this.model.set("textToggle", 0);
        }
        console.log("text message " + textMessage);
        $('.text-receive ul').prepend(textMessage);
        //this.renderMessageTemplate(sender, message, time);
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
    addRoom: function(room){

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
        }
    },
    addClient: function (client){
        var me = this.model.get("client");
        console.log("add me " + JSON.stringify(me, null, 2));
        console.log("add client: " + client.nickname + " is me? " + me.nickname);
        var clientName = client.nickname;
        var clientPrintName = client.nickname;
        var clientId = client.clientId;
        var clientRole = client.roleName;

        if(clientName == me.nickname){
            console.log("this is me");
            clientName = client.nickname;
            clientPrintName = '<font style="color:#FF0000;">ME: ' + me.nickname + '</font>';
            clientId = me.clientId;
            clientRole = me.roleName;
        }
        
        var htmlString = '<li data-clientId="' + clientId + '"><div id="performerCheckboxes" class="form-horizontal"><label class="checkbox"><input type="checkbox" id="' + clientName + '" onclick="$(this).val(this.checked ? 1 : 0)">  <b>' + clientPrintName + '</b> (' + clientRole + ')</lable></div></li>';
        
        $('.chat-clients ul').append(htmlString);
    },
    addRole: function (){
        
        console.log("Making List of Roles");

        var rolesArray = this.model.get("programRolelist");
        console.log(JSON.stringify(this.model, null, 2));
        this.$('.chat-roles ul').empty();
        this.$('.chat-roles ul').append('<li id"sendToAll"><div id="rolesCheckboxes" class="form-horizontal"><label class="checkbox"><input type="checkbox" id="All" onclick="$(this).val(this.checked ? 1 : 0)" checked>  <b>ALL</b></lable></div></li>');


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
            
            var sendRoleList = this.model.get("sendRoleList");
            var sendPerformerList = this.model.get("sendPerformerList");

            if((updateImage)&&((sendRoleList.length!=0)||(sendPerformerList!=0)))
            {
                console.log("sending image: " + updateImage + " to " + sendRoleList + " " + sendPerformerList);
                socket.emit('imagemessage', { message: updateImage, imageName: name, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList});
            }
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
            
            var sendRoleList = this.model.get("sendRoleList");
            var sendPerformerList = this.model.get("sendPerformerList");

            console.log('send audio ' + updateAudio + " to " + sendRoleList + " " + sendPerformerList);

        
            if((updateAudio)&&((sendRoleList.length!=0)||(sendPerformerList!=0)))
            {
                socket.emit('audiomessage', { message: updateAudio, audioName: name, sendRoleList: sendRoleList, sendPerformerList: sendPerformerList});
            }
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    updateFragment: function(e) {
        
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var fragmentData =  this.model.get(val);

            console.log("FRAGMENT : " + JSON.stringify(fragmentData, null, 2));

            for (var key in fragmentData) {
                var sendRoleList = fragmentData[key].roleName;

                var dataInfo = fragmentData[key].dataInfo;

                var contentName = fragmentData[key].contentName;

                socket.emit('fragmentmessage', { fragmentData: dataInfo, fragmentName: name, contentName: contentName, sendRoleList: sendRoleList });
            }
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    updateFraction: function(e) {
        
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var fractionData =  this.model.get(val);
            var roleId = $(e.currentTarget).find('option:selected').data('role');
            var roleName = "";
            var fractionCount = 0;
            this.collection.each(function(model) {

                if(model.get('_id')==roleId){
                    roleName = model.get("name");
                }
            }, this);
            console.log("FRACTION : " + roleId + " " + roleName);
            for (var key in fractionData) {
                fractionCount++;
            }
            socket.emit("getClientsByRole", { fractionId: val, fractionData: fractionData, fractionName: name, contentName: fractionData.contentName, roleName: roleName, fractionNumber: fractionCount });
        }
    },
    parseAudioImagePair: function (contentId) {
        var image = {};
        var audio = {};
        this.collection.each(function(model) {

            if(model.get('_id')==contentId){
                image = model.get("imageData");
                audio = model.get("audio");
            }
        }, this);
        var imageString = image.image + "," + image.type;
        
        if (image.type==19){
            imageString = imageString + "," + image.name + "," + image.font + "," + image.color + "," + image.bgcolor + "," + image.size;
        }
        playAudio(audio.audio);
        this.showImage(imageString);
    },
    sendFraction: function(nicknameArray, data) {
        
        if (nicknameArray.length != 0) {
            var name = data.fractionName;
            var fractionData =  data.fractionData;
            var fractionCount = data.fractionNumber;
            performersPerFraction = Math.ceil(nicknameArray.length / fractionCount);

            console.log("performers per fraction " + performersPerFraction + " nicknamelistlength " + nicknameArray.length);
            var fractionCount = nicknameArray.length;
            var j = 0;
            for (var key in fractionData) {

                var contentName = fractionData[key].contentName;

                var contentId = fractionData[key].contentId;

                var groupArray = [];

                offset = j*performersPerFraction;
                for( var i=0; i<performersPerFraction; i++){
                    if(nicknameArray[i+offset]!=undefined) {

                        groupArray.push(nicknameArray[i+offset]);
                    }
                }
                j++;

                console.log(groupArray);

                socket.emit('fractionmessage', { groupArray: groupArray, fractionName: name, contentId: contentId, contentName: contentName});
            }
            $("#fractionMenu")[0].selectedIndex = 0;
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
    },
    renderFragmentMenu: function() {
         
       console.log("render fragment menu");
       this.$("#fragmentMenuDiv").prepend('<select id="fragmentMenu"><option value="0">--SELECT FRAGMENT--</option>');

        this.collection.each(function(model) {

            if((model.get('parent_id')==50)&&(model.get('permissions')!=1)){
                this.model.set(model.get("_id"), model.get("fragmentList"));
                this.$('#fragmentMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);
    },
    renderFractionMenu: function() {
         
       console.log("render fraction menu");
       this.$("#fractionMenuDiv").prepend('<select id="fractionMenu"><option value="0">--SELECT FRACTION--</option>');

        this.collection.each(function(model) {

            if((model.get('parent_id')==51)&&(model.get('permissions')!=1)){
                this.model.set(model.get("_id"), model.get("fractionlist"));
                this.$('#fractionMenu').append('<option value="' + model.get("_id") + '" data-role="' + model.get("role") + '">' + model.get("name") + '</option>');
            }
        }, this);
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