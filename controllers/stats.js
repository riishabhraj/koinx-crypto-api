const Crypto = require("../models/crypto.js");

const getCoinDetails = async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: "Please specify a coin." });
  }

  try {
    const data = await Crypto.findOne({ symbol: coin }).sort({ date: -1 });
    if (!data) {
      return res.status(404).json({ error: "Coin not found." });
    }

    res.json(data);
  } catch (error) {
    console.error("Error in /stats endpoint:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getCoinDetails };
