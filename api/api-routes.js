let express = require('express');
let router = express.Router();
let userApiLogic = require('./user-api-logic');
let todoListApiLogic = require('./todo-list-api-logic');

router.post('/api/users', userApiLogic.createUser);
router.get('/api/users/:userId', userApiLogic.getUser);
router.delete('/api/users/:userId', userApiLogic.deleteUser);
router.put('/api/users/:userId', userApiLogic.updateUser);

router.post('/api/users/:userId/lists', todoListApiLogic.createTodoList);
router.get('/api/users/:userId/lists', todoListApiLogic.getAllTodoLists);
router.get('/api/users/:userId/lists/:listId', todoListApiLogic.getTodoList);
router.delete('/api/users/:userId/lists/:listId', todoListApiLogic.deleteTodoList);
router.put('/api/users/:userId/lists/:listId', todoListApiLogic.updateTodoList);

module.exports = router;