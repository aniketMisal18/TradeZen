const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            unique: true,
        },

        // Original starting capital
        initialBalance: {
            type: Number,
            default: 100000,
        },

        // Current cash available for trading/withdrawal
        availableBalance: {
            type: Number,
            default: 100000,
        },

        // Money currently invested/blocked in open trades
        usedMargin: {
            type: Number,
            default: 0,
        },

        // Profit/loss from completed trades
        realizedPnL: {
            type: Number,
            default: 0,
        },

        // Total money deposited by user
        totalDeposited: {
            type: Number,
            default: 0,
        },

        // Total money withdrawn by user
        totalWithdrawn: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = { Account };