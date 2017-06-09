let mongoose = require('mongoose');
let User = require('../db/schemas/User');
let TodoList = require('../db/schemas/TodoList');

let sendJsonResponse = (res, status, content) => {
    res.status(status).json(content);
};

module.exports = (function() {
    let getTodoList = (req, res) => {
        if (req.params && req.params.userId && req.params.listId) {
            User
            .findById(req.params.userId)
            .populate('todoLists')
            .exec()
            .then((user) => {
                if (user) {
                    let todoListRequested = user.todoLists.find((todoList) => {
                        return todoList._id == req.params.listId
                    });

                    if (todoListRequested) {
                        sendJsonResponse(res, 200, todoListRequested);
                    } else {
                        sendJsonResponse(res, 404, {
                            "message": `Todo list with id: ${req.params.listId} was not found`
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        }
    };

    let getAllTodoLists = (req, res) => {
        User
        .findById(req.params.userId)
        .populate('todoLists')
        .exec()
        .then((user) => {
            if (user) {
                sendJsonResponse(res, 200, user.todoLists);
            } else {
                sendJsonResponse(res, 404, {
                    "message": `User with id: ${req.params.userId} was not found` 
                });
            }
        })
        .catch((err) => {
            sendJsonResponse(res, 404, err);
        })
    };

    let createTodoList = (req, res) => {
        if (req.params && req.params.userId && req.body.listName) {
            User
            .findById(req.params.userId)
            .exec()
            .then((user) => {
                if (user) {
                    TodoList
                    .create({
                        userRefId: req.params.userId,
                        listName: req.body.listName 
                    })
                    .then((todoList) => {
                        user.todoLists.push(todoList._id);
                        user.save().then((user) => {
                            sendJsonResponse(res, 201, {
                                "message": `New todo list '${todoList.listName}' was created`
                            });
                        });
                    })
                    .catch((err) => {
                        sendJsonResponse(res, 404, err);
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
                "message": "user id or list name not found in request"
            });
        }
    };

    let deleteTodoList = (req, res) => {
        if (req.params && req.params.userId && req.params.listId) {
            User
            .findById(req.params.userId)
            .populate('todoLists')
            .exec()
            .then((user) => {
                if (user) {
                    let todoListToRemove = user.todoLists.find((todoList) => {
                        return todoList._id == req.params.listId;
                    });

                    if (todoListToRemove) {
                        TodoList
                        .findOne({ _id: todoListToRemove._id })
                        .exec()
                        .then((todoList) => {
                            todoList.remove().then((todoList) => {
                                
                                sendJsonResponse(res, 204, {
                                    "message": `Todo list with id: ${req.params.listId} was removed`
                                });
                            });
                        })
                        .catch((err) => {
                            sendJsonResponse(res, 404, err);
                        });
                    }
                } else {

                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            })
        }
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