const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const { isEmail } = require('validator'); //to validate the email at the model level


const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please, enter an email'],
        unique: true,
        validate: [isEmail, 'Please, enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please, enter a password.'],
        minlength: [6, 'Minimum length is 6 characters.']
    }
});

//a function that fires before the user is saved to the db
userSchema.pre('save', async function(next) {
    console.log('a user is about to be saved', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.userLogin = async function(email, password){
    const user = await this.findOne({ email });
    if(user) {
        const pswMatch = await bcrypt.compare(password, user.password);
        if(pswMatch) {
            console.log(user);
            return user;
        }
        throw Error('invalid password');
    }
    throw Error('invalid email');
};



const User = mongoose.model('User', userSchema);
module.exports = User;


