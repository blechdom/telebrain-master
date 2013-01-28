window.FractionsMasterView = Backbone.View.extend({

    initialize: function (options) {

        this.collection.each(function(programModel) {
            if(programModel.get('_id')==this.options.fraction_id) 
            { 
                this.model.set(programModel.attributes);
            }
        }, this);

         if(this.model.get('permissions')=="1"){
            this.model.set("_id", null);
            this.model.set("image", "pics/units.jpg");
            this.model.set("permissions", 0);
        }

        _.bindAll(this, 'render', 'beforeSave', 'saveModule', 'setFractionList', 'addToList', 'deleteModule', 'renderRole', 'imageMenus', 'audioMenus'); //must bind before rendering
        this.render();
    },

    render: function () {
        if (!this.fractionView) {
            this.fractionView = new FractionView();
        }
        $(this.el).append(this.fractionView.el);
        
        this.$('#fractionName').append('<input type="text" id="name" name="name" value="' + this.model.get("name") + '"/><span class="help-inline"></span>');
        this.$('#description').append(this.model.get("description"));
        this.renderRole();

        return this;
    },
    events: {
        "change #name"                  : "change",
        "click .save"                   : "beforeSave",
        "click .delete"                 : "deleteModule",
        "click #clearList"              : "clearList",
        "click #addFraction"            : "assignFraction",
        "click #toggleImage"            : "imageMenus",
        "click #toggleAudio"            : "audioMenus",
        "click #toggleFolders"          : "folderMenus",
        "change #imageURLMenu"          : "addToList",
        "change #folderMenu"            : "selectedFolderMenus",
        "change #fractionMenu"          : "setFractionNumber",
        "change #rolesMenu"             : "setRole",
        "change #imageUploadMenu"       : "addToList",
        "change #telepromptMenu"        : "addToList",
        "change #audioURLMenu"          : "addToList",
        "change #audioUploadMenu"       : "addToList",
        "change #TTSMenu"               : "addToList",
        "change #audioSentenceMenu"     : "addToList",
        "change #selectedFolderMenu"    : "addToList"
        

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
                utils.showAlert('Success!', 'Fraction saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this fraction', 'alert-error');
            }
        });
    },

    deleteModule: function () {

        this.model.destroy({
            success: function () {
                alert('Fractional Assignment deleted successfully');
                window.location.replace('#perform/16/51');
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
    clearList: function(e) {
        utils.hideAlert();
        this.model.set("fractionlist", []);
        $('#fractionListViewer').empty();
        this.model.set("fractionCount", 0);
        this.assignFraction();
    },
    setRole: function(e) {
        utils.hideAlert();
        var val = $(e.currentTarget).val(); 
        if (val != 0) {
            this.model.set("role", val);
            this.clearList();
            this.addFraction();
        }
        else {
            utils.showAlert('Oops!', 'Select a Role', 'alert-error');
        } 
    },
    addFraction: function() {
        utils.hideAlert();
        var selectedFlag = '';
        var selectedVal = this.model.get("fractionNumber");
        console.log("fraction number " + selectedVal);

        this.$("#fractionDiv").empty().append('<Br><div id="fractionMenuDiv"><label for="name" class="control-label">Number of Groups:</label><div class="controls"><select id="fractionMenu" class="input-mini"><option value="0"> # </option>');
        for (var i = 1; i<=12; i++) {
            if(i==selectedVal) {
                console.log(i);
                    selectedFlag = "selected";
            }
            else { selectedFlag = ""; }
            this.$("#fractionMenu").append('<option value="' + i + '" ' + selectedFlag + '>' + i + '</option>');
        }
        this.$("#fractionDiv").append('</select></div></div><Br><div id="fractionAssignments"></div>');
        if (selectedVal){
            this.model.set("fractionCount", 0);
            this.loadFractionList();
        }
    },
    renderRole: function () {
        utils.hideAlert();
        var selectedFlag = '';
        var selectedVal = this.model.get("role");

        this.$("#roleDiv").empty().append('<label for="name" class="control-label">Choose Role:</label><div class="controls"><select id="rolesMenu"><option value="0">--SELECT ROLES--</option><option value="1">All</option>');

        this.collection.each(function(model) {
            if(model.get('parent_id')==12)
            {
                
                if (selectedVal){
                    if(model.get("_id")==selectedVal) {
                        selectedFlag = "selected";
                    }
                    else { selectedFlag = ""; }
                }
                this.$('#rolesMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + '" ' + selectedFlag + '>' + model.get("name") + '</option>');
            } 
        }, this);
        if (selectedVal) {
            this.model.set("fractionCount", 0);
            this.addFraction();
        }
        this.$("#roleDiv").append('</select></div>');
    },
    addToList: function(e) {

        var roleId = $('#rolesMenu').val();
        var roleName = $('#rolesMenu').find('option:selected').text();
        var fractionList = this.model.get("fractionlist");
        var val = $(e.currentTarget).val();
        console.log("current target " + val);
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var dataInfo = $(e.currentTarget).find('option:selected').data('image');
            console.log(val + " " + name + " " + roleId + " " + roleName + " " + dataInfo);
            fractionList.push({"contentId": val, "contentName": name, "roleId": roleId, "roleName": roleName, "dataInfo": dataInfo});
            this.model.set("fractionlist", fractionList);
            console.log("fractionlist " + this.model.get("fractionlist"));
            this.drawList(roleName, name);
            $(e.currentTarget)[0].selectedIndex = 0;
            $('#fractionAssignments').empty();
            var fractionCount = this.model.get("fractionCount") + 1;
            this.model.set("fractionCount", fractionCount);
            this.assignFraction();
        }
    },
    loadFractionList: function() {
        var roleId = this.model.get("role");
        var roleName = "";
        this.collection.each(function(model) {
            if(model.get('_id')==roleId) {
                roleName = model.get("name");
            }
        }, this);
        var fractionList = this.model.get("fractionlist");
        var fractionCount = this.model.get("fractionCount");
        console.log(JSON.stringify(fractionList, null, 2));
        if (fractionList) {
            for (var i=0; i<fractionList.length; i++){
                this.model.set("fractionCount", fractionCount);
                this.drawList(fractionList[i].roleName, fractionList[i].contentName);
                fractionCount++;
            }
        }
        this.model.set("fractionCount", fractionCount);
        this.assignFraction();
    },
    setFractionList: function(programId) {
        var fractionList = this.model.get("fractionlist");
        for (var i=0; i<fractionList.length; i++){
            this.drawList(fractionList[i].roleName, fractionList[i].contentName);
        }
        console.log("fraction list " + fractionList);
    },
    drawList: function(roleName, contentName){
            var fractionCount = this.model.get("fractionCount") + 1;
            this.$('#fractionListViewer').append("<li><b>" + roleName + " #" + fractionCount + ":</b> " + contentName + " </li>");
    },
    setFractionNumber: function(e) {
        var fractionNumber = $(e.currentTarget).val();

        this.model.set("fractionNumber", fractionNumber);
        this.clearList();
        this.assignFraction();
    },
    assignFraction: function(){
        var fractionCount = this.model.get("fractionCount") + 1;
        var maxCount = this.model.get("fractionNumber");
        if (fractionCount <= maxCount) {
            console.log("assigning fraction in here");
            this.$('#fractionAssignments').empty().append('<label for="name" class="control-label">Assign Fraction #' + fractionCount + ':</label>');
            this.$('#fractionAssignments').append('<div class="controls"> <div id="checkboxes" class="form-horizontal"><input type="checkbox" id="toggleImage" onclick="$(this).val(this.checked ? 1 : 0)"> Image <input type="checkbox" id="toggleAudio" onclick="$(this).val(this.checked ? 1 : 0)"> Audio <input type="checkbox" id="toggleFolders" onclick="$(this).val(this.checked ? 1 : 0)"> Folders </div><br><div id="imageChat"></div><div id="audioChat"></div><div id="folderChat"></div><br><div id="selectedFolderChat"></div></div></div>');
        }
        else {
            utils.showAlert('Complete!', 'The maximum number of groups have been assigned.', 'alert-info');
        }
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
    folderMenus: function(e) {

       var folderChatFlag = $(e.currentTarget).val();
       console.log("flag " + folderChatFlag);
       if (folderChatFlag==1)
        {
            this.$('#folderChat').empty().append('<div id="folderMenuDiv"></div>'); 
            this.renderFolderMenus();
        }
        else
        {
            this.$('#folderChat').empty();
        }
    },  
    selectedFolderMenus: function(e) {

        var folderId = $(e.currentTarget).val();
        var folderContentList = $(e.currentTarget).find('option:selected').data('phrase');
        console.log("flag " + folderId + " phrase " + folderContentList);
        this.$('#selectedFolderChat').empty().append('<div id="selectedFolderMenuDiv"></div><select id="selectedFolderMenu"><option value="0">--SELECT CONTENT--</option>'); 
        folderContentList = folderContentList.split(',');
        for (var i =0; i<folderContentList.length; i++){

            console.log(folderContentList[i]);
            
            this.collection.each(function(model) {

                if((model.get('_id')==folderContentList[i])&&(model.get('permissions')!=1)){ 
                    console.log(model.get("name"));
                    this.$('#selectedFolderMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
                }
            }, this);
        }
        this.$('#folderChat').append('</select></div>'); 
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
    },
    renderAudioMenus: function() {
        
        this.$("#audioURLMenuDiv").prepend('<select id="audioURLMenu"><option value="0">--SELECT AUDIO--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==21)&&(model.get('permissions')!=1)){ 

             this.$('#audioURLMenu').append('<option value="' + model.get("_id") + '" data-image="snd/urls/' + model.get("_id") + '.mp3,21">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioUploadMenuDiv").prepend('<select id="audioUploadMenu"><option value="0">--SELECT AUDIO--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==22)&&(model.get('permissions')!=1)){ 
             this.$('#audioUploadMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("audio") + ',22">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#TTSMenuDiv").prepend('<select id="TTSMenu"><option value="0">--SELECT TTS--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==23)&&(model.get('permissions')!=1)){ 
             this.$('#TTSMenu').append('<option value="' + model.get("_id") + '" data-image="snd/ttsdb/' + model.get("_id") + '.mp3,23">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#audioSentenceMenuDiv").prepend('<select id="audioSentenceMenu"><option value="0">--SELECT SENTENCE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==58)&&(model.get('permissions')!=1)&&(model.get('_id')!=this.phraseId)){ 
             this.$('#audioSentenceMenu').append('<option value="' + model.get("_id") + '" data-image="snd/phrases/' + model.get("_id") + '.mp3,58">' + model.get("name") + '</option>');
            }
        }, this);
    },
    renderFolderMenus: function() {
        
        this.$("#folderMenuDiv").prepend('<select id="folderMenu"><option value="0">--SELECT FOLDER--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==59)&&(model.get('permissions')!=1)){ 

             this.$('#folderMenu').append('<option value="' + model.get("_id") + '" data-phrase="' + model.get("phrase") + '">' + model.get("name") + '</option>');
            }
        }, this);
    }  
});
window.FractionView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});