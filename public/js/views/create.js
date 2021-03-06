window.CreateListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        this.$el.html('<ul class="thumbnails">');
        this.collection.each(function(model) {
            console.log("in render");
            this.$('.thumbnails').append(new CreateView({model: model}).render().el);
        }, this);

        return this;
    }
});

window.CreateView = Backbone.View.extend({

    tagName: "li",
    className: "breakword",
     
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});