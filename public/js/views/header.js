window.HeaderView = Backbone.View.extend({

    initialize: function () {
       
        this.model.set(this.model.defaults);
        this.render();
    },
    render: function () {
        $(this.el).html(this.template());
        return this;
    },
    events: {
        "click #audioToggle"  : "toggleAudio",
        "click #leavePerformance"   : "leavePerformance",
        "click #audioPerformanceToggle"     : "toggleAudio"
    },
    hideTopMenu: function () {
        $('#topHeader').hide();
    },
    showTopMenu: function () {
        $('#topHeader').show();
    },
    updateSecondMenu: function () {

        $('.bottomHeader').show();
        $('#legendTitle').show();
        var activeMenu;
        var legendTitle = "Content";
        var hashaddress = location.hash;
        console.log("url: " + hashaddress);
        var urlArray = hashaddress.split('/');
        if ((urlArray[0] == "#perform")||(urlArray[0] == "#structure")||(urlArray[0] == "#create")||(urlArray[0] == "#program"))
        {
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li class="dropdown" id="Audio"><a class="dropdown-toggle" data-toggle="dropdown">Audio</a><ul class="dropdown-menu"><li><a href="#create/6/21">Web-Based Audio</a></li><li><a href="#create/6/23">Text-To-Speech Audio</a></li></ul></li><li class="dropdown" id="Visual"><a class="dropdown-toggle" data-toggle="dropdown">Visual</a><ul class="dropdown-menu"><li><a href="#create/5/17">Web-Based Images</a></li><li><a href="#create/5/19">Teleprompter Text</a></li></ul></li><li class="dropdown" id="Collections"><a class="dropdown-toggle" data-toggle="dropdown">Collections</a><ul class="dropdown-menu"><li><a href="#create/8/58">Audio Phrases</a></li><li><a href="#create/8/57">Image Phrases</a></li><li><a href="#create/8/56">Audio-Image Pairs</a></li></ul></li><li class="dropdown" id="Organization"><a class="dropdown-toggle" data-toggle="dropdown">Organization</a><ul class="dropdown-menu"><li><a href="#perform/11/12">Roles</a></li><li><a href="#perform/11/15">Venues</a></li></ul></li><li class="dropdown" id="Fragments"><a class="dropdown-toggle" data-toggle="dropdown">Fragments</a><ul class="dropdown-menu"><li><a href="#perform/16/50">Multi-Role Assignments</a></li><li><a href="#perform/16/51">Fractional Assignments</a></li></ul></li><li class="dropdown" id="UnderConstruction"><a class="dropdown-toggle" data-toggle="dropdown">Under Construction</a><ul class="dropdown-menu"><li><a href="#create/6/22">Uploaded Audio</a></li><li><a href="#create/5/18">Uploaded Images</a></li><li><a href="#perform/10/37">Timed Organization</a></li><li><a href="#perform/10/35">Timer</a></li><li><a href="#perform/10/36">Metronome</a></li><li><a href="#perform/11/13">Interfaces</a></li><li><a href="#testosc">Test OSC</a></li></ul></li></ul></div>');
            legendTitle = "Program";
            if(urlArray.length==3)
            {
                if((urlArray[1] == 77)||(urlArray[2]==77))
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Under Construction";
                }
                if((urlArray[1] == 11)||(urlArray[2]==11))
                {
                    activeMenu = "#Organization";
                    legendTitle = "Organization";
                }
                if((urlArray[1] == 16)||(urlArray[2]==16))
                {
                    activeMenu = "#Fragments";
                    legendTitle = "Fragments";
                }
                if((urlArray[1] == 37)||(urlArray[2]==37))
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Under Construction";
                }
                if((urlArray[1] == 36)||(urlArray[2]==36))
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Under Construction";
                }
                if((urlArray[1] == 35)||(urlArray[2]==35))
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Under Construction";
                }
                if((urlArray[1] == 12)||(urlArray[2]==12))
                {
                    activeMenu = "#Organization";
                    legendTitle = "Roles";
                }
                if((urlArray[1] == 13)||(urlArray[2]==13))
                {
                    activeMenu = "#Under Construction";
                    legendTitle = "Interfaces";
                }
                if((urlArray[1] == 15)||(urlArray[2]==15))
                {
                    activeMenu = "#Organization";
                    legendTitle = "Venues";
                }
                if((urlArray[1] == 50)||(urlArray[2]==50))
                {
                    activeMenu = "#Fragments";
                    legendTitle = "Multi-Role Assignments";
                }
                if((urlArray[1] == 51)||(urlArray[2]==51))
                {
                    activeMenu = "#Fragments";
                    legendTitle = "Fractional Assignments";
                }
           /* }
        }
        if ((urlArray[0] == "#create")||(urlArray[0] == "#structure"))
        {
            this.$('#legendTitle').empty();
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li class="dropdown" id="Audio"><a class="dropdown-toggle" data-toggle="dropdown">Audio</a><ul class="dropdown-menu"><li><a href="#create/6/21">Web-Based</a></li><li><a href="#create/6/22">Upload</a></li><li><a href="#create/6/23">Text-To-Speech</a></li></ul></li><li class="dropdown" id="Images"><a class="dropdown-toggle" data-toggle="dropdown">Images</a><ul class="dropdown-menu"><li><a href="#create/5/17">Web-Based</a></li><li><a href="#create/5/18">Upload</a></li><li><a href="#create/5/19">Teleprompt</a></li></ul></li><li class="dropdown" id="Structure"><a class="dropdown-toggle" data-toggle="dropdown">Collections</a><ul class="dropdown-menu"><li><a href="#create/8/59">Folders</a></li><li><a href="#create/8/58">Audio Sentences</a></li><li><a href="#create/8/57">Image Phrases</a></li><li><a href="#create/8/56">Audio-Image Pairs</a></li><li><a href="#create/8/55">Audio Layers</a></li></ul></li></ul></div>');
            if(urlArray.length==3)
            {*/
                if(urlArray[2]==8)
                {
                    activeMenu = "#Structure";
                    legendTitle = "Collections";
                }
                if((urlArray[1] == 75)||(urlArray[2]==75))
                {
                    activeMenu = "#Brains";
                    legendTitle = "Brains";
                }
                if((urlArray[1] == 5)||(urlArray[2]==5))
                {
                    activeMenu = "#Visual";
                    legendTitle = "Visual";
                }
                if((urlArray[1] == 6)||(urlArray[2]==6))
                {
                    activeMenu = "#Audio";
                    legendTitle = "Audio";
                }
                if((urlArray[1] == 17)||(urlArray[2]==17))
                {
                    activeMenu = "#Visual";
                     legendTitle = "Web-Based Images";
                }
                if((urlArray[1] == 18)||(urlArray[2]==18))
                {
                    activeMenu = "#UnderConstruction";
                     legendTitle = "Upload Images";
                }
                if((urlArray[1] == 19)||(urlArray[2]==19))
                {
                     activeMenu = "#Visual";
                     legendTitle = "Teleprompts";
                }
                if((urlArray[1] == 6)||(urlArray[2]==6))
                {
                    activeMenu = "#Audio";
                }
                if((urlArray[1] == 21)||(urlArray[2]==21))
                {
                    activeMenu = "#Audio";
                    legendTitle = "Web-Based Audio";
                }
                if((urlArray[1] == 22)||(urlArray[2]==22))
                {
                    activeMenu = "#Audio";
                    legendTitle = "Upload Audio";
                }
                if((urlArray[1] == 23)||(urlArray[2]==23))
                {
                    activeMenu = "#Audio";
                    legendTitle = "Text-To-Speech Audio";
                }
                if((urlArray[1] == 2)||(urlArray[2]==2))
                {
                    activeMenu = "#Collections";
                }
                if(urlArray[1] == 55)
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Edit Audio Layer";
                }
                if(urlArray[2] == 55)
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Audio Layers";
                }
                if(urlArray[1] == 59)
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "New Folder";
                }
                if(urlArray[2] == 59)
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Folders";
                }
                if(urlArray[1] == 56)
                {
                    activeMenu = "#Collections";
                    legendTitle = "Edit Audio-Image Pair";
                }
                if(urlArray[2] == 56)
                {
                    activeMenu = "#Collections";
                    legendTitle = "Audio-Image Pairs";
                }
                if(urlArray[1] == 57)
                {
                    activeMenu = "#Collections";
                    legendTitle = "Edit Image Phrase";
                }
                if(urlArray[2] == 57)
                {
                    activeMenu = "#Collections";
                    legendTitle = "Image Phrases";
                }
                if(urlArray[2] == 58)
                { 
                    activeMenu = "#Collections";
                    legendTitle = "Audio Phrases";
                }
                if(urlArray[1] == 58)
                { 
                    activeMenu = "#Collections";
                    legendTitle = "Edit Audio Phrase";
                }
                if(urlArray[1] == 35)
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Edit Timer";
                }
                if(urlArray[2] == 35)
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Timers";
                }
                if(urlArray[1] == 36)
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Edit Metronome";
                }
                if(urlArray[2] == 36)
                {
                    activeMenu = "#UnderConstruction";
                    legendTitle = "Metronomes";
                }
            }
        }
        if (urlArray[0] == "#performance2")
        {
            this.$('#bottomHeader').empty();
            legendTitle = "Performance";
            activeMenu = "#Performance";
            if(urlArray.length==3)
            {
                if(urlArray[1] == 15)
                {
                    activeMenu = "#Performance";
                    legendTitle = "Performance";
                }
            }
        }
        if (urlArray[0] == "#login")
        {
            this.$('#bottomHeader').empty().append('<br><br>');
            legendTitle = "Login to Your Brains";
        }
	if (urlArray[0] == "#testosc") //TEST OSC
        {
            legendTitle = "Test OSC";

            activeMenu = "#Algorithms";
        }
        if (urlArray[0] == "#tutorial") //TUTORIAL
        {
            legendTitle = "Tutorial";
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li class="active"><a href="#tutorial">Tutorial</a></li><li><a href="#instructions">Instructions</a></li><li><a href="#about">Contact</a></li></ul></div>');
        }
        if (urlArray[0] == "#instructions") //INSTRUCTIONS
        {
            legendTitle = "Instructions";
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li><a href="#tutorial">Tutorial</a></li><li class="active"><a href="#instructions">Instructions</a></li><li><a href="#about">Contact</a></li></ul></div>');
        }
        if (urlArray[0] == "#about") //CONTACT
        {
            legendTitle = "Contact";
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li><a href="#tutorial">Tutorial</a></li><li><a href="#instructions">Instructions</a></li><li class="active"><a href="#about">Contact</a></li></ul></div>');
        }
        $(activeMenu).addClass('active');
        this.$('#legendTitle').empty().append('<legend>' + legendTitle + '</legend>');
    },
    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    },
    leavePerformance: function() {
        console.log("Leaving Performance");
        socket.emit("leavePerformance");
    },
    toggleAudio: function(){
        var audioToggle = this.model.get("audio");
        if (audioToggle == 0)
        {   
           audioToggle = 1;
           $('#audioToggle').empty().append('<i class="icon-volume-up icon-2x audio-green">');

           $('#performanceHeader').empty().append('<div id="audioReminder"><a id="leavePerformance"><i class="icon-remove"></i> Leave Performance</a>&nbsp;&nbsp;<a id="audioPerformanceToggle" style="color: green;"><i class="icon-volume-up audio-green"></i> Audio On</a></div>');
           
           console.log("AUDIO ON");
            $('#jPlayerPerform').append('<div id="jquery_jplayer_1" class="jp-jplayer"></div>');
            $("#jquery_jplayer_1").jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        mp3: "css/snd/telebrain.mp3"
                    }).jPlayer("play");
                },
                swfPath: "lib/jPlayer/js",
                supplied: "mp3"
            });
        }
        else {
            audioToggle = 0;
            $('#audioToggle').empty().append('<i class="icon-volume-off icon-2x audio-red">');

            $('#performanceHeader').empty().append('<div id="audioReminder"><a id="leavePerformance"><i class="icon-remove"></i> Leave Performance</a>&nbsp;&nbsp;<a id="audioPerformanceToggle" style="color: red;"><i class="icon-volume-off little-audio-red"></i> Audio Off</a></div>');
     
            console.log("AUDIO OFF");
             $('#jPlayerPerform').empty();
        }
        this.model.set("audio", audioToggle);
    }
});
