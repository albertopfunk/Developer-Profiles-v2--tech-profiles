const request = require("supertest");
const server = require("./server");

describe("server", () => {
  describe("GET /", () => {
    it("responds with 200 OK", async () => {
      await request(server).get("/hello").expect(200);
    });

    it("Content-Type should be json", async () => {
      await request(server).get("/hello").expect("Content-Type", /json/i);
    });

    it("Should match the expected object", async (done) => {
      const expectedBody = { api: "up and running" };
      const response = await request(server).get("/hello");
      expect(response.body).toEqual(expectedBody);
      done();
    });
  });
});
