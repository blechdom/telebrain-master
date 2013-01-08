window.AudioSentenceMasterView = Backbone.View.extend({

    initialize: function () {
        var deleteFlag = 0;
        var phraseId, phraseObject;
        var phraseArray = [];
        var playList = [];
        this.model.set("playlist", []);

        _.bindAll(this, 'render', 'beforeSave', 'loadList', 'saveModule', 'makePhrase', 'deleteModule', 'addToList', 'clearList', 'drawList', 'playAudio'); //must bind before rendering
        this.render();
    },

    render: function () {
        if (!this.audioSentenceView) {
            this.audioSentenceView = new AudioSentenceView();
        }
        $(this.el).append(this.audioSentenceView.el);
        
        this.phraseId = this.model.get("_id");
        console.log(this.phraseId);

        this.collection.each(function(phraseModel) {
            if(phraseModel.get('_id')==this.phraseId) 
            { 
                if(phraseModel.get('permissions')==1){
                    this.deleteFlag = 1;
                    this.model.set(this.model.defaults);
                     this.phraseArray = [];
                     this.model.set("phrase", this.phraseArray);
                }
                else
                {
                    this.model.set(phraseModel.attributes);
                    this.deleteFlag = 0;
                }
                this.model.set('deleteFlag', this.deleteFlag);
                console.log("delete flag: " + this.deleteFlag);
                
            }
        }, this);
        
        this.$('#phraseName').append('<input type="text" id="name" name="name" value="' + this.model.get("name") + '"/><span class="help-inline"></span>');
        console.log("beginning phrase " + this.model.get("phrase"));
        this.phraseArray = this.model.get("phrase");
        this.playList = this.model.get("playlist");
        for (i = 0; i < this.phraseArray.length; i++ ){
            console.log("array members: " + this.phraseArray[i]);
            //limit to phrase parent_id eventually
            this.collection.each(function(model) {
                if(model.get('_id') == this.phraseArray[i]){ 
                    this.drawList(model.get('name')); 
                    if(model.get('parent_id')== 23) {
                        //this.playList.push("snd/ttsdb/" + model.get('_id') + ".mp3");
                    }
                    else {
                        //this.playList.push(model.get('audio'));
                    }  
                }
            }, this);
        } 

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

        console.log("Phrase _ids: " + this.phraseArray);

        return this;
    },
    events: {
        "change"            : "change",
        "click .save"       : "beforeSave",
        "click .delete"     : "deleteModule",
        "change select"     : "addToList",
        "click #playAudio"  : "playAudio",
        "click #clearList"  : "clearList",
         "click #makePhrase" : "makePhrase"
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
        this.playList = [];
        this.model.set("playlist", this.playList);
        //this.$('#addedAudio').empty();
        this.model.save(null, {
            success: function (model) {
                model.set('deleteFlag', 0);
                //self.render();
                app.navigate('structure/' + model.get("parent_id") + '/' + model.get('_id'), true);
                utils.showAlert('Success!', 'Phrase saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {
        console.log("pre-delete" + this.model.get("deleteFlag"));
        if(this.model.get('deleteFlag')==0){
            socket.emit('deletePhraseByID', this.model.get('_id'));
        }
        this.model.destroy({
            success: function () {
                alert('Phrase deleted successfully');
                //window.history.back();
                window.location.replace('#create/8/58');

            }
        });
        return false;
    },

    clearList: function(e) {
         // Remove any existing alert message
        utils.hideAlert();
            this.phraseArray = [];
            this.playList = [];
            this.model.set("phrase", this.phraseArray);
            this.model.set("playlist", this.playList);
            this.$('#addedAudio').empty();
            console.log("Cleared List");
    },
    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },
    loadList: function(){
        if (this.playList.length == 0) {
        console.log("gonna add some stuff");
            for (i = 0; i < this.phraseArray.length; i++ ){
                this.collection.each(function(model) {
                    if(model.get('_id') == this.phraseArray[i]){ 
                        if(model.get('parent_id')== 23) {
                            this.playList.push({audio: "snd/ttsdb/" + model.get('_id') + ".mp3", audioType: 23});
                            //this.prepareAudio("snd/ttsdb/" + model.get('_id') + ".mp3", (i+1));
                        }
                        else if(model.get('parent_id')== 21) {
                            this.playList.push({audio: "snd/urls/" + model.get('_id') + ".mp3", audioType: 21});
                            //this.prepareAudio("snd/ttsdb/" + model.get('_id') + ".mp3", (i+1));
                        }
                        else if(model.get('parent_id')== 58) {
                            this.playList.push({audio: "snd/phrases/" + model.get('_id') + ".mp3", audioType: 58});
                            //this.prepareAudio("snd/ttsdb/" + model.get('_id') + ".mp3", (i+1));
                        }
                        else {
                            this.playList.push({audio: model.get('audio'), audioType: model.get('parent_id')});
                            //this.prepareAudio(model.get('audio'), (i+1));
                        }  
                    }
                }, this);
            } 
        }
    },
    makePhrase: function(){
        this.loadList();
        if(this.model.get("deleteFlag")==1)
        {
            utils.showAlert('Phrase Error', 'Please save before making phrase', 'alert-error');
        }
        else 
        {
            utils.showAlert('Making Phrase', 'Press Preview to hear the phrase', 'alert-info');
            socket.emit("phraseList", this.playList, this.phraseId);
        }
    },
    addToList: function(e) {
        if(this.playList.length==0){ this.loadList(); }
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var audioData = $(e.currentTarget).find('option:selected').data('audio');
            var audio = audioData.split(',');
            console.log(audio);
            this.phraseArray.push(val);
            this.model.set("phrase", this.phraseArray);
            this.playList.push({audio: audio[0], audioType: audio[1]});
            //this.playList.push(audio);
            //this.prepareAudio(audio, this.playList.length);
            this.model.set("playlist", this.playList);
            console.log(this.model.get("phrase"));
            this.drawList(name);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    drawList: function(name){
            this.$('#addedAudio').append("<li>" + name + " </li>");
    },
    prepareAudio: function(audio, location) {
        if(this.playList.length==0){ this.loadList(); }
        console.log(audio + " " + location);
        this.$('#addedAudio').append('<div id="jplayer_' + location + '" class="jp-jplayer"></div>');
        console.log('Preparing Audio: <div id="jplayer_' + location + '" class="jp-jplayer"></div>');
        $("#jplayer_" + location).jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: audio    
                }).jPlayer("load");
                console.log("Loading Audio: " + location + " " + audio);
            },
            timeupdate: function (event) {
                var status = event.jPlayer.status;
                if (!!status && !status.waitForPlay && !status.waitForLoad && !!status.srcSet) {
                    //console.log(status.currentTime + ' ' + status.duration);

                    var hasCurrentTime = !isNaN(status.currentTime) && status.currentTime > 0,
                        hasDuration = !isNaN(status.duration) && status.duration > 0,
                        isEnded = status.currentTime >= status.duration;

                    if ( (hasCurrentTime && hasDuration  && isEnded) ) {
                        console.log('timeupdate ended');
                         $("#jplayer_" + (location + 1)).jPlayer("play");
                    }
                }
            },
            swfPath: "lib/jPlayer/js",
            supplied: "mp3" // if ogg vorbis then ' supplied: "mp3, ogg" '
        });
        $("#jplayer_" + location).bind($.jPlayer.event.play, function() { // Using a jPlayer event to avoid both jPlayers playing together.
            $(this).jPlayer("pauseOthers");
        });
    },
    playAudio: function() {
      utils.hideAlert();
        var url_id = this.model.get('_id');
        var mp3 = "snd/phrases/" + url_id + ".mp3";
        
        if($("#jquery_jplayer_1").length > 0)
        {
            console.log("playAudio: " + mp3);
            $("#jquery_jplayer_1").jPlayer("setMedia", {
            mp3: mp3
            }).jPlayer("play");
        }
        else {
            utils.showAlert('Audio Warning', 'Audio is off. Turn on to preview.', 'alert-error');
        }
    }
});

window.AudioSentenceView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});
