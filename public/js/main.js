var AppRouter = Backbone.Router.extend({

    routes: {
        ""                          : "home",
        "modules/page/:page"	    : "list",
        "create/:parent_id/:id"     : "createType",
        "create/:parent_id"         : "createType",
        "structure/:parent_id/:id"  : "structure",
        "structure/:parent_id"      : "structure",
        "perform"                   : "perform",
        "scheduler"                 : "scheduler",
        "testosc"                   : "testosc", 
        "database"                  : "database",
        "about"                     : "about"
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
    createType: function (parent_id, id) {
        socket.emit('jPlayerToggle', 1);
        console.log("Parent: " + parent_id + ' and _id: ' + id);
        if ( (id != undefined) && (id.length != 24)) 
        {   
            if ((id == 20)||(id ==24)||(id == 25)||(id ==31))
            {
                $('#content').empty().append('<font color=red><b>COMING SOON!</b></font>');
            }
            else
            {
                var createList = new CreateCollection({parent_id: parent_id, _id: id});
                createList.fetch({success: function(){
                    console.log('in create type function');
                        $("#content").empty().append(new CreateListView({collection: createList}).el);
                    }});
            }
        }
        else 
        {   
            switch (parent_id)
            {
                case "17":       // image URLs 
                    var imageURL = new ImageURLs({parent_id: parent_id, _id: id});
                    imageURL.fetch({success: function(){
                        $("#content").html(new ImageURLView({model: imageURL}).el);
                    }});
                    break;
                case "19":  // teleprompts
                    var teleprompt = new Teleprompts({parent_id: parent_id, _id: id});
                    teleprompt.fetch({success: function(){
                        $("#content").html(new TelepromptView({model: teleprompt}).el);
                    }});
                    break;
                case "21":  // audio upload
                    var audioURL = new AudioURLs({parent_id: parent_id, _id: id});
                    audioURL.fetch({success: function(){
                        $("#content").html(new AudioURLView({model: audioURL}).el);
                    }});
                    break;
                case "22":  // audio upload
                    var audioUpload = new AudioUploads({parent_id: parent_id, _id: id});
                    audioUpload.fetch({success: function(){
                        $("#content").html(new AudioUploadView({model: audioUpload}).el);
                    }});
                    break;
                case "23":  // TTS
                    var tts = new TTSs({parent_id: parent_id, _id: id});
                    tts.fetch({success: function(){
                        $("#content").html(new TTSView({model: tts}).el);
                    }});
                    break;
                case "28":  // Ordered Phrases
                    var phrase = new Phrases({parent_id: parent_id, _id: id});
                    phrase.fetch({success: function(){
                        $("#content").html(new PhraseView({model: phrase}).el);
                    }});
                    break;
                case "30":  // Conditional Control
                    var ifthen = new Controls({parent_id: parent_id, _id: id});
                    ifthen.fetch({success: function(){
                        $("#content").html(new ControlView({model: ifthen}).el);
                    }});
                    break;
                case "34":  // Now Trigger
                    var trigger = new Schedules({parent_id: parent_id, _id: id});
                    trigger.fetch({success: function(){
                        $("#content").html(new NowView({model: trigger}).el);
                    }});
                    break;
                case "35":  // Timer
                    var timer = new Schedules({parent_id: parent_id, _id: id});
                    timer.fetch({success: function(){
                        $("#content").html(new TimerView({model: timer}).el);
                    }});
                    break;
                case "36":  // Metronome
                    var metro = new Schedules({parent_id: parent_id, _id: id});
                    metro.fetch({success: function(){
                        $("#content").html(new MetroView({model: metro}).el);
                    }});
                    break;
                case "57":  // Audio Sentence Phrase
                    app.navigate('structure/' + parent_id + '/' + id, true);
                    break;
                case "58":  // Audio Sentence Phrase
                    app.navigate('structure/' + parent_id + '/' + id, true);
                    break;
                case "28":  // Audio Sentence Phrase
                    app.navigate('structure/' + parent_id + '/' + id, true);
                    break;
                case "29":  // Audio Sentence Phrase
                    app.navigate('structure/' + parent_id + '/' + id, true);
                    break;
                default:
                    $('#content').empty().append('<font color=red><b>COMING SOON!</b></font>');
            }
        }
        this.headerView.selectMenuItem('create-menu');
    },
    structure: function (parent_id, id){
        var sentence = new PhrasesCollection({parent_id: parent_id, _id: id});
        var phraseObject = new Phrases({parent_id: parent_id, _id: id});
        console.log("in declaration: " + phraseObject);
        switch (parent_id)
            {
                case "57":       // image URLs 
                    sentence.fetch({success: function(){
                        console.log("fetch succeeded");
                        $("#content").empty().append(new ImagePhraseMasterView({collection: sentence, model: phraseObject }).el);
                        }});
                    break;
                case "58":  // teleprompts
                    sentence.fetch({success: function(){
                        console.log("fetch succeeded");
                        $("#content").empty().append(new AudioSentenceMasterView({collection: sentence, model: phraseObject }).el);
                        }});
                    break;
            }
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
    'ControlView',
    'ImageURLView',
    'AudioURLView',
    'AudioSentenceView',
    'ImagePhraseView',
    'AudioUploadView',
    'NowView',
    'MetroView',
    'PhraseView',
    'TimerView',
    'TelepromptView',
    'TTSView',
    'SchedulerView',
    'AboutView'
], function() {
    app = new AppRouter();
    Backbone.history.start();
});