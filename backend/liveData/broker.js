
// const { broadcastPrice } = require("../liveData/subscriptionManager");
// const ZerodhaSession = require("../model/zerodhaSessionSchema");
// const Nifty50Stock = require("../model/nifty50StocksSchema");
// const { KiteConnect, KiteTicker } = require("kiteconnect");

// let activeTicker = null;
// let brokerStarting = false;

// async function startBroker() {
//     if (brokerStarting) {
//         console.log("Broker initialization already in progress");
//         return;
//     }

//     brokerStarting = true;

//     try {
//         const session = await ZerodhaSession.findOne();

//         if (!session || !session.accessToken) {
//             console.log("Zerodha access token not found");
//             return;
//         }

//         const kite = new KiteConnect({
//             api_key: process.env.ZERODHA_API_KEY
//         });

//         kite.setAccessToken(session.accessToken);

//         try {
//             await kite.getProfile();
//             console.log("Zerodha API authentication successful");
//         } catch (error) {
//             console.error("Zerodha authentication failed:", error.message);
//             return;
//         }

//         const stocks = await Nifty50Stock.find({
//             active: true,
//             exchange: "NSE",
//             instrumentType: "EQ"
//         });

//         if (!stocks.length) {
//             console.log("No active Nifty 50 stocks found");
//             return;
//         }

//         const tokenToSymbol = new Map();

//         const tokens = stocks.map(stock => {
//             const token = Number(stock.instrumentToken);

//             tokenToSymbol.set(token, stock.symbol);

//             return token;
//         });

//         if (activeTicker) {
//             console.log("Closing previous Zerodha connection");

//             const oldTicker = activeTicker;

//             activeTicker = null;

//             oldTicker.removeAllListeners();
//             oldTicker.disconnect();
//         }

//         const ticker = new KiteTicker({
//             api_key: process.env.ZERODHA_API_KEY,
//             access_token: session.accessToken
//         });

//         activeTicker = ticker;

//         ticker.on("connect", () => {
//             if (activeTicker !== ticker) return;

//             console.log("ZERODHA CONNECTED");

//             ticker.subscribe(tokens);

//             ticker.setMode(
//                 ticker.modeQuote,
//                 tokens
//             );

//             console.log("SUBSCRIBED TOKENS:", tokens.length);
//         });

//         ticker.on("ticks", ticks => {
//             if (activeTicker !== ticker) return;

//             ticks.forEach(tick => {
//                 const symbol = tokenToSymbol.get(
//                     Number(tick.instrument_token)
//                 );

//                 if (!symbol) return;

//                 const priceData = {
//                     symbol,
//                     ltp: tick.last_price,
//                     ohlc: {
//                         open: tick.ohlc?.open,
//                         high: tick.ohlc?.high,
//                         low: tick.ohlc?.low,
//                         close: tick.ohlc?.close
//                     }
//                 };

//                 broadcastPrice(priceData);
//             });
//         });

//         ticker.on("error", error => {
//             console.error("ZERODHA ERROR:", error);
//         });

//         ticker.on("close", () => {
//             console.log("ZERODHA SOCKET CLOSED");
//         });

//         ticker.on("disconnect", () => {
//             console.log("ZERODHA DISCONNECTED");
//         });

//         ticker.on("reconnect", (count, interval) => {
//             console.log(
//                 "ZERODHA RECONNECT:",
//                 count,
//                 interval
//             );
//         });

//         ticker.on("noreconnect", () => {
//             console.log("ZERODHA NO RECONNECT");
//         });

//         ticker.connect();

//         console.log("Zerodha broker initialization completed");

//     } catch (error) {
//         console.error("Broker error:", error);
//     } finally {
//         brokerStarting = false;
//     }
// }

// module.exports = {
//     startBroker
// };





const { broadcastPrice } = require("../liveData/subscriptionManager");
const ZerodhaSession = require("../model/zerodhaSessionSchema");
const Nifty50Stock = require("../model/nifty50StocksSchema");
const { KiteConnect, KiteTicker } = require("kiteconnect");

let activeTicker = null;
let brokerStarting = false;

async function startBroker() {
    if (brokerStarting) {
        console.log("Broker initialization already in progress");
        return;
    }

    brokerStarting = true;

    try {
        const session = await ZerodhaSession.findOne();

        if (!session || !session.accessToken) {
            console.log("Zerodha access token not found");
            return;
        }

        const kite = new KiteConnect({
            api_key: process.env.ZERODHA_API_KEY
        });

        kite.setAccessToken(session.accessToken);

        try {
            await kite.getProfile();
            console.log("Zerodha API authentication successful");
        } catch (error) {
            console.error("Zerodha authentication failed:", error.message);
            return;
        }

        
        const stocks = await Nifty50Stock.find({
            active: true,
            instrumentType: { $in: ["EQ", "INDEX"] }
        });

        if (!stocks.length) {
            console.log("No active instruments found");
            return;
        }

        const tokenToSymbol = new Map();

        const tokens = stocks.map(stock => {
            const token = Number(stock.instrumentToken);

            tokenToSymbol.set(token, stock.symbol);

            return token;
        });

        console.log("TOTAL INSTRUMENTS:", tokens.length);

        if (activeTicker) {
            console.log("Closing previous Zerodha connection");

            const oldTicker = activeTicker;
            activeTicker = null;

            oldTicker.removeAllListeners();
            oldTicker.disconnect();
        }

        const ticker = new KiteTicker({
            api_key: process.env.ZERODHA_API_KEY,
            access_token: session.accessToken
        });

        activeTicker = ticker;

        ticker.on("connect", () => {
            if (activeTicker !== ticker) return;

            console.log("ZERODHA CONNECTED");

            ticker.subscribe(tokens);

            ticker.setMode(
                ticker.modeQuote,
                tokens
            );

            console.log("SUBSCRIBED TOKENS:", tokens.length);
            console.log("SUBSCRIBED SYMBOLS:", [...tokenToSymbol.values()]);
        });

        ticker.on("ticks", ticks => {
            if (activeTicker !== ticker) return;

            ticks.forEach(tick => {
                const symbol = tokenToSymbol.get(
                    Number(tick.instrument_token)
                );

                if (!symbol) return;

               

                const priceData = {
                    symbol,
                    ltp: tick.last_price,
                    ohlc: {
                        open: tick.ohlc?.open,
                        high: tick.ohlc?.high,
                        low: tick.ohlc?.low,
                        close: tick.ohlc?.close
                    }
                };

                broadcastPrice(priceData);
            });
        });

        ticker.on("error", error => {
            console.error("ZERODHA ERROR:", error);
        });

        ticker.on("close", () => {
            console.log("ZERODHA SOCKET CLOSED");
        });

        ticker.on("disconnect", () => {
            console.log("ZERODHA DISCONNECTED");
        });

        ticker.on("reconnect", (count, interval) => {
            console.log("ZERODHA RECONNECT:", count, interval);
        });

        ticker.on("noreconnect", () => {
            console.log("ZERODHA NO RECONNECT");
        });

        ticker.connect();

        console.log("Zerodha broker initialization completed");

    } catch (error) {
        console.error("Broker error:", error);
    } finally {
        brokerStarting = false;
    }
}

module.exports = {
    startBroker
};
