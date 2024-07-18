const axios = require("axios").default;
const { ethers } = require("ethers");

const parseUrl = (requestURL) => {
  const { type, url, body, header, returnType } = JSON.parse(requestURL);
  return { type, url, body, header, returnType };
};

const isUrlOrJson = (url) => {
  try {
    JSON.parse(url);
    return "JSON";
  } catch (e) {
    try {
      new URL(url);
      return "URL";
    } catch (e) {
      return "";
    }
  }
};

const fetchCustomURL = async (requestURL, name) => {
  const { type, url, body, header, returnType } = parseUrl(requestURL);
  const opt = {
    method: type,
    url,
    headers: header,
    data: body,
  };
  const res = await axios.request(opt);
  return res;
};

const weiToEther = (weiValue) => {
  const ether = weiValue / 1e18;
  return Number(ether.toFixed(4));
};

const decodeUniswapV2Data = (data, returnType) => {
  // Check if data can be converted into a number
  if (typeof data === "number") {
    return Number(data);
  }

  // Check if data is in hex format
  if (typeof data === "string" && data.startsWith("0x")) {
    if (returnType === "hex") {
      // Convert hex to number and return
      return Number(data);
    } else if (returnType === "hexArray") {
      const match = returnType.match(/\[(\d+)\]/);
      const index = match ? parseInt(match[1], 10) : null;
      if (index !== null) {
        const decodedValue = ethers.utils.defaultAbiCoder.decode(
          ["uint256[]"],
          data
        );
        return weiToEther(Number(decodedValue[0][index].toString()));
      }
    }
  }

  // If none of the above conditions are met, return 0
  return 0;
};

module.exports = { fetchCustomURL, decodeUniswapV2Data, parseUrl, isUrlOrJson };
