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

exports.findAllTelebrain = function(req, res) {
    console.log('Retrieving all of telebrain collection');
    db.collection('telebrain', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findContentById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving content with _id: ' + id);
    db.collection('content', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
exports.findContentByParent = function(req, res) {
    var id = req.params.id;
    if ( id.length != 24)
    {
        console.log('Retrieving all content type: ' + id);
        db.collection('content', function(err, collection) {
            collection.find({parent_id: id}).toArray(function(err, items) {
                res.send(items);
            });
        });
    }
    else
    {
        console.log('Retrieving content with _id: ' + id);
        db.collection('content', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                res.send(item);
            });
        }); 
    }
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

exports.addContentByParent = function(req, res) {
    console.log("in add content");
    var parent_id = req.params.parent_id;
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

exports.findAllImages = function(req, res) {
    console.log('Retrieving all images');
    db.collection('content', function(err, collection) {
        collection.find({ $or: [ { parent_id: "1" } ,
             { parent_id: "2" } ] }).toArray(function(err, items) {
            res.send(items);
        });
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.

var populateDBContent = function() {

    var content = [

    {
        _id: "1",
        parent_id: "0",
        name: "Content",
        image: "pics/imageURL.jpg"
    },
    {
        _id: "2",
        parent_id: "0",
        name: "Structure",
        image: "pics/imageUpload.jpg"
    },
    {
        _id: "3",
        parent_id: "0",
        name: "Communication",
        image: "pics/perform-full.png"
    },
    {
        _id: "4",
        parent_id: "0",
        name: "Performance",
        image: "pics/program.jpg"
    },
    {
        _id: "5",
        parent_id: "1",
        name: "Images",
        image: "pics/frame.jpg"
    },
    {
        _id: "6",
        parent_id: "1",
        name: "Audio",
        image: "pics/audio.jpg"
    },
    {
        _id: "7",
        parent_id: "1",
        name: "Other Content",
        image: "pics/vibrate.jpg"
    },
    {
        _id: "8",
        parent_id: "2",
        name: "Phrases",
        image: "pics/phrases.jpg"
    },
    {
        _id: "9",
        parent_id: "2",
        name: "Controls",
        image: "pics/ifelse.png"
    },
    {
        _id: "10",
        parent_id: "2",
        name: "Schedules",
        image: "pics/timer.png"
    },
    {
        _id: "11",
        parent_id: "3",
        name: "Networks",
        image: "pics/perform-star.png"
    },
    {
        _id: "12",
        parent_id: "3",
        name: "Roles",
        image: "pics/master.png"
    },
    {
        _id: "13",
        parent_id: "3",
        name: "Interfaces",
        image: "pics/interfaces.png"
    },
    {
        _id: "14",
        parent_id: "4",
        name: "Fragments",
        image: "pics/units.jpg"
    },
    {
        _id: "15",
        parent_id: "4",
        name: "Programs",
        image: "pics/program.jpg"
    },
    {
        _id: "16",
        parent_id: "4",
        name: "People",
        image: "pics/team.png"
    },
    {
        _id: "17",
        parent_id: "5",
        name: "Web-Based Image",
        image: "pics/imageURL.jpg"
    },
    {
        _id: "18",
        parent_id: "5",
        name: "Uploaded Image",
        image: "pics/imageUpload.jpg"
    },
    {
        _id: "19",
        parent_id: "5",
        name: "Teleprompter Text",
        image: "pics/type.jpg"
    },
    {
        _id: "20",
        parent_id: "5",
        name: "Graphics",
        image: "pics/graphics.png"
    },
     {
        _id: "21",
        parent_id: "6",
        name: "Web-Based Audio",
        image: "pics/audioURL.jpg"
    },
    {
        _id: "22",
        parent_id: "6",
        name: "Uploaded Audio",
        image: "pics/audioUpload.jpg"
    },
    {
        _id: "23",
        parent_id: "6",
        name: "Text-To-Speech Text",
        image: "pics/speaking.jpg"
    },
    {
        _id: "24",
        parent_id: "6",
        name: "Synthesized Audio",
        image: "pics/synth.jpg"
    },
    {
        _id: "25",
        parent_id: "7",
        name: "Vibrate",
        image: "pics/vibrate.jpg"
    },
    {
        _id: "57",
        parent_id: "8",
        name: "Timed Images",
        image: "pics/phrases.jpg"
    },
    {
        _id: "58",
        parent_id: "8",
        name: "Audio Sentence",
        image: "pics/phrases.jpg"
    },
    {
        _id: "28",
        parent_id: "8",
        name: "Ordered Collection",
        image: "pics/phrases.jpg"
    },
    {
        _id: "29",
        parent_id: "8",
        name: "Unordered Collection",
        image: "pics/phrases.jpg"
    },
    {
        _id: "30",
        parent_id: "9",
        name: "Conditional Branch",
        image: "pics/ifelse.png"
    },
    {
        _id: "31",
        parent_id: "9",
        name: "iteration",
        image: "pics/forwhile.jpg"
    },
    {
        _id: "34",
        parent_id: "10",
        name: "Now (trigger)",
        description: "trigger immediately",
        image: "pics/now.jpg"
    },
    {
        _id: "35",
        parent_id: "10",
        name: "Timer",
        description: "Set an amount of time to elapse.",
        image: "pics/timer.png"
    },
    {
        _id: "36",
        parent_id: "10",
        name: "Metronome",
        description: "trigger at regular intervals",
        image: "pics/metronome.jpg"
    },
    {
        _id: "37",
        parent_id: "11",
        name: "Role-Based",
        image: "pics/perform-roles.jpg"
    },
    {
        _id: "38",
        parent_id: "11",
        name: "Full: All-To-All",
        image: "pics/perform-full.png"
    },
    {
        _id: "39",
        parent_id: "11",
        name: "Star: One-To-All",
        image: "pics/perform-full.png"
    },
    {
        _id: "40",
        parent_id: "11",
        name: "Star: All-To-One",
        image: "pics/perform-star.png"
    },
    {
        _id: "41",
        parent_id: "11",
        name: "Teams",
        image: "pics/perform-ring.png"
    },
    {
        _id: "42",
        parent_id: "12",
        name: "Master",
        image: "pics/master.png",
        description: "full control: the only performer allowed to transmit."
    },
    {   
        _id: "43",
        parent_id: "12",
        name: "Slave",
        image: "pics/slave.png",
        description: "no control: can only receive."
    },
    {
        _id: "44",
        parent_id: "12",
        name: "Lead",
        image: "pics/lead.gif",
        description: "Plays a leading role."
    },
    {
        _id: "45",
        parent_id: "12",
        name: "Chorus",
        image: "pics/chorus.jpg",
        description: "Plays a collective supporting role."
    },
      {
        _id: "46",
        parent_id: "12",
        name: "Team",
        image: "pics/team.png",
        description: "Group of Performers in Unison"
    },
    {
        _id: "48",
        parent_id: "13",
        name: "Button",
        image: "pics/interfaces.png"
    },
    {
        _id: "49",
        parent_id: "13",             
        name: "Text Input",
        image: "pics/interfaces.png"
    },
    {
        _id: "54",
        parent_id: "16",
        name: "Troupes",
        image: "pics/team.png"
    },
    {
        _id: "55",
        parent_id: "16",
        name: "Creators",
        image: "http://preview.turbosquid.com/Preview/2011/09/08__18_24_59/Female_Mannequin_V4_06.jpg6821b3ae-bbc4-4397-906f-ce0f19df6c0cLarge.jpg"
    },
    {
        _id: "56",
        parent_id: "16",
        name: "Instigators",
        image: "pics/team.png"
    },
    {
        permissions: "1",
        parent_id: "17",
        name: "New Web-Based Image",
        image: "pics/new.png"
    },
    {
        parent_id: "17",
        name: "animated score",
        image: "http://blogfiles.wfmu.org/KF/2007/01/note/musical%20notation.gif"
    },
    {
        parent_id: "17",
        name: "cardew treatise",
        image: "http://blogfiles.wfmu.org/KF/2007/01/note/cardew_-_treatiseP183.jpg"
    },
    {
        parent_id: "17",
        name: "dance animation",
        image: "http://www.jazzcotech.com/images/brian_dance_ani.gif"
    },
    {
        parent_id: "17",
        name: "countdown",
        image: "http://www.johnston.k12.ia.us/schools/elemlmc/images/count2.gif"
    },
    {
        permissions: "1",
        parent_id: "18",
        name: "Upload New Image",
        image: "pics/new.png"
    },
    {
        parent_id: "18",
        name: "arrows",
        image: "pics/arrows.jpg"
    },
    {
        parent_id: "18",
        name: "metronome",
        image: "pics/metronome_ani.gif"
    },
    {
        parent_id: "18",
        name: "traditional notation",
        image: "pics/music-example.jpg"
    },
    {
        parent_id: "18",
        name: "Chemical",
        image: "pics/notation-chemical.png"
    },
    {
        parent_id: "18",
        name: "Record",
        image: "pics/record.png"
    },
    {
        parent_id: "18",
        name: "Repeat",
        image: "pics/repeat.jpg"
    },
    {
        parent_id: "18",
        name: "Tango",
        image: "pics/tango.jpg"
    },
    {
        parent_id: "18",
        name: "conductor",
        image: "pics/conductor.gif"
    },
    {
        parent_id: "18",
        name: "Chaos",
        image: "pics/chaos.jpg"
    },
    {
        parent_id: "18",
        name: "A Major",
        image: "pics/AMajor.png"
    },
    {
        permissions: "1",
        parent_id: "21",
        name: "New Web-Based Audio",
        image: "pics/new.png"
    },
    {
        parent_id: "21",
        name: "Old Car Honk",
        image: "pics/audioURL.jpg",
        audio: "http://www.pacdv.com/sounds/transportation_sounds/antique-car-honk-1.mp3"
    },
    {
        parent_id: "21",
        name: "Dog Growl",
        image: "pics/audioURL.jpg",
        audio: "http://www.sounddogs.com/sound-effects/2223/mp3/441201_SOUNDDOGS__do.mp3"
    },
    {
        parent_id: "21",
        name: "Uh oh Trombone",
        image: "pics/audioURL.jpg",
        audio: "http://www.sounddogs.com/sound-effects/3177/mp3/258845_SOUNDDOGS__co.mp3"
    },
    {
        parent_id: "21",
        name: "Man Falling",
        image: "pics/audioURL.jpg",
        audio: "http://www.sounddogs.com/sound-effects/2904/mp3/615900_SOUNDDOGS__ma.mp3"
    },
    {
        permissions: "1",
        parent_id: "22",
        name: "Upload New Audio",
        image: "pics/new.png"
    },
    {
        parent_id: "22",
        name: "mtbrain",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/MTBrain.mp3"
    },
    {
        parent_id: "22",
        name: "laugh",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/Laugh.mp3"
    },
    {
        parent_id: "22",
        name: "slide",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/Slide.mp3"
    },
    {
        parent_id: "22",
        name: "spring",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/Spring.mp3"
    },
    {
        parent_id: "22",
        name: "mtbrain",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/MTBrain.mp3"
    },
    {
        parent_id: "22",
        name: "Beep",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/Beep.mp3"
    },
    {
        parent_id: "22",
        name: "Double Beep",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/DoubleBeep.mp3"
    },
    {
        parent_id: "22",
        name: "Ictus",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/Ictus.mp3"
    },
    {
        parent_id: "22",
        name: "Zuction",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/zuction.mp3"
    },
    {
        parent_id: "22",
        name: "slidey up",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/slideyup.mp3"
    },
    {
        parent_id: "22",
        name: "slidey down",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/slideyupbackwards.mp3"
    },
    {
        parent_id: "22",
        name: "noise hit",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/noisehit.mp3"
    },
    {
        parent_id: "22",
        name: "chunkly",
        image: "pics/audioUpload.jpg",
        audio: "snd/uploads/chunkly.mp3"
    },
    {
        permissions: "1",
        parent_id: "19",
        name: "New Teleprompter",
        image: "pics/new.png"
    },
    {
        parent_id: "19",
        name: "Shakespeare Quote",
        text: "Two households, both alike in dignity,In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean. From forth the fatal loins of these two foes - A pair of star-cross'd lovers take their life;",
        font: "Geneva",
        color: "#FF0000",
        image: "pics/type.jpg",
        bgcolor: "#000",
        size: "32px"
    },
    {
        parent_id: "19",
        name: "Gertrude Stein",
        text: "There is singularly nothing that makes a difference a difference in beginning and in the middle and in ending except that each generation has something different at which they are all looking. By this I mean so simply that anybody knows it that composition is the difference which makes each and all of them then different from other generations and this is what makes everything different otherwise they are all alike and everybody knows it because everybody says it.",
        font: "Geneva",
        color: "#FFFF00",
        image: "pics/type.jpg",
        bgcolor: "#FFF",
        size: "32px"
    },
    {
        parent_id: "19",
        name: "Bateson Quote",
        text: "The computer never truly encounters logical paradox, but only the simulation of paradox in trains of cause and effect. The computer therefore does not fade away. It merely oscillates.",
        font: "Geneva",
        color: "#00FF00",
        image: "pics/type.jpg",
        bgcolor: "#FF0000",
        size: "32px"
    },
    {
        permissions: "1",
        parent_id: "23",
        name: "New Text-To-Speech",
        image: "pics/new.png"
    },
    {
        parent_id: "23",
        name: "Bateson Quote",
        text: "The computer never truly encounters logical paradox, but only the simulation of paradox in trains of cause and effect. The computer therefore does not fade away. It merely oscillates.",
        image: "pics/speaking.jpg"
    },
    {
        parent_id: "23",
        name: "Stage Directions",
        text: "All Onstage",
        image: "pics/speaking.jpg"
    },
    {
        parent_id: "23",
        name: "Choreography",
        text: "Swing your partner to the left",
        image: "pics/speaking.jpg"
    },
    {
        parent_id: "23",
        name: "Instructions",
        text: "Repeat everything I say.",
        image: "pics/speaking.jpg"
    },
    {
        permissions: "1",
        parent_id: "28",
        name: "New Ordered Phrase",
        image: "pics/new.png"
    },
    {
        parent_id: "28",
        name: "Sequence 1",
        phrase: [1, 2, 3, 4],
        image: "pics/phrases.jpg"
    },
    {
        parent_id: "57",
        name: "New Timed Images",
        phrase: [1, 2, 3, 4],
        image: "pics/new.png",
        permissions: "1"
    },
    {
        parent_id: "58",
        name: "New Audio Sentence",
        phrase: [1, 2, 3, 4],
        image: "pics/new.png",
        permissions: "1"
    },
     {
        parent_id: "57",
        name: "Sequence 1",
        phrase: [1, 2, 3, 4],
        image: "pics/phrases.jpg"
    },
    {
        parent_id: "58",
        name: "Sequence 2",
        phrase: [4, 3, 2, 1],
        image: "pics/phrases.jpg"
    },
    {
        parent_id: "58",
        name: "Sequence 3",
        phrase: [6, 5, 8, 1],
        image: "pics/phrases.jpg"
    },
    {
        permissions: "1",
        parent_id: "29",
        name: "New Unordered Phrase",
        image: "pics/new.png"
    },
    {
        parent_id: "29",
        name: "Sequence 1",
        phrase: [1, 2, 3, 4],
        image: "pics/phrases.jpg"
    },
    {
        parent_id: "29",
        name: "Sequence 2",
        phrase: [4, 3, 2, 1],
        image: "pics/phrases.jpg"
    },
    {
        parent_id: "29",
        name: "Sequence 3",
        phrase: [6, 5, 8, 1],
        image: "pics/phrases.jpg"
    },
    {
        permissions: "1",
        parent_id: "14",
        name: "New Performance Fragment",
        image: "pics/new.png"
    },
    {
        parent_id: "14",
        name: "Sequence of Phrases",
        image: "pics/units.jpg"
    },
    {
        parent_id: "14",
        name: "Phrase Delay",
        image: "pics/units.jpg"
    },
    {
        permissions: "1",
        parent_id: "15",
        name: "New Performance Program",
        image: "pics/new.png"
    },
    {
        parent_id: "15",
        name: "Example Performance Program #1",
        image: "pics/program.jpg"
    },
    {
        parent_id: "15",
        name: "Example Performance Program #2",
        image: "pics/program.jpg"
    }, 
    {
        permissions: "1",
        parent_id: "54",
        name: "New Troupe",
        image: "pics/new.png"
    },
    {
        parent_id: "54",
        name: "telebrain",
        image: "pics/mtbrain.png"
    },
    {
        parent_id: "54",
        name: "The Tigers",
        image: "http://la3eme72011.edublogs.org/files/2012/01/lovely-tiger-cubs-19d5399.jpg"
    },
    {
        parent_id: "54",
        name: "Goofballs",
        image: "http://www.americansale.com/images/products/medium/025829.jpg"
    },
    {
        parent_id: "54",
        name: "Psychic Blanket",
        image: "http://dhairyaenterprises.com/wp-content/gallery/three/org_fleece-baby-blankets.jpg"
    },
    {
        permissions: "1",
        parent_id: "36",
        name: "New Metronome Scheduler",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "35",
        name: "New Timer Scheduler",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "34",
        name: "New Now (Trigger) Scheduler",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "31",
        name: "New Iterative Control",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "30",
        name: "New Conditional Control",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "41",
        name: "New Team-Based Network",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "40",
        name: "New All-To-One Network",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "39",
        name: "New One-To-All Network",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "38",
        name: "New All-To-All Network",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "37",
        name: "New Role-Based Network",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "42",
        name: "New Master",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "43",
        name: "New Slave",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "44",
        name: "New Lead",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "45",
        name: "New Chorus",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "46",
        name: "New Team",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "49",
        name: "New Text Input",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "48",
        name: "New Button",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "56",
        name: "New Instigator",
        image: "pics/new.png"
    },
    {
        permissions: "1",
        parent_id: "55",
        name: "New Creator",
        image: "pics/new.png"
    }];

    db.collection('content', function(err, collection) {
        collection.insert(content, {safe:true}, function(err, result) {});
    });
};