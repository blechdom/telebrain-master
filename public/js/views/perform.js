
window.PerformView = Backbone.View.extend({

        initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },
    events: {
     
        "change select"     : "updateImage",
        "click #usernameSend"       : "renderMenus"
    },

    updateImage: function(e) {
        
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            var image = $(e.currentTarget).find('option:selected').data('image');
            console.log(image);
            socket.emit('sendimage', image);
            $(e.currentTarget)[0].selectedIndex = 0;
        }
    },
    renderMenus: function() {
        
       console.log("render menus");
       this.$("#imageURLMenuDiv").prepend('<select id="imageURLMenu"><option value="0">--SELECT WEB IMAGE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==17)&&(model.get('permissions')!=1)){
             this.$('#imageURLMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#imageUploadMenuDiv").prepend('<select id="imageUploadMenu"><option value="0">--SELECT IMAGE UPLOAD--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==18)&&(model.get('permissions')!=1)){
             this.$('#imageUploadMenu').append('<option value="' + model.get("_id") + '" data-image="' + model.get("image") + '">' + model.get("name") + '</option>');
            }
        }, this);
    }

});