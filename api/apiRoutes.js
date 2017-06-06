let express = require('express');
let router = express.Router();
let userApiLogic = require('./userApiLogic');
let todoListApiLogic = require('./todoListApiLogic');
let todoItemApiLogic = require('./todoItemApiLogic');

router.post('/api/users', userApiLogic.createUser);
router.get('/api/users', userApiLogic.getAllUsers);
router.get('/api/users/:userId', userApiLogic.getUser);
router.delete('/api/users/:userId', userApiLogic.deleteUser);
router.put('/api/users/:userId', userApiLogic.updateUser);

router.post('/api/users/:userId/lists', todoListApiLogic.createTodoList);
router.get('/api/users/:userId/lists', todoListApiLogic.getAllTodoLists);
router.get('/api/users/:userId/lists/:listId', todoListApiLogic.getTodoList);
router.delete('/api/users/:userId/lists/:listId/items/:itemId', todoListApiLogic.deleteTodoList);
router.put('/api/users/:userId/lists/:listId/items/:itemId', todoListApiLogic.updateTodoList);

router.post('/api/users/:userId/lists/:listId/items', todoItemApiLogic.createTodoItem);
router.get('/api/users/:userId/lists/:listId/items', todoItemApiLogic.getAllTodoItems);
router.get('/api/users/:userId/lists/:listId/items/:itemId', todoItemApiLogic.getTodoItem);
router.delete('/api/users/:userId/lists/:listId/items/:itemId', todoItemApiLogic.deleteTodoItem);
router.put('/api/users/:userId/lists/:listId/items/:ItemId', todoItemApiLogic.updateTodoItem);

module.exports = router;