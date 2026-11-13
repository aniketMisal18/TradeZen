const router = require("express").Router();
const Nifty50Stock = require("../model/nifty50StocksSchema");




router.get("/getStocks", async(req, res)=>{
try {
   let allStocks = await Nifty50Stock.find({});
   res.json(allStocks);
} catch (error) {
    res.json(error);
}
});


module.exports = router;