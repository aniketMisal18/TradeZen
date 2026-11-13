const mongoose = require('mongoose');
const { Schema } = require("mongoose")

const positionsSchema = new Schema({
    
    Instrument: {
        type:String ,
        ref: 'Stocks',
        required: true
    },
    qty:{
        type:Number,
        required: true
    },
    AvgPrice:{
        type:Number,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

const Positions = mongoose.model('Positions', positionsSchema);

module.exports = { Positions };