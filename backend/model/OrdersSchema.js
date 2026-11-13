const mongoose = require('mongoose');
const {Schema} = require("mongoose")

const ordersSchema = new Schema({


    symbol:{
        type: String,
        required: true
    },
    qty:{
        type: Number,
        required: true
    },
    avgPrice:{
        type:Number,
        required: true
    },
    status:{
        type:String,
        default:"Complete",
        required: true

    },
    orderType:{
        type:String,
        required: true
    },
    action:{
         type:String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, { timestamps: true }); 

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = {Orders};