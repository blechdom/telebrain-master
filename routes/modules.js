var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('telebraindb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'telebraindb' database");
        db.collection('content', {safe:true}, function(err, collection) {
            if (err) {
                console.log("CONTENT does not exist. Creating...");
                populateDBContent();
                console.log("CONTENT created.");
            }
        });
    }
});

exports.findContentById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving content with _id: ' + id);
    db.collection('content', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
exports.findContentByType = function(req, res) {
    var id = req.params.type_id;
    console.log('Retrieving all content type: ' + id);
    db.collection('content', function(err, collection) {
        collection.find({type_id: id}).toArray(function(err, items) {
            res.send(items);
        });
    });
};
exports.findAllContent = function(req, res) {
    console.log('Retrieving all content');
    db.collection('content', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
exports.addContent = function(req, res) {
    var content = req.body;
    console.log('Adding content: ' + JSON.stringify(content));
    db.collection('content', function(err, collection) {
        collection.insert(content, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateContent = function(req, res) {
    var id = req.params.id;
    var content = req.body;
    delete content._id;
    console.log('Updating content: ' + id);
    console.log(JSON.stringify(content));
    db.collection('content', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, content, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating content: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' content updated');
                res.send(content);
            }
        });
    });
};

exports.deleteContent = function(req, res) {
    var id = req.params.id;
    console.log('Deleting content: ' + id);
    db.collection('content', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' content deleted');
                res.send(req.body);
            }
        });
    });
};



/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.

