const express = require("express");
const router = express.Router();
const { getCoinDetails } = require("../controllers/stats.js");

router.route("/").get(getCoinDetails);

module.exports = router;
