
const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved"],
            default: "Open"
        },

        ticketId: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Support", supportSchema);
