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
        var selectedFlag2 = '';
        var selectedVal = this.model.get("numberOfBeats");
        var selectedVal2 = this.model.get("beatValue");
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
        this.$("#beatsMenuDiv").append('</select></div><div class="controls"><select id="beatValueMenu" class="input-mini"><option value="0"> # </option>');
        for (var i = 1; i<=6; i++) {
            var beatVal = Math.pow(2, i);
            console.log(beatVal)
            if(beatVal==selectedVal2) {
                selectedFlag2 = "selected";
            }
            else { selectedFlag2 = ""; }
            this.$("#beatValueMenu").append('<option value="' + beatVal + '" ' + selectedFlag2 + '>' + beatVal + '</option>');
        }
        this.$("#beatsMenuDiv").append('</select></div></div>');
        return this;
    },

    events: {
        "change"                    : "change",
        "click .save"               : "beforeSave",
        "click .delete"             : "deleteModule",
        "change #beatsMenu"         : "setNumberOfBeats",
        "change #beatValueMenu"     : "setBeatValue",
        "click #previewMetro"       : "previewMetro",
        "keyup #bpm"                : "checkBPMInput",
        "click .timestart"          : "startMetro",
        "click .timestop"           : "stopMetro"
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
        var bpmInput = $(e.currentTarget).val();
        
        if (bpmInput != bpmInput.replace(/[^0-9\.]/g, '')) {
           bpmInput = bpmInput.replace(/[^0-9\.]/g, '');
           $(e.currentTarget).val(bpmInput);
           utils.showAlert('Error', "only numbers allowed");
        }
        console.log(bpmInput);
        this.model.set("bpm", bpmInput);
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
        var beatNumber = $(e.currentTarget).val();
        console.log("top sig " + beatNumber);
        this.model.set("numberOfBeats", beatNumber);
    },
    setBeatValue: function(e) {
        var beatValue = $(e.currentTarget).val();
        console.log("bottom sig " + beatValue);
        this.model.set("beatValue", beatValue);
    },
    previewMetro: function() {
        utils.hideAlert();
        var bpm = this.model.get("bpm");
        var beatNumber = this.model.get("numberOfBeats");
        var beatValue = this.model.get("beatValue");
        console.log("preview Metro " + bpm + " " + beatNumber + "/" + beatValue);

        $("#metroView").empty().append('<label for="bpm" class="control-label">Metronome Preview:</label><div class="controlpanel controls"><a class="timestart" href="javascript:void(0);">start</a><a class="timestop" href="javascript:void(0);">stop</a></div><div class="controls"><time datetime="2012-11-16T10:43:50Z" data-time-label="#beatTicks" data-time-tooltip>0000 TICKS(ms)</time></div><div class="controls"><time datetime="2012-11-16T10:43:50Z" data-time-label="#beatBlinker" data-time-tooltip>00 BEATS</time></div><div class="controls"><time datetime="2012-11-16T10:43:50Z" data-time-label="#measureBlinker" data-time-tooltip>00 MEASURES</time></div>');
       
    },
    startMetro: function() {
        utils.hideAlert();
        var bpm = this.model.get("bpm");
        var beatNumber = this.model.get("numberOfBeats");
        var beatValue = this.model.get("beatValue");
        console.log("start Metro " + bpm + " " + beatNumber + "/" + beatValue);
        
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
               }
          });
          $('#metroView').livetime();
    },
    stopMetro: function() {
        utils.hideAlert();
        console.log("stop Metro");
        $('#metroView').livetime(false);
    }
});