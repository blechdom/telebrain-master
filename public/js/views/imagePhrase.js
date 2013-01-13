window.ImagePhraseMasterView = Backbone.View.extend({

    initialize: function () {
        var phraseId, phraseObject;
        var phraseArray = [];
        var imageList = [];
        var imageCounter = 0;
        this.model.set("imagelist", []);
        _.bindAll(this, 'render', 'beforeSave', 'loadList', 'saveModule', 'deleteModule', 'addToList', 'clearList', 'drawList', 'previewPhrase'); //must bind before rendering
        this.render();
    },

    render: function () {
        if (!this.imagePhraseView) {
            this.imagePhraseView = new ImagePhraseView();
        }
        $(this.el).append(this.imagePhraseView.el);
        
        this.phraseId = this.model.get("_id");
        console.log("image phrase id: " + this.phraseId);

        this.collection.each(function(phraseModel) {
            if(phraseModel.get('_id')==this.phraseId) 
            { 
                this.model.set(phraseModel.attributes);
            }
        }, this);

        if(this.model.get('permissions')==1){
            this.model.set(this.model.defaults);
            console.log("this is default phrase");
        }
        
        this.$('#phraseName').append('<input type="text" id="name" name="name" value="' + this.model.get("name") + '"/><span class="help-inline"></span>');

        this.phraseArray = this.model.get("phrase");
        this.imageList = this.model.get("imagelist");
        for (i = 0; i < this.phraseArray.length; i++ ){
            console.log("array members: " + this.phraseArray[i]);
            //limit to phrase parent_id eventually
            this.collection.each(function(model) {
                if(model.get('_id') == this.phraseArray[i]){ 
                    this.drawList(model.get('name')); 
                    //this.imageList.push(model.get('image')); 
                }
            }, this);
        } 
        this.loadList();
        this.$("#imageURLMenuDiv").prepend('<select id="imageURLMenu"><option value="0">--SELECT IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==17)&&(model.get('permissions')!=1)){ 
             this.$('#imageURLMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',17">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#imageUploadMenuDiv").prepend('<select id="imageUploadMenu"><option value="0">--SELECT IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==18)&&(model.get('permissions')!=1)){ 
             this.$('#imageUploadMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',18">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#imageTelepromptMenuDiv").prepend('<select id="imageTelepromptMenu"><option value="0">--SELECT TELEPROMPT--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==19)&&(model.get('permissions')!=1)){ 
             this.$('#imageTelepromptMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',19,' + model.get("text") + ',' + model.get("font") + ',' + model.get("color") + ',' + model.get("bgcolor") + ','  + model.get("size") + '">' + model.get("name") + '</option>');
            }
        }, this);
        this.$("#imagePhraseMenuDiv").prepend('<select id="imagePhraseMenu"><option value="0">--SELECT PHRASE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==57)&&(model.get('permissions')!=1)&&(model.get('_id')!=this.phraseId)){ 
             this.$('#imagePhraseMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + ',57">' + model.get("name") + '</option>');
            }
        }, this);

        console.log("Phrase _ids: " + this.phraseArray);
        return this;
    },
    events: {
        "change"            : "change",
        "click .save"       : "beforeSave",
        "click .delete"     : "deleteModule",
        "change select"     : "addToList",
        "click #previewPhrase"  : "previewPhrase",
        "click #clearList"  : "clearList",
        "click #nextImage"  : "nextImage"
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
        this.imageList = [];
        this.model.set("imagelist", this.imageList);
        this.model.save(null, {
            success: function (model) {
                //self.render();
                app.navigate('structure/' + model.get("parent_id") + '/' + model.get('_id'), true);
                utils.showAlert('Success!', 'Phrase saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteModule: function () {

        this.model.destroy({
            success: function () {
                alert('Phrase deleted successfully');
                //window.history.back();
                window.location.replace('#create/8/57');
            }
        });
        return false;
    },

    clearList: function(e) {
         // Remove any existing alert message
        utils.hideAlert();
            this.phraseArray = [];
            this.imageList = [];
            this.model.set("phrase", this.phraseArray);
            this.model.set("imagelist", this.imageList);
            this.$('#addedImage').empty();
            this.$('#imageViewer').empty();
            console.log("Cleared List");
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
    loadList: function(){
        if (this.imageList.length == 0) {
        console.log("gonna add some stuff");
            for (i = 0; i < this.phraseArray.length; i++ ){
                this.collection.each(function(model) {
                    if(model.get('_id') == this.phraseArray[i]){ 
                        if((model.get('parent_id')== 17)||(model.get('parent_id')== 18)||(model.get('parent_id')== 57)) {
                            this.imageList.push({image: model.get('image'), imageType: model.get('parent_id')});
                        }
                        else if(model.get('parent_id')== 19) {  // text, font, color, bgcolor, size
                            this.imageList.push({   image: model.get('image'), 
                                                    imageType: model.get('parent_id'),
                                                    text: model.get('text'),
                                                    font: model.get('font'),
                                                    color: model.get('color'),
                                                    bgcolor: model.get('bgcolor'),
                                                    size: model.get('size')
                                                });
                        }
                    }
                }, this);
            } 
        }             
    },
    addToList: function(e) {
        if(this.imageList.length==0){ this.loadList(); }
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var imageData = $(e.currentTarget).find('option:selected').data('image');
            var image = imageData.split(',');
            console.log(image);
            this.phraseArray.push(val);
            this.model.set("phrase", this.phraseArray);
            if ((image[1]==17)||(image[1]==18)||(image[1]==57))
            {
                this.imageList.push({image: image[0], imageType: image[1]});
            }
            else if (image[1]==19)
            {
                this.imageList.push({   image: image[0], 
                                        imageType: image[1], 
                                        text: image[2],
                                        font: image[3],
                                        color: image[4],
                                        bgcolor: image[5],
                                        size: image[6]});
            }
            this.model.set("imagelist", this.imageList);
            console.log(this.model.get("phrase"));
            this.drawList(name);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    drawList: function(name){
            this.$('#addedImage').append("<li>" + name + " </li>");
    },
    previewPhrase: function() {
        this.imageCounter = 0;
        utils.hideAlert();
        if (this.imageList.length > 0)
        {
            var firstImage = this.imageList[0];
            console.log(this.imageList[1]);
            if(firstImage.imageType == 19)
            {
                console.log("TELEPROMPT");
                if(this.imageList.length > 1)
                {
                    this.$('#imageViewer').empty().append("<div id='nextButton'><a class='btn btn-success' id='nextImage'>Next Image</a></div><div id='internalViewer'><div class='breakword' style='width:100%;margin: 0px auto; background-color:" + firstImage.bgcolor + "; font-size:" + firstImage.size + "px; color:" + firstImage.color + ";font-family:" + firstImage.font + "; line-height:" + firstImage.size + "px;'>" + firstImage.text + "</div></div>");
                }
                else
                {
                    this.$('#imageViewer').empty().append("<div id='internalViewer'><div class='breakword' style='width:100%;margin: 0px auto; background-color:" + firstImage.bgcolor + "; font-size:" + firstImage.size + "px; color:" + firstImage.color + ";font-family:" + firstImage.font + "; line-height:" + firstImage.size + "px;'>" + firstImage.text + "</div></div>");
                }
            }
            else
            {
                if(this.imageList.length > 1)
                {
                    this.$('#imageViewer').empty().append("<div id='nextButton'><a class='btn btn-success' id='nextImage'>Next Image</a></div><div id='internalViewer'><img src='" + firstImage.image + "' width=100%></div>");
                }
                else
                {
                    this.$('#imageViewer').empty().append("<div id='internalViewer'><image src='" + firstImage.image + "'></div>");
                }
            }
        }
        else
        {
            utils.showAlert('Preview Error', 'Add content to phrase before preview', 'alert-info');  
        }
        this.imageCounter++;
    }, 
    nextImage: function() {
        var imageNext;
        var i = this.imageCounter++;
        console.log(i);
        if (i == this.imageList.length)
        {
            this.$('#imageViewer').empty();
        }
        else
        {
            imageNext = this.imageList[i];
            console.log("image next: " + imageNext);
            if(imageNext.imageType == 19)
            {
                this.$('#internalViewer').empty().append("<div class='breakword' style='width:100%;margin: 0px auto; background-color:" + imageNext.bgcolor + "; font-size:" + imageNext.size + "px; color:" + imageNext.color + ";font-family:" + imageNext.font + "; line-height:" + imageNext.size + "px;'>" + imageNext.text + "</div>");
            }
            else
            {
                this.$('#internalViewer').empty().append("<image src='" + imageNext.image + "'>");
            }
        }
    }      
});
window.ImagePhraseView = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});