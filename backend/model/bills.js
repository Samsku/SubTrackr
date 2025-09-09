
const mongoose = require('mongoose')
const User = require('./user')
const billschema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    amount: {
        type: Number,
        required: true,
        min: 0 
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD'] // Common currencies
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