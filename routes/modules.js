var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('telebraindb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'telebraindb' database");
        db.collection('performanceUnits', {safe:true}, function(err, collection) {
            if (err) {
                console.log("PERFORMANCE UNITS do not exist. Creating...");
                populateDBPerformanceUnits();
                console.log("PERFORMANCE UNITS created.");
            }
        });
        db.collection('performancePrograms', {safe:true}, function(err, collection) {
            if (err) {
                console.log("PERFORMANCE PROGRAMS do not exist. Creating...");
                populateDBPerformancePrograms();
                console.log("PERFORMANCE PROGRAMS created.");
            }
        });
        db.collection('networks', {safe:true}, function(err, collection) {
            if (err) {
                console.log("NETWORKS do not exist. Creating...");
                populateDBNetworks();
                console.log("NETWORKS created.");
            }
        });
        db.collection('roles', {safe:true}, function(err, collection) {
            if (err) {
                console.log("ROLES do not exist. Creating...");
                populateDBRoles();
                console.log("ROLES created.");
            }
        });
        db.collection('schedules', {safe:true}, function(err, collection) {
            if (err) {
                console.log("SCHEDULES do not exist. Creating...");
                populateDBSchedules();
                console.log("SCHEDULES created.");
            }
        });
        db.collection('controls', {safe:true}, function(err, collection) {
            if (err) {
                console.log("CONTROLS do not exist. Creating...");
                populateDBControls();
                console.log("CONTROLS created.");
            }
        });
        db.collection('modules', {safe:true}, function(err, collection) {
            if (err) {
                console.log("MODULES do not exist. Creating...");
                populateDBModules();
                console.log("MODULES created.");
            }
        });
        db.collection('troupes', {safe:true}, function(err, collection) {
            if (err) {
                console.log("TROUPES do not exist. Creating...");
                populateDBTroupes();
                console.log("TROUPES created.");
            }
        });
        db.collection('permissions', {safe:true}, function(err, collection) {
            if (err) {
                console.log("PERMISSIONS do not exist. Creating...");
                populateDBPermissions();
                console.log("PERMISSIONS created.");
            }
        });
        db.collection('imageURLs', {safe:true}, function(err, collection) {
            if (err) {
                console.log("IMAGEURLS do not exist. Creating...");
                populateDBImageURLs();
                console.log("IMAGEURLS created.");
            }
        });
        db.collection('imageUploads', {safe:true}, function(err, collection) {
            if (err) {
                console.log("IMAGEUPLOADS do not exist. Creating...");
                populateDBImageUploads();
                console.log("IMAGEUPLOADS created.");
            }
        });
        db.collection('audioURLs', {safe:true}, function(err, collection) {
            if (err) {
                console.log("AUDIOURLS do not exist. Creating...");
                populateDBAudioURLs();
                console.log("AUDIOURLS created.");
            }
        });
        db.collection('audioUploads', {safe:true}, function(err, collection) {
            if (err) {
                console.log("AUDIOUPLOADS do not exist. Creating...");
                populateDBAudioUploads();
                console.log("AUDIOUPLOADS created.");
            }
        });
        db.collection('teleprompts', {safe:true}, function(err, collection) {
            if (err) {
                console.log("TELEPROMPTS do not exist. Creating...");
                populateDBTeleprompts();
                console.log("TELEPROMPTS created.");
            }
        });
        db.collection('tts', {safe:true}, function(err, collection) {
            if (err) {
                console.log("TTS do not exist. Creating...");
                populateDBTTS();
                console.log("TTS created.");
            }
        });
        db.collection('phrases', {safe:true}, function(err, collection) {
            if (err) {
                console.log("PHRASES do not exist. Creating...");
                populateDBPhrases();
                console.log("PHRASES created.");
            }
        });
    }
});

