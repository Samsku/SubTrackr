
const mongoose = require('mongoose')
const User = require('./user')
const billschema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    remindertime:{
        type: Date, 
        required: true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})


const Bill = mongoose.model('Bill',billschema)
module.exports = Bill