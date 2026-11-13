const mongoose = require('mongoose');
const {Schema} = require("mongoose")

const holdingsSchema = new Schema({

    symbol:{
        type: String,
    },
    qty:{
        type: Number,
    },
    avgPrice:{
        type:Number,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true }); 

const Holdings = mongoose.model('Holdings', holdingsSchema);

module.exports = {Holdings};