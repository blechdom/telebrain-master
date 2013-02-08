/*window.Performance = Backbone.Model.extend({ 

	urlRoot: "/performance", 

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

window.PerformanceCollection = Backbone.Collection.extend({

    model: Performance,

   initialize : function(options) {
        this.parent_id = options.parent_id;    
        this._id = options._id; 
        console.log("in perform collection model");
    },
    url : function(options) {
        return "/performance/" + this.parent_id + "/" + this._id;
    }

});*/