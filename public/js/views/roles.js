window.RoleView = Backbone.View.extend({

    initialize: function () {
        //Force Defaults on NEW
        if(this.model.get('permissions')==1){
            this.model.set(this.model.defaults);
        }
        console.log("role model : " + JSON.stringify(this.model, null, 2));
        this.render();
    },

    render: function () {

        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change #name"  : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteModule",
        "click #interfaceCheckboxes input[type='checkbox']"    : "setFunctionality",
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
                utils.showAlert('Success!', 'Role saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {
        this.model.destroy({
            success: function () {
                alert('Role deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    setFunctionality: function(e) {
        var check=e.currentTarget;
        var flagVal = $(e.currentTarget).val();
        console.log("id " + check.id + " current val " + flagVal);
        if (flagVal == 1) 
        {
            this.model.set(check.id, "checked");
        }
        else
        {
            this.model.set(check.id, "");
        }

    }
});
