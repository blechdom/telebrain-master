
window.Performance2 = Backbone.Model.extend({ 

	idAttribute: "_id",

    initialize: function (options) {
        this.parent_id = options.parent_id;
        this.performance_id = options._id;

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a new performance name"};
        };
        this.validators.role = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a role"};
        }; 
        this.validators.nickname = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a nickname"};
        }; 
    },
    urlRoot : function(options) {

        return "/performance2/" + this.parent_id;
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
        performanceName: "New Performance Name",
        nickname: "",
        playerRole: "",
        name: "name new program",
        image: "pics/program.jpg",
        network: null,
        rolelist: [],
        permissions: "0"
    }
});

window.PerformanceCollection2 = Backbone.Collection.extend({
    model: Performance2,

    initialize : function(options) {
        this.performance_parent_id = options.parent_id;    
        this.performance_id = options._id; 
    },
    url : function(options) {
        return "/performance2/" + this.performance_parent_id + "/" + this.performance_id;
    }
});