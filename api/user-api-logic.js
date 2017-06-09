// Get required modules
let mongoose = require('mongoose');
let validator = require('validator');
let User = require('../db/schemas/User');
let TodoList = require('../db/schemas/TodoList');
let helpers = require('../helpers.js');

// Extract sendJsonResponse function from helpers
let sendJsonResponse = helpers.sendJsonResponse;

// Use global promise instead of mongoose promise
mongoose.Promise = global.Promise;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

// Export api logic for users
module.exports = {
    getUser,
    createUser,
    deleteUser,
    updateUser
};