var AppRouter = Backbone.Router.extend({

    routes: {
        ""                              : "home",
        "modules/page/:page"	        : "list",
        "create/:parent_id/:id"         : "createType",
        "structure/:parent_id/:id"      : "structure",
        "structure/:parent_id"          : "structure",
        "program/:parent_id/:id"        : "program",
        "program/:parent_id"            : "program",
        "performance"                   : "performance",
        "performance2"                  : "performanceSetup2",
        "perform/:parent_id/:id"        : "perform",
        "performance2/:parent_id/:id"   : "performance2",
        "scheduler"                     : "scheduler",
        "testosc"                       : "testosc", 
        "database"                      : "database",
        "instructions"                  : "instructions",
        "about"                         : "about",
        "tutorial"                      : "tutorial"
    },

    initialize: function () {
        var headerModel = new Header({});
        this.headerView = new HeaderView({model: headerModel});
        $('.header').html(this.headerView.el);
    },
    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        $('.header').hide();
        this.headerView.updateSecondMenu();
    },
	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var createList = new CreateCollection();
        createList.fetch({success: function(){
            console.log('in create paginated list function');
            $("#content").html(new CreateListView({model: createList, page: p}).el);
        }});
        this.headerView.updateSecondMenu();
    },
    perform: function (parent_id, id) {
        $('.header').show();

        console.log("Perform Parent: " + parent_id + ' and _id: ' + id);

        if ( (id != undefined) && (id.length != 24)) 
        {   
           console.log("Viewing Program Content");
            var performList = new PerformCollection({parent_id: parent_id, _id: id});
            performList.fetch({success: function(){
                console.log('in perform function');
                $("#content").empty().append(new PerformListView({collection: performList}).el);
            }});
            this.headerView.updateSecondMenu();
        }
        else 
        {   
            console.log("in perform switch");
            switch (parent_id)
            {
                case "12":       // image URLs 
                    var role = new Roles({parent_id: parent_id, _id: id});
                    role.fetch({success: function(){
                        console.log("in role fetch");
                        $("#content").html(new RoleView({model: role}).el);
                    }});
                    break;
                case "15":  // teleprompts
                    app.navigate('program/' + parent_id + '/' + id, true);
                    break;
                case "13":  // teleprompts
                    app.navigate('program/' + parent_id + '/' + id, true);
                    break;
                case "50":  // teleprompts
                    app.navigate('program/' + parent_id + '/' + id, true);
                    break;
                case "51":  // teleprompts
                    app.navigate('program/' + parent_id + '/' + id, true);
                    break;
                case "35":  // Timer
                    var timer = new Timers({parent_id: parent_id, _id: id});
                    timer.fetch({success: function(){
                        $("#content").html(new TimerView({model: timer}).el);
                    }});
                    break;
                case "36":  // Metronome
                    var metro = new Metronomes({parent_id: parent_id, _id: id});
                    metro.fetch({success: function(){
                        $("#content").html(new MetroView({model: metro}).el);
                    }});
                    break;
                case "37":  // Timed-Organization
                    var algorithm = new Algorithms({parent_id: parent_id, _id: id});
                    var algorithmCollection = new AlgorithmsCollection({parent_id: parent_id, _id: id});
                    algorithmCollection.fetch({success: function(){
                        $("#content").html(new TimedOrganizationView({model: algorithm, collection: algorithmCollection, fraction_id: id}).el);
                    }});
                    break;
            }
            this.headerView.updateSecondMenu();
        }
    },
    program: function (parent_id, id){
        if(parent_id==15)
        {
            var programs = new ProgramsCollection({parent_id: parent_id, _id: id});
            var programObject = new Programs({parent_id: parent_id, _id: id});
            console.log("in declaration: " + programObject);
            programs.fetch({success: function(){
                console.log("program fetch succeeded");
                $("#content").empty().append(new ProgramsMasterView({collection: programs, model: programObject }).el);
                }});
        }
        if(parent_id==13)
        {
            var interfaceCollection = new InterfaceCollection({parent_id: parent_id, _id: id});
            var interfaceInput = new Interfaces({parent_id: parent_id, _id: id});
            interfaceCollection.fetch({success: function(){
                console.log("in interface fetch");
                $("#content").html(new InterfaceView({collection: interfaceCollection, model: interfaceInput }).el);
            }});
        }
        if(parent_id==50)
        {
            var multiroles = new MultirolesCollection({parent_id: parent_id, _id: id});
            var multiroleObject = new Multiroles({parent_id: parent_id, _id: id});
            console.log("in declaration: " + multiroleObject);
            multiroles.fetch({success: function(){
                console.log("multirole fetch succeeded");
                $("#content").empty().append(new MultiroleMasterView({collection: multiroles, model: multiroleObject }).el);
                }});
        }
        if(parent_id==51)
        {
            var fragments = new FragmentsCollection({parent_id: parent_id, _id: id});
            var fragmentObject = new Fragments({parent_id: parent_id, _id: id});
            console.log("in declaration: " + fragmentObject);
            fragments.fetch({success: function(){
                console.log("fragment fetch succeeded");
                $("#content").empty().append(new FractionsMasterView({collection: fragments, model: fragmentObject, fraction_id: id }).el);
                }});
        }
        this.headerView.updateSecondMenu();
    },
    performanceSetup2: function () {
        console.log("calling performanceSetup2 in main.js");
        var performanceList2 = new PerformanceCollection2({});
        var performanceModel2 = new Performance2({});
        performanceList2.fetch({success: function(){
            console.log('in performanceSetup2 function');
            $("#content").empty().append(new PerformanceMasterHeaderView2({collection: performanceList2, model: performanceModel2}).el);
        }});
        this.headerView.updateSecondMenu();
    },
    performance2: function (parent_id, id) {
        console.log("calling perform2 in main.js");
        var performanceList2 = new PerformanceCollection2({parent_id: parent_id, _id: id});
        var performanceModel2 = new Performance2({parent_id: parent_id, _id: id});
        var programModel = new Programs({parent_id: parent_id, _id: id});
        performanceList2.fetch({success: function(){
            console.log('in performance2 fetch function');
            $("#content").empty().append(new PerformanceMasterView2({collection: performanceList2, model: performanceModel2, programModel: programModel, performanceId: id, parentId: parent_id}).el);
            }});
        this.headerView.updateSecondMenu();
    },
    createType: function (parent_id, id) {
        $('.header').show();

        console.log("Create Parent: " + parent_id + ' and _id: ' + id);
        if((id==4)&&(parent_id==0))
        {
            console.log("navigating to Programs");
            app.navigate('perform/' + parent_id + '/' + id, true);
        }
        else if ( (id != undefined) && (id.length != 24)) 
        {   
            console.log("Viewing Content by Parent and id");
            var createList = new CreateCollection({parent_id: parent_id, _id: id});
            createList.fetch({success: function(){
                console.log('in create type function');
                    $("#content").empty().append(new CreateListView({collection: createList}).el);
                }});
            this.headerView.updateSecondMenu();
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
                case "18":       // image URLs 
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
                case "56":  // Audio-Image Pair
                    app.navigate('structure/' + parent_id + '/' + id, true);
                    break;
                case "57":  // Image Phrase
                    app.navigate('structure/' + parent_id + '/' + id, true);
                    break;
                case "58":  // Audio Sentence Phrase
                    app.navigate('structure/' + parent_id + '/' + id, true);
                    break;
                case "59":  // Folder
                    app.navigate('structure/' + parent_id + '/' + id, true);
                    break;
                default:
                    $('#content').empty().append('<font color=red><b>COMING SOON!</b></font>');
            }
        }
    },
    structure: function (parent_id, id){
        var sentence = new PhrasesCollection({parent_id: parent_id, _id: id});
        var phraseObject = new Phrases({parent_id: parent_id, _id: id});
        console.log("in declaration: " + phraseObject);
        switch (parent_id)
            {
                case "56":       // Audio-Image Pair
                    sentence.fetch({success: function(){
                        console.log("fetch succeeded");
                        $("#content").empty().append(new AudioImagePairMasterView({collection: sentence, model: phraseObject }).el);
                        }});
                    break;
                case "57":       // image phrase
                    sentence.fetch({success: function(){
                        console.log("fetch succeeded");
                        $("#content").empty().append(new ImagePhraseMasterView({collection: sentence, model: phraseObject }).el);
                        }});
                    break;
                case "58":  // audio sentences
                    sentence.fetch({success: function(){
                        console.log("fetch succeeded");
                        $("#content").empty().append(new AudioSentenceMasterView({collection: sentence, model: phraseObject }).el);
                        }});
                    break;
                case "59":  // collections
                    sentence.fetch({success: function(){
                        console.log("fetch succeeded");
                        $("#content").empty().append(new ContentCollectionsMasterView({collection: sentence, model: phraseObject }).el);
                        }});
                    break;
            }
        this.headerView.updateSecondMenu();
    },
    testosc: function () {
        if (!this.testoscView) {
            this.testoscView = new TestoscView();
        }
        $('#content').html(this.testoscView.el);
        this.headerView.updateSecondMenu();
    },
    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.updateSecondMenu();
    },
    tutorial: function () {
        if (!this.tutorialView) {
            this.tutorialView = new TutorialView();
        }
        $('#content').html(this.tutorialView.el);
        this.headerView.updateSecondMenu();
    },
    instructions: function () {
        $('.header').show();
        if (!this.instructionsView) {
            this.instructionsView = new InstructionsView();
        }
        $('#content').html(this.instructionsView.el);
        this.headerView.updateSecondMenu();
    },
    database: function () {
        if (!this.databaseView) {
            this.databaseView = new DatabaseView();
        }
        $('#content').html(this.databaseView.el);
        this.headerView.updateSecondMenu();
    },
    scheduler: function () {
        if (!this.schedulerView) {
            this.schedulerView = new SchedulerView();
        }
        $('#content').html(this.schedulerView.el);
        this.headerView.updateSecondMenu();
    }
});

utils.loadTemplate([
    'HomeView', 
    'HeaderView', 
    'ProgramView',
    'PerformView',
    'PerformanceHeaderView', 
    'PerformanceHeaderView2', 
    'PerformanceHeaderAlert', 
    'PerformanceView', 
    'PerformanceView2', 
    'TestoscView', 
    'DatabaseView', 
    'BuildTopView', 
    'CreateView',
    'ControlView',
    'ImageURLView',
    'AudioURLView',
    'AudioSentenceView',
    'ContentCollectionsView',
    'TimedOrganizationView',
    'ImagePhraseView',
    'AudioImagePairView',
    'AudioUploadView',
    'MetroView',
    'PhraseView',
    'TimerView',
    'RoleView',
    'InterfaceView',
    'ProgramView',
    'FragmentView',
    'FractionView',
    'MultiroleView',
    'TelepromptView',
    'TTSView',
    'SchedulerView',
    'InstructionsView',
    'AboutView',
    'TutorialView'
], function() {
    app = new AppRouter();
    Backbone.history.start();
});