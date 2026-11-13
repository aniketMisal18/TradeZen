const { AddOrder, GetOrder } = require("../Controller/OrderController");
const { checkAuth } = require("../Middleware/CheckAuth");
const router = require("express").Router();



router.post("/addOrder", checkAuth ,AddOrder );
router.get("/getOrder",checkAuth, GetOrder);
 

module.exports = router;