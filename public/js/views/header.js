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

    updateSecondMenu: function () {

        $('#bottomHeader').show();
        $('#legendTitle').show();
        var activeMenu;
        var legendTitle = "Content";
        var hashaddress = location.hash;
        console.log("url: " + hashaddress);
        var urlArray = hashaddress.split('/');
        if ((urlArray[0] == "#perform")||(urlArray[0] == "#program")) //TEST OSC
        {
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li class="dropdown" id="Program"><a class="dropdown-toggle" data-toggle="dropdown">Program</a><ul class="dropdown-menu"><li><a href="#perform/4/11">Networks</a></li><li><a href="#perform/4/12">Roles</a></li><li><a href="#perform/4/15">Performance Programs</a></li></ul></li><li class="dropdown" id="Fragments"><a class="dropdown-toggle" data-toggle="dropdown">Fragments</a><ul class="dropdown-menu"><li><a href="#perform/16/50">Multi-Role Assignments</a></li><li><a href="#perform/16/51">Role Algorithms</a></li></ul></li><li id="Perform"><a href="#performance2">Perform</a></li></ul></div>');
            legendTitle = "Perform";
            if(urlArray.length==3)
            {
                if((urlArray[1] == 11)||(urlArray[2]==11))
                {
                    activeMenu = "#Program";
                    legendTitle = "Networks";
                }
                if((urlArray[1] == 12)||(urlArray[2]==12))
                {
                    activeMenu = "#Program";
                    legendTitle = "Roles";
                }
                if((urlArray[1] == 15)||(urlArray[2]==15))
                {
                    activeMenu = "#Program";
                    legendTitle = "Performance Programs";
                }
                if((urlArray[1] == 50)||(urlArray[2]==50))
                {
                    activeMenu = "#Fragments";
                    legendTitle = "Multi-Role Assignments";
                }
                if((urlArray[1] == 51)||(urlArray[2]==51))
                {
                    activeMenu = "#Fragments";
                    legendTitle = "Role-Based Algorithms";
                }
            }
        }
        if (urlArray[0] == "#performance2") //TEST OSC
        {
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li class="dropdown" id="Program"><a class="dropdown-toggle" data-toggle="dropdown">Program</a><ul class="dropdown-menu"><li id="Performance"><a href="#perform/4/11">Networks</a></li><li><a href="#perform/4/12">Roles</a></li><li><a href="#perform/4/15">Performance Programs</a></li></ul></li><li class="dropdown" id="Fragments"><a class="dropdown-toggle" data-toggle="dropdown">Fragments</a><ul class="dropdown-menu"><li><a href="#perform/16/50">Multi-Role Assignments</a></li><li><a href="#perform/16/51">Role Algorithms</a></li></ul></li><li id="Perform"><a href="#performance2">Perform</a></li></ul></div>');
            legendTitle = "Perform";
            activeMenu = "#Perform";
            if(urlArray.length==3)
            {
                if(urlArray[1] == 15)
                {
                    activeMenu = "#Performance";
                    legendTitle = "Perform";
                }
            }
        }
        if ((urlArray[0] == "#create")||(urlArray[0] == "#structure"))
        {
            this.$('#legendTitle').empty();
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li class="dropdown" id="Images"><a class="dropdown-toggle" data-toggle="dropdown">Images</a><ul class="dropdown-menu"><li><a href="#create/5/17">Web-Based</a></li><li><a href="#create/5/18">Upload</a></li><li><a href="#create/5/19">Teleprompt</a></li></ul></li><li class="dropdown" id="Audio"><a class="dropdown-toggle" data-toggle="dropdown">Audio</a><ul class="dropdown-menu"><li><a href="#create/6/21">Web-Based</a></li><li><a href="#create/6/22">Upload</a></li><li><a href="#create/6/23">Text-To-Speech</a></li></ul></li><li class="dropdown" id="Structure"><a class="dropdown-toggle" data-toggle="dropdown">Structure</a><ul class="dropdown-menu"><li><a href="#create/8/58">Audio Sentence</a></li><li><a href="#create/8/57">Image Phrase</a></li><li><a href="#create/10/35">Timer</a></li><li><a href="#create/10/36">Metronome</a></li></ul></li></ul></div>');
            if(urlArray.length==3)
            {
                if((urlArray[1] == 5)||(urlArray[2]==5))
                {
                    activeMenu = "#Images";
                }
                if((urlArray[1] == 17)||(urlArray[2]==17))
                {
                    activeMenu = "#Images";
                     legendTitle = "Web-Based Images";
                }
                if((urlArray[1] == 18)||(urlArray[2]==18))
                {
                    activeMenu = "#Images";
                     legendTitle = "Upload Images";
                }
                if((urlArray[1] == 19)||(urlArray[2]==19))
                {
                     activeMenu = "#Images";
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
                    activeMenu = "#Structure";
                }
                if(urlArray[1] == 57)
                {
                    activeMenu = "#Structure";
                    legendTitle = "Edit Image Phrase";
                }
                if(urlArray[2] == 57)
                {
                    activeMenu = "#Structure";
                    legendTitle = "Image Phrases";
                }
                if(urlArray[2] == 58)
                { 
                    activeMenu = "#Structure";
                    legendTitle = "Audio Sentences";
                }
                if(urlArray[1] == 58)
                { 
                    activeMenu = "#Structure";
                    legendTitle = "Edit Audio Sentence";
                }
                if(urlArray[1] == 35)
                {
                    activeMenu = "#Structure";
                    legendTitle = "Edit Timer";
                }
                if(urlArray[2] == 35)
                {
                    activeMenu = "#Structure";
                    legendTitle = "Timers";
                }
                if(urlArray[1] == 36)
                {
                    activeMenu = "#Structure";
                    legendTitle = "Edit Metronome";
                }
                if(urlArray[2] == 36)
                {
                    activeMenu = "#Structure";
                    legendTitle = "Metronomes";
                }
            }
        }
        
        if (urlArray[0] == "#instructions") //INSTRUCTIONS
        {
            legendTitle = "Instructions";
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li class="active"><a href="#instructions">Instructions</a></li><li><a href="#about">Contact</a></li><li><a href="#testosc">Test OSC</a></li></ul></div>');
        }
        if (urlArray[0] == "#about") //CONTACT
        {
            legendTitle = "Contact";
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li><a href="#instructions">Instructions</a></li><li class="active"><a href="#about">Contact</a></li><li><a href="#testosc">Test OSC</a></li></ul></div>');
        }
         if (urlArray[0] == "#testosc") //TEST OSC
        {
            legendTitle = "OSC Web-Test";
            this.$('#bottomHeader').empty().append('<div class="tabbable red"><ul class="nav nav-pills"><li><a href="#instructions">Instructions</a></li><li><a href="#about">Contact</a></li><li class="active"><a href="#testosc">Test OSC</a></li></ul></div>');
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

           $('#performanceHeader').empty().append('<div id="audioReminder"><a id="leavePerformance"><i class="icon-remove"></i> Leave Performance</a> &nbsp; &nbsp; &nbsp; &nbsp;<a id="audioPerformanceToggle" style="color: green;"><i class="icon-volume-up audio-green"></i> Audio On</a></div>');
           
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

            $('#performanceHeader').empty().append('<div id="audioReminder"><a id="leavePerformance"><i class="icon-remove"></i> Leave Performance</a> &nbsp; &nbsp; &nbsp; &nbsp;<a id="audioPerformanceToggle" style="color: red;"><i class="icon-volume-off little-audio-red"></i> Audio Off</a></div>');
     
            console.log("AUDIO OFF");
             $('#jPlayerPerform').empty();
        }
        this.model.set("audio", audioToggle);
    }
});