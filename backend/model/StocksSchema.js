const mongoose = require('mongoose');
const {Schema} = require("mongoose")

const stocksSchema = new Schema({
  name:{
    type: String, 
    required: true
  },
  symbol:{
    type: String, 
    required: true
  },
  positionLotSize:{
    type:Number,
    required: true
  }
}, { timestamps: true }); 

const Stocks = mongoose.model('Stocks', stocksSchema);

module.exports = {Stocks};