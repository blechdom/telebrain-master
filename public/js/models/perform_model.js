window.Perform = Backbone.Model.extend({ urlRoot: "/perform" });

window.PerformCollection = Backbone.Collection.extend({

    model: Perform,

    url : "/perform"

});