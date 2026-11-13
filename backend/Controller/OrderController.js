const { Holdings } = require("../model/HoldingsSchema");
const { Orders } = require("../model/OrdersSchema");
const { Positions } = require("../model/PositionsSchema");
const { Account } = require("../model/AccountSchema");

// =====================================================
// ADD ORDER
// =====================================================

const AddOrder = async (req, res) => {

    const order = req.body.order;

    if (!order) {
        return res.status(400).json({
            success: false,
            message: "Order data is missing"
        });
    }

    try {

        // =================================================
        // COMMON VALIDATION
        // =================================================

        const qty = Number(order.qty);
        const price = Number(order.price);

        if (!qty || qty <= 0 || !price || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity or price"
            });
        }

        if (
            order.action !== "BUY" &&
            order.action !== "SELL"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order action"
            });
        }

        if (
            order.orderType !== "DELIVERY" &&
            order.orderType !== "POSITION"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order type"
            });
        }

        // =================================================
        // FIND ACCOUNT
        // =================================================

        const account = await Account.findOne({
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Trading account not found"
            });
        }

        // =================================================
        // BUY ORDER
        // =================================================

        if (order.action === "BUY") {

            const requiredAmount = qty * price;

            // ---------------------------------------------
            // CHECK AVAILABLE BALANCE
            // ---------------------------------------------

            if (
                Number(account.availableBalance) <
                requiredAmount
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient balance",
                    availableBalance: account.availableBalance,
                    requiredAmount: requiredAmount
                });
            }

            // =================================================
            // DELIVERY BUY
            // =================================================

            if (order.orderType === "DELIVERY") {

                let holding = await Holdings.findOne({
                    user: req.user._id,
                    symbol: order.Stock
                });

                // ---------------------------------------------
                // EXISTING HOLDING
                // ---------------------------------------------

                if (holding) {

                    const oldQty = Number(holding.qty);
                    const oldAvg = Number(holding.avgPrice);

                    const totalQty =
                        oldQty + qty;

                    const totalInvestment =
                        (oldQty * oldAvg) +
                        (qty * price);

                    const avgPrice =
                        totalInvestment / totalQty;

                    holding.qty = totalQty;

                    holding.avgPrice =
                        Number(avgPrice.toFixed(2));

                    await holding.save();

                }

                // ---------------------------------------------
                // NEW HOLDING
                // ---------------------------------------------

                else {

                    holding = new Holdings({
                        symbol: order.Stock,
                        qty: qty,
                        avgPrice: price,
                        user: req.user._id
                    });

                    await holding.save();
                }

                // ---------------------------------------------
                // UPDATE ACCOUNT
                // ---------------------------------------------

                account.availableBalance -=
                    requiredAmount;

                account.usedMargin =
                    Number(account.usedMargin || 0) +
                    requiredAmount;

                await account.save();
            }

            // =================================================
            // POSITION BUY
            // =================================================

            if (order.orderType === "POSITION") {

                let position = await Positions.findOne({
                    user: req.user._id,
                    Instrument: order.Stock
                });

                // ---------------------------------------------
                // EXISTING POSITION
                // ---------------------------------------------

                if (position) {

                    const oldQty =
                        Number(position.qty);

                    const oldAvg =
                        Number(position.AvgPrice);

                    const totalQty =
                        oldQty + qty;

                    const totalInvestment =
                        (oldQty * oldAvg) +
                        (qty * price);

                    const avgPrice =
                        totalInvestment / totalQty;

                    position.qty = totalQty;

                    position.AvgPrice =
                        Number(avgPrice.toFixed(2));

                    await position.save();
                }

                // ---------------------------------------------
                // NEW POSITION
                // ---------------------------------------------

                else {

                    position = new Positions({
                        Instrument: order.Stock,
                        qty: qty,
                        AvgPrice: price,
                        user: req.user._id
                    });

                    await position.save();
                }

                // ---------------------------------------------
                // UPDATE ACCOUNT
                // ---------------------------------------------

                account.availableBalance -=
                    requiredAmount;

                account.usedMargin =
                    Number(account.usedMargin || 0) +
                    requiredAmount;

                await account.save();
            }

            // =================================================
            // CREATE BUY ORDER
            // =================================================

            const newOrder = new Orders({
                symbol: order.Stock,
                qty: qty,
                orderType: order.orderType,
                action: order.action,
                avgPrice: price,
                user: req.user._id
            });

            await newOrder.save();

            return res.status(200).json({
                success: true,
                message: "BUY order successful",
                order: newOrder,
                availableBalance:
                    account.availableBalance,
                usedMargin:
                    account.usedMargin
            });
        }

        // =================================================
        // SELL ORDER
        // =================================================

        if (order.action === "SELL") {

            // =================================================
            // DELIVERY SELL
            // =================================================

            if (order.orderType === "DELIVERY") {

                const holding = await Holdings.findOne({
                    user: req.user._id,
                    symbol: order.Stock
                });

                if (!holding) {
                    return res.status(400).json({
                        success: false,
                        message: "Holding not found"
                    });
                }

                const currentQty =
                    Number(holding.qty);

                const sellQty = qty;
                const sellPrice = price;

                // ---------------------------------------------
                // CHECK QUANTITY
                // ---------------------------------------------

                if (sellQty > currentQty) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient quantity",
                        availableQuantity: currentQty,
                        requestedQuantity: sellQty
                    });
                }

                // ---------------------------------------------
                // CALCULATE SELL
                // ---------------------------------------------

                const originalCost =
                    sellQty *
                    Number(holding.avgPrice);

                const sellValue =
                    sellQty *
                    sellPrice;

                const profit =
                    sellValue -
                    originalCost;

                // ---------------------------------------------
                // UPDATE ACCOUNT
                // ---------------------------------------------

                account.availableBalance +=
                    sellValue;

                account.usedMargin =
                    Math.max(
                        0,
                        Number(account.usedMargin || 0) -
                        originalCost
                    );

                account.realizedPnL =
                    Number(account.realizedPnL || 0) +
                    profit;

                await account.save();

                // ---------------------------------------------
                // UPDATE HOLDING
                // ---------------------------------------------

                const remainingQty =
                    currentQty - sellQty;

                if (remainingQty > 0) {

                    holding.qty = remainingQty;

                    await holding.save();

                } else {

                    await Holdings.deleteOne({
                        _id: holding._id
                    });
                }

                // ---------------------------------------------
                // CREATE SELL ORDER
                // ---------------------------------------------

                const newOrder = new Orders({
                    symbol: order.Stock,
                    qty: sellQty,
                    orderType: order.orderType,
                    action: order.action,
                    avgPrice: sellPrice,
                    user: req.user._id
                });

                await newOrder.save();

                return res.status(200).json({
                    success: true,
                    message: "SELL order successful",
                    order: newOrder,
                    profit: Number(profit.toFixed(2)),
                    availableBalance:
                        account.availableBalance,
                    usedMargin:
                        account.usedMargin,
                    realizedPnL:
                        account.realizedPnL
                });
            }

            // =================================================
            // POSITION SELL
            // =================================================

            if (order.orderType === "POSITION") {

                const position = await Positions.findOne({
                    user: req.user._id,
                    Instrument: order.Stock
                });

                if (!position) {
                    return res.status(400).json({
                        success: false,
                        message: "Position not found"
                    });
                }

                const currentQty =
                    Number(position.qty);

                const sellQty = qty;
                const sellPrice = price;

                const avgPrice =
                    Number(position.AvgPrice);

                // ---------------------------------------------
                // CHECK QUANTITY
                // ---------------------------------------------

                if (sellQty > currentQty) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient quantity",
                        availableQuantity: currentQty,
                        requestedQuantity: sellQty
                    });
                }

                // ---------------------------------------------
                // CALCULATE SELL
                // ---------------------------------------------

                const originalCost =
                    sellQty * avgPrice;

                const sellValue =
                    sellQty * sellPrice;

                const profit =
                    sellValue -
                    originalCost;

                // ---------------------------------------------
                // UPDATE ACCOUNT
                // ---------------------------------------------

                account.availableBalance +=
                    sellValue;

                account.usedMargin =
                    Math.max(
                        0,
                        Number(account.usedMargin || 0) -
                        originalCost
                    );

                account.realizedPnL =
                    Number(account.realizedPnL || 0) +
                    profit;

                await account.save();

                // ---------------------------------------------
                // UPDATE POSITION
                // ---------------------------------------------

                const remainingQty =
                    currentQty - sellQty;

                if (remainingQty > 0) {

                    position.qty = remainingQty;

                    await position.save();

                } else {

                    await Positions.deleteOne({
                        _id: position._id
                    });
                }

                // ---------------------------------------------
                // CREATE SELL ORDER
                // ---------------------------------------------

                const newOrder = new Orders({
                    symbol: order.Stock,
                    qty: sellQty,
                    orderType: order.orderType,
                    action: order.action,
                    avgPrice: sellPrice,
                    user: req.user._id
                });

                await newOrder.save();

                return res.status(200).json({
                    success: true,
                    message: "SELL order successful",
                    order: newOrder,
                    profit: Number(profit.toFixed(2)),
                    availableBalance:
                        account.availableBalance,
                    usedMargin:
                        account.usedMargin,
                    realizedPnL:
                        account.realizedPnL
                });
            }
        }

    } catch (error) {

        console.error("AddOrder Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something is wrong",
            error: error.message
        });
    }
};


// =====================================================
// GET TODAY'S ORDERS
// =====================================================

const GetOrder = async (req, res) => {

    try {

        const startOfDay = new Date();

        startOfDay.setHours(0, 0, 0, 0);

        const startOfTomorrow =
            new Date(startOfDay);

        startOfTomorrow.setDate(
            startOfTomorrow.getDate() + 1
        );

        const allOrder = await Orders.find({
            user: req.user._id,

            createdAt: {
                $gte: startOfDay,
                $lt: startOfTomorrow
            }
        });

        res.status(200).json(allOrder);

    } catch (error) {

        console.error("GetOrder Error:", error);

        res.status(500).json({
            success: false,
            message: "Something is wrong",
            error: error.message
        });
    }
};


module.exports = {
    AddOrder,
    GetOrder
};