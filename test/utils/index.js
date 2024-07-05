const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SLEEP_TIME = 500;

module.exports = { sleep, SLEEP_TIME };
