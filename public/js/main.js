var AppRouter = Backbone.Router.extend({

    routes: {
        ""                      : "home",
        "modules"	            : "list",
        "modules/page/:page"	: "list",
        "modules/add"           : "addModule",
        "modules/:id"           : "moduleDetails",
        "build"                 : "build",
        "build/:id"             : "buildSelector",
        "troupes"               : "troupes",
        "networks"              : "networks",
        "imageURLs"             : "imageURLs",
        "imageURLs/:id"         : "imageURLDetails",
        "imageUploads"          : "imageUploads",
        "audioURLs"             : "audioURLs",
        "audioURLs/:id"         : "audioURLDetails",
        "audioUploads"          : "audioUploads",
        "teleprompts"           : "teleprompts", 
        "teleprompts/:id"       : "telepromptDetails", 
        "tts"                   : "tts",
        "tts/:id"               : "ttsDetails",
        "phrases"               : "phrases",
        "controls"              : "controls",
        "schedules"             : "schedules",
        "roles"                 : "roles",
        "units"                 : "units", 
        "programs"              : "programs",
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

    buildSelector: function (id) {
        if (id == 1) // add new Web-Based Image
        {
            var imageURLs = new ImageURLs();
            $('#content').html(new ImageURLView({model: imageURLs}).el);
            this.headerView.selectMenuItem();
        }
        if (id == 2) // add new Uploaded Image
        {
            $('#buildError').html('<font color=red><b>IMAGE UPLOAD COMING SOON!</b></font>');
        }
        if (id == 3) // add new Graphics Image
        {
            $('#buildError').html('<font color=red><b>GRAPHICS/ANIMATION COMING SOON!</b></font>');
        }
        if (id == 4) // add new Telepromt
        {
            var teleprompts = new Teleprompts();
            $('#content').html(new TelepromptView({model: teleprompts}).el);
            this.headerView.selectMenuItem();
        }
         if (id == 5) // add new TTS
        {
            var tts = new TTS();
            $('#content').html(new TTSView({model: tts}).el);
            this.headerView.selectMenuItem();
        }
        if (id == 6) // add new Web-Based Audio
        {
            var audioURLs = new AudioURLs();
            $('#content').html(new AudioURLView({model: audioURLs}).el);
            this.headerView.selectMenuItem();
        }
        if (id == 7) // add new Uploaded Audio
        {
            $('#buildError').html('<font color=red><b>AUDIO UPLOAD COMING SOON!</b></font>');
        }
        if (id == 8) // add new Synthesizer
        {
            $('#buildError').html('<font color=red><b>SYNTHESIZER COMING SOON!</b></font>');
        }
        if (id == 9) // add new Vibrate
        {
            $('#buildError').html('<font color=red><b>VIBRATE COMING SOON!</b></font>');
        }
        //var module = new Module({_id: id});
        //module.fetch({success: function(){
           // $("#content").html(new ModuleView({model: module}).el);
        //}});
        //this.headerView.selectMenuItem();
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
    },
    build: function() {
        var buildList = new BuildCollection();
        buildList.fetch({success: function(){
            console.log('in build list function');
            $("#content").html(new BuildListView({model: buildList}).el);
        }});
        this.headerView.selectMenuItem('build-menu');
    },
    troupes: function() {
        var troupesList = new TroupesCollection();
        troupesList.fetch({success: function(){
            console.log('in troupes list function');
            $("#content").html(new TroupesListView({model: troupesList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    imageURLs: function() {
        var imageURLsList = new ImageURLsCollection();
        var telepromptsList = new TelepromptsCollection();
        imageURLsList.fetch({success: function(){
            console.log('in imageURLs list function');
            $("#content").empty().append(new ImageURLsListView({collection: imageURLsList}).el);
            //$("#content").html(new ImageURLsListView({model: imageURLsList}).el);
        }});
        telepromptsList.fetch({success: function(){
            console.log('in teleprompts list function');
            $("#troupeMenu").append(new TelepromptsListView({collection: telepromptsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    imageURLDetails: function (id) {
        var imageURL = new ImageURLs({_id: id});
        imageURL.fetch({success: function(){
            $("#content").html(new ImageURLView({model: imageURL}).el);
        }});
        this.headerView.selectMenuItem();
    },
    audioURLDetails: function (id) {
        var audioURL = new AudioURLs({_id: id});
        audioURL.fetch({success: function(){
            $("#content").html(new AudioURLView({model: audioURL}).el);
        }});
        this.headerView.selectMenuItem();
    },
    ttsDetails: function (id) {
        var tts = new TTS({_id: id});
        tts.fetch({success: function(){
            $("#content").html(new TTSView({model: tts}).el);
        }});
        this.headerView.selectMenuItem();
    },
    telepromptDetails: function (id) {
        var teleprompt = new Teleprompt({_id: id});
        teleprompt.fetch({success: function(){
            $("#content").html(new TelepromptView({model: teleprompt}).el);
        }});
        this.headerView.selectMenuItem();
    },
    imageUploads: function() {
        var imageUploadsList = new ImageUploadsCollection();
        imageUploadsList.fetch({success: function(){
            console.log('in imageUploads list function');
            $("#content").html(new ImageUploadsListView({model: imageUploadsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    audioURLs: function() {
        var audioURLsList = new AudioURLsCollection();
        audioURLsList.fetch({success: function(){
            console.log('in audioURLs list function');
            $("#content").html(new AudioURLsListView({model: audioURLsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    audioUploads: function() {
        var audioUploadsList = new AudioUploadsCollection();
        audioUploadsList.fetch({success: function(){
            console.log('in audioUploads list function');
            $("#content").html(new AudioUploadsListView({model: audioUploadsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    teleprompts: function() {
        var telepromptsList = new TelepromptsCollection();
        telepromptsList.fetch({success: function(){
            console.log('in teleprompts list function');
            $("#content").html(new TelepromptsListView({model: telepromptsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    tts: function() {
        var ttsList = new TTSCollection();
        ttsList.fetch({success: function(){
            console.log('in tts list function');
            $("#content").html(new TTSListView({model: ttsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    phrases: function() {
        var phrasesList = new PhrasesCollection();
        phrasesList.fetch({success: function(){
            console.log('in phrases list function');
            $("#content").html(new PhrasesListView({model: phrasesList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    controls: function() {
        var controlsList = new ControlsCollection();
        controlsList.fetch({success: function(){
            console.log('in controls list function');
            $("#content").html(new ControlsListView({model: controlsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    schedules: function() {
        var schedulesList = new SchedulesCollection();
        schedulesList.fetch({success: function(){
            console.log('in schedules list function');
            $("#content").html(new SchedulesListView({model: schedulesList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    roles: function() {
        var rolesList = new RolesCollection();
        rolesList.fetch({success: function(){
            console.log('in roles list function');
            $("#content").html(new RolesListView({model: rolesList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    units: function() {
        var unitsList = new UnitsCollection();
        unitsList.fetch({success: function(){
            console.log('in units list function');
            $("#content").html(new UnitsListView({model: unitsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    programs: function() {
        var programsList = new ProgramsCollection();
        programsList.fetch({success: function(){
            console.log('in programs list function');
            $("#content").html(new ProgramsListView({model: programsList}).el);
        }});
        this.headerView.selectMenuItem();
    },
    networks: function() {
        var networksList = new NetworksCollection();
        networksList.fetch({success: function(){
            console.log('in networks list function');
            $("#content").html(new NetworksListView({model: networksList}).el);
        }});
        this.headerView.selectMenuItem();
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
    'ModuleView', 
    'ModuleListItemView', 
    'PerformView', 
    'TestoscView', 
    'DatabaseView', 
    'BuildTopView', 
    'BuildView',
    'TroupesView', 
    'NetworksView',
    'ImageURLsView',
    'ImageURLView',
    'ImageUploadsView',
    'AudioURLsView',
    'AudioURLView',
    'AudioUploadsView',
    'TelepromptsView',
    'TelepromptView',
    'TTSView',
    'TTSsView',
    'PhrasesView',
    'ControlsView', 
    'SchedulesView',
    'SchedulerView',
    'RolesView',
    'UnitsView',
    'ProgramsView',
    'AboutView'
], function() {
    app = new AppRouter();
    Backbone.history.start();
});