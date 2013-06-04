window.MyBrains = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {

        this.validators = {};

        /*this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.password = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a password"};
        };*/
    },
    urlRoot : function(options) {

        return "/brains/" + options._id;
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
        name: "new brain",
        roleList: ["new role"],
        contentList: [],
        rolesList: []
    }
});

window.MyBrainsCollection = Backbone.Collection.extend({

    model: MyBrains,

    initialize : function(options) {
        this.brains_id = options._id; 
    },
    url : function(options) {
        console.log("in my brains url function");
        return "/brains/" + this.brains_id;
    }

});