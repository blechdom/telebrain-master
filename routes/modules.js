var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('mtbraindb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'mtbraindb' database");
        db.collection('modules', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'mtbrain' example modules do not exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving module: ' + id);
    db.collection('modules', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('modules', function(err, collection) {
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
}

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
}

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
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var modules = [
    {
        name: "Module Example #1",
        creator: "MTBrain",
        type: "1",
        control: "1",
        description: "Example module for triggering an image",
        picture: "notation_example.png",
        text: "image",
        audio: ""
    },
    {
        name: "Module Example #2",
        creator: "MTBrain",
        type: "2",
        control: "3",
        description: "Example module for triggering audio",
        picture: "audio.jpg",
        text: "audio",
        audio: "MTBrain.wav"
    },
    {
        name: "Module Example #3",
        creator: "MTBrain",
        type: "3",
        control: "5",
        description: "Example for triggering written text",
        picture: "type.jpg",
        text: "This is an example of written text",
        audio: ""
    },
    {
        name: "Module Example #4",
        creator: "MTBrain",
        type: "4",
        control: "7",
        description: "Example for triggering spoken text",
        picture: "speaking.jpg",
        text: "This is an example of spoken text",
        audio: ""
    }];

    db.collection('modules', function(err, collection) {
        collection.insert(modules, {safe:true}, function(err, result) {});
    });

};