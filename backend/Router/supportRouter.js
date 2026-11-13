
const router = require("express").Router();

const { createSupport } = require("../Controller/supportController");


router.post("/create", createSupport);

module.exports = router;
