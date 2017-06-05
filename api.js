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
            submitNewProblem(topicID, newQuestion, newAnswer, function(err) {
                if (!err) {
                    resolve();
                } else {
                    reject();
                }
            });
        });

        promise.then(result => {
            response.sendStatus(200);
        }, error => {
            response.sendStatus(400);
        });
    });

    app.post('/api/submit-new-topic', (request, response) => {
        const newTopic = request.body.newTopic;

        const promise = new Promise((resolve, reject) => {

            submitNewTopic(newTopic, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

        });
        promise.then(result => {
            response.sendStatus(200);
        }, error => {
            response.sendStatus(400);
        });
    });

    app.post('/api/edit-topic-name', (request, response) => {
        const newTopicName = request.body.newTopicName;
        const topicID = request.body.topicID;

        new Promise((resolve, reject) => {

            submitEditTopic(topicID, newTopicName, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

        })
        .then(result => {
            response.sendStatus(200);
        }, error => {
            response.sendStatus(400);
        });
    });

    app.delete('/api/topics/delete', (request, response) => {
        const topicID = request.body.topicID;

        const promise = new Promise((resolve, reject) => {

            deleteTopic(topicID, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

        });

        promise.then(result => {
            response.sendStatus(200);
        }, error => {
            response.sendStatus(400);
        });


    });

    app.get('/api/all-questions', (request, response) => {
        const topicID = request.query.topic;

        new Promise((resolve, reject) => {
            
        })
        .then(result => {

        }, error => {
            response.sendStatus(400);
        });
    });
}

function getAllQuestions(topicID) {

    db.findOne({}, (err, doc) => {
        try {

        } catch (err) {
            return false;
        }
    });
}

function deleteTopic(topicID, callback) {
    db.findOne({}, (err, doc) => {
        try {
            doc.topics = doc.topics
                .filter(topic => topic._id !== topicID)
            

            db.update({_id: doc._id}, doc, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
            });                            
        } catch(err) {
            callback(err);
        }
    });
}

function submitEditTopic(topicID, newTopicName, callback) {
    console.log(newTopicName);

    db.findOne({}, function(err, doc) {
        
        doc.topics
            .find(topic => topic._id === topicID)
            .topicName = newTopicName;

        db.update({_id: doc._id}, doc, function(err) {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        });

    });

}

function submitNewTopic(newTopic, callback) {
    db.findOne({}, function(err, doc) {
        doc.topics
            .push({
                _id: uniqid(),
                topicName: newTopic,
                content: []
            });
        db.update({_id: doc._id}, doc, function(err) {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        });
    });
}

function submitNewProblem(topicID, question, answer, callback) {
    db.findOne({}, function(err, doc) {
        getHighestRank(topicID, rank => {
            try {
                doc.topics
                    .find(topic => topic._id === topicID)
                    .content
                    .push({
                        _id: uniqid(),
                        question: question,
                        answer: answer,
                        rank: rank + 1
                    });
            } catch(err) {
                callback("couldn't find topic");
            }

            db.update({_id: doc._id}, doc, function(err, response) {
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
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
        try {
            callback(
                doc.topics
                    .find(topic => topic._id === topicID)
                    .content
                    .sort(compare)
                    .slice(-1)[0]
                    .rank);
        } catch(err) {
            // no content?
            callback(1);
        }
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
