const chai = require("chai");
const chaiHttp = require("chai-http");
const collectionsData = require("../collections.json");
const jobsData = require("../jobs.json");
chai.use(chaiHttp);
const { expect } = chai;
const _ = require("lodash");
const axios = require("axios").default;
const jsdom = require("jsdom");
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
     const tableData = [];
  it("Collections should have required keys", () => {
    collectionsData.map((col, index) => {
      expect(Object.keys(col).sort()).to.be.eql(
        requiredCollectionKeys,
        `Collection[${index}] does not match with required keys spec`
      );
    });
  });

  it("Collection keys should match with required datatype", () => {
    collectionsData.map((col, index) => {
      Object.keys(col).map((colKey) => {
        expect(col[colKey]).to.be.a(
          collectionKeysWithType[colKey],
          `Collection[${index}][${colKey}] does match required data type`
        );
      });
    });
  });

  it("Collection jobIDs length should be greater than 0", () => {
    collectionsData.map((col) => {
      const { jobIDs } = col;
      expect(jobIDs).to.be.instanceof(Array);
      expect(jobIDs).to.have.length.above(0);
    });
  });

  it("Collection jobIDs should be number", () => {
    collectionsData.map((col, index) => {
      const { jobIDs } = col;
      const isValid = jobIDs.every((ele) => typeof ele === "number");
      expect(isValid).to.be.eq(
        true,
        `Collection[${index}] jobIDs should be number`
      );
    });
  });

    it("Collection jobIDs should send OK response ", async () => {
            await Promise.all(
                collectionsData.map(async (col) => {
                    const { jobIDs } = col;
                    jobIDs.every(async (ele) => {
                    const { url, name } =  jobsData[ele - 1];
                    const res = await chai.request(url).get("");
                    expect(res.status).to.be.equal(
                        200,
                        `Job(${name}) url should send OK response`
                    );
                    });
                })
            );
        });

        it("Collection JSON jobIDs should have required selectors ", async () => {
            await Promise.all(
                collectionsData.map(async (col) => {
                    const { jobIDs } = col;
                    jobIDs.every(async (ele) => {
                        const { url, name, selectorType, selector } =  jobsData[ele - 1];
                        //JSON
                        if(selectorType === 0) {
                            const res = await chai.request(url).get("");
                            const result = _.get(res.body, selector);
                            expect(isNaN(result)).to.be.eq(
                                false,
                                `Job[${name}] does not have required selector`
                            );
                            tableData.push({ job: name, result });
                        }
                    });
                })
            );
        });

        it("Collection XHTML jobIDs should have required selectors ", async () => {
            await Promise.all(
                collectionsData.map(async (col) => {
                    const { jobIDs } = col;
                    jobIDs.every(async (ele) => {
                        const { url, name, selectorType, selector } =  jobsData[ele - 1];
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
                              `Job[${name}] does not have numeric result`
                            );
                            tableData.push({ job: name, result: trimResult });
                          }
                    });
                })
            );
        });
        
        
        after(() => console.table(tableData));
    });
