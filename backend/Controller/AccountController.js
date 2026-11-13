const { Account } = require("../model/AccountSchema");

const getAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            account
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const addFunds = async (req, res) => {
    try {
        const amount = Number(req.body.amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid amount",
            });
        }

        const account = await Account.findOne({
            user: req.user._id,
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        // Add money only to available balance
        account.availableBalance += amount;
       account.totalDeposited = Number(account.totalDeposited || 0) + amount;

        await account.save();

        return res.status(200).json({
            success: true,
            message: "Funds added successfully",
            account,
        });

    } catch (error) {
        console.log("Add funds error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add funds",
        });
    }
};





const withdrawFunds = async (req, res) => {
    try {
        const amount = Number(req.body.amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid amount",
            });
        }

        const account = await Account.findOne({
            user: req.user._id,
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        if (amount > account.availableBalance) {
            return res.status(400).json({
                success: false,
                message: "Insufficient available balance",
            });
        }

        account.availableBalance -= amount;
        account.totalWithdrawn = Number(account.totalWithdrawn || 0) + amount;

        await account.save();

        return res.status(200).json({
            success: true,
            message: "Funds withdrawn successfully",
            account,
        });

    } catch (error) {
        console.log("Withdraw funds error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to withdraw funds",
        });
    }
};


module.exports = {
    getAccount,
    addFunds,
    withdrawFunds
};