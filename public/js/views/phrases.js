window.PhraseView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});

window.ImagePhraseMasterView = Backbone.View.extend({

    initialize: function () {
        var phraseId, phraseObject;
        var phraseArray = [];
        var playList = [];
        this.model.set("playlist", []);
        _.bindAll(this, 'render', 'beforeSave', 'loadList', 'saveModule', 'deleteModule', 'addToList', 'clearList', 'drawList', 'previewPhrase'); //must bind before rendering

        this.render();
    },

    render: function () {
        if (!this.imagePhraseView) {
            this.imagePhraseView = new ImagePhraseView();
        }
        $(this.el).append(this.imagePhraseView.el);
        
        this.phraseId = this.model.get("_id");

        this.collection.each(function(phraseModel) {
            if(phraseModel.get('_id')==this.phraseId) 
            { 
                this.model.set(phraseModel.attributes);
            }
        }, this);

        if(this.model.get('permissions')==1){
            this.model.set(this.model.defaults);
            console.log("this is default phrase");
        }
        
        this.$('#phraseName').append('<input type="text" id="name" name="name" value="' + this.model.get("name") + '"/><span class="help-inline"></span>');

        this.phraseArray = this.model.get("phrase");
        this.playList = this.model.get("playlist");
        for (i = 0; i < this.phraseArray.length; i++ ){
            console.log("array members: " + this.phraseArray[i]);
            //limit to phrase parent_id eventually
            this.collection.each(function(model) {
                if(model.get('_id') == this.phraseArray[i]){ 
                    this.drawList(model.get('name')); 
                    this.playList.push(model.get('audio')); 
                }
            }, this);
        } 
        this.$("#imageURLMenuDiv").prepend('<select id="imageURLMenu"><option value="0">--SELECT IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==17)&&(model.get('permissions')!=1)){ 
             this.$('#imageURLMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#imageUploadMenuDiv").prepend('<select id="imageUploadMenu"><option value="0">--SELECT IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==18)&&(model.get('permissions')!=1)){ 
             this.$('#imageUploadMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#imageTelepromptMenuDiv").prepend('<select id="imageTelepromptMenu"><option value="0">--SELECT TELEPROMPT--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==19)&&(model.get('permissions')!=1)){ 
             this.$('#imageTelepromptMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        console.log("Phrase _ids: " + this.phraseArray);
        console.log("Playlist: " + this.playList);

        return this;
    },
    events: {
        "change"            : "change",
        "click .save"       : "beforeSave",
        "click .delete"     : "deleteModule",
        "change select"     : "addToList",
        "click #previewPhrase"  : "previewPhrase",
        "click #clearList"  : "clearList",
        "mouseover #playAudio" : "loadList"
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
                            this.playList.push("snd/ttsdb/" + model.get('_id') + ".mp3");
                        }
                        else {
                            this.playList.push(model.get('audio'));
                        }  
                    }
                }, this);
            } 
        }
    },
    addToList: function(e) {
        if(this.playList.length==0){ this.loadList(); }
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var audio = $(e.currentTarget).find('option:selected').data('audio');
            console.log("add with id: " + val + " name: " + name + " audio: " + audio);
            this.phraseArray.push(val);
            this.model.set("phrase", this.phraseArray);
            this.playList.push(audio);
            this.model.set("playlist", this.playList);
            console.log(this.model.get("phrase"));
            this.drawList(name);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    drawList: function(name){
            this.$('#addedAudio').append("<li>" + name + " </li>");
    },
    previewPhrase: function() {
        // Remove any existing alert message
        utils.hideAlert();
        console.log("preview images");
    }      
});
window.ImagePhraseView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});