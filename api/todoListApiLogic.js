let mongoose = require('mongoose');
let User = require('../db/schemas/User');
let TodoList = require('../db/schemas/TodoList');
let TodoItem = require('../db/schemas/TodoItem');

let sendJsonResponse = (res, status, content) => {
    res.status(status).json(content);
};

module.exports = (function() {
    let getTodoList = (req, res) => {
        if (req.params && req.params.userId && req.params.listId) {
            User
            .findById(req.params.userId)
            .populate('todoLists')
            .exec((err, user) => {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else if (!user || user.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    let todoList = user.todoLists.find((todoList) => {
                        return req.params.listId == todoList._id;
                    });
                    sendJsonResponse(res, 404, todoList);
                }
            });
        } else {
            sendJsonResponse(res, 404, {
                "message": "No user id or list id in request"
            });
        }
    };

    let getAllTodoLists = (req, res) => {
        if (req.params && req.params.userId) {
            User
            .findById(req.params.userId)
            .populate('todoLists')
            .exec((err, user) => {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else if (!user || user.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    sendJsonResponse(res, 200, user.todoLists);
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        }
    };

    let createTodoList = (req, res) => {
        if (req.params && req.params.userId && req.body.listName) {
            User
            .findById(req.params.userId)
            .exec()
            .then((user) => {
                if (!user || user.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    TodoList
                    .create({ listName: req.body.listName })
                    .then((todoList) => {
                        user.todoLists.push(todoList._id);
                        return user.save();
                    })
                    .then((user) => {
                        sendJsonResponse(res, 201, {
                            "message": "New todo list has been created"
                        });
                    })
                    .catch((err) => {
                        sendJsonResponse(res, 404, err);
                    });
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        } else {
            sendJsonResponse(res, 404, {
                "message": "No user id or list name in request"
            });
        }
    };

    let deleteTodoList = (req, res) => {
        
    };

    let updateTodoList = (req, res) => {
        
    };

    return {
        getTodoList,
        getAllTodoLists,
        createTodoList,
        deleteTodoList,
        updateTodoList
    }
}());