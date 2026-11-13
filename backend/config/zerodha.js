const { KiteConnect } = require("kiteconnect");

const kite = new KiteConnect({
    api_key: process.env.ZERODHA_API_KEY
});

module.exports = kite;