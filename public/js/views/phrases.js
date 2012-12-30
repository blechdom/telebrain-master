window.PhraseView = Backbone.View.extend({

    initialize: function () {
         //Force Defaults on NEW
        if(this.model.get('permissions')==1){
            this.model.set(this.model.defaults);
        }
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteModule"
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
                app.navigate('create/' + model.parent_id + '/' + model.get('_id'), false);
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
                window.history.back();
            }
        });
        return false;
    }
});

window.PhrasesMasterView = Backbone.View.extend({

    initialize: function () {
        this.counter = 0;
        this.render();
    },

    render: function () {
         if (!this.audioSentenceView) {
            this.audioSentenceView = new AudioSentenceView();
        }
        $(this.el).append(this.audioSentenceView.el);
        
        this.$("#audioURLMenuDiv").prepend('<select id="audioURLMenu">');

        this.collection.each(function(model) {
            if((model.get('parent_id')==21)&&(model.get('permissions')!=1)){ 
             this.$('#audioURLMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioUploadMenuDiv").prepend('<select id="audioUploadMenu">');

        this.collection.each(function(model) {
            if((model.get('parent_id')==22)&&(model.get('permissions')!=1)){ 
             this.$('#audioUploadMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#TTSMenuDiv").prepend('<select id="TTSMenu">');

        this.collection.each(function(model) {
            if((model.get('parent_id')==23)&&(model.get('permissions')!=1)){ 
             this.$('#TTSMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        return this;
    },
    events: {
        "click .save"   : "beforeSave",
        "click .delete" : "deleteModule",
        "change select" : "addToList",
        "click #playAudio"  : "playAudio",
        "click #clearList" : "clearList"
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
                app.navigate('create/' + model.parent_id + '/' + model.get('_id'), false);
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
                window.history.back();
            }
        });
        return false;
    },

    clearList: function(e) {
            this.counter = 0;
            this.$('#addedAudio').empty();
            console.log("Cleared List");
            //remove get phrase model - remove "phrase: [1, 2, 3, 4];" from model
    },

    addToList: function(e) {
            this.counter++;
            var val = $(e.currentTarget).val();
            var name = $(e.currentTarget).find('option:selected').text();
            console.log("add: " + this.counter + " " + val + " " + name);
            this.$('#addedAudio').append("<li>" + name + " </li>");
            //add to model before save -> get Phrase model and set "phrase:[1, 2, 3, 4];"
    },

    playAudio: function() {
        // add concatenation here...
        console.log(this.model.get('audio'));
        $("#jquery_jplayer_1").jPlayer("setMedia", {
            mp3: this.model.get('audio')
        }).jPlayer("play");
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
