let mongoose = require('mongoose');
let User = require('../db/schemas/User');
let TodoList = require('../db/schemas/TodoList');
let TodoItem = require('../db/schemas/TodoItem');

let sendJsonResponse = (res, status, content) => {
    res.status(status).json(content);
};

module.exports = (function () {
    let getTodoItem = (req, res) => {
        if (req.params && req.params.userId && req.params.listId && req.params.itemId) {
            User
            .findById(req.params.userId)
            .exec()
            .then((user) => {
                if (!user || user.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": `User with id: ${req.params.userId} was not found`
                    });
                } else {
                    let listId = user.todoLists.find((todoListId) => {
                        return todoListId === req.params.listId;
                    });

                    TodoList
                    .findById(listId)
                    .exec()
                    .then((todoList) => {
                        console.log(todoList);
                        if (!todoList) {
                            sendJsonResponse(res, 404, {
                                "message": `Todo list with id: ${req.params.listId} was not found`
                            });
                        } else {
                            let todoItem = todoList.todoItems.find((todoItem) => {
                                return todoItem._id === req.params.itemId
                            });

                            sendJsonResponse(res, 200, todoItem);
                        }
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
                "message": "No user id, list id, or item id in request"
            });
        }
    };

    let getAllTodoItems = (req,res) => {
        if (req.params && req.params.listId && req.params.userId) {
            TodoItem
            .find({})
            .exec()
            .then((todoItems) => {
                if (!todoItems || todoItems.length == 0) {
                    sendJsonResponse(res, 404, {
                        "message": "There are currently no todo items"
                    });
                } else {
                    sendJsonResponse(res, 200, todoItems);
                }
            })
            .catch((err) => {
                sendJsonResponse(res, 404, err);
            });
        } else {
            sendJsonResponse(res, 404, {
                "message": "No user id or listId in request"
            });
        }
    };

    let createTodoItem = (req, res) => {

    };

    let deleteTodoItem = (req, res) => {

    };

    let updateTodoItem = (req, res) => {

    };

    return {
        getTodoItem,
        getAllTodoItems,
        createTodoItem,
        deleteTodoItem,
        updateTodoItem
    };
}());