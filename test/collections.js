const chai = require("chai");
const chaiHttp = require("chai-http");
const testnetCollectionsData = require("../testnet/collections.json");
const testnetJobsData = require("../testnet/jobs.json");
const mainnetCollectionsData = require("../mainnet/collections.json");
const mainnetJobsData = require("../mainnet/jobs.json");
chai.use(chaiHttp);
const { expect } = chai;
const _ = require("lodash");
const axios = require("axios").default;
const jsdom = require("jsdom");
const {
  parseUrl,
  fetchCustomURL,
  decodeUniswapV2Data,
  isUrlOrJson,
} = require("./utils/request");
const { sleep, SLEEP_TIME } = require("./utils");
const { JSDOM } = jsdom;

const collectionKeysWithType = {
  jobIDs: "array",
  aggregationMethod: "number",
  power: "number",
  name: "string",
  tolerance: "number",
};

const requiredCollectionKeys = Object.keys(collectionKeysWithType).sort();

describe("Collections test", () => {
  const testnetTableData = [];
  const mainnetTableData = [];
  it("Collections should have required keys", () => {
    testnetCollectionsData.map((col, index) => {
      expect(Object.keys(col).sort()).to.be.eql(
        requiredCollectionKeys,
        `Testnet Collection[${index}] does not match with required keys spec`
      );
    });
    mainnetCollectionsData.map((col, index) => {
      expect(Object.keys(col).sort()).to.be.eql(
        requiredCollectionKeys,
        `Mainnet Collection[${index}] does not match with required keys spec`
      );
    });
  });

  it("Collection keys should match with required datatype", () => {
    testnetCollectionsData.map((col, index) => {
      Object.keys(col).map((colKey) => {
        expect(col[colKey]).to.be.a(
          collectionKeysWithType[colKey],
          `Testnet Collection[${index}][${colKey}] does match required data type`
        );
      });
    });
    mainnetCollectionsData.map((col, index) => {
      Object.keys(col).map((colKey) => {
        expect(col[colKey]).to.be.a(
          collectionKeysWithType[colKey],
          `Mainnet Collection[${index}][${colKey}] does match required data type`
        );
      });
    });
  });

  it("Collection jobIDs length should be greater than 0", () => {
    testnetCollectionsData.map((col) => {
      const { jobIDs } = col;
      expect(jobIDs).to.be.instanceof(Array);
      expect(jobIDs).to.have.length.above(0);
    });
    mainnetCollectionsData.map((col) => {
      const { jobIDs } = col;
      expect(jobIDs).to.be.instanceof(Array);
      expect(jobIDs).to.have.length.above(0);
    });
  });

  it("Collection jobIDs should be number", () => {
    testnetCollectionsData.map((col, index) => {
      const { jobIDs } = col;
      const isValid = jobIDs.every((ele) => typeof ele === "number");
      expect(isValid).to.be.eq(
        true,
        `Testnet Collection[${index}] jobIDs should be number`
      );
    });
    mainnetCollectionsData.map((col, index) => {
      const { jobIDs } = col;
      const isValid = jobIDs.every((ele) => typeof ele === "number");
      expect(isValid).to.be.eq(
        true,
        `Mainnet Collection[${index}] jobIDs should be number`
      );
    });
  });

  it("Collection jobIDs should send OK response ", async () => {
    for (const col of testnetCollectionsData) {
      const { jobIDs } = col;
      for (const ele of jobIDs) {
        const { url, name } = testnetJobsData[ele - 1];
        // * Check if URL is URL or JSON

        if (isUrlOrJson(url) === "JSON") {
          const res = await fetchCustomURL(url, name);
          expect(res.status).to.be.equal(
            200,
            `Testnet Job(${name}) url should send OK response`
          );
        } else if (isUrlOrJson(url) === "URL") {
          const res = await chai.request(url).get("").timeout(10000);
          expect(res.status).to.be.equal(
            200,
            `Testnet Job(${name}) url should send OK response`
          );
        } else {
          console.error("Invalid URL:", url);
        }

        await sleep(SLEEP_TIME);
      }
    }

    for (const col of mainnetCollectionsData) {
      const { jobIDs } = col;
      for (const ele of jobIDs) {
        const { url, name } = mainnetJobsData[ele - 1];
        if (isUrlOrJson(url) === "JSON") {
          const res = await fetchCustomURL(url, name);
          expect(res.status).to.be.equal(
            200,
            `Mainnet Job(${name}) url should send OK response`
          );
        } else if (isUrlOrJson(url) === "URL") {
          const res = await chai.request(url).get("").timeout(10000);
          expect(res.status).to.be.equal(
            200,
            `Mainnet Job(${name}) url should send OK response`
          );
        } else {
          console.error("Invalid URL:", url);
        }
        await sleep(SLEEP_TIME);
      }
    }
  }).timeout(4 * 60 * 1000);

  it("Collection JSON jobIDs should have required selectors ", async () => {
    for (const col of testnetCollectionsData) {
      const { jobIDs } = col;
      for (const ele of jobIDs) {
        const { url, name, selectorType, selector } = testnetJobsData[ele - 1];

        //JSON
        if (selectorType === 0) {
          if (isUrlOrJson(url) === "JSON") {
            const { returnType } = parseUrl(url);
            const res = await fetchCustomURL(url, name);
            const result = decodeUniswapV2Data(res.data.result, returnType);
            expect(isNaN(result)).to.be.eq(
              false,
              `Testnet Job[${name}] does not have required selector`
            );
            testnetTableData.push({
              job: name,
              result,
            });
          } else if (isUrlOrJson(url) === "URL") {
            const res = await chai.request(url).get("").timeout(10000);
            const result = _.get(res.body, selector);
            expect(isNaN(result)).to.be.eq(
              false,
              `Testnet Job[${name}] does not have required selector`
            );
            testnetTableData.push({
              job: name,
              result,
            });
          } else {
            console.error("Invalid URL:", url);
          }
        }

        await sleep(SLEEP_TIME);
      }
    }

    for (const col of mainnetCollectionsData) {
      const { jobIDs } = col;
      for (const ele of jobIDs) {
        const { url, name, selectorType, selector } = mainnetJobsData[ele - 1];

        //JSON
        if (selectorType === 0) {
          if (isUrlOrJson(url) === "JSON") {
            const { returnType } = parseUrl(url);
            const res = await fetchCustomURL(url, name);
            const result = decodeUniswapV2Data(res.data.result, returnType);
            expect(isNaN(result)).to.be.eq(
              false,
              `Mainnet Job[${name}] does not have required selector`
            );
            mainnetTableData.push({
              job: name,
              result,
            });
          } else if (isUrlOrJson(url) === "URL") {
            const res = await chai.request(url).get("").timeout(10000);
            const result = _.get(res.body, selector);
            expect(isNaN(result)).to.be.eq(
              false,
              `Mainnet Job[${name}] does not have required selector`
            );
            mainnetTableData.push({
              job: name,
              result,
            });
          } else {
            console.error("Invalid URL:", url);
          }
        }

        await sleep(SLEEP_TIME);
      }
    }
  }).timeout(4 * 60 * 1000);

  it("Collection XHTML jobIDs should have required selectors ", async () => {
    await Promise.all(
      testnetCollectionsData.map(async (col) => {
        const { jobIDs } = col;
        await Promise.all(
          jobIDs.map(async (ele) => {
            const { url, name, selectorType, selector } =
              testnetJobsData[ele - 1];
            //XHTML
            if (selectorType === 1) {
              const res = await axios.get(url, {
                headers: {
                  "Content-Type": "application/xml; charset=utf-8",
                },
              });

              const dom = new JSDOM(res.data);
              const parser = new dom.window.DOMParser();
              const doc = parser.parseFromString(res.data, "text/html");
              const result = dom.window.document.evaluate(
                selector,
                doc,
                null,
                dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;

              expect(result).to.not.equal(
                null,
                `Job[${name}] result content is null`
              );

              const trimResult = result
                ? result.textContent.replace(/[, $]+/g, "")
                : undefined;
              expect(isNaN(trimResult)).to.be.eq(
                false,
                `Testnet Job[${name}] does not have numeric result`
              );
              testnetTableData.push({
                job: name,
                result: trimResult,
              });
            }
          })
        );
      }),
      mainnetCollectionsData.map(async (col) => {
        const { jobIDs } = col;
        await Promise.all(
          jobIDs.map(async (ele) => {
            const { url, name, selectorType, selector } =
              mainnetJobsData[ele - 1];
            //XHTML
            if (selectorType === 1) {
              const res = await axios.get(url, {
                headers: {
                  "Content-Type": "application/xml; charset=utf-8",
                },
              });

              const dom = new JSDOM(res.data);
              const parser = new dom.window.DOMParser();
              const doc = parser.parseFromString(res.data, "text/html");
              const result = dom.window.document.evaluate(
                selector,
                doc,
                null,
                dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;

              expect(result).to.not.equal(
                null,
                `Job[${name}] result content is null`
              );

              const trimResult = result
                ? result.textContent.replace(/[, $]+/g, "")
                : undefined;
              expect(isNaN(trimResult)).to.be.eq(
                false,
                `Mainnet Job[${name}] does not have numeric result`
              );
              mainnetTableData.push({
                job: name,
                result: trimResult,
              });
            }
          })
        );
      })
    );
  });

  after(() => {
    console.log("Testnet Results");
    console.table(testnetTableData);
    console.log("Mainnet Results");
    console.table(mainnetTableData);
  });
});
