let mongoose = require('mongoose');
let todoItemSchema = require('./TodoItem').model('TodoItem').schema;
let Schema = mongoose.Schema;

let todoListSchema = new Schema({
    listName: { type: String, required: true },
    todoItems: { type: [todoItemSchema] },
    filterSelected: { type: String, required: true, default: 'all' }
});

module.exports = mongoose.model('TodoList', todoListSchema);