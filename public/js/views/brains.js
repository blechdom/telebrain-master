window.BrainsView = Backbone.View.extend({

    initialize: function () {
        //Force Defaults on NEW
        console.log("initialize brainsview");
        console.log("this model" + JSON.stringify(this.model));
        if(this.model.get('permissions')==1){
            console.log("permissions is 1");
            this.model.set(this.model.defaults);
            this.model.set("permissions", 0);
        }
    console.log("after defaults this model" + JSON.stringify(this.model));
        this.render();
    },

    render: function () {
        console.log("rendering");
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
                app.navigate('content/' + model.parent_id + '/' + model.get('_id'), false);
                utils.showAlert('Success!', 'Brains saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete your brains', 'alert-error');
            }
        });
    },
 
    deleteModule: function () {
        this.model.destroy({
            success: function () {
                alert('Brains deleted successfully');
                window.history.back();
            }
        });
        return false;
    }
});
