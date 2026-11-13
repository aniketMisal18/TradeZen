
const Support = require("../model/supportSchema");
const { Users } = require("../model/UsersSchema");

const createSupport = async (req, res) => {
    try {
        const {
            phone,
            category,
            subject,
            description
        } = req.body;

        if (!phone || !category || !subject || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingUser = await Users.findOne({
            phone: Number(phone)
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found with this phone number."
            });
        }

        const ticket = await Support.create({
            user: existingUser._id,
            name: existingUser.fullName,
            email: existingUser.email,
            phone: existingUser.phone,
            category,
            subject,
            description,
            ticketId: `TZ-${Date.now()}`
        });


        return res.status(201).json({
            success: true,
            message: "Support request submitted successfully.",
            ticket
        });

    } catch (error) {
        console.error("Support creation error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createSupport };
