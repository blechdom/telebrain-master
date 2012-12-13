var AppRouter = Backbone.Router.extend({

    routes: {
        ""                      : "home",
        "modules"	            : "list",
        "modules/page/:page"	: "list",
        "modules/add"           : "addModule",
        "modules/:id"           : "moduleDetails",
        "perform"               : "perform",
        "testosc"               : "testosc", 
        "about"                 : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var moduleList = new ModuleCollection();
        moduleList.fetch({success: function(){
            console.log('in list function');
            $("#content").html(new ModuleListView({model: moduleList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    moduleDetails: function (id) {
        var module = new Module({_id: id});
        module.fetch({success: function(){
            $("#content").html(new ModuleView({model: module}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addModule: function() {
        var module = new Module();
        $('#content').html(new ModuleView({model: module}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    perform: function () {
        if (!this.performView) {
            this.performView = new PerformView();
        }
        $('#content').html(this.performView.el);
        this.headerView.selectMenuItem('perform-menu');
    },

    testosc: function () {
        if (!this.testoscView) {
            this.testoscView = new TestoscView();
        }
        $('#content').html(this.testoscView.el);
        this.headerView.selectMenuItem('testosc-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'ModuleView', 'ModuleListItemView', 'PerformView', 'TestoscView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});