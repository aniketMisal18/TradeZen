const router = require("express").Router();
const { startBroker } = require("../liveData/broker");


const kite = require("../config/zerodha");
const ZerodhaSession =  require("../model/zerodhaSessionSchema");

router.get("/login", (req, res) => {

    const loginURL = kite.getLoginURL();

    res.redirect(loginURL);
});



router.get("/callback", async (req, res) => {
    try {
        const requestToken = req.query.request_token;

        if (!requestToken) {
            return res.status(400).send("Request token missing");
        }

        console.log("Request token received");

        const session = await kite.generateSession(
            requestToken,
            process.env.ZERODHA_API_SECRET
        );

        const accessToken = session.access_token;

        console.log("Zerodha login successful");

        await ZerodhaSession.deleteMany({});

        await ZerodhaSession.create({
            accessToken
        });

        kite.setAccessToken(accessToken);

        console.log("New access token saved");

        await startBroker();

        res.send("Zerodha connected successfully. Live market data service restarted.");

    } catch (error) {
        console.error("Zerodha authentication error:", error);

        res.status(500).send(
            "Zerodha authentication failed: " + error.message
        );
    }
});


module.exports = router;