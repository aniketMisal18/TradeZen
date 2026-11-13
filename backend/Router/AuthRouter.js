const { login, signup, logout } = require("../Controller/AuthController");
const { signupValidation, loginValidation } = require("../Middleware/Authvalidation");
const { checkAuth } = require("../Middleware/CheckAuth");
const { Holdings } = require("../model/HoldingsSchema");
const { Users } = require("../model/UsersSchema");
const { Positions } = require("../model/PositionsSchema");
const Nifty50Stock = require("../model/nifty50StocksSchema");
const router = require("express").Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

router.get("/me", checkAuth, async (req, res) => {









    let user = await Users.findById(req.user._id).populate('watchlist');

    
    let watchlist = user.watchlist;
    let holdings = await Holdings.find({ user: req.user._id });
    let positions = await Positions.find({ user: req.user._id });




    

      let symbols = new Set([
            "NIFTY 50",
            "SENSEX"
        ]);

    watchlist.forEach(stock => symbols.add(stock.symbol));

    holdings.forEach(stock => symbols.add(stock.symbol));

    positions.forEach(stock => symbols.add(stock.Instrument));



    let symbolArray = [...symbols];


    console.log(watchlist);

    res.status(200).json({
        success: true,
        userInfo: user,
        subscriptionStocks: symbolArray
    });
});


module.exports = router;