window.ProgramsMasterView = Backbone.View.extend({

    initialize: function () {
        var programId, programObject, network, networkName;
        var roleList = [];
        this.model.set("rolelist", []);
        _.bindAll(this, 'render', 'beforeSave', 'loadList', 'saveModule', 'deleteModule', 'addToList', 'clearList', 'drawList', 'viewNetwork'); //must bind before rendering

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
        this.network = this.model.get("network");
        console.log("network id " + this.network);

        for (i = 0; i < this.roleList.length; i++ ){
            console.log("array members: " + this.roleList[i]);
            //limit to program parent_id eventually
            this.collection.each(function(model) {
                if(model.get('_id') == this.roleList[i]){ 
                    this.drawList(model.get('name')); 
                    //this.roleList.push(model.get('image')); 
                }
            }, this);
        } 
        this.loadList();
        this.$("#networkMenuDiv").prepend('<select id="networkMenu" name="network"><option value="0">--SELECT NETWORK--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==11)&&(model.get('permissions')!=1)){ 
                if(model.get('_id') == this.network)
                {
                    this.$('#networkMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + '" selected="selected">' + model.get("name") + '</option>');
                    this.$('#networkImage').empty().append("<img src='" + model.get("image") + "'>");
                    this.$('#networkName').empty().append("<h5>" + model.get("name") + "</h5>");
                }
                else{
                     this.$('#networkMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + '">' + model.get("name") + '</option>');
                }
            }
        }, this);

        this.$("#rolesMenuDiv").prepend('<select id="rolesMenu" name="rolelist"><option value="0">--SELECT ROLES--</option>');

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
        "change #networkMenu"   : "viewNetwork",
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
                //self.render();
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
                //window.history.back();
                window.location.replace('#perform/4/15');
            }
        });
        return false;
    },

    clearList: function(e) {
         // Remove any existing alert message
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
    loadList: function(){
        if (this.roleList.length == 0) {
            console.log("gonna add some stuff");
            for (i = 0; i < this.roleList.length; i++ ){
                this.collection.each(function(model) {
                    if(model.get('_id') == this.roleList[i]){ 
                        this.roleList.push(model.get('_id'));
                    }
                }, this);
            } 
        }             
    },
    addToList: function(e) {
        if(this.roleList.length==0){ this.loadList(); }
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var image = $(e.currentTarget).find('option:selected').data('image');
            console.log(name);
            this.roleList.push(val);
            this.model.set("rolelist", this.roleList);
            console.log(this.model.get("rolelist"));
            this.drawList(name);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    drawList: function(name){
            this.$('#roleViewer').append("<li>" + name + " </li>");
    },
    viewNetwork: function(e) {
        this.change(e);
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var image = $(e.currentTarget).find('option:selected').data('image');
            this.model.set("network", val);
            console.log(val + " " + name + " " + image);
            $('#networkImage').empty().append("<img src='" + image + "'>");
            $('#networkName').empty().append("<h5>" + name + "</h5>");
        }
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