window.Module = Backbone.Model.extend({

    urlRoot: "/modules",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.icon = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a type"};
        };

        this.validators.id = function (value) {
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
        icon: "",
        id: ""
    }
});

window.ModuleCollection = Backbone.Collection.extend({

    model: Module,

    url: "/modules"

});

window.Build = Backbone.Model.extend({

    urlRoot: "/build",

    idAttribute: "_id"

});

window.BuildCollection = Backbone.Collection.extend({

    model: Build,

    url: "/build"

});
window.Create = Backbone.Model.extend({

    urlRoot: "/create",

    //idAttribute: "_id"

});

window.CreateCollection = Backbone.Collection.extend({

    model: Create,

    url: "/create"

});

window.Troupes = Backbone.Model.extend({

    urlRoot: "/troupes",

    idAttribute: "_id"

});

window.TroupesCollection = Backbone.Collection.extend({

    model: Troupes,

    url: "/troupes"

});

window.Networks = Backbone.Model.extend({

    urlRoot: "/networks",

    idAttribute: "_id"

});

window.NetworksCollection = Backbone.Collection.extend({

    model: Networks,

    url: "/networks"

});
window.ImageURLs = Backbone.Model.extend({

    urlRoot: "/imageURLs",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.troupename = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a troupename"};
        };

        this.validators.URL = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a URL"};
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
        troupename: "",
        permissions: "",           //pulldown
        URL: ""
    }
});

window.ImageURLsCollection = Backbone.Collection.extend({

    model: ImageURLs,

    url: "/imageURLs"

});

window.ImageUploads = Backbone.Model.extend({

    urlRoot: "/imageUploads",

    idAttribute: "_id"

});

window.ImageUploadsCollection = Backbone.Collection.extend({

    model: ImageUploads,

    url: "/imageUploads"

});
window.AudioURLs = Backbone.Model.extend({

    urlRoot: "/audioURLs",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.troupename = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a troupename"};
        };

        this.validators.URL = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a URL"};
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
        troupename: "",
        permissions: "",           //pulldown
        URL: ""
    }
});

window.AudioURLsCollection = Backbone.Collection.extend({

    model: AudioURLs,

    url: "/audioURLs"

});
window.AudioUploads = Backbone.Model.extend({

    urlRoot: "/audioUploads",

    idAttribute: "_id"

});

window.AudioUploadsCollection = Backbone.Collection.extend({

    model: AudioUploads,

    url: "/audioUploads"

});
window.Teleprompts = Backbone.Model.extend({

    urlRoot: "/teleprompts",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.text = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter some text"};
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
        text: "",
        font: "Arial",
        color: "#000",
        size: "12px",
        bgcolor: "#FFF",
        troupename: "telebrain",
        permissions: ""
    }
});

window.TelepromptsCollection = Backbone.Collection.extend({

    model: Teleprompts,

    url: "/teleprompts"

});

window.TTSs = Backbone.Model.extend({

    urlRoot: "/tts",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.text = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter some text"};
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
        text: "",
        voice: "Arial",
        troupename: "telebrain",
        permissions: ""
    }
});

window.TTSsCollection = Backbone.Collection.extend({

    model: TTSs,

    url: "/tts"

});

window.Phrases = Backbone.Model.extend({

    urlRoot: "/phrases",

    idAttribute: "_id"

});

window.PhrasesCollection = Backbone.Collection.extend({

    model: Phrases,

    url: "/phrases"

});
window.Controls = Backbone.Model.extend({

    urlRoot: "/controls",

    idAttribute: "_id"

});

window.ControlsCollection = Backbone.Collection.extend({

    model: Controls,

    url: "/controls"

});
window.Schedules = Backbone.Model.extend({

    urlRoot: "/schedules",

    idAttribute: "_id"

});

window.SchedulesCollection = Backbone.Collection.extend({

    model: Schedules,

    url: "/schedules"

});
window.Roles = Backbone.Model.extend({

    urlRoot: "/roles",

    idAttribute: "_id"

});

window.RolesCollection = Backbone.Collection.extend({

    model: Roles,

    url: "/roles"

});
window.Units = Backbone.Model.extend({

    urlRoot: "/units",

    idAttribute: "_id"

});

window.UnitsCollection = Backbone.Collection.extend({

    model: Units,

    url: "/units"

});
window.Programs = Backbone.Model.extend({

    urlRoot: "/programs",

    idAttribute: "_id"

});

window.ProgramsCollection = Backbone.Collection.extend({

    model: Programs,

    url: "/programs"

});
