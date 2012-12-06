window.Module = Backbone.Model.extend({

    urlRoot: "/modules",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.type = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a type"};
        };

        this.validators.control = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a control"};
        };
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
        name: "",
        creator: "",
        type: "",           //pulldown
        control: "",
        description: "",
        picture: null,
        text: "",
        audio: ""
    }
});

window.ModuleCollection = Backbone.Collection.extend({

    model: Module,

    url: "/modules"

});