var AppRouter = Backbone.Router.extend({

    routes: {
        ""                      : "home",
        "modules/page/:page"	: "list",
        "create/:id"            : "createType",
        "create/:type_id/:id"   : "createViewByType",
        "create/:type_id/add"   : "createContentByType",
        "perform"               : "perform",
        "scheduler"             : "scheduler",
        "testosc"               : "testosc", 
        "database"              : "database",
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
        var createList = new CreateCollection();
        createList.fetch({success: function(){
            console.log('in create paginated list function');
            $("#content").html(new CreateListView({model: createList, page: p}).el);
        }});
        this.headerView.selectMenuItem();
    },
    perform: function () {
        socket.emit('performViewLoaded', 1);
        if (!this.performView) {
            this.performView = new PerformView();
        }
        $('#content').html(this.performView.el);
        this.headerView.selectMenuItem('perform-menu');
    },
    createType: function (id) {
        var createList = new CreateCollection({type_id: id});
       // createList.set({type_id: id});

        createList.fetch({success: function(){
            console.log('in create type function');
            if (id == 0)
            {
                $("#content").empty().append(new CreateListView({collection: createList}).el);
            }
            else if((id==3)||(id==8)||(id==9)||(id==15))
            {
                $('#content').empty().append('<font color=red><b>COMING SOON!</b></font>');
            }
            else 
            {
                $("#content").empty().append(new CreateTypesListView({collection: createList}).el);
            }
        }});
        this.headerView.selectMenuItem('create-menu');
    },
    createViewByType: function (type_id, id) {
        if (type_id==1) {  // image URLs
            var imageURL = new ImageURLs({type_id: type_id, _id: id});
            imageURL.fetch({success: function(){
                $("#content").html(new ImageURLView({model: imageURL}).el);
            }});
        }
        else if (type_id==4) {  // teleprompts
            var teleprompt = new Teleprompts({type_id: type_id, _id: id});
            teleprompt.fetch({success: function(){
                $("#content").html(new TelepromptView({model: teleprompt}).el);
            }});
        }
        else if (type_id==5) {  // TTS
            var tts = new TTSs({type_id: type_id, _id: id});
            tts.fetch({success: function(){
                $("#content").html(new TTSView({model: tts}).el);
            }});
        }
        else if (type_id==6) { // audio upload
            var audioURL = new AudioURLs({_id: id});
            audioURL.fetch({success: function(){
                $("#content").html(new AudioURLView({model: audioURL}).el);
            }});
        }
        else if((type_id==2)||(type_id==7)||(type_id>=10))
            {
                $('#content').empty().append('<font color=red><b>COMING SOON!</b></font>');
            }
        this.headerView.selectMenuItem('create-menu'); 
    },
    createContentByType: function() { // similar to above method
        var module = new Module();
        $('#content').html(new ModuleView({model: module}).el);
        this.headerView.selectMenuItem('add-menu');
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
    },
    database: function () {
        if (!this.databaseView) {
            this.databaseView = new DatabaseView();
        }
        $('#content').html(this.databaseView.el);
        this.headerView.selectMenuItem('database-menu');
    },
    scheduler: function () {
        if (!this.schedulerView) {
            this.schedulerView = new SchedulerView();
        }
        $('#content').html(this.schedulerView.el);
        this.headerView.selectMenuItem('scheduler-menu');
    }
});

utils.loadTemplate([
    'HomeView', 
    'HeaderView', 
    'PerformView', 
    'TestoscView', 
    'DatabaseView', 
    'BuildTopView', 
    'CreateView',
    'CreateTypesView',
    'ImageURLView',
    'AudioURLView',
    'TelepromptView',
    'TTSView',
    'SchedulerView',
    'AboutView'
], function() {
    app = new AppRouter();
    Backbone.history.start();
});