window.Teleprompts = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.parent_id = options.parent_id;
        this._id = options._id;
        console.log("model for this id " + this._id + " and type" + this.parent_id);
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.text = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter some text"};
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
        name: "name your teleprompt text",
        image: "pics/type.jpg",
        text: "Teleprompt Text here",
        font: "Quantico",
        color: "#000",
        size: "12px",
        bgcolor: "#FFF",
        troupename: "telebrain",
        permissions: "0"
    }
});