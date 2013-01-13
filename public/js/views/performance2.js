window.PerformanceMasterHeaderView2 = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        if (!this.performanceHeaderView2) {
            this.performanceHeaderView2 = new PerformanceHeaderView2();
        }
        $(this.el).append(this.performanceHeaderView2.el);

        this.$("#performanceMenuDiv").prepend('<select id="performanceMenu"><option value="0">--START PERFORMANCE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==15)&&(model.get('permissions')!=1)){ 

             this.$('#performanceMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#livePerformanceMenuDiv").prepend('<select id="livePerformanceMenu"><option value="0">--JOIN PERFORMANCE--</option>');

        socket.emit('getRoomsList');
        socket.on('liveRoomslist', function (data){
            for(var i = 0; i < data.rooms.length; i++){
                var roomString = data.rooms[i];
                while(roomString.charAt(0) === '/')
                    roomString = roomString.substr(1);
                console.log(roomString);
                this.$('#livePerformanceMenu').append('<option>' + roomString + '</option>');
            }
        }.bind(this));
    },
     events: {
     
        "change #performanceMenu"           : "loadPerformance",
        "change #livePerformanceMenu"       : "livePerformance"
    },
    loadPerformance: function (e) {
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            console.log(val + " " + name);
            app.navigate('#performance2/15/' + val, true);

        }

    },
    livePerformance: function (e) {
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            console.log(val + " " + name);
            app.navigate('#performance2/0/' + val, true);

        }

    }

});
window.PerformanceHeaderView2 = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        $('#renderPerformance').hide();
        return this;
    }

});
window.PerformanceMasterView2 = Backbone.View.extend({

    initialize: function (options) {
        
        this.model.set(this.model.defaults);
        _.bindAll(this, 'render'
                        , 'sendNickname'
                        , 'connectNickname'
                        , 'bindSocketEvents'
                        , 'chatSubmit'
                        , 'insertMessage'
                        , 'buildVenue'
                        , 'joinPerformance'
                        , 'addRoom'
                        , 'addRoomShow'
                        , 'removeRoom'
                        , 'createRoom'
                        , 'addClient'
                        , 'removeClient'); //must bind before rendering
        
        this.render();
    },

    render: function (options) {
        if (!this.performanceView2) {
            this.performanceView2 = new PerformanceView2();
        }
        $(this.el).append(this.performanceView2.el);

        var performanceId = this.options.performanceId;
        var parentId = this.options.parentId;

        if (parentId == 15) {

            this.collection.each(function(model) {
                if(model.get('_id')==performanceId) 
                { 
                    this.model.set(model.attributes);
                }
            }, this);
            var rolesArray = this.model.get("rolelist");
            $('#legendTitle').empty().append('<legend>' + this.model.get("name") + "</legend>");
            //this.$('#chatDataDisplay').empty();
            this.$('#newPerformance').empty().append('<div class="control-group"><label for="name" class="control-label">Enter a New Performance Name:</label><div class="controls"><input type="text" id="addRoomInput"/><span class="help-inline"></span></div></div>');


            this.$("#newPerformance").append('<select id="performanceRoleMenu"><option value="0">--SELECT ROLE-</option>');

            for(var i =0; i<rolesArray.length;i++)
            {
                 this.collection.each(function(model) {
                    if(model.get('_id')==rolesArray[i]){
                        console.log("got the model yo"); 
                        this.$('#performanceRoleMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
                    }
                }, this);
            }

            this.$('#newPerformance').append('<div class="control-group"><label for="name" class="control-label">Enter a Nickname:</label><div class="controls"><input type="text" id="nicknameInput"/><span class="help-inline"></span></div></div><div class="form-actions"><a class="btn btn-primary" id="buildVenue">Enter New Venue</a></div>');
        }
        else {
            $('#legendTitle').empty().append('<legend>Joining ' + performanceId + "</legend>");
            this.$('#newPerformance').empty().append('<select id="performanceRoleMenu"><option value="0">--SELECT ROLE-</option>');
            this.$('#newPerformance').append('<div class="control-group"><label for="name" class="control-label">Enter a Nickname:</label><div class="controls"><input type="text" id="nicknameInput"/><span class="help-inline"></span></div></div><div class="form-actions"><a class="btn btn-primary" id="joinPerformance">Join Performance</a></div>');
        }

        this.$("#renderPerformance").hide();
        this.model.set("serverDisplayName", "telebrain");

        

        return this;
    },
    
    events: {
     
        "click #buildVenue"         : "buildVenue",
        "click #joinPerformance"    : "joinPerformance",
        "click #sendNickname"       : "sendNickname",
        "click #chatSubmit"         : "chatSubmit",
        "click #addRoomBtn"         : "addRoomShow",
        "click #createRoom"         : "createRoom",
        "change #roomSelect"         : "changeRoom",
        "scroll .chat-venues select" : "roomScroll",
        "scroll .chat-messages"      : "messageScroll" 
    },
    buildVenue: function() {
        //PARSE FORM ARGUMENTS THEN INSTANTIATE VENUE
        var perfName = $('#addRoomInput').val();
        var roleId = $('#performanceRoleMenu').val();
        var roleName = $('#performanceRoleMenu').find('option:selected').text();
        var nick = $('#nicknameInput').val();   
        console.log("name " + perfName + " role " + roleId + " " + roleName + " nick " + nick);
        this.model.set({"performanceName": perfName, "nickname": nick, "playerRole": roleName, "playerRoleId": roleId });

        if(nick && nick.length <= 15){ 
            this.connectNickname();
            console.log("SENDING NICKNAME: " + nick); 
        }
        else{
            //throw error
        }

    },
    joinPerformance: function() {
        console.log('joining performance');
        //PARSE FORM ARGUMENTS THEN INSTANTIATE VENUE

//NEED TO GET PERFORMANCE _id from SERVER to generate roles and store model
//ALSO DEAL WITH NAVIGATING AWAY - DISCONNECTING
//AND JOINING A ROOM RIGHT AS THE LAST PERSON IS LEAVING . . .

        /*var perfName = $('#addRoomInput').val();
        var roleId = $('#performanceRoleMenu').val();
        var roleName = $('#performanceRoleMenu').find('option:selected').text();
        var nick = $('#nicknameInput').val();   
        console.log("name " + perfName + " role " + roleId + " " + roleName + " nick " + nick);
        this.model.set({"performanceName": perfName, "nickname": nick, "playerRole": roleName, "playerRoleId": roleId });

        if(nick && nick.length <= 15){ 
            this.connectNickname();
            console.log("SENDING NICKNAME: " + nick); 
        }
        else{
            //throw error
        }*/

    },
    sendNickname: function() {
               
        var nick = $('#nicknameInput').val().trim();
        console.log("clicked nickname");
        if(nick && nick.length <= 15){   //arbitrary restriction - for layout purposes I suppose
            nickname = nick;
            $('#nickname').hide();
            $('#addRoom').hide();
            this.connectNickname();
            console.log("SENDING NICKNAME: " + nickname); 
        } else {
            this.shake('#nickname-popup', '#nickname-popup .input input', 'tada', 'yellow');
            $('#nickname-popup .input input').val('');
        }

    },
    connectNickname: function(){

        // show connecting message
        //$('.chat-shadow .content').html('Connecting...');
        
        // creating the connection and saving the socket
        //socket = io.connect(serverAddress);
        socket.emit("saveSocket", 'http://localhost', this.model.get("performanceName"));
        // now that we have the socket we can bind events to it
        this.bindSocketEvents();
    },
    bindSocketEvents: function() {

        var nickname = this.model.get("nickname");
        // when the connection is made, the server emiting
        // the 'connect' event
        socket.on('connect', function(){
            // firing back the connect event to the server
            // and sending the nickname for the connected client
            console.log("nickname " + nickname);
            socket.emit('connect', { nickname: nickname });
        }.bind(this));
        
        // after the server created a client for us, the ready event
        // is fired in the server with our clientId, now we can start 
        socket.on('ready', function(data){
            // hiding the 'connecting...' message
            //$('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
                //$(this).hide();
                //$('.chat input').focus();

            //});
            console.log("socket ready and clientID: " + data.clientId);
            // saving the clientId localy
            this.model.set("clientId", data.clientId);
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
            
            //display the message in the chat window
            this.insertMessage(nickname, message, true, false, false);
        }.bind(this));
        
        // when we subscribes to a room, the server sends a list
        // with the clients in this room
        socket.on('roomclients', function(data){
            
            // add the room name to the rooms list
            this.addRoom(data.room, false);

            // set the current room
            this.setCurrentRoom(data.room);
            
            // announce a welcome message
            $("#newPerformance").empty();
            $("#renderPerformance").show();
            $('#legendTitle').empty().append("<legend>" + data.room + "   (LIVE)</legend>");
            this.insertMessage(this.model.get("serverDisplayName"), 'The <b>"' + data.room + '"</b> Performance has begun!', true, false, true);
            $('.chat-clients ul').empty();
            
            var nickname = this.model.get("nickname");
            var clientId = this.model.get("clientId");
            // add the clients to the clients list
            this.addClient({ nickname: nickname, clientId: clientId }, false, true);
            for(var i = 0, len = data.clients.length; i < len; i++){
                if(data.clients[i]){
                    this.addClient(data.clients[i], false);
                }
            }

            // hide connecting to room message message
            $('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
                $(this).hide();
                $('.chat input').focus();
            });
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

        var message = $('#composeMessage').val().trim();
        if(message){

            // send the message to the server with the room name
            socket.emit('chatmessage', { message: message, room: currentRoom });
            var nickname = this.model.get("nickname");
            // display the message in the chat window
            this.insertMessage(nickname, message, true, true);
            $('#composeMessage').val('');
        } else {
            this.shake('.chat', '.chat input', 'wobble', 'yellow');
        }

        //handleMessage();
        
        //composeMessage
    },
    insertMessage: function(sender, message, showTime, isMe, isServer){
        
        var time = showTime ? getTime() : '';
        var htmlString = '<li class="cf"><div class="fl sender">' + sender + ': </div><div class="fl text">' + message + '</div><div class="fr time">' + time + '</div></li>';
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
        $('.chat-messages ul').append(htmlString);
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

            if(announce){
                this.insertMessage(this.model.get("serverDisplayName"), 'The room `' + room + '` created...', true, false, true);
            }
        }
    },
    removeRoom: function (name, announce){
        $('.chat-venues select option[value="' + name + '"]').remove();

        if(announce){
            this.insertMessage(this.model.get("serverDisplayName"), 'The room `' + name + '` destroyed...', true, false, true);
        }
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
            this.shake('#addroom-popup', '#addroom-popup .input input', 'tada', 'yellow');
            $('#addroom-popup .input input').val('');
        }
    },
    addClient: function (client, announce, isMe){
        var htmlString = '<li data-clientId="' + client.Id + '"><div class="fl"> ' + client.nickname + '</div></li>';
        //var $html = $.tmpl(tmplt.client, client);
        
        // if this is our client, mark him with color
        if(isMe){
            htmlString = '<div class="me">' + htmlString + '</div>';
        }

        // if announce is true, show a message about this client
        if(announce){
            this.insertMessage(this.model.get("serverDisplayName"), client.nickname + ' has joined the room...', true, false, true);
        }
        $('.chat-clients ul').append(htmlString);
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
    changeRoom: function(e){

        var room = $(e.currentTarget).val();
        console.log(room);
        var name = $(e.currentTarget).find('option:selected').text();
            //var room = $(e.currentTarget).find('option:selected').data('roomId');
            console.log(name + " " + room);
        var currentRoom = this.model.get("currentRoom");
        console.log("room from room list: " + room);
        console.log("currentRoom: " + currentRoom);
        if(room != currentRoom){
            socket.emit('unsubscribe', { room: currentRoom });
            this.model.set("currentRoom", room);
            socket.emit('subscribe', { room: room });
        }
    },
    shake: function (container, input, effect, bgColor){
            utils.showAlert('oops!', 'somethings wrong', 'alert-danger');
            lockShakeAnimation = true;
            $(container).addClass(effect);
            $(input).addClass(bgColor);
            window.setTimeout(function(){
                $(container).removeClass(effect);
                $(input).removeClass(bgColor);
                $(input).focus();
                lockShakeAnimation = false;
            }, 1500);

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