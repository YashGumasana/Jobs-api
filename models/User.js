import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    }
});

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(this.password);
    next();
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userID: this.id, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME });
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    console.log(candidatePassword, '+++');
    console.log(this.password, '---');
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(isMatch);
    return isMatch;
}

export default mongoose.model('User', UserSchema);