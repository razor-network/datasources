const axios = require("axios").default;
const { ethers } = require("ethers");

const parseUrl = (requestURL) => {
  const { type, url, body, header, returnType } = JSON.parse(requestURL);
  return { type, url, body, header, returnType };
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
  const match = returnType.match(/\[(\d+)\]/);
  const index = match ? parseInt(match[1], 10) : null;
  if (index) {
    const decodedValue = ethers.utils.defaultAbiCoder.decode(
      ["uint256[]"],
      data
    );

    return weiToEther(Number(decodedValue[0][index].toString()));
  }
  return 0;
};

module.exports = { fetchCustomURL, decodeUniswapV2Data, parseUrl };
