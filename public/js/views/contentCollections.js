window.ContentCollectionsMasterView = Backbone.View.extend({

    initialize: function () {
        var phraseId, phraseObject;
        var phraseArray = [];
        var contentList = [];
        var contentCounter = 0;
        this.model.set("imagelist", []);
        _.bindAll(this, 'render', 'beforeSave', 'loadList', 'saveModule', 'deleteModule', 'addToList', 'clearList', 'drawList', 'previewPhrase'); //must bind before rendering
        this.render();
    },

    render: function () {
        if (!this.contentCollectionsView) {
            this.contentCollectionsView = new ContentCollectionsView();
        }
        $(this.el).append(this.contentCollectionsView.el);
        
        this.phraseId = this.model.get("_id");
        console.log("image phrase id: " + this.phraseId);

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
        this.contentList = this.model.get("contentlist");
        for (i = 0; i < this.phraseArray.length; i++ ){
            console.log("array members: " + this.phraseArray[i]);
            //limit to phrase parent_id eventually
            this.collection.each(function(model) {
                if(model.get('_id') == this.phraseArray[i]){ 
                    this.drawList(model.get('name')); 
                    //this.imageList.push(model.get('image')); 
                }
            }, this);
        } 
        this.loadList();
        this.$("#imageURLMenuDiv").prepend('<select id="imageURLMenu"><option value="0">--SELECT IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==17)&&(model.get('permissions')!=1)){ 
             this.$('#imageURLMenu').append('<option value="' + model.get("_id") + '" data-content="' + model.get("image") + ',17">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#imageUploadMenuDiv").prepend('<select id="imageUploadMenu"><option value="0">--SELECT IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==18)&&(model.get('permissions')!=1)){ 
             this.$('#imageUploadMenu').append('<option value="' + model.get("_id") + '" data-content="' + model.get("image") + ',18">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#imageTelepromptMenuDiv").prepend('<select id="imageTelepromptMenu"><option value="0">--SELECT TELEPROMPT--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==19)&&(model.get('permissions')!=1)){ 
             this.$('#imageTelepromptMenu').append('<option value="' + model.get("_id") + '" data-content="' + model.get("image") + ',19,' + model.get("text") + ',' + model.get("font") + ',' + model.get("color") + ',' + model.get("bgcolor") + ','  + model.get("size") + '">' + model.get("name") + '</option>');
            }
        }, this);
        this.$("#imagePhraseMenuDiv").prepend('<select id="imagePhraseMenu"><option value="0">--SELECT PHRASE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==57)&&(model.get('permissions')!=1)&&(model.get('_id')!=this.phraseId)){ 
             this.$('#imagePhraseMenu').append('<option value="' + model.get("_id") + '" data-content="' + model.get("image") + ',57">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioURLMenuDiv").prepend('<select id="audioURLMenu"><option value="0">--SELECT AUDIO--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==21)&&(model.get('permissions')!=1)){ 

             this.$('#audioURLMenu').append('<option value="' + model.get("_id") + '" data-content="snd/urls/' + model.get("_id") + '.mp3,21">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioUploadMenuDiv").prepend('<select id="audioUploadMenu"><option value="0">--SELECT AUDIO--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==22)&&(model.get('permissions')!=1)){ 
             this.$('#audioUploadMenu').append('<option value="' + model.get("_id") + '" data-content="' + model.get("audio") + ',22">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#TTSMenuDiv").prepend('<select id="TTSMenu"><option value="0">--SELECT TTS--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==23)&&(model.get('permissions')!=1)){ 
             this.$('#TTSMenu').append('<option value="' + model.get("_id") + '" data-content="snd/ttsdb/' + model.get("_id") + '.mp3,23">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioSentenceMenuDiv").prepend('<select id="audioSentenceMenu"><option value="0">--SELECT SENTENCE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==58)&&(model.get('permissions')!=1)&&(model.get('_id')!=this.phraseId)){ 
             this.$('#audioSentenceMenu').append('<option value="' + model.get("_id") + '" data-content="snd/phrases/' + model.get("_id") + '.mp3,58">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioImagePairsMenuDiv").prepend('<select id="audioImagePairsMenu"><option value="0">--SELECT PAIR--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==56)&&(model.get('permissions')!=1)&&(model.get('_id')!=this.phraseId)){ 
             this.$('#audioImagePairsMenu').append('<option value="' + model.get("_id") + '" data-content=' + model.get("phrase") + '>' + model.get("name") + '</option>');
            }
        }, this);

        var permissions = this.model.get("permissions");
        console.log("Permissions: " + permissions);
        if (permissions < 2){
            this.$('#formButtons').empty().append('<div class="form-actions"><a class="btn btn-inverse" id="contentLock"><i class="icon-unlock unlock-black"></i></a> <a href="#" class="btn btn-primary save">Save</a> <a href="#" class="btn btn-danger delete">Delete</a> <a class="btn btn-warning" id="clearList">Clear</a></div>');
        }
        else if (permissions == 2){
            this.$('#formButtons').empty().append('<div class="form-actions"><a class="btn btn-inverse" id="contentUnlock"><i class="icon-lock unlock-black"></i></a></div>');
        }

        console.log("Phrase _ids: " + this.phraseArray);
        return this;
    },
    events: {
        "change"            : "change",
        "click .save"       : "beforeSave",
        "click .delete"     : "deleteModule",
        "click #contentLock" : "lockContent", 
        "click #contentUnlock" : "unlockContent", 
        "click #contentLocking" : "lockingContent", 
        "click #contentUnlocking" : "unlockingContent", 
        "change select"     : "addToList",
        "click #previewPhrase"  : "previewPhrase",
        "click #clearList"  : "clearList",
        "click #nextItem"  : "nextItem"
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
        this.contentList = [];
        this.model.set("contentlist", this.contentList);
        this.model.save(null, {
            success: function (model) {
                //self.render();
                app.navigate('structure/' + model.get("parent_id") + '/' + model.get('_id'), true);
                utils.showAlert('Success!', 'Content Collection saved successfully', 'alert-success');
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
                window.location.replace('#create/8/59');
            }
        });
        return false;
    },
    lockContent: function () {
        utils.hideAlert();
        var permissions = this.model.get("permissions");
        if(permissions == 1){
            utils.showAlert('Lock Error', 'You must save a new Collection before locking', 'alert-info');
        }
        if(permissions == 0){
            this.$('#formButtons').empty().append('<div class="form-actions input-append"><label>Enter Passcode to Lock:</label><input type="text" id="lockAuth" name="lockAuth"/><a class="btn btn-inverse" id="contentLocking"><i class="icon-unlock unlock-black"></i></a></div></div>');
        }
        if(permission == 2){
             this.$('#formButtons').empty().append('<div class="form-actions"><a class="btn btn-inverse" id="contentUnlock"><i class="icon-lock unlock-black"></i></a></div>');

        }
    },
    unlockContent: function () {
        console.log("contentUnlocking");
        utils.hideAlert();
        this.$('#formButtons').empty().append('<div class="form-actions input-append"><label>Enter Passcode to Unlock:</label><input type="text" id="lockAuth" name="lockAuth"/><a class="btn btn-inverse" id="contentUnlocking"><i class="icon-lock unlock-black"></i></a></div></div>');
    },
    lockingContent: function (e) {
        utils.hideAlert();
        var passcode = $('#lockAuth').val();
        console.log("passcode " + passcode);

        this.model.set({"passcode": passcode, "permissions": 2});
        this.beforeSave();
        this.$('#formButtons').empty().append('<div class="form-actions"><a class="btn btn-inverse" id="contentUnlock"><i class="icon-lock unlock-black"></i></a></div>');
    },
    unlockingContent: function (e) {
        utils.hideAlert();
        console.log("unlocking");
        var lockCode = this.model.get("passcode");
        var passcode = $('#lockAuth').val();
        if(lockCode == passcode) {
            this.$('#formButtons').empty().append('<div class="form-actions"><a class="btn btn-inverse" id="contentLock"><i class="icon-unlock unlock-black"></i></a> <a href="#" class="btn btn-primary save">Save</a> <a href="#" class="btn btn-danger delete">Delete</a> <a class="btn btn-warning" id="clearList">Clear</a></div>');
            this.model.set({"passcode": "", "permissions": 0});
        }
        else {
            utils.showAlert('Unlock Error', 'You must enter the correct passcode to unlock the Content.', 'alert-error');
        }
    },
    clearList: function(e) {
         // Remove any existing alert message
        utils.hideAlert();
            this.phraseArray = [];
            this.contentList = [];
            this.model.set("phrase", this.phraseArray);
            this.model.set("contentlist", this.contentList);
            this.$('#addedImage').empty();
            this.$('#imageViewer').empty();
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
        if(this.contentList == undefined){ this.contentList = this.model.get("contentList");}
        if (this.contentList.length == 0) {
        console.log("gonna add some stuff");
            for (i = 0; i < this.phraseArray.length; i++ ){
                this.collection.each(function(model) {
                    if(model.get('_id') == this.phraseArray[i]){ 
                        if((model.get('parent_id')== 17)||(model.get('parent_id')== 18)||(model.get('parent_id')== 57)) {
                            this.contentList.push({content: model.get('image'), contentType: model.get('parent_id')});
                        }
                        else if(model.get('parent_id')== 19) {  // text, font, color, bgcolor, size
                            this.contentList.push({   content: model.get('image'), 
                                                    contentType: model.get('parent_id'),
                                                    text: model.get('text'),
                                                    font: model.get('font'),
                                                    color: model.get('color'),
                                                    bgcolor: model.get('bgcolor'),
                                                    size: model.get('size')
                                                });
                        }
                    }
                }, this);
            } 
        }          
    },
    addToList: function(e) {
        if(this.contentList == undefined){ this.contentList = this.model.get("contentList");}
        if(this.contentList.length==0){ this.loadList(); }
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var contentData = $(e.currentTarget).find('option:selected').data('content');
            var content = contentData.split(',');
            console.log(content);
            this.phraseArray.push(val);
            this.model.set("phrase", this.phraseArray);
            if ((content[1]==17)||(content[1]==18)||(content[1]==57))
            {
                this.contentList.push({content: content[0], contentType: content[1]});
            }
            else if (content[1]==19)
            {
                this.contentList.push({   content: content[0], 
                                        contentType: content[1], 
                                        text: content[2],
                                        font: content[3],
                                        color: content[4],
                                        bgcolor: content[5],
                                        size: content[6]});
            }

            this.model.set("contentlist", this.contentList);
            console.log(this.model.get("phrase"));
            this.drawList(name);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    drawList: function(name){
            this.$('#addedImage').append("<li>" + name + " </li>");
    },
    previewPhrase: function() {
        this.contentCounter = 0;
        utils.hideAlert();
        if (this.contentList.length > 0)
        {
            var firstContent = this.contentList[0];
            console.log(this.contentList[1]);
            if(firstContent.contentType == 19)
            {
                console.log("TELEPROMPT");
                if(this.contentList.length > 1)
                {
                    this.$('#imageViewer').empty().append("<div id='nextButton'><a class='btn btn-success' id='nextItem'>Next Image</a></div><div id='internalViewer'><div class='breakword' style='width:100%;margin: 0px auto; background-color:" + firstContent.bgcolor + "; font-size:" + firstContent.size + "px; color:" + firstContent.color + ";font-family:" + firstContent.font + "; line-height:" + firstContent.size + "px;'>" + firstContent.text + "</div></div>");
                }
                else
                {
                    this.$('#imageViewer').empty().append("<div id='internalViewer'><div class='breakword' style='width:100%;margin: 0px auto; background-color:" + firstContent.bgcolor + "; font-size:" + firstContent.size + "px; color:" + firstContent.color + ";font-family:" + firstContent.font + "; line-height:" + firstContent.size + "px;'>" + firstContent.text + "</div></div>");
                }
            }
            else
            {
                if(this.contentList.length > 1)
                {
                    this.$('#imageViewer').empty().append("<div id='nextButton'><a class='btn btn-success' id='nextItem'>Next Image</a></div><div id='internalViewer'><img src='" + firstContent.image + "' width=100%></div>");
                }
                else
                {
                    this.$('#imageViewer').empty().append("<div id='internalViewer'><image src='" + firstContent.content + "'></div>");
                }
            }
        }
        else
        {
            utils.showAlert('Preview Error', 'Add content to phrase before preview', 'alert-info');  
        }
        this.contentCounter++;
    }, 
    nextItem: function() {
        var contentNext;
        var i = this.contentCounter++;
        console.log(i);
        if (i == this.contentList.length)
        {
            this.$('#imageViewer').empty();
        }
        else
        {
            contentNext = this.contentList[i];
            console.log("image next: " + contentNext);
            if(imageNext.imageType == 19)
            {
                this.$('#internalViewer').empty().append("<div class='breakword' style='width:100%;margin: 0px auto; background-color:" + contentNext.bgcolor + "; font-size:" + contentNext.size + "px; color:" + contentNext.color + ";font-family:" + contentNext.font + "; line-height:" + contentNext.size + "px;'>" + contentNext.text + "</div>");
            }
            else
            {
                this.$('#internalViewer').empty().append("<image src='" + contentNext.content + "'>");
            }
        }
    }      
});
window.ContentCollectionsView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});