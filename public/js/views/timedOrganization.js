window.TimedOrganizationMasterView = Backbone.View.extend({

    initialize: function () {
        _.bindAll(this, 'render', 'beforeSave', 'loadPhrase', 'saveModule', 'deleteModule', 'addAudio', 'addImage', 'renderMenus', 'clearList', 'previewImage'); //must bind before rendering
        this.render();
    },

    render: function () {
        if (!this.timedOrganizationView) {
            this.timedOrganizationView = new TimedOrganizationView();
        }
        $(this.el).append(this.timedOrganizationView.el);
        
        var phraseId = this.model.get("_id");
        console.log("image phrase id: " + phraseId);

        this.collection.each(function(phraseModel) {
            if(phraseModel.get('_id')==phraseId) 
            { 
                this.model.set(phraseModel.attributes);
            }
        }, this);

        if(this.model.get('permissions')==1){
            this.model.set(this.model.defaults);
        }
        
        this.model.set("audioImageToggle", 1);

        this.$('#phraseName').append('<input type="text" id="name" name="name" value="' + this.model.get("name") + '"/><span class="help-inline"></span>');

        var phraseArray = this.model.get("phrase");
        
        if (phraseArray.length == 0){
            this.$('#audioHalf').show();
            this.$('#imageHalf').hide();
            this.renderMenus();
        }
        else {
            this.$('#audioHalf').hide();
            this.$('#imageHalf').hide();
            console.log("Phrase _ids: " + phraseArray);
            this.loadPhrase();
        }
        return this;
    },
    events: {
        "change"                        : "change",
        "click .save"                   : "beforeSave",
        "click .delete"                 : "deleteModule",
        "click #previewPhrase"          : "previewImage",
        "click #clearList"              : "clearList",
        "click #playAudio"              : "playAudio",
        "change #timingControlMenu"     : "renderTimingSubmenu",
        "change #timingSubmenu"         : "renderSubmenuParameters"
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
        this.model.save(null, {
            success: function (model) {
                //self.render();
                app.navigate('structure/' + model.get("parent_id") + '/' + model.get('_id'), true);
                utils.showAlert('Success!', 'Audio-Image Pair saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {

        this.model.destroy({
            success: function () {
                alert('Audio-Image Pair deleted successfully');
                //window.history.back();
                window.location.replace('#create/8/56');
            }
        });
        return false;
    },

    clearList: function(e) {

        utils.hideAlert();
        this.model.set("phrase", []);
        this.model.set("audio", {});
        this.model.set("imageData", {});
        this.$('#previewImage').empty();
        this.$('#previewAudio').empty();
        this.$('#audioHalf').show();
        console.log("Cleared List");
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
    loadPhrase: function(){
        var phraseArray = this.model.get("phrase");
        var audio = {};
        var image = {};
        console.log("gonna add some stuff");

        this.collection.each(function(model) {
            if(model.get('_id') == phraseArray[0]){ 
                audio = { name: model.get("name"), type: model.get("parent_id"), audio: model.get("audio")};
            }
            if(model.get('_id') == phraseArray[1]){ 
                if(model.get('parent_id')== 19) {  
                    image = {   name: model.get("name"),
                                type: model.get("parent_id"),
                                text: model.get('text'),
                                font: model.get('font'),
                                color: model.get('color'),
                                bgcolor: model.get('bgcolor'),
                                size: model.get('size')
                            };
                }
                else {
                    image = { name: model.get("name"), type: model.get("parent_id"), image: model.get('image') };
                }
            }
        }, this);  
        this.model.set("audio", audio);
        this.model.set("imageData", image);
        this.$('#previewAudio').show();
        this.$('#previewImage').show();
        console.log("audio name " + audio.name);  
        this.$('#previewAudio').empty().append("<a class='btn btn-success' id='playAudio'>Play</a> <b> " + audio.name + "</b>");
        this.previewImage();       
    },
    checkToggle: function(e) {
        var audioImageToggle = this.model.get("audioImageToggle");
        console.log("toggle " + audioImageToggle);
        if (audioImageToggle == 1) {
            this.addAudio(e);
            this.model.set("audioImageToggle", 0);
        }
        else {
            this.addImage(e);
            this.model.set("audioImageToggle", 1);
        }
    },
    addImage: function(e) {
        var phraseArray = this.model.get("phrase");
        var image = {};
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var imageData = $(e.currentTarget).find('option:selected').data('image');
            var image = imageData.split(',');

            phraseArray.push(val);
            this.model.set("phrase", phraseArray);
            
            if (image[1]==19)
            {
                image = {
                    name: name,
                    type: image[1],
                    text: image[2],
                    font: image[3],
                    color: image[4],
                    bgcolor: image[5],
                    size: image[6]
                };
            }
            else {
                image = {
                    name: name,
                    type: image[1],
                    image: image[0]
                };
            }

            this.model.set("imageData", image);    
            
            console.log("phrase " + this.model.get("phrase") + " image " + this.model.get("imageData"));

            $(e.currentTarget)[0].selectedIndex = 0;

            this.$('#imageHalf').hide();
            this.$('#audioHalf').hide();

            this.previewImage();
        }
    },
    addAudio: function(e) {
        var phraseArray = this.model.get("phrase");
        var audio = {};
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var audioData = $(e.currentTarget).find('option:selected').data('audio');
            var audio = audioData.split(',');
            
            phraseArray.push(val);
            this.model.set("phrase", phraseArray);

            audio = {
                    name: name,
                    type: audio[1],
                    audio: audio[0]
                };

            this.model.set("audio", audio);
            console.log("phrase " + this.model.get("phrase") + " audio " + this.model.get("audio"));
            
            
            this.$('#previewAudio').empty().append("<a class='btn btn-success' id='playAudio'>Play</a> <b> " + name + "</b>");
            $(e.currentTarget)[0].selectedIndex = 0;
       
            this.$('#imageHalf').show();
            this.$('#audioHalf').hide();
        }
    },
    renderSubmenuParameters: function(e) {
        console.log("render submenu parameters");
    },
    renderTimingSubmenu: function(e) {
        console.log("render timing submenu");
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var timingType = $(e.currentTarget).find('option:selected').text();
            this.model.set("timing_parent_id", val);
            this.model.set("timingType", timingType);

            this.$("#timingSubmenuDiv").empty().prepend('<label for="name" class="control-label">Timing Presets:</label><div class="controls"><select id="timingSubmenu"><option value="0">--SELECT PRESET--</option>');

            this.collection.each(function(model) {
                if((model.get('parent_id')==val)&&(model.get('permissions')!=1)){ 
                    if(val==36){
                        this.$('#timingSubmenu').append('<option value="' + model.get("_id") + '" data-bpm="' + model.get("bpm") + '" + data-beats="' + model.get("numberOfBeats") + '">' + model.get("name") + '</option>');
                    }
                    else if(val==35){
                        this.$('#timingSubmenu').append('<option value="' + model.get("_id") + '" data-min="' + model.get("min") + '" + data-sec="' + model.get("sec") + '" data-ms="' + model.get("ms") + '">' + model.get("name") + '</option>');
                    }
                } 
            }, this);

            this.$("#timingSubmenuDiv").append('</select></div>');
        }
    },
    renderMenus: function() {

        this.$('#audioHalf').show();

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

        this.$("#imageTelepromptMenuDiv").prepend('<select id="imageTelepromptMenu"><option value="0">--SELECT TELEPROMPT--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==19)&&(model.get('permissions')!=1)){ 
             this.$('#imageTelepromptMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',19,' + model.get("text") + ',' + model.get("font") + ',' + model.get("color") + ',' + model.get("bgcolor") + ','  + model.get("size") + '">' + model.get("name") + '</option>');
            }
        }, this);
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

        this.$('#imageHalf').hide();

    },
    previewImage: function() {
        utils.hideAlert();
        var image = this.model.get("imageData");
console.log(image.image);
        if(image.type == 19)
        {
            console.log("preview teleprompt");
            this.$('#previewImage').empty().append("<div id='internalViewer'><div class='breakword' style='width:100%;margin: 0px auto; background-color:" + image.bgcolor + "; font-size:" + image.size + "px; color:" + image.color + ";font-family:" + image.font + "; line-height:" + image.size + "px;'>" + image.text + "</div></div>");
        }
        else
        {
            this.$('#previewImage').empty().append("<div id='internalViewer'><image src='" + image.image + "'></div>");
        }
    },
    playAudio: function() {
        var audio = this.model.get('audio');
        if($("#jquery_jplayer_1").length > 0)
        {
            $("#jquery_jplayer_1").jPlayer("setMedia", {
            mp3: audio.audio
            }).jPlayer("play");
        }
        else {
            utils.showAlert('Audio Warning', 'Audio is off. Turn on to preview.', 'alert-error');
        }
    }
});
window.TimedOrganizationView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});