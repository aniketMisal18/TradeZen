const mongoose = require('mongoose');
const { Schema } = require("mongoose")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: Number,
        unique: true,
        minLength: 10,
        maxLength: 15,
        required: true,
    },
    password: {
        type: String,
        required: true
    },

    balance: {
        type: Number,
        default: 100000 // Virtual money
    },

    initialBalance: {
        type: Number,
        default: 0
    },

    availableBalance: {
        type: Number,
        default: 0
    },

    usedMargin: {
        type: Number,
        default: 0
    },

    realizedPnL: {
        type: Number,
        default: 0
    },


    watchlist: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nifty50Stock"
    }
],

}, { timestamps: true });

const Users = mongoose.model('Users', userSchema);

module.exports = { Users };