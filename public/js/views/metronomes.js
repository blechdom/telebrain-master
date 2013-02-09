window.MetroView = Backbone.View.extend({

    initialize: function () {
         //Force Defaults on NEW
        if(this.model.get('permissions')==1){
            this.model.set(this.model.defaults);
            this.model.set('image', "pics/metronome.jpg");
        }
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));

        var selectedFlag = '';
        var selectedVal = this.model.get("numberOfBeats");
        console.log("time signature " + selectedVal);

        this.$("#timeSignatureDiv").empty().append('<div id="beatsMenuDiv"><label for="name" class="control-label">Time Signature:</label><div class="controls"><select id="beatsMenu" class="input-mini"><option value="0"> # </option>');
        for (var i = 1; i<=64; i++) {
            if(i==selectedVal) {
                console.log(i);
                selectedFlag = "selected";
            }
            else { selectedFlag = ""; }
            this.$("#beatsMenu").append('<option value="' + i + '" ' + selectedFlag + '>' + i + '</option>');
        }
        this.$("#beatsMenuDiv").append('</select></div>');
        return this;
    },

    events: {
        "change"                    : "change",
        "click .save"               : "beforeSave",
        "click .delete"             : "deleteModule",
        "change #beatsMenu"         : "setNumberOfBeats",
        "click #previewMetro"       : "previewMetro",
        "keyup #bpm"                : "checkBPMInput",
        "click .timestart"          : "startMetro",
        "click .timestop"           : "stopMetro",
        "click #audioMetro"         : "setAudio"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },
    checkBPMInput: function(e){
        utils.hideAlert();
        this.stopMetro();
        $("#metroView").empty();
        var bpmInput = $(e.currentTarget).val();
        
        if (bpmInput != bpmInput.replace(/[^0-9\.]/g, '')) {
           bpmInput = bpmInput.replace(/[^0-9\.]/g, '');
           $(e.currentTarget).val(bpmInput);
           
        }
        console.log(bpmInput);
        if (bpmInput > 0 ){
            this.model.set("bpm", bpmInput);
        }
        else {
            utils.showAlert('Error', "BPM must be greater than zero.");
        }
        
    },
    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveModule();
        return false;
    },

    saveModule: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('perform/' + model.parent_id + '/' + model.get('_id'), false);
                utils.showAlert('Success!', 'Schedule saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {
        this.model.destroy({
            success: function () {
                alert('Schedule deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    setNumberOfBeats: function(e) {
        this.stopMetro();
        $("#metroView").empty();
        var beats = $(e.currentTarget).val();
        console.log("top sig " + beats);
        this.model.set("numberOfBeats", beats);
    },
    previewMetro: function() {
        utils.hideAlert();
        var bpm = this.model.get("bpm");
        var beats = this.model.get("numberOfBeats");
        console.log("preview Metro " + bpm + " " + beats);
        $("#metroView").empty().append('<label for="bpm" class="control-label">Metronome Preview:</label><div class="controls form-horizontal"><label class="checkbox"><input type="checkbox" id="audioMetro" onclick="$(this).val(this.checked ? 1 : 0)"><div class="inline">Audio Metro</label></div></div><div class="controlpanel controls"><a class="timestart" href="javascript:void(0);">start</a><a class="timestop" href="javascript:void(0);">stop</a></div><div class="controls"><time datetime="2012-11-16T10:43:50Z" data-time-label="#beatTicks" data-time-tooltip data-bpm="' + bpm + '" >0000 TICKS(ms)</time></div><div class="controls"><time datetime="2012-11-16T10:43:50Z" data-time-label="#beatBlinker" data-time-tooltip data-bpm="' + bpm + '" data-beats="' + beats + '">00 BEATS</time></div><div class="controls"><time datetime="2012-11-16T10:43:50Z" data-time-label="#measureBlinker" data-time-tooltip data-bpm="' + bpm + '" data-beats="' + beats + '">00 MEASURES</time></div>');
       
    },
    startMetro: function() {
        utils.hideAlert();
        var beats = this.model.get("numberOfBeats");
        var audioFlag = this.model.get("audioFlag");
        if (audioFlag == 1){
            if($("#jquery_jplayer_1").length > 0)
            {
                utils.hideAlert();
                $("#jquery_jplayer_1").jPlayer("setMedia", {
                mp3: "snd/uploads/click-high.mp3"
                }).jPlayer("load");
            }
            else {
                utils.showAlert('Audio Warning', 'Audio is off. Turn on to preview.', 'alert-error');
            }
         }
        
          $('[datetime]').attr('datetime', new Date().getTime()
            -new Date().getTimezoneOffset()*60000);
          //makes highlight occur at interval
          $('#metroView').on('refreshComplete', function(e, data){
              if (data.htmlChanged && data.nextRefreshMs > 100) {
                  var root = $(e.target);
                  var labels = root.find('[data-time-label]');
                  if (root.is('[data-time-label]')) {
                    
                      labels = labels.add(root);
                  }
                  labels.addClass('timer-tick');
                      setTimeout(function(){
                          labels.removeClass('timer-tick');
                      },80);
                if (audioFlag == 1){
                    $("#jquery_jplayer_1").jPlayer("play");
                }
                 
               }
          });
          this.$('#metroView').livetime();
    },
    stopMetro: function() {
        utils.hideAlert();
        console.log("stop Metro");
        $('#metroView').livetime(false);
    },
    setAudio: function(e) {
        var check=e.currentTarget;
        var flagVal = $(e.currentTarget).val();
        this.model.set("audioFlag", flagVal);
        console.log("set Audio " + flagVal);
        if (flagVal==1){
            this.startMetro();
        }
        else {
            this.stopMetro();
        }
    }
});