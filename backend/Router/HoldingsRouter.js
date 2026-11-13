const { AddHolding, GetHolding } = require("../Controller/HoldingsController");
const { checkAuth } = require("../Middleware/CheckAuth");
const router = require("express").Router();



router.post("/addHolding", checkAuth ,AddHolding );
router.get("/getHolding",checkAuth, GetHolding);
 

module.exports = router;