const mainnetJobsData = require("../mainnet/jobs.json");
const testnetJobsData = require("../testnet/jobs.json");
const chai = require("chai");

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
    mainnetJobsData.map((job, index) => {
      expect(Object.keys(job).sort()).to.be.eql(
        requiredKeys,
        `Mainnet Job[${index}] does not match with requiredKeys spec`
      );
    });
    testnetJobsData.map((job, index) => {
      expect(Object.keys(job).sort()).to.be.eql(
        requiredKeys,
        `Testnet Job[${index}] does not match with requiredKeys spec`
      );
    });
  });

  it("Job keys should match with required datatype", () => {
    mainnetJobsData.map((job, index) => {
      Object.keys(job).map((jobKey) => {
        expect(job[jobKey]).to.be.a(
          keysWithType[jobKey],
          `Mainnet Job[${index}][${jobKey}] does match required data type`
        );
      });
    });
    testnetJobsData.map((job, index) => {
        Object.keys(job).map((jobKey) => {
          expect(job[jobKey]).to.be.a(
            keysWithType[jobKey],
            `Testnet Job[${index}][${jobKey}] does match required data type`
          );
        });
      });
  });

  it("Job selectorType must be either 0 or 1", async () => {
    mainnetJobsData.map((job, index) => {
      const { name, selectorType } = job;
      let isSelectorTypeValid = false;

      if (parseInt(selectorType) === 0 || parseInt(selectorType) === 1) {
        isSelectorTypeValid = true;
      }

      expect(isSelectorTypeValid).to.be.eq(
        true,
        `Mainnet Job[${name}] does not have required selector type`
      );
    });
    testnetJobsData.map((job, index) => {
        const { name, selectorType } = job;
        let isSelectorTypeValid = false;
  
        if (parseInt(selectorType) === 0 || parseInt(selectorType) === 1) {
          isSelectorTypeValid = true;
        }
  
        expect(isSelectorTypeValid).to.be.eq(
          true,
          `Testnet Job[${name}] does not have required selector type`
        );
      });
  });

  it("Job weight must be less than 100", async () => {
    mainnetJobsData.map((job, index) => {
      const { name, weight } = job;
      let isWeightValid = weight >= 0 && weight <= 100;

      expect(isWeightValid).to.be.eq(
        true,
        `Mainnet Job[${name}] does not have required weight`
      );
    });
    testnetJobsData.map((job, index) => {
        const { name, weight } = job;
        let isWeightValid = weight >= 0 && weight <= 100;
  
        expect(isWeightValid).to.be.eq(
          true,
          `Testnet Job[${name}] does not have required weight`
        );
      });
  });

  it("Job power must be less than 128", async () => {
    mainnetJobsData.map((job, index) => {
      const { name, power } = job;
      let isPower = power >= -128 && power < 128;

      expect(isPower).to.be.eq(
        true,
        `Mainnet Job[${name}] does not have required power`
      );
    });
    testnetJobsData.map((job, index) => {
        const { name, power } = job;
        let isPower = power >= -128 && power < 128;
  
        expect(isPower).to.be.eq(
          true,
          `Testnet Job[${name}] does not have required power`
        );
      });
  });
});
