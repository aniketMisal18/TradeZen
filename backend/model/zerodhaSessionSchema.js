const mongoose = require("mongoose");

const zerodhaSessionSchema = new mongoose.Schema({

    accessToken: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "ZerodhaSession",
    zerodhaSessionSchema
);