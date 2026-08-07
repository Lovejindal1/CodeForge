const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }, 
    
},
{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);