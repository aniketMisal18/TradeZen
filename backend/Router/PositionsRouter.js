const { AddPosition, GetPosition } = require("../Controller/PositionsController");
const { checkAuth } = require("../Middleware/CheckAuth");
const router = require("express").Router();



router.post("/addPosition", checkAuth ,AddPosition );
router.get("/getPosition",checkAuth, GetPosition);
 

module.exports = router;