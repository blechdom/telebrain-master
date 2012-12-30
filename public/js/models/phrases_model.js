window.Phrases = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.parent_id = options.parent_id;
        this._id = options._id;
        console.log("model for this id " + this._id + " and type" + this.parent_id);

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
    },
    urlRoot : function(options) {

        return "/structure/" + this.parent_id;
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
        name: "Name your Phrase here.",
        image: "pics/phrases.jpg",
        phrase: "[1, 2, 3, 4]",
        permissions: "0"
    }
});


window.PhrasesCollection = Backbone.Collection.extend({

    model: Phrases,

    initialize : function(options) {
        this.parent_id = options.parent_id;    
        this._id = options._id; 
    },
    url : function(options) {
        return "/structure/" + this.parent_id + "/" + this._id;
    }

});