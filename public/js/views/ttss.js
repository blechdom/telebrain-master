window.TTSView = Backbone.View.extend({

    initialize: function () {
        var deleteFlag = 0;
         //Force Defaults on NEW
        if(this.model.get('permissions')==1){
            deleteFlag = 1;
            this.model.set(this.model.defaults);
        }
        this.model.set('deleteFlag', deleteFlag);
        _.bindAll(this, 'render', 'change', 'beforeSave', 'deleteModule', 'playTTS');
        this.render();

    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteModule",
        "click #playTTS" : "playTTS",
        "change #ttsLanguage" : "setLanguage"
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
    setLanguage: function(e) {
        var ttsLanguage = $(e.currentTarget).val();
        console.log(ttsLanguage);
        this.model.set("language", ttsLanguage);
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
                model.set('deleteFlag', 0); // allow New saved TTS to be deleted
                self.render();
                app.navigate('create/' + model.get("parent_id") + '/' + model.get('_id'), true);
                utils.showAlert('Success!', 'Text-To-Speech saved successfully', 'alert-success');
                //make tts audio file.
                var language = model.get('language');
                var text = model.get('text');
                var googleTts = new GoogleTTS(language);
                var urlString = googleTts.url(text, language);
                var tts_id = model.get('_id');
                console.log("Saving URL: " + urlString + " as name " + tts_id + ".mp3");
                socket.emit('saveNewTTS', urlString, tts_id);
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to save this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {
        //add DELETE TTS audio file
        if(this.model.get('deleteFlag')==0){
            socket.emit('deleteTTSbyID', this.model.get('_id'));
        }
        this.model.destroy({
            success: function () {
                alert('Text-To-Speech deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    playTTS: function() {

        if($("#jquery_jplayer_1").length > 0)
        {
            $("#jquery_jplayer_1").jPlayer("setMedia", {
                mp3: "snd/ttsdb/" + this.model.get('_id') + ".mp3"
            }).jPlayer("play");
        }
        else {
            utils.showAlert('Audio Warning', 'Audio is off. Turn on to preview.', 'alert-error');
        }
    }

});