var populateDBContent = function() {

    var content = [

    {
        type_id: "17",
        name: "Example Performance Program #1",
        image: "pics/program.jpg",
        units: "1",
        control: "",
        schedule: "",
        permissions: "0"
    },
    {
        type_id: "17",
        name: "Example Performance Program #2",
        units: "2",
        image: "pics/program.jpg",
        control: "",
        schedule: "",
        permissions: "0"
    }, 
    {
        type_id: "16",
        name: "Sequence of Phrases",
        control: "",
        image: "pics/units.jpg",
        schedule: "",
        permissions: "0"
    },
    {
        type_id: "16",
        name: "Phrase Delay",
        control: "",
        image: "pics/units.jpg",
        schedule: "",
        permissions: "0"
    },
    {
        type_id: "13",
        name: "Role-Based",
        image: "pics/perform-roles.jpg",
        permissions: "0"
    },
    {
        type_id: "13",
        name: "Full: All-To-All",
        image: "pics/perform-full.png",
        permissions: "0"
    },
    {
        type_id: "13",
        name: "Star: One-To-All",
        image: "pics/perform-full.png",
        permissions: "0"
    },
    {
        type_id: "13",
        name: "Star: All-To-One",
        image: "pics/perform-star.png",
        permissions: "0"
    },
    {
        type_id: "13",
        name: "Ring",
        image: "pics/perform-ring.png",
        permissions: "0"
    },
    {
        type_id: "13",
        name: "Tree",
        image: "pics/perform-tree.png",
        permissions: "0"
    },
    {
        type_id: "12",
        name: "Now",
        description: "trigger immediately",
        image: "pics/now.jpg",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        permissions: "0"
    },
   {
        type_id: "12",
        name: "Wait Until",
        description: "trigger later",
        image: "pics/pause.png",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        permissions: "0" 
    },
   {
        type_id: "12",
        name: "Metronome",
        description: "trigger at regular intervals",
        image: "pics/metronome.jpg",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        permissions: "0"
    },
    {
        type_id: "12",
        name: "Timer",
        description: "Set an amount of time to elapse.",
        image: "pics/timer.png",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        permissions: "0"
    },
    {
        type_id: "12",
        name: "Random Time",
        description: "Random triggers within an interval of time.",
        image: "pics/random.jpg",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        permissions: "0"
    },
    {
        type_id: "14",
        name: "Master",
        image: "pics/master.png",
        description: "full control: the only performer allowed to transmit.",
        permissions: "0"
    },
    {
        type_id: "14",
        name: "Slave",
        image: "pics/slave.png",
        description: "no control: can only receive.",
        permissions: "0"
    },
    {
        type_id: "14",
        name: "Lead",
        image: "pics/lead.gif",
        description: "Plays a leading role.",
        permissions: "0"
    },
    {
        type_id: "14",
        name: "Chorus",
        image: "pics/chorus.jpg",
        description: "Plays a supporting role.",
        permissions: "0"
    },
    {
        type_id: "11",
        name: "conditional branch",
        inputs: "[< 5]",
        image: "pics/ifelse.png",
        outputs: "imageURLs",
        permissions: "0"
    },
    {
        type_id: "11",
        name: "interation",
        inputs: "[3, 5, 1]",
        image: "pics/forwhile.jpg",
        outputs: "Phrases",
        permissions: "0"
    },
    {
        type_id: "1",
        name: "animated score",
        image: "http://blogfiles.wfmu.org/KF/2007/01/note/musical%20notation.gif",
        permissions: "0"
    },
    {
        type_id: "1",
        name: "cardew treatise",
        image: "http://blogfiles.wfmu.org/KF/2007/01/note/cardew_-_treatiseP183.jpg",
        permissions: "0"
    },
    {
        type_id: "1",
        name: "dance animation",
        image: "http://www.jazzcotech.com/images/brian_dance_ani.gif",
        permissions: "0"
    },
    {
        type_id: "1",
        name: "countdown",
        image: "http://www.johnston.k12.ia.us/schools/elemlmc/images/count2.gif",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "arrows",
        image: "pics/arrows.jpg",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "metronome",
        image: "pics/metronome_ani.gif",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "traditional notation",
        image: "pics/music-example.jpg",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "Chemical",
        image: "pics/notation-chemical.png",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "Record",
        image: "pics/record.png",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "Repeat",
        image: "pics/repeat.jpg",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "Tango",
        image: "pics/tango.jpg",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "conductor",
        image: "pics/conductor.gif",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "Chaos",
        image: "pics/chaos.jpg",
        permissions: "0"
    },
    {
        type_id: "2",
        name: "A Major",
        image: "pics/AMajor.png",
        permissions: "0"

    },
    {
        type_id: "6",
        name: "Old Car Honk",
        image: "pics/audioURL.jpg",
        audio: "http://www.pacdv.com/sounds/transportation_sounds/antique-car-honk-1.mp3",
        permissions: "0"

    },
    {
        type_id: "6",
        name: "Dog Growl",
        image: "pics/audioURL.jpg",
        audio: "http://www.sounddogs.com/sound-effects/2223/mp3/441201_SOUNDDOGS__do.mp3",
        permissions: "0"
    },
    {
        type_id: "6",
        name: "Uh oh Trombone",
        image: "pics/audioURL.jpg",
        audio: "http://www.sounddogs.com/sound-effects/3177/mp3/258845_SOUNDDOGS__co.mp3",
        permissions: "0"

    },
    {
        type_id: "6",
        name: "Man Falling",
        image: "pics/audioURL.jpg",
        audio: "http://www.sounddogs.com/sound-effects/2904/mp3/615900_SOUNDDOGS__ma.mp3",
        permissions: "0"
    },
    {
        type_id: "7",
        name: "mtbrain",
        image: "pics/audioUpload.jpg",
        audio: "MTBrain.mp3",
        permissions: "0"
    },
    {
        type_id: "7",
        name: "laugh",
        image: "pics/audioUpload.jpg",
        audio: "Laugh.mp3",
        permissions: "0"
    },
    {
        type_id: "7",
        name: "slide",
        image: "pics/audioUpload.jpg",
        audio: "Slide.mp3",
        permissions: "0"
    },
    {
        type_id: "7",
        name: "spring",
        image: "pics/audioUpload.jpg",
        audio: "Spring.mp3",
        permissions: "0"
    },
    {
        type_id: "4",
        name: "Shakespeare Quote",
        text: "Two households, both alike in dignity,In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean. From forth the fatal loins of these two foes - A pair of star-cross'd lovers take their life;",
        font: "Geneva",
        color: "#FF0000",
        image: "pics/type.jpg",
        bgcolor: "#000",
        size: "32px",
        permissions: "0"
    },
    {
        type_id: "4",
        name: "Gertrude Stein",
        text: "There is singularly nothing that makes a difference a difference in beginning and in the middle and in ending except that each generation has something different at which they are all looking. By this I mean so simply that anybody knows it that composition is the difference which makes each and all of them then different from other generations and this is what makes everything different otherwise they are all alike and everybody knows it because everybody says it.",
        font: "Geneva",
        color: "#FFFF00",
        image: "pics/type.jpg",
        bgcolor: "#FFF",
        size: "32px",
        permissions: "0"
    },
    {
        type_id: "4",
        name: "Bateson Quote",
        text: "The computer never truly encounters logical paradox, but only the simulation of paradox in trains of cause and effect. The computer therefore does not fade away. It merely oscillates.",
        font: "Geneva",
        color: "#00FF00",
        image: "pics/type.jpg",
        bgcolor: "#FF0000",
        size: "32px",
        permissions: "0"
    },
    {
        type_id: "5",
        name: "Bateson Quote",
        text: "The computer never truly encounters logical paradox, but only the simulation of paradox in trains of cause and effect. The computer therefore does not fade away. It merely oscillates.",
        voice: "Alex",
        image: "pics/speaking.jpg",
        preset: "Fast",
        permissions: "0"
    },
    {
        type_id: "5",
        name: "Stage Directions",
        text: "All Onstage",
        voice: "Alex",
        image: "pics/speaking.jpg",
        preset: "Clear",
        permissions: "0"
    },
    {
        type_id: "5",
        name: "Choreography",
        text: "Swing your partner to the left",
        voice: "Alex",
        image: "pics/speaking.jpg",
        preset: "Clear",
        permissions: "0"
    },
    {
        type_id: "5",
        name: "Instructions",
        text: "Repeat everything I say.",
        voice: "Alex",
        image: "pics/speaking.jpg",
        preset: "Clear",
        permissions: "0"
    },
    {
        type_id: "10",
        name: "Sequence 1",
        phrase: "[1, 2, 3, 4]",
        image: "pics/phrases.jpg",
        permissions: "0"
    },
    {
        type_id: "10",
        name: "Sequence 2",
        phrase: "[4, 3, 2, 1]",
        image: "pics/phrases.jpg",
        permissions: "0"
    },
    {
        type_id: "10",
        name: "Sequence 3",
        phrase: "[6, 5, 8, 1]",
        image: "pics/phrases.jpg",
        permissions: "0"
    },
    {
        type_id: "18",
        name: "telebrain",
        passcode: "",
        image: "pics/mtbrain.png",
        securityQuestion: "No Password",
        answer: ""
    },
    {
        type_id: "18",
        name: "The Tigers",
        passcode: "",
        image: "http://la3eme72011.edublogs.org/files/2012/01/lovely-tiger-cubs-19d5399.jpg",
        securityQuestion: "No Password",
        answer: ""
    },
    {
        type_id: "18",
        name: "Goofballs",
        passcode: "",
        image: "http://www.americansale.com/images/products/medium/025829.jpg",
        securityQuestion: "No Password",
        answer: ""
    },
    {
        type_id: "18",
        name: "Psychic Blanket",
        passcode: "",
        image: "http://dhairyaenterprises.com/wp-content/gallery/three/org_fleece-baby-blankets.jpg",
        securityQuestion: "No Password",
        answer: "" 
    },
    {
        id: "1",
        type_id: "0",
        name: "Web-Based Image",
        image: "pics/imageURL.jpg"
    },
    {
        id: "2",
        type_id: "0",
        name: "Uploaded Image",
        image: "pics/imageUpload.jpg"
    },
    {
        id: "3",
        type_id: "0",
        name: "Graphics",
        image: "pics/graphics.png"
    },
    {
        id: "4",
        type_id: "0",
        name: "Teleprompter Text",
        image: "pics/type.jpg"
    },
    {
        id: "5",
        type_id: "0",
        name: "Text-To-Speech Text",
        image: "pics/speaking.jpg"
    },
    {
        id: "6",
        type_id: "0",
        name: "Web-Based Audio",
        image: "pics/audioURL.jpg"
    },
    {
        id: "7",
        type_id: "0",
        name: "Uploaded Audio",
        image: "pics/audioUpload.jpg"
    },
    {
        id: "8",
        type_id: "0",
        name: "Synthesized Audio",
        image: "pics/synth.jpg"
    },
    {
        id: "9",
        type_id: "0",
        name: "Vibrate",
        image: "pics/vibrate.jpg"
    },
    {
        id: "10",
        type_id: "0",
        name: "Phrases",
        image: "pics/phrases.jpg"
    },
    {
        id: "11",
        type_id: "0",
        name: "Controls",
        image: "pics/ifelse.png"
    },
    {
        id: "12",
        type_id: "0",
        name: "Schedules",
        image: "pics/timer.png"
    },
    {
        id: "13",
        type_id: "0",
        name: "Networks",
        image: "pics/perform-star.png"
    },
    {
        id: "14",
        type_id: "0",
        name: "Roles",
        image: "pics/master.png"
    },
    {
        id: "15",
        type_id: "0",
        name: "Interfaces",
        image: "pics/interfaces.png"
    },
    {
        id: "16",
        type_id: "0",
        name: "Units",
        image: "pics/units.jpg"
    },
    {
        id: "17",
        type_id: "0",
        name: "Programs",
        image: "pics/program.jpg"
    },
    {
        id: "18",
        type_id: "0",
        name: "Troupes",
        image: "pics/team.png"
    }];

    db.collection('content', function(err, collection) {
        collection.insert(content, {safe:true}, function(err, result) {});
    });
};