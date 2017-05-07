const app = require('express');
var Datastore = require('nedb')
  , db = new Datastore({ filename: './db/db', autoload: 'true' });

module.exports = function(app) {
    app.get('/api/question', (request, response) => {
        db.findOne({}, function(error, doc) {
            response.json(
                doc.topics
                    .find(topic => topic._id === request.query.topic)
                    .content
                    .sort(compare)[0])
        });
    });

    app.post('/api/question/response', (request, response) => {
        let type = request.body.response.type;
        let currentTopic = request.query.topic;

        let promise = new Promise((resolve, reject) => {
            if (type === "good") {
                goodResponse(currentTopic);
                resolve();
            } else if (type === "pass") {
                passResponse(currentTopic);
                resolve();
            } else if (type === "bad") {
                badResponse(currentTopic);
                resolve();
            } else {
                reject();
                throw new Error("bad study response: " + type);
            }
        });
        promise.then(result => {
            response.sendStatus(200);
        }, error => {
            response.sendStatus(404);
        })
    });
}

function compare(a, b) {
    if (a.rank < b.rank) {
        return -1;
    } else if (a.rank > b.rank) {
        return 1;
    } else {
        return 0;
    }
}

function goodResponse(topicID) {
    getHighestRank(topicID, rank => {
        updateRank(topicID, rank + 1);
    });
}

function badResponse(topicID) {
    getHighestRank(topicID, maxRank => {
        getLowestRank(topicID, minRank => {
            updateRank(topicID, (maxRank - minRank) / 4);
        });
    });
}

function passResponse(topicID) {
    getHighestRank(topicID, maxRank => {
        getLowestRank(topicID, minRank => {
            updateRank(topicID, (maxRank - minRank) / 2);
        });
    });
}

function updateRank(topicID, newRank) {
    db.findOne({}, function(error, doc) {
        let docID = doc._id;
        doc.topics
            .find(topic => topic._id === topicID)
            .content
            .sort(compare)[0]
            .rank = newRank;

        db.update({_id: docID}, doc);
    });
}

function getHighestRank(topicID, callback) {
    db.findOne({}, function(error, doc) {
       callback(
           doc.topics
            .find(topic => topic._id === topicID)
            .content
            .sort(compare)
            .slice(-1)[0]
            .rank);
    });
}

function getLowestRank(topicID, callback) {
    db.findOne({}, function(error, doc) {
       callback(
           doc.topics
            .find(topic => topic._id === topicID)
            .content
            .sort(compare)[0]
            .rank);
    });
}
