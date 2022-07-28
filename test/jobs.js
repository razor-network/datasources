//! Replace jobsData.json -> jobs.json before merging to master
const jobsData = require("../jobsData.json");
const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const axios = require("axios").default;
const DOMParser = require("dom-parser");
const jsdom = require("jsdom");

chai.use(chaiHttp);
const { expect } = chai;
const { JSDOM } = jsdom;

const keysWithType = {
  weight: "number",
  power: "number",
  selectorType: "number",
  name: "string",
  selector: "string",
  url: "string",
};

const requiredKeys = Object.keys(keysWithType).sort();

describe("Jobs test", () => {
  it("Job should have required keys", () => {
    jobsData.map((job, index) => {
      expect(Object.keys(job).sort()).to.be.eql(
        requiredKeys,
        `Job[${index}] does not match with requiredKeys spec`
      );
    });
  });

  it("Job keys should match with required datatype", () => {
    jobsData.map((job, index) => {
      Object.keys(job).map((jobKey) => {
        expect(job[jobKey]).to.be.a(
          keysWithType[jobKey],
          `Job[${index}][${jobKey}] does match required data type`
        );
      });
    });
  });

  it("Job URL should send OK response", async () => {
    await Promise.all(
      jobsData.map(async (job, index) => {
        const { url, name } = job;

        const res = await chai.request(url).get("");
        expect(res.status).to.be.equal(
          200,
          `Job(${name}) url should send OK response`
        );
      })
    );
  });

  it("Job selector should be present in URL response", async () => {
    await Promise.all(
      jobsData.map(async (job, index) => {
        const { selectorType, url, name, selector } = job;

        // JSON
        if (selectorType === 0) {
          const res = await chai.request(url).get("");
          const result = _.get(res.body, selector);
          expect(isNaN(result)).to.be.eq(
            false,
            `Job[${name}] does not have required selector`
          );
        } else if (selectorType === 1) {
          const res = await axios.get(url, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
            },
          });
          const parser = new DOMParser();
          const doc = parser.parseFromString(res.data, "text/html");
          const dom = new JSDOM(res.data);
          const result = dom.window.document.evaluate(
            selector,
            doc,
            null,
            dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          console.log(result);
        }
      })
    );
  });
});
