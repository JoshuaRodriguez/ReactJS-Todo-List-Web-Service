let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let todoItemSchema = new Schema({
    itemId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'active'
    }
});

let todoListSchema = new Schema({
    listName: {
        type: String,
        required: true
    },
    todoItems: {
        type: [todoItemSchema],
        default: []
    },
    filterSelected: {
        type: String,
        required: true,
        default: 'all'
    },
    userRefId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('TodoList', todoListSchema);