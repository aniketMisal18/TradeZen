

const cron = require("node-cron");

const {
    syncNifty50
} = require("../services/syncNifty50Stocks");

cron.schedule(
    "0 8 * * *",
    async () => {

        try {

            console.log(
                "Running Nifty 50 daily sync..."
            );

            await syncNifty50();

        } catch (error) {

            console.error(
                "Nifty 50 sync failed:",
                error
            );

        }

    },
    {
        timezone: "Asia/Kolkata"
    }
);