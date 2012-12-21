window.CreateListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
      
        var modules = this.model.models;
        $(this.el).append('<b>CONTENT TYPES:</b> <ul class="thumbnails"></ul>');

        for (var i = 0; i < modules.length; i++) {
            $('.thumbnails', this.el).append(new CreateView({model: modules[i]}).render().el);
        }

        return this;
    }
});


window.CreateView = Backbone.View.extend({

    tagName: "li",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});
