window.Interfaces = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.parent_id = options.parent_id;

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
        this.validators.inputType = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

    },
    urlRoot : function(options) {

        return "/program/" + this.parent_id;
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
        name: "Name your interface",  
        permissions: "0",
        inputType: "0",
        btnColor: "btn",
        btnSize: "btn",
        interfaceText: "interface text",
        btnWidth: "0",
        image: "pics/interface.png"
    }
});

window.InterfaceCollection = Backbone.Collection.extend({

    model: Interfaces,

    initialize : function(options) {
        this.phrase_parent_id = options.parent_id;    
        this.phrase_id = options._id; 
    },
    url : function(options) {
        return "/program/" + this.phrase_parent_id + "/" + this.phrase_id;
    }

});