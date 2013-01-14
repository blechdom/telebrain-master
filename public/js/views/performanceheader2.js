window.PerformanceMasterHeaderView2 = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        if (!this.performanceHeaderView2) {
            this.performanceHeaderView2 = new PerformanceHeaderView2();
        }
        $(this.el).append(this.performanceHeaderView2.el);

        this.$("#performanceMenuDiv").prepend('<select id="performanceMenu"><option value="0">--START PERFORMANCE--</option>');

        this.collection.each(function(model) {
            if((model.get('parent_id')==15)&&(model.get('permissions')!=1)){ 

                this.$('#performanceMenu').append('<option value="' + model.get("_id") + '">' + model.get("name") + '</option>');
            }
        }, this);

        this.$("#livePerformanceMenuDiv").prepend('<select id="livePerformanceMenu"><option value="0">--JOIN PERFORMANCE--</option>');

        socket.emit('getRoomsList');
        socket.on('liveRoomslist', function (data){
            console.log(data);
            for(var i = 1; i < data.rooms.length; i++){
                var roomString = data.rooms[i];
                while(roomString.charAt(0) === '/')
                    roomString = roomString.substr(1);
                console.log(roomString);
                this.collection.each(function(model) {
                    if((model.get('parent_id')==99)&&(model.get('performanceName')==roomString)){ 

                        this.$('#livePerformanceMenu').append('<option value="' + model.get('_id') + '">' + roomString + '</option>');
                    }
                }, this);
            }
        }.bind(this));
    },
     events: {
     
        "change #performanceMenu"           : "loadPerformance",
        "change #livePerformanceMenu"       : "livePerformance"
    },
    loadPerformance: function (e) {
        var val = $(e.currentTarget).val();
        if (val != 0) {
            var name = $(e.currentTarget).find('option:selected').text();
            console.log(val + " " + name);
            app.navigate('#performance2/15/' + val, true);

        }

    },
    livePerformance: function (e) {
        var val = $(e.currentTarget).val();
        if (val != 0) {
            console.log(val + " " + name);
            app.navigate('#performance2/99/' + val, true);
        }

    }

});
window.PerformanceHeaderView2 = Backbone.View.extend({

    initialize:function () {

        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        $('#renderPerformance').hide();
        return this;
    }

});