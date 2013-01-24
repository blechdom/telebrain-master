window.Fragments = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.parent_id = options.parent_id;
        this.program_id = options._id;

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
        this.validators.programId = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a performance program"};
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
        name: "name new fragment",
        image: "pics/units.jpg",
        programId: "",
        rolelist: [],
        permissions: "0",
        fragmentList: []
    }
});


window.FragmentsCollection = Backbone.Collection.extend({

    model: Programs,

    initialize : function(options) {
        this.program_parent_id = options.parent_id;    
        this.program_id = options._id; 
    },
    url : function(options) {
        return "/program/" + this.program_parent_id + "/" + this.program_id;
    }

});