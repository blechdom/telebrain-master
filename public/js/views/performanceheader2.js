window.PerformanceMasterHeaderView2 = Backbone.View.extend({

    initialize:function () {
        this.model.set("liveMenuFlag", 0);
        socket.removeAllListeners("registeredPerformer");
        socket.removeAllListeners("unregisteredPerformer");
        socket.removeAllListeners('liveRoomslist'); 
        socket.removeAllListeners('updateRoomslist');
        socket.removeAllListeners('compareNewRoomslist');

        _.bindAll(this, 'render'
                        , 'bindSocketEvents'
                        , 'registeredPerformer'
                        , 'unregisteredPerformer'
                        , 'livePerformance'
                        , 'updateRoomsList'
                        , 'makeLivePerformanceMenu'
                        , 'compareNewRoomsList'
                        , 'loadPerformance'); //must bind before rendering

        this.render();
    },

    render:function () {

        socket.emit("checkForClientData");
        this.bindSocketEvents();

    },
    events: {
     
        "change #performanceMenu"           : "loadPerformance",
        "change #livePerformanceMenu"       : "livePerformance",
        "click #joinCurrentPerformance"     : "joinCurrentPerformance",
        "click #createNewPerformance"       : "createNewPerformance"
    },
    bindSocketEvents: function() {

        socket.on("registeredPerformer", this.registeredPerformer.bind(this));
        
        socket.on("unregisteredPerformer", this.unregisteredPerformer.bind(this));  

        socket.on('liveRoomslist', this.makeLivePerformanceMenu.bind(this));

        socket.on('updateRoomslist', this.updateRoomsList.bind(this));

        socket.on('compareNewRoomslist', this.compareNewRoomsList.bind(this));

    },
    registeredPerformer: function(client) {
        $('#startPerformanceDiv').empty();

            console.log("REGISTERED PERFORMER " + client.nickname);

            this.model.set("client", client);

            if (!this.PerformanceHeaderAlert) {
                this.performanceHeaderAlert = new PerformanceHeaderAlert();
            }
            $(this.el).append(this.performanceHeaderAlert.el);

    },
    unregisteredPerformer: function() {
        $('#startPerformanceAlertDiv').empty();

            console.log("UNREGISTERED PERFORMER");

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

            socket.emit('getRoomsList');

    },
    updateRoomsList: function(data) {
        console.log("updating rooms");
        var addRoomFlag = 1;
        var roomsList = this.model.get("roomsList");
        var liveMenuFlag = this.model.get("liveMenuFlag");
        console.log("liveMenuFlag " + liveMenuFlag);
        if (liveMenuFlag == 0) {
            this.$("#joinLivePerformance").prepend('<label for="name" class="control-label">Join Live Performance:</label><div class="controls"><div id="livePerformanceMenuDiv"><select id="livePerformanceMenu"><option value="0">--JOIN PERFORMANCE--</option>');
        }
        for(var i =0; i< roomsList.length; i++){
            if (roomsList[i] == data.room){
                addRoomFlag = 0;
            }
        }
        if (addRoomFlag == 1){
            console.log("updatingRoomsList with " + data.room);
            this.$('#livePerformanceMenu').append('<option value="' + data.roomId + '">' + data.room + '</option>');
            roomsList.push(data.room);
            this.model.set("roomsList", roomsList);
        }
        if (liveMenuFlag == 0) {
            this.$("#joinLivePerformance").append('</div><span class="help-inline"></span></div>'); 
        }
        this.model.set("liveMenuFlag", 1);
    },
    makeLivePerformanceMenu: function(data) {
        var roomsList = [];
        if (data.rooms.length > 1){
            this.model.set("liveMenuFlag", 1);
            console.log("number of performances: " + data.rooms.length);
            this.$("#joinLivePerformance").empty().prepend('<label for="name" class="control-label">Join Live Performance:</label><div class="controls"><div id="livePerformanceMenuDiv"><select id="livePerformanceMenu"><option value="0">--JOIN PERFORMANCE--</option>');
            for(var i = 1; i < data.rooms.length; i++){
                var roomString = data.rooms[i];
                while(roomString.charAt(0) === '/')
                    roomString = roomString.substr(1);
                console.log("list rooms: " + data.rooms[i] + " = " + roomString);
                this.collection.each(function(model) {
                    if((model.get('parent_id')==99)&&(model.get('performanceName')==roomString)){ 
                        console.log("appending live performance list");
                        this.$('#livePerformanceMenu').append('<option value="' + model.get('_id') + '">' + roomString + '</option>');
                        roomsList.push(roomString);
                        this.model.set("roomsList", roomsList);
                    }
                }, this);
            }
            this.$("#joinLivePerformance").append('</div><span class="help-inline"></span></div>'); 
        }
    },
    compareNewRoomsList: function(data) {
        var newRoomsList = [];
        for(var i = 1; i < data.rooms.length; i++){
            var roomString = data.rooms[i];
            while(roomString.charAt(0) === '/')
                roomString = roomString.substr(1);
            roomString = roomString.split('/');
            if (roomString.length==1){
                newRoomsList.push(roomString);
            }
        }
        var roomsList = this.model.get("roomsList");
        var removeList = [];
        if (newRoomsList.length==0){
            this.$("#joinLivePerformance").empty();
        }
        else{
            for(var i=0; i< newRoomsList.length; i++){
                for (var j=0; j< roomsList.length; j++){
                    var removeFlag = 1;
                    if(newRoomsList[i]==roomsList[j]){
                        removeFlag = 0;
                    }
                    if (removeFlag==1){
                        removeList.push(roomsList[j]);
                    }
                }
            }
        }
        console.log("new rooms [" + newRoomsList + "] compared with [" + roomsList + "] remove [" + removeList + "]");
        for (var k =0; k<removeList.length; k++){
            $("#livePerformanceMenu option:contains(" + removeList[k] + ")").remove();
        }
    },
    loadPerformance: function (e) {
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            console.log("make new venue modeled on " + val + " named: " + name);
            app.navigate('#performance2/15/' + val, true);

        }

    },
    livePerformance: function (e) {
        var val = $(e.currentTarget).val();
        if (val != 0) {
            console.log(val + " " + name);
            app.navigate('#performance2/99/' + val, true);
        }

    },
    joinCurrentPerformance: function (e) {
        var client = this.model.get("client");
        var performanceId = client.roomId;
        console.log("reJoining performance ID: " + performanceId);
        app.navigate('#performance2/99/' + performanceId, true);
    },
    createNewPerformance: function (e) {
        this.model.set("client", []);
        console.log("unregister and create new performance");
        socket.emit('unregisterPerformer');
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
window.PerformanceHeaderAlert = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});