window.FragmentsMasterView = Backbone.View.extend({

    initialize: function () {
        var programId, programObject, network, networkName;
        var roleList = [];
        this.model.set("rolelist", []);
        _.bindAll(this, 'render', 'beforeSave', 'saveModule', 'setFragmentList', 'addToList', 'deleteModule', 'setProgram', 'renderRole', 'imageMenus', 'audioMenus'); //must bind before rendering

        this.render();
    },

    render: function () {
        if (!this.fragmentView) {
            this.fragmentView = new FragmentView();
        }
        $(this.el).append(this.fragmentView.el);
        
        this.programId = this.model.get("_id");
        console.log("programId: " + this.model.get("_id"));
        this.collection.each(function(programModel) {
            if(programModel.get('_id')==this.programId) 
            { 
                this.model.set(programModel.attributes);
            }
        }, this);

        if(this.model.get('permissions')==1){
            this.model.set(this.model.defaults);
            console.log("this is default fragment");
        }
        
        this.$('#fragmentName').append('<input type="text" id="name" name="name" value="' + this.model.get("name") + '"/><span class="help-inline"></span>');

        
        this.$("#programMenuDiv").prepend('<select id="programMenu"><option value="0">--SELECT PROGRAM--</option>');
        var selectedFlag = '';
        var selectedVal = "";
        this.collection.each(function(model) {
            if((model.get('parent_id')==15)&&(model.get('permissions')!=1)){ 
               //this.$('#programMenu').append('<option value="' + model.get("_id") + '" selected="selected">' + model.get("name") + '</option>');
                if(model.get("_id")==this.model.get("programId"))
                {
                    selectedFlag = "selected";
                    selectedVal = model.get("_id");
                }
                else { selectedFlag = ""};
               this.$('#programMenu').append('<option value="' + model.get("_id") + '" ' + selectedFlag + '>' + model.get("name") + '</option>');
            }
        }, this);
        if(selectedVal) { this.setFragmentList(selectedVal); console.log("selectedval " + selectedVal);}

        return this;
    },
    events: {
        "change #name"                  : "change",
        "click .save"                   : "beforeSave",
        "click .delete"                 : "deleteModule",
        "change #programMenu"           : "setProgram",
        "click #clearList"              : "clearList",
        "click #addRole"                : "addRole",
        "click #toggleImage"            : "imageMenus",
        "click #toggleAudio"            : "audioMenus",
        "change #imageURLMenu"          : "addToList",
        "change #imageUploadMenu"       : "addToList",
        "change #telepromptMenuDiv"     : "addToList",
        "change #audioURLMenu"          : "addToList",
        "change #audioUploadMenu"       : "addToList",
        "change #TTSMenu"               : "addToList",
        "change #audioSentenceMenu"     : "addToList"
        

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
                app.navigate('#program/' + model.get("parent_id") + '/' + model.get('_id'), true);
                utils.showAlert('Success!', 'Fragment saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this fragment', 'alert-error');
            }
        });
    },

    deleteModule: function () {

        this.model.destroy({
            success: function () {
                alert('Fragment deleted successfully');
                window.location.replace('#perform/4/50');
            }
        });
        return false;
    },
    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        console.log("target name: " + target.name);
        this.model.set(change);
        console.log(JSON.stringify(this.model, null, 2));
        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },
    setProgram: function(e) {
        utils.hideAlert();
        var roleList = [];
        var val = $(e.currentTarget).val(); 
        this.model.set("programId", val);
        this.model.set("fragmentList", []);
        $("#roleDiv").empty();  
        $('#fragmentListViewer').empty();
    },
    clearList: function(e) {
        this.model.set("fragmentList", []);
        $("#roleDiv").empty();  
        $('#fragmentListViewer').empty();
    },
    addRole: function(e) {
        console.log("addRole");

        var programId = this.model.get("programId");
        console.log("Program ID " + programId);
        if (programId != 0) {
            this.renderRole(programId);
        }
        else {
            utils.showAlert('Oops!', 'Select a Performance Program before Adding a Role.', 'alert-error');
        }
        
    },
    renderRole: function (val) {
        this.collection.each(function(model) {
            if(model.get('_id')==val)
            {
                roleList = model.get("rolelist");
                console.log("associated rolelist " + roleList);
            } 
        }, this);
        this.$("#roleDiv").empty().append('<label for="name" class="control-label">Choose Role:</label><div class="controls"><select id="rolesMenu"><option value="0">--SELECT ROLES--</option><option value="1">All</option>');
        for (i = 0; i < roleList.length; i++ ){
            console.log("array members: " + roleList[i]);
            this.collection.each(function(model) {
                if(model.get('_id') == roleList[i]){ 
                    this.$('#rolesMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + '">' + model.get("name") + '</option>');
                }
            }, this);
        } 
        this.$("#roleDiv").append('</select></div><div class="control-group"><div class="controls"><div id="checkboxes" class="form-horizontal"><input type="checkbox" id="toggleImage" onclick="$(this).val(this.checked ? 1 : 0)"> Image <input type="checkbox" id="toggleAudio" onclick="$(this).val(this.checked ? 1 : 0)"> Audio </div><div id="imageChat"></div><div id="audioChat"></div>');
    },
    addToList: function(e) {
        utils.hideAlert();
        var roleId = $('#rolesMenu').val();
        var roleName = $('#rolesMenu').find('option:selected').text();
        if (roleId == 0){
            utils.showAlert('Oops!', 'Select a Role before adding Content.', 'alert-error');
        }
        else {
            var fragmentList = this.model.get("fragmentList");
            var val = $(e.currentTarget).val();
            console.log("current target " + val);
            if (val != 0) {
                var name = $(e.currentTarget).find('option:selected').text();
                console.log(val + " " + name + " " + roleId + " " + roleName);
                fragmentList.push({"contentId": val, "contentName": name, "roleId": roleId, "roleName": roleName});
                this.model.set("fragmentList", fragmentList);
                console.log("fragmentList " + this.model.get("fragmentList"));
                this.drawList(roleName, name);
                $(e.currentTarget)[0].selectedIndex = 0;
                $('#roleDiv').empty();
            }
        }
    },
    setFragmentList: function(programId) {
        var fragmentList = this.model.get("fragmentList");
        for (var i=0; i<fragmentList.length; i++){
            this.drawList(fragmentList[i].roleName, fragmentList[i].contentName);
        }
        console.log("fragment list " + fragmentList);
    },
    drawList: function(roleName, contentName){
            this.$('#fragmentListViewer').append("<li><b>" + roleName + ":</b> " + contentName + " </li>");
    },
    imageMenus: function(e) {

        var imageChatFlag = $(e.currentTarget).val();
        if (imageChatFlag==1)
        {
            this.$('#imageChat').empty().append('<div id="imageURLMenuDiv"></div><div id="imageUploadMenuDiv"></div><div id="telepromptMenuDiv"></div><div id="imagePhraseMenuDiv"></div>'); 
            this.renderImageMenus();
        }
        else
        {
            this.$('#imageChat').empty();
        }
    },
    audioMenus: function(e) {

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
    },   
    renderImageMenus: function() {
        
       console.log("render menus");
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

        this.$("#telepromptMenuDiv").prepend('<select id="telepromptMenu"><option value="0">--SELECT TELEPROMPT--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==19)&&(model.get('permissions')!=1)){ 
             this.$('#telepromptMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
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

             this.$('#audioURLMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioUploadMenuDiv").prepend('<select id="audioUploadMenu"><option value="0">--SELECT AUDIO--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==22)&&(model.get('permissions')!=1)){ 
             this.$('#audioUploadMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#TTSMenuDiv").prepend('<select id="TTSMenu"><option value="0">--SELECT TTS--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==23)&&(model.get('permissions')!=1)){ 
             this.$('#TTSMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioSentenceMenuDiv").prepend('<select id="audioSentenceMenu"><option value="0">--SELECT SENTENCE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==58)&&(model.get('permissions')!=1)&&(model.get('_id')!=this.phraseId)){ 
             this.$('#audioSentenceMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);
    }  
});
window.FragmentView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});