let mongoose = require('mongoose');
let validator = require('validator');
let User = require('../db/schemas/User');
let TodoList = require('../db/schemas/TodoList');
let TodoItem = require('../db/schemas/TodoItem');

let sendJsonResponse = (res, status, content) => {
    res.status(status).json(content);
};

let sanitizeRequestData = () => {

}

module.exports = (function () {
    let getUser = (req, res) => {
        if (req.params && req.params.userId) {
            User
            .findById(req.params.userId)
            .exec()
            .then((user) => {
                if (!user || user.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    sendJsonResponse(res, 200, user);
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            })
        } else {
            sendJsonResponse(res, 404, {
                "message": "No user id in request"
            });
        }
    };

    let getAllUsers = (req, res) => {
        User
        .find({})
        .exec()
        .then((users) => {
            if (!users || users.length == 0) {
                sendJsonResponse(res, 404, {
                    "message": "There are no users"
                });
            } else {
                sendJsonResponse(res, 200, users);
            }
        })
        .catch((err) => {
            sendJsonResponse(res, 404, err);
        });
    };

    let createUser = (req, res) => {
        User
        .find({ username: req.body.username })
        .exec()
        .then((user) => {
            if (!user || user.length == 0) {
                User
                .create({ 
                    username: req.body.username,
                    password: req.body.password
                })
                .then((user) => {
                    sendJsonResponse(res, 201, user)
                });
            } else {
                sendJsonResponse(res, 202, {
                    "message": `Username '${req.body.username}' already exists`
                });
            }
        })
        .catch((err) => {
            sendJsonResponse(res, 404, err);
        });
    };

    let deleteUser = (req, res) => {
        if (req.params && req.params.userId) {
            User
            .findById(req.params.userId)
            .exec()
            .then((user) => {
                if (!user || user.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    user.todoLists.forEach((todoListId) => {
                        console.log(todoListId);
                        TodoList
                        .findByIdAndRemove(todoListId)
                        .exec()
                        .catch((err) => {
                            sendJsonResponse(res, 404, err);
                        });
                    });

                    User
                    .findByIdAndRemove(req.params.userId)
                    .exec()
                    .then((user) => {
                        sendJsonResponse(res, 200, {
                            "message": `User with id: ${req.params.userId} was deleted`,
                            "user": user
                        });
                    });
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        } else {
            sendJsonResponse(req, 404, {
                "message": "No user id was in request"
            });
        }
    };

    let updateUser = (req, res) => {
        let sentResponse = false;
        
        if (req.params && req.params.userId && req.body.username && !req.body.password) {
            User
            .findById(req.params.userId)
            .exec()
            .then((requestedUser) => {
                if (!requestedUser || requestedUser.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    User
                    .find({ username: req.body.username })
                    .exec()
                    .then((existingUser) => {
                        if (!existingUser || existingUser.length == 0) {
                            requestedUser.username = req.body.username;
                        } else {
                            sendJsonResponse(res, 202, {
                                "message": `Username '${req.body.username}' already exists`
                            });
                            sentResponse = true;
                        }
                        return requestedUser.save();
                    })
                    .then((requestedUser) => {
                        if (sentResponse === false) {
                            sendJsonResponse(res, 200, {
                                "message": `Username was sucessfully updated to: ${req.body.username}`
                            });
                        }
                    })
                    .catch((err) => {
                        if (sentResponse === false) {
                            sendJsonResponse(res, 404, err);
                        }
                    });
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        } else if (req.params && req.params.userId && !req.body.username && req.body.password) {
            User
            .findById(req.params.userId)
            .exec()
            .then((requestedUser) => {
                if (!requestedUser || requestedUser.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    requestedUser.password = req.body.password;
                    return requestedUser.save();
                }
            })
            .then((requestedUser) => {
                sendJsonResponse(res, 201, {
                    "message": "Password has been successfully changed"
                });
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            })
        } else if (req.params && req.params.userId && req.body.username && req.body.password) {
            User
            .findById(req.params.userId)
            .exec()
            .then((requestedUser) => {
                if (!requestedUser || requestedUser.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    User
                    .find({ username: req.body.username })
                    .exec()
                    .then((existingUser) => {
                        if (!existingUser || existingUser.length == 0) {
                            requestedUser.username = req.body.username;
                            requestedUser.password = req.body.password;
                        } else {
                            sendJsonResponse(res, 202, {
                                "message": `Username '${req.body.username}' already exists`
                            });
                            sentResponse = true;
                        }
                        return requestedUser.save();
                    })
                    .then((requestedUser) => {
                        if (sentResponse === false) {
                            sendJsonResponse(res, 200, {
                                "message": `Username was sucessfully updated to: ${req.body.username}`
                            });
                        }
                    })
                    .catch((err) => {
                        if (sentResponse === false) {
                            sendJsonResponse(res, 404, err);
                        }
                    });
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        } else {
            sendJsonResponse(res, 404, {
                "message": "No user id was in request"
            });
        }
    };

    return {
        getUser,
        getAllUsers,
        createUser,
        deleteUser,
        updateUser
    };
}());