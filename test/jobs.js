//! Replace jobsData.json -> jobs.json before merging to master
const jobsData = require("../jobs.json");
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
});
