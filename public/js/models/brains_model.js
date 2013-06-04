window.Brains = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.parent_id = options.parent_id;

        console.log("model for this parent " + this.parent_id);

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.password = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a password"};
        };
    },
    urlRoot : function(options) {

        return "/create/" + this.parent_id;
    },
    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    defaults: {
        _id: null,
        name: "name it",  
        password: "password",
        email: "",
        image: "pics/brain.jpg",
        permissions: "0"
    }
});

window.BrainsCollection = Backbone.Collection.extend({

    model: Brains,

    initialize : function(options) {
        this.phrase_parent_id = options.parent_id;    
        this.phrase_id = options._id; 
    },
    url : function(options) {
        console.log("in brains url function");
        return "/create/" + this.phrase_parent_id + "/" + this.phrase_id;
    }

});