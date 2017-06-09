/**
 * Require modules
 */
let mongoose = require('mongoose');
let validator = require('validator');
let User = require('../db/schemas/User');
let TodoList = require('../db/schemas/TodoList');

/**
 * Use global promise instead of mongoose promise
 */
mongoose.Promise = global.Promise;

/**
 * Helper functions
 */
let sendJsonResponse = (res, status, content) => {
    res.status(status).json(content);
};

let sanitizeRequestData = () => {

}

/**
 * API logic for users
 */
module.exports = (function () {
    let getUser = (req, res) => {
        if (req.params && req.params.userId) {
            User
            .findById(req.params.userId)
            .exec()
            .then((user) => {
                if (user) {
                    sendJsonResponse(res, 200, user);
                } else {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    })
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            })
        }
    };

    let createUser = (req, res) => {
        if (req.params && req.body.username && req.body.password) {
            User
            .findOne({ username: req.body.username })
            .exec()
            .then((user) => {
                if (user) {
                    sendJsonResponse(res, 202, {
                        "message": `User '${user.username}' already exists`
                    });
                } else {
                    User
                    .create({ 
                        username: req.body.username, 
                        password: req.body.password
                    })
                    .then((user) => {
                        sendJsonResponse(res, 201, user);
                    })
                    .catch((err) => {
                        sendJsonResponse(res, 404, err);
                    })
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        } else {
            sendJsonResponse(res, 404, {
                "message": "No username or password exists in the request body"
            });
        }
    };

    let deleteUser = (req, res) => {
        if (req.params && req.params.userId) {
            User
            .findById(req.params.userId)
            .exec()
            .then((user) => {
                if (user) {
                    user.remove().then((user) => {
                        sendJsonResponse(res, 202, {
                            "message": `User with id: ${req.params.userId} was deleted`,
                            "user": user
                        });
                    })
                } else {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        } else {
            sendJsonResponse(res, 404, {
                "message": "No user id found in request"
            });
        }
    };

    let updateUser = (req, res) => {
        if (req.params && req.params.userId && req.body.username) {
            User
            .findOne({ username: req.body.username })
            .exec()
            .then((user) => {
                if (user) {
                    sendJsonResponse(res, 201, {
                        "message": `User '${user.username}' already exists`
                    });
                } else {
                    user.save().then((result) => {
                        sendJsonResponse(res, 200, result);
                    })
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            })
        } else {
            sendJsonResponse(res, 404, {
                "message": "No user id found in request"
            });
        }
    };

    return {
        getUser,
        createUser,
        deleteUser,
        updateUser
    };
}());