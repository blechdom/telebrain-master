window.CreateListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        this.$el.html('<ul class="thumbnails">');

        this.collection.each(function(model) {
            // (this.collection.type_id == 0) {
            //this.$('#content').append("in for loop");
            this.$('.thumbnails').append(new CreateView({model: model}).render().el);
           // }
        }, this);

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


window.CreateTypesListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        this.$el.html('<ul class="thumbnails">');

        this.collection.each(function(model) {
            // (this.collection.type_id == 0) {
            //this.$('#content').append("in for loop");
            this.$('.thumbnails').append(new CreateTypesView({model: model}).render().el);
           // }
        }, this);

        return this;
    }
});


window.CreateTypesView = Backbone.View.extend({

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