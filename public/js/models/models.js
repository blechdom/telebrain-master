window.Create = Backbone.Model.extend({ urlRoot: "/create" });

window.CreateCollection = Backbone.Collection.extend({

    model: Create,

    initialize : function(options) {
        this.parent_id = options.parent_id;    
        this._id = options._id; 
        console.log("in model and id is " + this._id);
    },
    url : function(options) {
	if(this._id!=13) {
        	console.log("not 13");
		return "/create/" + this.parent_id + "/" + this._id;
	}
	else {
		console.log("is 13");
		return "/perform/" + this.parent_id + "/" + this._id;
	}

    }


});
