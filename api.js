const app = require('express');
var Datastore = require('nedb')
  , db = new Datastore({ filename: './db/db', autoload: 'true' });
const uniqid = require('uniqid');

module.exports = function(app) {
    app.get('/api/question', (request, response) => {
        db.findOne({}, function(error, doc) {
            try {
                const attempt = 
                    doc.topics
                        .find(topic => topic._id === request.query.topic)
                        .content
                        .sort(compare)[0];
                if (attempt) {
                    response.json(attempt);
                } else {
                    response.json({question: "", answer: ""});
                }
            } catch(err) {
                response.json({question: "", answer: ""});
            }

        });
    });

    app.post('/api/question/response', (request, response) => {
        let type = request.body.userResponse;
        let currentTopic = request.query.topic;

        if (currentTopic.length > 0) {
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

        } else {
            response.sendStatus(200);
        }
    });

    app.get('/api/topics', (request, response) => {
        db.findOne({}, function(error, doc) {
            response.json(
                doc.topics
                    .map(topic => ({
                        _id: topic._id,
                        topicName: topic.topicName
                    })));
        });
    });

    app.post('/api/submitnewproblem', (request, response) => {
        const newQuestion = request.body.question;
        const newAnswer = request.body.answer;
        const topicID = request.body.topicID;

        const promise = new Promise((resolve, reject) => {  
            submitNewProblem(topicID, newQuestion, newAnswer);
            resolve();
        });

        promise.then(result => {
            response.sendStatus(200);
        }, error => {
            response.sendStatus(400);
        });
    });
}

function submitNewProblem(topicID, question, answer) {
    db.findOne({}, function(err, doc) {
        getHighestRank(topicID, rank => {
            doc.topics
                .find(topic => topic._id === topicID)
                .content
                .push({
                    _id: uniqid(),
                    question: question,
                    answer: answer,
                    rank: rank + 1
                });
                
            db.update({_id: doc._id}, doc, function(err, response) {
                console.log("err", err);
            });
        });
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
