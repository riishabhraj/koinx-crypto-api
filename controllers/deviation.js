const Crypto = require("../models/crypto.js");

const getCoinDeviation = async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: "Please specify a coin." });
  }

  try {
    const records = await Crypto.find({ symbol: coin })
      .sort({ date: -1 })
      .limit(100);

    if (records.length === 0) {
      return res.status(404).json({ error: "No records found for this coin." });
    }

    const prices = records.map((record) => record.price);

    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    const variance =
      prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) /
      prices.length;

    const deviation = Math.sqrt(variance);

    res.json({ deviation: deviation.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getCoinDeviation };
