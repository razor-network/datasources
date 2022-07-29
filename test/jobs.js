//! Replace jobsData.json -> jobs.json before merging to master
const jobsData = require("../jobsData.json");
const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const axios = require("axios").default;
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
  const tableData = [];

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

  it("Job selectorType must be either 0 or 1", async () => {
    jobsData.map((job, index) => {
      const { name, selectorType } = job;
      let isSelectorTypeValid = false;

      if (parseInt(selectorType) === 0 || parseInt(selectorType) === 1) {
        isSelectorTypeValid = true;
      }

      expect(isSelectorTypeValid).to.be.eq(
        true,
        `Job[${name}] does not have required selector type`
      );
    });
  });

  it("Job weight must be less than 100", async () => {
    jobsData.map((job, index) => {
      const { name, weight } = job;
      let isWeightValid = weight >= 0 && weight <= 100;

      expect(isWeightValid).to.be.eq(
        true,
        `Job[${name}] does not have required weight`
      );
    });
  });

  it("Job power must be less than 128", async () => {
    jobsData.map((job, index) => {
      const { name, power } = job;
      let isPower = power >= -128 && power < 128;

      expect(isPower).to.be.eq(
        true,
        `Job[${name}] does not have required power`
      );
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

  it("JSON jobs should have required selector", async () => {
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

          tableData.push({ job: name, result });
        }
      })
    );
  });

  it("XHTML jobs should have required selector", async () => {
    await Promise.all(
      jobsData.map(async (job, index) => {
        const { selectorType, url, name, selector } = job;

        // XHTML
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
      })
    );
  });

  after(() => console.table(tableData));
});
