
const router = require("express").Router();

const { getAccount,addFunds,  withdrawFunds,} = require("../Controller/AccountController");

const { checkAuth } = require("../Middleware/CheckAuth");


router.get("/", checkAuth, getAccount);

router.post("/add-funds", checkAuth, addFunds);

router.post("/withdraw-funds", checkAuth, withdrawFunds);


module.exports = router;