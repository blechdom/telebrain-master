window.ProgramsMasterView = Backbone.View.extend({

    initialize: function () {
        var programId, programObject;
        var roleList = [];
        this.model.set("rolelist", []);
        _.bindAll(this, 'render', 'beforeSave', 'saveModule', 'deleteModule', 'addToList', 'clearList', 'drawList'); //must bind before rendering

        this.render();
    },

    render: function () {
        if (!this.programView) {
            this.programView = new ProgramView();
        }
        $(this.el).append(this.programView.el);
        
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
            console.log("this is default program");
            this.roleList = [];
            this.model.set("rolelist", this.roleList);
        }
        
        this.$('#programName').append('<input type="text" id="name" name="name" value="' + this.model.get("name") + '"/><span class="help-inline"></span>');

        this.roleList = this.model.get("rolelist");

        for (i = 0; i < this.roleList.length; i++ ){
            console.log("array members: " + this.roleList[i]);
            this.collection.each(function(model) {
                if(model.get('_id') == this.roleList[i]){ 
                    this.drawList(model.get('name')); 
                }
            }, this);
        } 

        this.$("#rolesMenuDiv").prepend('<select id="rolesMenu"><option value="0">--SELECT ROLES--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==12)&&(model.get('permissions')!=1)){ 
             this.$('#rolesMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + '">' + model.get("name") + '</option>');
            }
        }, this);

        return this;
    },
    events: {
        "change #name"          : "change",
        "click .save"           : "beforeSave",
        "click .delete"         : "deleteModule",
        "change #rolesMenu"     : "addToList",
        "click #clearList"      : "clearList"
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
                utils.showAlert('Success!', 'Program saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {

        this.model.destroy({
            success: function () {
                alert('Program deleted successfully');
                window.location.replace('#perform/4/15');
            }
        });
        return false;
    },

    clearList: function(e) {
        utils.hideAlert();
        this.roleList = [];
        this.model.set("rolelist", this.roleList);
        this.$('#roleViewer').empty();
        console.log("Cleared List");
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
    addToList: function(e) {
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var image = $(e.currentTarget).find('option:selected').data('image');
            var pushFlag=1;
            for( var i=0; i<this.roleList.length; i++)
            { 
                if(val == this.roleList[i])
                {
                    pushFlag = 0;
                    utils.showAlert('Oops!', 'Only unique roles can be added.', 'alert-info');
                }
            }
            if (pushFlag == 1)
            {
                console.log(name);
                this.roleList.push(val);
                this.model.set("rolelist", this.roleList);
                this.drawList(name);
                utils.hideAlert();
            }
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    drawList: function(name){
            this.$('#roleViewer').append("<li>" + name + " </li>");
    }
});
window.ProgramView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});