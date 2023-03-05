// const mongoose = require("mongoose");
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const roles = ["USER", "ADMIN"];

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        maxlength: 15
    },
    password:{
        type: String,
        minlength: 4,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    role:{
        type: String,
        enum: roles,
        required: true
    },
    avatarImg: String
})

const User = mongoose.model("User", userSchema);

export default User