window.UnitsListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        if (!this.buildTopView) {
            this.buildTopView = new BuildTopView();
        }
        $(this.el).append(this.buildTopView.el);
        var modules = this.model.models;
        
        $(this.el).append('<ul class="thumbnails"></ul>');

        for (var i = 0; i < modules.length; i++) {
            $('.thumbnails', this.el).append(new UnitsView({model: modules[i]}).render().el);
        }

        return this;
    }
});

window.UnitsView = Backbone.View.extend({

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
