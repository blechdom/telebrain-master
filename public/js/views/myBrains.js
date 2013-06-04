window.MyBrainsView = Backbone.View.extend({

    initialize: function () {
        this.model.set("canvasFlag", 0);
        this.model.set("newObjectFlag", 0);
        console.log("this model: " + JSON.stringify(this.model));
        
        this.render();
    },

    render: function (options) {
        $(this.el).html(this.template());
        var mybrainsId = this.model.get("_id");
        var mybrainsName = "";

        this.collection.each(function(brainsModel) {    
            if(brainsModel.get('_id') == mybrainsId) 
            { 
                mybrainsName = brainsModel.get("name");
            }
        }, this);
        this.$(".mybrainsHeader").empty().append("<div class='tabbable' id='mybrainsBottomHeader'></div><div id='legendTitle'><legend>" + mybrainsName + "'s brains &nbsp;&nbsp;&nbsp;<small><a href='/#create/75/" + mybrainsId + "'>Edit Profile</a></small></legend><div id='toolbarMenu' class='tabbable red higher'><ul class='nav nav-pills'><li class='lower'>TOOLBAR:</li><li class='dropdown' id='brainMenu'><a class='dropdown-toggle' data-toggle='dropdown'>Brain</a><ul class='dropdown-menu'><li><a id='newBrain'>New</a></li><li><a id='openBrain'>Open</a></li><li><a id='saveBrain'>Save</a></li><li><a id='saveAsBrain'>Save As</a></li></ul></div></div><div id='buildBrainPlumb'></div>");

        
        return this;
    },

     events: {
        "click #newBrain"           : "newBrain",
        "click #openBrain"          : "openBrain",
        "click #saveBrain"          : "saveBrain",
        "click #saveAsBrain"        : "saveAsBrain",
        "click #editBrain"          : "editBrain",
        "change"                    : "change",
        "click .save"               : "beforeSave",
        "click .delete"             : "deleteModule",
        "click #addNewRole"         : "addNewRole"
    },
    newBrain: function(){
        console.log("new brain");
        this.model.set({brainName: "New Brain", brainImage: "pics/brain.jpg"});
        this.$("#toolbarMenu ul").append("<li class='dropdown' id='addObject'><a class='dropdown-toggle' data-toggle='dropdown'>Add Object</a><ul class='dropdown-menu'><li><a id='addNewRole'>New Role</a></li><li><a id='newInterface'>New Interface</a></li>");
        this.$("#buildBrainPlumb").empty().append("<div class='window brain' id='windowBrain'>NEW BRAIN<br><img src='pics/brain.jpg' width=40 height=40>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='editBrain'>edit</a><br><i class='icon-volume-up audio-icon-green'><font class='tiny-font'> audio</font></i>&nbsp;&nbsp;&nbsp;<i class='icon-picture audio-icon-red'><font class='tiny-font'> image</font></i></div>");
        this.addNewRole();
        
    },
    openBrain: function(){
        console.log("open brain");
    },
    saveBrain: function(){
        console.log("save brain");
    },
    saveAsBrain: function(){
        console.log("save as brain");
    },
    editBrain: function(){
        console.log("edit brain");
    },
    addNewRole: function(){
        var rolesList = this.model.get("rolesList");
        var rolesLength = rolesList.length + 1;
        rolesList.push({ roleNumber: rolesLength, roleName: "NEW ROLE", roleImage: "pics/user_default.png"});
        this.model.set("rolesList", rolesList);
        this.$("#buildBrainPlumb").append("<div class='window role' id='windowRole" + rolesLength + "'><i class='icon-volume-up audio-icon-green'><font class='tiny-font'> audio</font></i>&nbsp;&nbsp;&nbsp;<i class='icon-picture audio-icon-red'><font class='tiny-font'> image</font></i><br>NEW ROLE " + rolesLength + "<br><img src='pics/user_default.png' width=40 height=40>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='editRole'>edit</a></div>");
        this.plumbBrain();
    },
    plumbBrain: function(e){
            
            var rolesList = this.model.get("rolesList");

            jsPlumb.bind("ready", function() {    

            connections = [],
            updateConnections = function(conn, remove) {
                if (!remove) connections.push(conn);
                else {
                    var idx = -1;
                    for (var i = 0; i < connections.length; i++) {
                        if (connections[i] == conn) {
                            idx = i; break;
                        }
                    }
                    if (idx != -1) connections.splice(idx, 1);
                }
                if (connections.length > 0) {
                    for (var j = 0; j < connections.length; j++) {
                      console.log((j+1) + ". Scope: " + connections[j].scope + " Source: " + connections[j].sourceId + " Target: " + connections[j].targetId );
                    }
                } 
            };
        
            jsPlumb.importDefaults({
                DragOptions : { cursor: 'pointer', zIndex:2000 },
                PaintStyle : {
                    strokeStyle:"#FF0000",
                    lineWidth:2
                },
                Connector:["Bezier", { curviness:60 }],
                EndpointStyle : { width:10, height:10, strokeStyle:'#666' },
                Endpoint : ["Dot", {radius:5}],
                //Anchors : ["TopCenter", "TopCenter"],
                ConnectionOverlays : [
                    //[ "Label", { label:"FOO", id:"label" }],
                    [ "Arrow", { 
                        location:1,
                        id:"arrow",
                        length:12,
                        width: 12,
                        foldback:1
                    } ]
                ]
            });                                             
            jsPlumb.bind("click", function(c) { 
                jsPlumb.detach(c); 
            });
            // bind to connection/connectionDetached events, and update the list of connections on screen.
            jsPlumb.bind("connection", function(info, originalEvent) {
                updateConnections(info.connection);
            });
            jsPlumb.bind("connectionDetached", function(info, originalEvent) {
                updateConnections(info.connection, true);
            });

            // configure some drop options for use by all endpoints.
            var brainsDropOptions = {
                tolerance:"touch",
                hoverClass:"dropHover",
                activeClass:"dragActive"
            };
            
            var audioColor = "#62c462";
            var audioSendEndpoint = {
                endpoint:["Rectangle", {width:10, height:10}],
                isSource:true,
                isTarget:false,
                scope:"audio",
                dropOptions: brainsDropOptions,
                paintStyle: { fillStyle: audioColor },
                connectorStyle:{ strokeStyle:audioColor, lineWidth:2 }
              
            }; 

            var audioReceiveEndpoint = {
                endpoint:["Dot", { radius:5 }],
                isSource:false,
                isTarget:true,
                scope:"audio",
                dropOptions: brainsDropOptions,
                paintStyle: { fillStyle: audioColor },
                connectorStyle:{ strokeStyle:audioColor, lineWidth:2 }
                
            };          

            var imageColor = "#FF0000";
            var imageSendEndpoint = {
                endpoint:["Rectangle", {width:10, height:10}],
                isSource:true,
                isTarget:false,
                scope:"image",
                dropOptions: brainsDropOptions,
                paintStyle: { fillStyle: imageColor },
                connectorStyle:{ strokeStyle:imageColor, lineWidth:2 }
                
            };
             
            var imageReceiveEndpoint = {
                endpoint:["Dot", { radius:5 }],
                isSource:false,
                isTarget:true,
                scope:"image",
                dropOptions: brainsDropOptions,
                paintStyle: { fillStyle: imageColor },
                connectorStyle:{ strokeStyle:imageColor, lineWidth:2 }
            
            };
                
           /* maxConnectionsCallback = function(info) {
                alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            };
           */
            var e1 = jsPlumb.addEndpoint('windowBrain',{ anchor:[0.1, 1.05, 0, 1]}, audioSendEndpoint); 
           // e1.bind("maxConnections", null);
            jsPlumb.addEndpoint("windowBrain", { anchor:[0.3, 1.05, 0, 1]} , audioReceiveEndpoint);
            jsPlumb.addEndpoint('windowBrain', { anchor:[0.7, 1.05, 0, 1] }, imageSendEndpoint); 
            jsPlumb.addEndpoint("windowBrain",  { anchor:[0.9, 1.05, 0, 1] }, imageReceiveEndpoint);

            for (var i = 0; i < rolesList.length; i++) {
                console.log("roles " + rolesList[i].roleNumber);
                var roleNumber = rolesList[i].roleNumber;
            
                var e2 = jsPlumb.addEndpoint('windowRole' + roleNumber, { anchor:[0.3, -0.04, 0, -1]}, audioSendEndpoint);
                var e2 = jsPlumb.addEndpoint('windowRole' + roleNumber, { anchor:[0.1, -0.04, 0, -1]}, audioReceiveEndpoint);
                var e2 = jsPlumb.addEndpoint('windowRole' + roleNumber, { anchor:[0.9, -0.04, 0, -1]}, imageSendEndpoint);
                var e2 = jsPlumb.addEndpoint('windowRole' + roleNumber, { anchor:[0.7, -0.04, 0, -1]}, imageReceiveEndpoint);
                //e2.bind("maxConnections", maxConnectionsCallback);
            }
           
            var roleWindows = $(".role");
            jsPlumb.draggable(roleWindows);
            jsPlumb.draggable(roleWindows);
            
           /* jsPlumb.makeTarget(roleWindows, {
                dropOptions:{ hoverClass:"hover" }
            });*/ 

        });
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
                app.navigate('content/' + model.parent_id + '/' + model.get('_id'), false);
                utils.showAlert('Success!', 'Brains saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete your brains', 'alert-error');
            }
        });
    },
 
    deleteModule: function () {
        this.model.destroy({
            success: function () {
                alert('Brains deleted successfully');
                window.history.back();
            }
        });
        return false;
    }
});