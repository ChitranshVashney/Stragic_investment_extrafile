const fs = require("fs");
const { AnkrProvider } = require("@ankr.com/ankr.js");
const riskInfo = require("./riskManage.json");
//https://rpc.ankr.com/polygon/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599

const getTokenInfo = async () => {
  const provider = new AnkrProvider(
    "https://rpc.ankr.com/multichain/09aa865912ef9d73e71b6e338ceccc43b2831d2e923a14b7d5e3a452d5752a2a"
  );

  const currencyy = await provider.getCurrencies({
    blockchain: "eth",
  });
  let currency = currencyy.currencies;

  const convertedData = {};
  let lowReturnMR = [];
  let lowReturnLR = [];
  let highReturnHR = [];
  let highReturnMR = [];
  let highReturnLR = [];
  currency.forEach((item) => {
    const { address, blockchain, name, decimals, symbol, thumbnail } = item;
    convertedData[address] = {
      blockchain,
      name,
      decimals,
      symbol,
      thumbnail,
    };
  });
  let a = 0;

  for (i in riskInfo) {
    let otherData = convertedData[riskInfo[i].address];
    riskInfo[i].symbol = otherData.symbol;
    riskInfo[i].name = otherData.name;
    riskInfo[i].decimals = otherData.decimals;
    riskInfo[i].thumbnail = otherData.thumbnail;
    // let time = Date.now();
    // time = Math.floor(time / 1000);
    // const price = await provider.getTokenPriceHistory({
    //   blockchain: "eth",
    //   contractAddress: riskInfo[i].address,
    //   fromTimestamp: time - 300,
    //   interval: 86400, // 24h
    //   limit: 1,
    // });
    // console.log(price.quotes[0].usdPrice);
    if (
      riskInfo[i].Return_Category === "High Return" &&
      riskInfo[i].Risk_Category === "High Risk"
    ) {
      highReturnHR.push(riskInfo[i]);
    }
    if (
      riskInfo[i].Return_Category === "High Return" &&
      riskInfo[i].Risk_Category === "Low Risk"
    ) {
      highReturnLR.push(riskInfo[i]);
    }
    if (
      riskInfo[i].Return_Category === "High Return" &&
      riskInfo[i].Risk_Category === "Medium Risk"
    ) {
      highReturnMR.push(riskInfo[i]);
    }

    if (
      riskInfo[i].Return_Category === "Low Return" &&
      riskInfo[i].Risk_Category === "Low Risk"
    ) {
      lowReturnLR.push(riskInfo[i]);
    }
    if (
      riskInfo[i].Return_Category === "Low Return" &&
      riskInfo[i].Risk_Category === "Medium Risk"
    ) {
      lowReturnMR.push(riskInfo[i]);
    }
  }
  console.log(
    lowReturnMR.length,
    lowReturnLR.length,
    highReturnHR.length,
    highReturnMR.length,
    highReturnLR.length
  );
  console.log(riskInfo.length);

  // Convert the array to a JSON string
  // const jsonString1 = JSON.stringify(lowReturnMR, null, 2);
  // const filePath1 = "lowReturnMR.json";
  // fs.writeFileSync(filePath1, jsonString1);

  // const jsonString2 = JSON.stringify(lowReturnLR, null, 2);
  // const filePath2 = "lowReturnLR.json";
  // fs.writeFileSync(filePath2, jsonString2);

  // const jsonString3 = JSON.stringify(highReturnHR, null, 2);
  // const filePath3 = "highReturnHR.json";
  // fs.writeFileSync(filePath3, jsonString3);

  // const jsonString4 = JSON.stringify(highReturnMR, null, 2);
  // const filePath4 = "highReturnMR.json";
  // fs.writeFileSync(filePath4, jsonString4);

  // const jsonString5 = JSON.stringify(highReturnLR, null, 2);
  // const filePath5 = "highReturnLR.json";
  // fs.writeFileSync(filePath5, jsonString5);

  const jsonString5 = JSON.stringify(riskInfo, null, 2);
  const filePath5 = "allToken.json";
  fs.writeFileSync(filePath5, jsonString5);
};
getTokenInfo();
