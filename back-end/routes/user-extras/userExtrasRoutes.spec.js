const request = require("supertest");
const server = require("../../api/server");
const db = require("../../data/dbConfig");


describe("environment", () => {
  it("environment should be testing", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});
