const express = require("express");
const router = express.Router();
const { getCoinDeviation } = require("../controllers/deviation.js");

router.route("/").get(getCoinDeviation);

module.exports = router;