exports.findModuleById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving module: ' + id);
    db.collection('modules', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAllModules = function(req, res) {
    db.collection('modules', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllImageURLs = function(req, res) {
    db.collection('imageURLs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllImageUploads = function(req, res) {
    db.collection('imageUploads', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllAudioURLs = function(req, res) {
    db.collection('audioURLs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllAudioUploads = function(req, res) {
    db.collection('audioUploads', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllTroupes = function(req, res) {
    db.collection('troupes', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllPermissions = function(req, res) {
    db.collection('permissions', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllPhrases = function(req, res) {
    db.collection('phrases', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllTeleprompts = function(req, res) {
    db.collection('teleprompts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
exports.findAllTTS = function(req, res) {
    db.collection('tts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllControls = function(req, res) {
    db.collection('controls', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllSchedules = function(req, res) {
    db.collection('schedules', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllNetworks = function(req, res) {
    db.collection('networks', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllRoles = function(req, res) {
    db.collection('roles', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.findAllPerformanceUnits = function(req, res) {
    db.collection('performanceUnits', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllPerformancePrograms = function(req, res) {
    db.collection('performancePrograms', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addModule = function(req, res) {
    var module = req.body;
    console.log('Adding module: ' + JSON.stringify(module));
    db.collection('modules', function(err, collection) {
        collection.insert(module, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateModule = function(req, res) {
    var id = req.params.id;
    var module = req.body;
    delete module._id;
    console.log('Updating module: ' + id);
    console.log(JSON.stringify(module));
    db.collection('modules', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, module, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating module: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(module);
            }
        });
    });
};

exports.deleteModule = function(req, res) {
    var id = req.params.id;
    console.log('Deleting module: ' + id);
    db.collection('modules', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
exports.addImageURL = function(req, res) {
    var imageURL = req.body;
    console.log('Adding imageURL: ' + JSON.stringify(imageURL));
    db.collection('imageURLs', function(err, collection) {
        collection.insert(imageURL, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};
exports.findImageURLById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving imageURL: ' + id);
    db.collection('imageURLs', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
exports.updateImageURL = function(req, res) {
    var id = req.params.id;
    var imageURL = req.body;
    delete imageURL._id;
    console.log('Updating imageURL: ' + id);
    console.log(JSON.stringify(imageURL));
    db.collection('imageURLs', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, imageURL, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating imageURL: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(imageURL);
            }
        });
    });
};

exports.deleteImageURL = function(req, res) {
    var id = req.params.id;
    console.log('Deleting imageURL: ' + id);
    db.collection('imageURLs', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

exports.addTeleprompt = function(req, res) {
    var teleprompt = req.body;
    console.log('Adding teleprompt: ' + JSON.stringify(teleprompt));
    db.collection('teleprompts', function(err, collection) {
        collection.insert(teleprompt, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};
exports.findTelepromptById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving teleprompt: ' + id);
    db.collection('teleprompts', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
exports.updateTeleprompt = function(req, res) {
    var id = req.params.id;
    var teleprompt = req.body;
    delete teleprompt._id;
    console.log('Updating teleprompt: ' + id);
    console.log(JSON.stringify(teleprompt));
    db.collection('teleprompts', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, teleprompt, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating teleprompt: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(teleprompt);
            }
        });
    });
};

exports.deleteTeleprompt = function(req, res) {
    var id = req.params.id;
    console.log('Deleting teleprompt: ' + id);
    db.collection('teleprompts', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

exports.addAudioURL = function(req, res) {
    var audioURL = req.body;
    console.log('Adding audioURL: ' + JSON.stringify(audioURL));
    db.collection('audioURLs', function(err, collection) {
        collection.insert(audioURL, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};
exports.findAudioURLById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving audioURL: ' + id);
    db.collection('audioURLs', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
exports.updateAudioURL = function(req, res) {
    var id = req.params.id;
    var audioURL = req.body;
    delete audioURL._id;
    console.log('Updating audioURL: ' + id);
    console.log(JSON.stringify(audioURL));
    db.collection('audioURLs', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, audioURL, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating audioURL: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(audioURL);
            }
        });
    });
};

exports.deleteAudioURL = function(req, res) {
    var id = req.params.id;
    console.log('Deleting audioURL: ' + id);
    db.collection('audioURLs', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
exports.addTTS = function(req, res) {
    var ttss = req.body;
    console.log('Adding tts: ' + JSON.stringify(audioURL));
    db.collection('tts', function(err, collection) {
        collection.insert(ttss, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};
exports.findTTSById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving tts: ' + id);
    db.collection('tts', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
exports.updateTTS = function(req, res) {
    var id = req.params.id;
    var ttss = req.body;
    delete ttss._id;
    console.log('Updating tts: ' + id);
    console.log(JSON.stringify(ttss));
    db.collection('tts', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, ttss, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating tts: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(ttss);
            }
        });
    });
};

exports.deleteTTS = function(req, res) {
    var id = req.params.id;
    console.log('Deleting tts: ' + id);
    db.collection('tts', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.

var populateDBPerformancePrograms = function() {

    var performancePrograms = [
    {
        id: "1",
        name: "Example Performance Program #1",
        icon: "program.jpg",
        units: "1",
        control: "",
        schedule: "",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "2",
        name: "Example Performance Program #2",
        units: "2",
        icon: "program.jpg",
        control: "",
        schedule: "",
        troupename: "telebrain",
        permissions: "3"
    }];

    db.collection('performancePrograms', function(err, collection) {
        collection.insert(performancePrograms, {safe:true}, function(err, result) {});
    });
};
var populateDBPerformanceUnits = function() {

    var performanceUnits = [
    {
        id: "1",
        name: "Sequence of Phrases",
        control: "",
        icon: "units.jpg",
        schedule: "",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "2",
        name: "Phrase Delay",
        control: "",
        icon: "units.jpg",
        schedule: "",
        troupename: "telebrain",
        permissions: "3"
    }];

    db.collection('performanceUnits', function(err, collection) {
        collection.insert(performanceUnits, {safe:true}, function(err, result) {});
    });
};
var populateDBNetworks = function() {

    var networks = [
    {
        id: "1",
        name: "Role-Based",
        icon: "perform-roles.jpg",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "2",
        name: "Full: All-To-All",
        icon: "perform-full.png",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "3",
        name: "Star: One-To-All",
        icon: "perform-full.png",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "4",
        name: "Star: All-To-One",
        icon: "perform-star.png",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "5",
        name: "Ring",
        icon: "perform-ring.png",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "6",
        name: "Tree",
        icon: "perform-tree.png",
        troupename: "telebrain",
        permissions: "3"
    }];

    db.collection('networks', function(err, collection) {
        collection.insert(networks, {safe:true}, function(err, result) {});
    });
};
var populateDBSchedules = function() {

    var schedules = [
    {
        id: "1",
        name: "Now",
        description: "trigger immediately",
        icon: "now.jpg",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        troupename: "telebrain",
        permissions: "3"
    },
   {
        id: "2",
        name: "Wait Until",
        description: "trigger later",
        icon: "pause.png",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        troupename: "telebrain",
        permissions: "3" 
    },
   {
        id: "3",
        name: "Metronome",
        description: "trigger at regular intervals",
        icon: "metronome.jpg",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "4",
        name: "Timer",
        description: "Set an amount of time to elapse.",
        icon: "timer.png",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "5",
        name: "Random Time",
        description: "Random triggers within an interval of time.",
        icon: "random.jpg",
        parameter1: "",
        parameter2: "",
        parameter3: "",
        troupename: "telebrain",
        permissions: "3"
    }];

    db.collection('schedules', function(err, collection) {
        collection.insert(schedules, {safe:true}, function(err, result) {});
    });
};
var populateDBRoles = function() {

    var roles = [
    {
        id: "1",
        module: "Master",
        icon: "master.png",
        description: "full control: the only performer allowed to transmit.",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "2",
        module: "Slave",
        icon: "slave.png",
        description: "no control: can only receive.",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "3",
        module: "Lead",
        icon: "lead.gif",
        description: "Plays a leading role.",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "4",
        module: "Chorus",
        icon: "chorus.jpg",
        description: "Plays a supporting role.",
        troupename: "telebrain",
        permissions: "3"
    }];

    db.collection('roles', function(err, collection) {
        collection.insert(roles, {safe:true}, function(err, result) {});
    });
};
var populateDBControls = function() {

    var controls = [
    {
        id: "1",
        module: "conditional branch",
        inputs: "[< 5]",
        icon: "ifelse.png",
        outputs: "imageURLs",
        troupename: "telebrain",
        permissions: "3"
    },
    {
        id: "2",
        module: "interation",
        inputs: "[3, 5, 1]",
        icon: "forwhile.jpg",
        outputs: "Phrases",
        troupename: "telebrain",
        permissions: "3"
    }];

    db.collection('controls', function(err, collection) {
        collection.insert(controls, {safe:true}, function(err, result) {});
    });
};
var populateDBModules = function() {

    var modules = [
    {
        id: "1",
        name: "Web-Based Image",
        icon: "imageURL.jpg"
    },
    {
        id: "2",
        name: "Uploaded Image",
        icon: "imageUpload.jpg"
    },
    {
        id: "3",
        name: "Graphics",
        icon: "graphics.png"
    },
    {
        id: "4",
        name: "Teleprompter Text",
        icon: "type.jpg"
    },
    {
        id: "5",
        name: "Text-To-Speech Text",
        icon: "speaking.jpg"
    },
    {
        id: "6",
        name: "Web-Based Audio",
        icon: "audioURL.jpg"
    },
    {
        id: "7",
        name: "Uploaded Audio",
        icon: "audioUpload.jpg"
    },
    {
        id: "8",
        name: "Synthesized Audio",
        icon: "synth.jpg"
    },
    {
        id: "9",
        name: "Vibrate",
        icon: "vibrate.jpg"
    }];

    db.collection('modules', function(err, collection) {
        collection.insert(modules, {safe:true}, function(err, result) {});
    });
};
var populateDBImageURLs = function() {

    var imageURLs = [
    {
        name: "animated score",
        URL: "http://blogfiles.wfmu.org/KF/2007/01/note/musical%20notation.gif",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "cardew treatise",
        URL: "http://blogfiles.wfmu.org/KF/2007/01/note/cardew_-_treatiseP183.jpg",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "dance animation",
        URL: "http://www.jazzcotech.com/images/brian_dance_ani.gif",
        troupename: "the tigers",
        permissions: "1"
    },
    {
        name: "countdown",
        URL: "http://www.johnston.k12.ia.us/schools/elemlmc/images/count2.gif",
        troupename: "goofballs",
        permissions: "2"
    }];

    db.collection('imageURLs', function(err, collection) {
        collection.insert(imageURLs, {safe:true}, function(err, result) {});
    });
};
var populateDBImageUploads = function() {

    var imageUploads = [
    {
        name: "arrows",
        filename: "arrows.jpg",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "metronome",
        filename: "metronome_ani.gif",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "traditional notation",
        filename: "music-example.jpg",
        troupename: "the tigers",
        permissions: "2"
    },
    {
        name: "Chemical",
        filename: "notation-chemical.png",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Record",
        filename: "record.png",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Repeat",
        filename: "repeat.jpg",
        troupename: "the tigers",
        permissions: "2"
    },
    {
        name: "Tango",
        filename: "tango.jpg",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "conductor",
        filename: "conductor.gif",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Chaos",
        filename: "chaos.jpg",
        troupename: "the tigers",
        permissions: "2"
    },
    {
        name: "A Major",
        filename: "AMajor.png",
        troupename: "goofballs",
        permissions: "1"

    }];

    db.collection('imageUploads', function(err, collection) {
        collection.insert(imageUploads, {safe:true}, function(err, result) {});
    });
};
var populateDBAudioURLs = function() {

    var audioURLs = [
    {
        name: "Old Car Honk",
        URL: "http://www.pacdv.com/sounds/transportation_sounds/antique-car-honk-1.mp3",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Dog Growl",
        URL: "http://www.sounddogs.com/sound-effects/2223/mp3/441201_SOUNDDOGS__do.mp3",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Uh oh Trombone",
        URL: "http://www.sounddogs.com/sound-effects/3177/mp3/258845_SOUNDDOGS__co.mp3",
        troupename: "the tigers",
        permissions: "1"

    },
    {
        name: "Man Falling",
        URL: "http://www.sounddogs.com/sound-effects/2904/mp3/615900_SOUNDDOGS__ma.mp3",
        troupename: "goofballs",
        permissions: "2"
    }];

    db.collection('audioURLs', function(err, collection) {
        collection.insert(audioURLs, {safe:true}, function(err, result) {});
    });
};
var populateDBAudioUploads = function() {

    var audioUploads = [
    {
        name: "mtbrain",
        filename: "MTBrain.mp3",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "laugh",
        filename: "Laugh.mp3",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "slide",
        filename: "Slide.mp3",
        troupename: "telebrain",
        permissions: "1"
    },
    {
        name: "spring",
        filename: "Spring.mp3",
        troupename: "telebrain",
        permissions: "2"
    }];

    db.collection('audioUploads', function(err, collection) {
        collection.insert(audioUploads, {safe:true}, function(err, result) {});
    });
};
var populateDBTeleprompts = function() {

    var teleprompts = [
    {
        name: "Shakespeare Quote",
        text: "Two households, both alike in dignity,In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean. From forth the fatal loins of these two foes - A pair of star-cross'd lovers take their life;",
        font: "Geneva",
        color: "#FF0000",
        bgcolor: "#000",
        size: "32px",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Gertrude Stein",
        text: "There is singularly nothing that makes a difference a difference in beginning and in the middle and in ending except that each generation has something different at which they are all looking. By this I mean so simply that anybody knows it that composition is the difference which makes each and all of them then different from other generations and this is what makes everything different otherwise they are all alike and everybody knows it because everybody says it.",
        font: "Geneva",
        color: "#FFFF00",
        bgcolor: "#FFF",
        size: "32px",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Bateson Quote",
        text: "The computer never truly encounters logical paradox, but only the simulation of paradox in trains of cause and effect. The computer therefore does not fade away. It merely oscillates.",
        font: "Geneva",
        color: "#00FF00",
        bgcolor: "#FF0000",
        size: "32px",
        troupename: "telebrain",
        permissions: "0"
    }];

    db.collection('teleprompts', function(err, collection) {
        collection.insert(teleprompts, {safe:true}, function(err, result) {});
    });
};
var populateDBTTS = function() {

    var tts = [
    {
        name: "Bateson Quote",
        text: "The computer never truly encounters logical paradox, but only the simulation of paradox in trains of cause and effect. The computer therefore does not fade away. It merely oscillates.",
        voice: "Alex",
        preset: "Fast",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Stage Directions",
        text: "All Onstage",
        voice: "Alex",
        preset: "Clear",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Choreography",
        text: "Swing your partner to the left",
        voice: "Alex",
        preset: "Clear",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Instructions",
        text: "Repeat everything I say.",
        voice: "Alex",
        preset: "Clear",
        troupename: "telebrain",
        permissions: "0"
    }];

    db.collection('tts', function(err, collection) {
        collection.insert(tts, {safe:true}, function(err, result) {});
    });
};
var populateDBPhrases = function() {

    var phrases = [
    {
        name: "Sequence 1",
        phrase: "[1, 2, 3, 4]",
        icon: "phrases.jpg",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Sequence 2",
        phrase: "[4, 3, 2, 1]",
        icon: "phrases.jpg",
        troupename: "telebrain",
        permissions: "0"
    },
    {
        name: "Sequence 3",
        phrase: "[6, 5, 8, 1]",
        icon: "phrases.jpg",
        troupename: "telebrain",
        permissions: "0"
    }];

    db.collection('phrases', function(err, collection) {
        collection.insert(phrases, {safe:true}, function(err, result) {});
    });
};
var populateDBTroupes = function() {

    var troupes = [
    {
        id: "1",
        name: "telebrain",
        passcode: "",
        URL: "pics/mtbrain.png",
        securityQuestion: "No Password",
        answer: ""
    },
    {
        id: "1",
        name: "The Tigers",
        passcode: "",
        URL: "http://la3eme72011.edublogs.org/files/2012/01/lovely-tiger-cubs-19d5399.jpg",
        securityQuestion: "No Password",
        answer: ""
    },
    {
        id: "1",
        name: "Goofballs",
        passcode: "",
        URL: "http://www.americansale.com/images/products/medium/025829.jpg",
        securityQuestion: "No Password",
        answer: ""
    },
    {
        id: "1",
        name: "Psychic Blanket",
        passcode: "",
        URL: "http://dhairyaenterprises.com/wp-content/gallery/three/org_fleece-baby-blankets.jpg",
        securityQuestion: "No Password",
        answer: ""
    }];

    db.collection('troupes', function(err, collection) {
        collection.insert(troupes, {safe:true}, function(err, result) {});
    });
};
var populateDBPermissions = function() {

    var permissions = [
    {
        id: "1",
        name: "public / unlocked",
        icon: ""
    },
    {
        id: "2",
        name: "owned / locked",
        icon: ""
        },
    {
        id: "3",
        name: "prototype",
        icon: ""
        },
    {
        id: "4",
        name: "example",
        icon: ""
    }];

    db.collection('permissions', function(err, collection) {
        collection.insert(permissions, {safe:true}, function(err, result) {});
    });
};