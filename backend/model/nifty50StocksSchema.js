

const mongoose = require("mongoose");

const nifty50StockSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            unique: true
        },

        name: String,

        exchange: {
            type: String,
            default: "NSE"
        },

        instrumentToken: {
            type: Number,
            required: true
        },

        exchangeToken: String,

        segment: String,

        instrumentType: String,

        active: {
            type: Boolean,
            default: true
        },

        lastSyncedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model( "Nifty50Stock", nifty50StockSchema);