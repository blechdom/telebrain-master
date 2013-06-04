window.LoginView = Backbone.View.extend({

    initialize: function () {

        _.bindAll(this, 'render', 'beforeLogin', 'createSession'); //must bind before rendering
        console.log("initialize login");

        this.render();
    },

    render: function () {
        console.log("rendering login");
        $(this.el).html(this.template());
        return this;
    },
    events: {
        "click #loginSubmit"    : "beforeLogin"
     },
    beforeLogin: function () {
        utils.removeValidationError("name");
        utils.removeValidationError("password");
        utils.hideAlert();
        var self = this;
        var name = $('#name').val();
        var password = $('#password').val();
        var nameflag = 0;
        
        this.model.set("name", name);
        this.model.set("password", password);

        console.log("name: " + this.model.get('name') + " password: " + this.model.get('password'));

        var check = this.model.validateAll();
        
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        else {
            this.collection.each(function(model) {
                if (model.get('name') == name){
                    nameflag = 1;
                    console.log("name found, checking password");
                    if (model.get('password') == password){
                        console.log("password found, creating session");
                        this.model.set(model.attributes);
                    }
                    else {
                        utils.showAlert('Error!', 'Password does not match username.', 'alert-error');
                    }
                }
            }, this);
            if (nameflag ==0) {
                utils.showAlert('Error!', 'Username does not exist.', 'alert-error');
            }
            console.log("model: " + JSON.stringify(this.model));
            this.createSession();
            return false;
        }
    },

    createSession: function () {
        console.log("creating session");
        var self = this;
        this.model.save(null, {
            success: function(model) {
                app.navigate('#brains/' + model.get('_id'), true);
            },
            error: function () {
                utils.showAlert('Error!', 'An error occurred while trying to begin your session', 'alert-error');
            }
        });
    }
});