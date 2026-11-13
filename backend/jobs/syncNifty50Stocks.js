


const { Stocks } = require("../data/nifty50stocks.js");
const Nifty50Stock = require("../model/nifty50StocksSchema");

const {
    getZerodhaInstruments
} = require("./zerodhajobs");


async function syncNifty50() {

    console.log("Starting Nifty 50 sync...");

    const instruments = await getZerodhaInstruments();

    const zerodhaMap = new Map();

    for (const instrument of instruments) {

        if (
            instrument.exchange === "NSE" &&
            instrument.segment === "NSE" &&
            instrument.instrument_type === "EQ"
        ) {
            zerodhaMap.set(
                instrument.tradingsymbol,
                instrument
            );
        }
    }

    const stocks = [];

    for (const symbol of Stocks) {

        const instrument = zerodhaMap.get(symbol);

        if (!instrument) {
            console.log(`Not found in Zerodha: ${symbol}`);
            continue;
        }

        stocks.push({
            symbol: instrument.tradingsymbol,
            name: instrument.name,
            exchange: instrument.exchange,
            instrumentToken: Number(instrument.instrument_token),
            exchangeToken: instrument.exchange_token,
            segment: instrument.segment,
            instrumentType: instrument.instrument_type,
            active: true,
            lastSyncedAt: new Date()
        });
    }

    console.log(`Matched ${stocks.length} stocks`);


    for (const stock of stocks) {

        await Nifty50Stock.updateOne(
            {
                symbol: stock.symbol,
                exchange: stock.exchange
            },
            {
                $set: {
                    name: stock.name,
                    instrumentToken: stock.instrumentToken,
                    exchangeToken: stock.exchangeToken,
                    segment: stock.segment,
                    instrumentType: stock.instrumentType,
                    active: stock.active,
                    lastSyncedAt: stock.lastSyncedAt
                }
            },
            {
                upsert: true
            }
        );
    }

    const indices = [
        {
            symbol: "NIFTY 50",
            name: "Nifty 50",
            exchange: "NSE",
            instrumentToken: 256265,
            exchangeToken: 0,
            segment: "INDICES",
            instrumentType: "INDEX",
            active: true,
            lastSyncedAt: new Date()
        },
        {
            symbol: "SENSEX",
            name: "SENSEX",
            exchange: "BSE",
            instrumentToken: 265,
            exchangeToken: 0,
            segment: "INDICES",
            instrumentType: "INDEX",
            active: true,
            lastSyncedAt: new Date()
        }
    ];

    for (const index of indices) {
        await Nifty50Stock.updateOne(
            {
                symbol: index.symbol,
                exchange: index.exchange
            },
            {
                $set: index
            },
            {
                upsert: true
            }
        );
    }
    console.log("Nifty 50 MongoDB sync completed");

    return stocks;
}

module.exports = {
    syncNifty50
};