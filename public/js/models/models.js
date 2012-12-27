window.Create = Backbone.Model.extend({ urlRoot: "/create" });

window.CreateCollection = Backbone.Collection.extend({

    model: Create,

    initialize : function(options) {
        this.type_id = options.type_id;     
        console.log(this.type_id);
    },
    url : function(options) {
        console.log(this.type_id);
        return "/create/" + this.type_id;
    }

});

window.ImageURLs = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.type_id = options.type_id;
        this._id = options._id;
        console.log("model for this id " + this._id + " and type" + this.type_id);

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.image = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a URL"};
        };
    },
    urlRoot : function(options) {

        return "/create/" + this.type_id;
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
        name: "Name your image here.",
        troupename: "",
        permissions: "",           //pulldown
        image: "pics/imageURL.jpg"
    }
});

window.AudioURLs = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.type_id = options.type_id;
        this._id = options._id;
        console.log("model for this id " + this._id + " and type" + this.type_id);

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.audio = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a URL"};
        };
    },
    urlRoot : function(options) {

        return "/create/" + this.type_id;
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
        troupename: "",
        permissions: "",           //pulldown
        audio: ""
    }
});

window.Teleprompts = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.type_id = options.type_id;
        this._id = options._id;
        console.log("model for this id " + this._id + " and type" + this.type_id);
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.text = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter some text"};
        };
    },
    urlRoot : function(options) {

        return "/create/" + this.type_id;
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
        text: "",
        font: "Quantico",
        color: "#000",
        size: "12px",
        bgcolor: "#FFF",
        troupename: "telebrain",
        permissions: ""
    }
});

window.TTSs = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.type_id = options.type_id;
        this._id = options._id;
        console.log("model for this id " + this._id + " and type" + this.type_id);
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.text = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter some text"};
        };
    },
    urlRoot : function(options) {

        return "/create/" + this.type_id;
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
        text: "",
        voice: "Arial",
        troupename: "telebrain",
        permissions: ""
    }
});
