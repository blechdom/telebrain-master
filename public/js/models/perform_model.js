window.Performance = Backbone.Model.extend({ 

	urlRoot: "/perform", 

	initialize: function (options) {
       
    },

	defaults: {
        _id: null,
        name: "Default Performance",
        image: "pics/perform.jpg",
        ttsFlag: "0",
        imageChatFlag: "0",
        audioChatFlag: "0",
        permissions: "0"
    }
});

window.PerformCollection = Backbone.Collection.extend({

    model: Performance,

    url : "/perform"

});