const mongoose = require('mongoose');
const User = require('./user')
const Paymentschema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    type: {
        type: String,
        required: true
    },
    paymentMethodId: {
        type:String,
        required: true
    },
    billingName: {
        type:String,
        required: true
    },
    billingEmail: {
        type:String,
        required: true
    }

})

const Payments = mongoose.model('Payments', Paymentschema)

module.exports = Payments;