const router = require("express").Router();
const { checkAuth } = require("../Middleware/CheckAuth");
const {UpdateWatchlist} = require("../Controller/UserController")




router.put("/updateWatchlist",checkAuth, UpdateWatchlist);


module.exports = router;