window.Create = Backbone.Model.extend({ urlRoot: "/create" });

window.CreateCollection = Backbone.Collection.extend({

    model: Create,

    initialize : function(options) {
        this.parent_id = options.parent_id;    
        this._id = options._id; 
    },
    url : function(options) {
        return "/create/" + this.parent_id + "/" + this._id;
    }

});