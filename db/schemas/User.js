let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let TodoList = require('./TodoList');

let Schema = mongoose.Schema;
let SALT_WORK_FACTOR = 10;

let userSchema = new Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: {
        type: String, 
        required: true 
    },
    todoLists: [{ 
        type: String, 
        ref: 'TodoList'
    }]
});

userSchema.pre('save', function(next) {
    let user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});

userSchema.pre('remove', function(next) {
    TodoList.remove({ userRefId: this._id }).exec();
    next();
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);

