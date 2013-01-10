window.AudioURLView = Backbone.View.extend({

    initialize: function () {
        var deleteFlag = 0;
         //Force Defaults on NEW
        if(this.model.get('permissions')==1){
            deleteFlag = 1;
            this.model.set(this.model.defaults);
            $('#audioDiv').empty();
        }
        this.model.set('deleteFlag', deleteFlag);
        console.log("delete flag" + deleteFlag);
        _.bindAll(this, 'render', 'change', 'beforeSave', 'deleteModule', 'playAudio', 'saveModule');
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"                : "change",
        "click .save"           : "beforeSave",
        "click .delete"         : "deleteModule",
        "click #prepareAudio"   : "prepareAudio",
        "click #playAudio"      : "playAudio",
        "saveModule"            : "saveModule"
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
                model.set('deleteFlag', 0);
                self.render();
                app.navigate('audioURLs/' + model.parent_id + '/' + model.get('_id'), false);
                utils.showAlert('Success!', 'Web-Based Audio saved successfully', 'alert-success');
                //make local copy of audioURL
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {
        //add DELETE URL audio file
        if(this.model.get('deleteFlag')==0){
            socket.emit('deleteURLAudioByID', this.model.get('_id'));
        }
        this.model.destroy({
            success: function () {
                alert('Audio Image deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    prepareAudio: function() {
        utils.hideAlert();
        utils.showAlert('PRPARING AUDIO', 'Please wait while telebrain tests URL', 'alert-info');
        var urlExists = 0;
        var url = this.model.get('audio');
        var url_id = this.model.get('_id');
        console.log("Saving URL: " + url + " as name " + url_id + ".mp3");
        socket.emit('saveURLAudio', url, url_id);
        socket.on("urlAudioError", function(urlExistsFlag) 
        {
            urlExists = urlExistsFlag;
            console.log(urlExistsFlag); 
            if (urlExists == 0)
            {  
                utils.hideAlert();  
                utils.showAlert('URL Error', 'This URL is an invalid audio file', 'alert-error');
                console.log('This URL is an invalid audio file');
            }
            else if (urlExists == 1)
            {
                utils.hideAlert();
                utils.showAlert('URL OK', 'Preparing Audio', 'alert-success');
                console.log('Preparing Audio');
            }
            else if (urlExists == 2)
            {
                utils.hideAlert();
                utils.showAlert('URL Error', 'URL Timed-out. URL Unavailable', 'alert-error');
                console.log('URL TIMED-OUT');
            }
        });
    },
    playAudio: function() {
        utils.hideAlert();
        var url_id = this.model.get('_id');
        var mp3 = "snd/urls/" + url_id + ".mp3";
        
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
