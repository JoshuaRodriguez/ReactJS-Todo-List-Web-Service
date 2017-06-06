let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let todoItemSchema = new Schema({
    description: { type: String, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('TodoItem', todoItemSchema);