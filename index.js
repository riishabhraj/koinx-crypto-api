const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const mongoose = require("./config/db.js");
const Crypto = require("./models/crypto.js");
const statsRoute = require("./routes/stats.js");
const deviationRoute = require("./routes/deviation.js");

const app = express();
const PORT = 3000;

app.use(express.json());

async function fetchData() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd&include_market_cap=true&include_24hr_change=true"
    );
    const data = response.data;

    const cryptos = [
      {
        name: "Bitcoin",
        symbol: "bitcoin",
        price: data.bitcoin.usd,
        marketCap: data.bitcoin.usd_market_cap,
        change24h: data.bitcoin.usd_24h_change,
        date: new Date(),
      },
      {
        name: "Ethereum",
        symbol: "ethereum",
        price: data.ethereum.usd,
        marketCap: data.ethereum.usd_market_cap,
        change24h: data.ethereum.usd_24h_change,
        date: new Date(),
      },
      {
        name: "Matic",
        symbol: "matic-network",
        price: data["matic-network"].usd,
        marketCap: data["matic-network"].usd_market_cap,
        change24h: data["matic-network"].usd_24h_change,
        date: new Date(),
      },
    ];

    for (const crypto of cryptos) {
      try {
        const newCrypto = new Crypto(crypto);
        const savedCrypto = await newCrypto.save();
      } catch (saveError) {
        console.error(`Error saving ${crypto.name} data:`, saveError);
      }
    }
  } catch (error) {
    console.error("Error in fetchData:", error);
    if (error.response) {
      console.error("API Response Error:", error.response.data);
    }
  }
}

fetchData().catch(console.error);

cron.schedule("0 */2 * * *", () => {
  fetchData().catch(console.error);
});

app.use("/stats", statsRoute);
app.use("/deviation", deviationRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
