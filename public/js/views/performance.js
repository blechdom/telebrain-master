window.PerformanceHeaderMasterView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        if (!this.performanceHeaderView) {
            this.performanceHeaderView = new PerformanceHeaderView();
        }
        $(this.el).append(this.performanceHeaderView.el);

        this.$("#performanceMenuDiv").prepend('<select id="performanceMenu"><option value="0">--SELECT PERFORMANCE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==15)&&(model.get('permissions')!=1)){ 

             this.$('#performanceMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);
    },
     events: {
     
        "change #performanceMenu"      : "loadPerformance",
    },
    loadPerformance: function (e) {

        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            console.log(val + " " + name);
            app.navigate('#performance/15/' + val, true);
        }

    }

});
window.PerformanceHeaderView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});
window.PerformanceMasterView = Backbone.View.extend({

    initialize:function () {

        this.model.set(this.model.defaults);

        console.log("performance initialized");
        
        /*$(function(){
      
        // when the client hits ENTER on their keyboard
        $('#usernameInput').keypress(function(e) {
          if(e.which == 13) {
            $(this).blur();
            $('#usernameSend').focus().click();
          }
        });  
      });*/
        _.bindAll(this, 'render', 'TTSChat', 'imageChat', 'audioChat', 'updateImage', 'sendUsername', 'renderAudioMenus', 'renderImageMenus');
        this.render();
    },

    render:function () {
        if (!this.performanceView) {
            this.performanceView = new PerformanceView();
        }
        $(this.el).append(this.performanceView.el);

        this.$('#chatDataDisplay').empty();
        this.$('#conversation').hide();
        this.$('#signin').empty().append('<div class="control-group form-horizontal"><label for="usernameInput" class="control-label"><b>USERNAME:</b></label><div class="controls"><input type="text" id="usernameInput" name="usernameInput"/><span class="help-inline"></span><input type="button" id="usernameSend" value="send" class="btn"/></div></div>');
      
        return this;
    },

    events: {
     
        "change #imageURLMenu"      : "updateImage",
        "change #imageUploadMenu"   : "updateImage",
        "change #telepromptMenu"    : "updateImage",
        "change #imagePhraseMenu"   : "updateImage",
        "change #audioURLMenu"      : "updateAudio",
        "change #audioUploadMenu"   : "updateAudio",
        "change #TTSMenu"           : "updateAudio",
        "change #audioSentenceMenu" : "updateAudio",
        "click #usernameSend"       : "sendUsername",
        "click #toggleImageChat"    : "imageChat",
        "click #toggleAudioChat"    : "audioChat",
        "click #toggleTTSFlag"      : "TTSChat",
        "click #datasend"           : "dataSend"
    },

    TTSChat: function(e) {

        var ttsFlag = $(e.currentTarget).val();
        this.model.set("ttsFlag", ttsFlag);
        console.log("ttsFlag " + this.model.get("ttsFlag"));
    },

    imageChat: function(e) {

        var imageChatFlag = $(e.currentTarget).val();
        if (imageChatFlag==1)
        {
            this.$('#imageChat').empty().append('<div id="imageURLMenuDiv"></div><div id="imageUploadMenuDiv"></div><div id="telepromptMenuDiv"></div><div id="imagePhraseMenuDiv"></div>'); 
            this.renderImageMenus();
        }
        else
        {
            this.$('#imageChat').empty();
            this.$('#imageViewer').empty();
        }
        this.model.set("imageChatFlag", imageChatFlag);
        console.log("imageChatFlag " + this.model.get("imageChatFlag"));
    },
    audioChat: function(e) {

       var audioChatFlag = $(e.currentTarget).val();
       if (audioChatFlag==1)
        {
            this.$('#audioChat').empty().append('<div id="audioURLMenuDiv"></div><div id="audioUploadMenuDiv"></div><div id="TTSMenuDiv"></div><div id="audioSentenceMenuDiv"></div>'); 
            this.renderAudioMenus();
        }
        else
        {
            this.$('#audioChat').empty();
        }
        this.model.set("audioChatFlag", audioChatFlag);
        console.log("audioChatFlag " + this.model.get("audioChatFlag"));
    },

    updateImage: function(e) {
        
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var updateImage = $(e.currentTarget).find('option:selected').data('image');
            console.log(updateImage);
            socket.emit('sendimage', updateImage);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
        socket.on('updateimage', function (username, data) {
            var image = data.split(',');
            console.log("updating image " + username + " data " + image);
            $('#imageViewer').empty();
            if(image[1]==19)
            {
                $('#imageViewer').append("<div id='internalViewer'><div class='breakword' style='width:100%;margin: 0px auto; background-color:" + image[5] + "; font-size:" + image[6] + "px; color:" + image[4] + ";font-family:" + image[3] + "; line-height:" + image[6] + "px;'>" + image[2] + "</div></div>");
            }
            else {
                $('#imageViewer').append('<p><img id="picture" src="' + image[0] + '" width = 100% /></p>');
            }
        });
    },
    updateAudio: function(e) {
        
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var updateAudio = $(e.currentTarget).find('option:selected').data('audio');
            console.log(updateAudio);
            socket.emit('sendaudio', updateAudio);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
        socket.on('updateaudio', function (username, data) {
            var audio = data.split(',');
            console.log("updating audio " + username + " data " + audio);
            playAudio(audio[[0]]);
        });
    },
    sendUsername: function(e) {
        console.log("username send button clicked");
        //var message = $('.usernameInput').val();
        var message = $(this.el).find('input#usernameInput').val();
    
        console.log("Username: " + message);
        //$('#usernameInput').val('');
          // tell server to execute 'sendchat' and send along one parameter
        socket.emit('adduser', message);
        socket.on('updatechatme', function (username, data) {
            $('#chatDataDisplay').empty().append('<br><div class="control-group"><div class="controls"><div id="checkboxes" class="form-horizontal"><input type="checkbox" id="toggleTTSFlag" onclick="$(this).val(this.checked ? 1 : 0)"> Text-To-Speech <input type="checkbox" id="toggleImageChat" onclick="$(this).val(this.checked ? 1 : 0)"> Image <input type="checkbox" id="toggleAudioChat" onclick="$(this).val(this.checked ? 1 : 0)"> Audio </div><br><div class="form-horizontal"><input type="text" id="data" name="data"/> <input type="button" id="datasend" value="send" class="btn"/></div></div></div>');
            $('#conversation').show();
        });
    },
    dataSend: function() {
        console.log("text send button clicked");
        var message = $(this.el).find('input#data').val();
         // var message = $('#data').val();
        this.$('#data').val('');
        console.log("chat text: " + message);
          // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
          
          //TTS on or off
        if (this.model.get("ttsFlag") == 1)
        {
            var googleTts = new GoogleTTS('en');
            var urlString = googleTts.url(message, 'en');
            console.log("Speak URL: " + urlString);
            socket.emit("urlTTS", urlString);
        }
        else {console.log ("NO TTS")}


        // when the client hits ENTER on their keyboard
        /*$('#data').keypress(function(e) {
          if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
          }
        });*/

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
window.PerformanceView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});