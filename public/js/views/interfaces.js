window.InterfaceView = Backbone.View.extend({

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
        "change #name"          : "change",
        "change #interfaceText" : "changeText",
        "change #buttonSize"    : "changeSize",
        "change #buttonColor"   : "changeColor",
        "change #inputType"     : "updateType",
        "click .save"           : "beforeSave",
        "click .delete"         : "deleteModule", 
        "click #btnWidth"       : "changeWidth",
        "change #folderInterface"   : "setDropdown"
    },

    change: function (event) {
        utils.hideAlert();

        // Apply the change to the model
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
                app.navigate('perform/' + model.parent_id + '/' + model.get('_id'), false);
                utils.showAlert('Success!', 'Interface saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {
        this.model.destroy({
            success: function () {
                alert('Interface deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    updateType: function(e) {
        var typeVal = $(e.currentTarget).val();
        this.model.set("inputType", typeVal);
        var interfaceText = this.model.get("interfaceText");
        if (typeVal == 0){
        }
        else if (typeVal =="Button") {
            console.log("button");
            var btnWidth = this.model.get("btnWidth");
            var widthSelected = "";
            if (btnWidth==1){ widthSelected = "selected";}
            $('#interfaceView').empty().append('<label for="inputType" class="control-label">Interface Qualities:</label><div class="controls"><input type="text" id="interfaceText" name="interfaceText" value="' + interfaceText + '"/><br><br><select id="buttonColor"><option value="btn">white</option><option value="btn btn-warning">orange</option><option value="btn btn-primary">blue</option><option value="btn btn-inverse">black</option><option value="btn btn-danger">red</option><option value="btn btn-success">green</option><option value="btn btn-info">sky blue</option></select><br><br><select id="buttonSize"><option value="btn">medium</option><option value="btn-large">large</option><option value="btn-small">small</option><option value="btn-mini">mini</option></select><br><br><label class="checkbox"><input type="checkbox" id="btnWidth" onclick="$(this).val(this.checked ? 1 : 0)" ' + widthSelected + '>Full Width</label><br><Br><div><a id="btnClass" class="btn">' + interfaceText + '</a></div>');
        }
        else if (typeVal == "Dropdown Menu") {
            console.log("dropdown menu");
            $('#interfaceView').empty().append('<label for="inputType" class="control-label">Interface Qualities:</label><div class="controls"><select id="folderInterface"><option value="0">--SELECT FOLDER--</option></select><br><br><div id="dropdownView"></div>');
            console.log("render menus");

            this.collection.each(function(model) {
                if((model.get('parent_id')=="59")&&(model.get('permissions')!=1)){ 
                 this.$('#folderInterface').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
                }
            }, this);
        }
        else if (typeVal == "Checkbox") {
            console.log("checkbox");
        }
        else if (typeVal == "Text Input") {
            console.log("text input");
        } 
    },
    changeColor: function(e) {
        var colorVal = $(e.currentTarget).val();
        this.model.set("btnColor", colorVal);
        this.renderButton();
    },
    changeSize: function(e) {
        var sizeVal = $(e.currentTarget).val();
        this.model.set("btnSize", sizeVal);
        this.renderButton();
    },
    changeWidth: function(e) {
        var widthVal = $(e.currentTarget).val();
        this.model.set("btnWidth", widthVal);
        this.renderButton();
    },
    changeText: function(e) {
        var textVal = $(e.currentTarget).val();
        console.log("change text " + textVal);
        this.model.set("interfaceText", textVal);
        var inputType = this.model.get("inputType");
        if (inputType == "Button") {
            $("#btnClass").empty().append(textVal);
        }  
        else if (inputType == "Dropdown Menu") {
            console.log("changing text");
            this.renderDropdown();
        }        
    },
    renderButton: function() {
        var colorVal = this.model.get("btnColor");
        var sizeVal = this.model.get("btnSize");
        var widthVal = "";
        var btnWidth = this.model.get("btnWidth");
        if (btnWidth==1){ widthVal = " btn-block"; }
        var classString = sizeVal + " " + colorVal + widthVal;
        $("#btnClass").attr('class', classString);
    },
    setDropdown: function(e) {
        var folderVal = $(e.currentTarget).val();
        console.log(folderVal);
        if (folderVal != 0) {
            this.model.set("interfaceFolder", folderVal);
            this.renderDropdown();
        }
        else {
            this.$("#dropdownView").empty();
        }
    },
    renderDropdown: function() { 
        var folderVal = this.model.get("interfaceFolder");
        var interfaceText = this.model.get("interfaceText");
        var folder = [];
        this.$("#dropdownView").empty().append('<input type="text" id="interfaceText" name="interfaceText" value="' + interfaceText + '"/><br><br><select id="dropdownContents"><option value="0">--' + interfaceText + '--</option></select>');
        this.collection.each(function(model) {
            if(model.get('_id')==folderVal){ 
                folder = model.get("phrase");
            }
        }, this);
        console.log(folder);
        for (var i =0; i< folder.length; i++) {
            this.collection.each(function(model) {
                if(model.get('_id')==folder[i]){ 
                    this.$('#dropdownContents').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
                }
            }, this);
        }
    }

});
