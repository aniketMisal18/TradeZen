const { Orders } = require("../model/OrdersSchema");

function startOrderStatusUpdater() {
    setInterval(async () => {
        try {
            const result = await Orders.updateMany(
                {
                    status: "Pending",
                    completeAt: { $lte: new Date() }
                },
                {
                    $set: { status: "Complete" }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`${result.modifiedCount} orders completed.`);
            }

        } catch (err) {
            console.error(err);
        }
    }, 60000); 
}

module.exports = startOrderStatusUpdater;