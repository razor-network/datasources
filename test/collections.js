const chai = require("chai");

const collectionsData = require("../collections.json");

const { expect } = chai;

const collectionKeysWithType = {
  jobIDs: "array",
  aggregationMethod: "number",
  power: "number",
  name: "string",
  tolerance: "number",
};

const requiredCollectionKeys = Object.keys(collectionKeysWithType).sort();

describe("Collections test", () => {
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
});
