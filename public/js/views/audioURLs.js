window.AudioURLView = Backbone.View.extend({

    initialize: function () {
         //Force Defaults on NEW
        if(this.model.get('permissions')==1){
            this.model.set(this.model.defaults);
            $('#audioDiv').empty();
        }
        _.bindAll(this, 'render', 'change', 'beforeSave', 'deleteModule', 'playAudio');
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"            : "change",
        "click .save"       : "beforeSave",
        "click .delete"     : "deleteModule",
        "click #playAudio"  : "playAudio"
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
                self.render();
                app.navigate('audioURLs/' + model.parent_id + '/' + model.get('_id'), false);
                utils.showAlert('Success!', 'Web-Based Audio saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {
        this.model.destroy({
            success: function () {
                alert('Audio Image deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    playAudio: function() {
        console.log(this.model.get('audio'));
        $("#jquery_jplayer_1").jPlayer("setMedia", {
            mp3: this.model.get('audio')
        }).jPlayer("play");
    }
});
