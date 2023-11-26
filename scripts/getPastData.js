const { AnkrProvider } = require("@ankr.com/ankr.js");
const { error } = require("console");
const fs = require("fs");
//https://rpc.ankr.com/polygon/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599

const getPrice = async () => {
  const provider = new AnkrProvider(
    "https://rpc.ankr.com/multichain/09aa865912ef9d73e71b6e338ceccc43b2831d2e923a14b7d5e3a452d5752a2a"
  );
  const allToken = await provider.getCurrencies({ blockchain: "eth" });

  let allDetail = [];
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  for (let i in allToken.currencies) {
    try {
      console.log(i);
      let eth = await provider.getTokenPriceHistory({
        blockchain: "eth",
        contractAddress: allToken.currencies[i].address,
        fromTimestamp: 0,
        interval: 86400, // 24h
        limit: 337,
      });
      let tokenDetail = {};
      let prices = eth.quotes.map((entry) => entry.usdPrice);
      tokenDetail[allToken.currencies[i].address] = prices;
      tokenDetail["name"] = allToken.currencies[i].name;
      allDetail.push(tokenDetail);
      await delay(1000);
    } catch (e) {
      continue;
    }
  }
  console.log(allDetail);
  // Extract unique addresses
  const addresses = Array.from(
    new Set(
      allDetail.flatMap((entry) =>
        Object.keys(entry).filter((key) => key !== "name")
      )
    )
  );

  // Create CSV header
  const csvHeader =
    "name,address," +
    addresses.map((address, index) => `day-${index + 1}`).join(",") +
    "\n";

  // Create CSV rows
  const csvRows = allDetail.map((entry) => {
    const name = entry.name;
    const address = Object.keys(entry).find((key) => key !== "name");
    const prices = entry[address].map((price) => `'${price}'`).join(",");
    return `${name},${address},${prices}`;
  });

  // Combine header and rows
  const csvContent = csvHeader + csvRows.join("\n");

  // Write the CSV string to a file
  fs.writeFileSync("output.csv", csvContent);

  console.log("CSV file created successfully.");
};
getPrice();
