window.Roles = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function (options) {
        this.parent_id = options.parent_id;

        console.log("model for this parent " + this.parent_id);

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.image = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a URL"};
        };

    },
    urlRoot : function(options) {

        return "/perform/" + this.parent_id;
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
        name: "Name your role here.",  
        image: "pics/master.png",
        permissions: "0",
        showMenu: "",
        showTitle: "",
        textSend: "",
        TTSSend: "",
        imageSend: "", 
        audioSend: "",
        textReceive: "",
        TTSReceive: "",
        imageReceive: "",
        audioReceive: "",
        performerList: "",
        activityLog: "",
        tester: ""
    }
});