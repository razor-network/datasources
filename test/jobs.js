//! Replace jobsData.json -> jobs.json before merging to master
const jobsData = require("../jobsData.json");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const { expect } = chai;

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

  it("Job url should send OK response", async () => {
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
});
