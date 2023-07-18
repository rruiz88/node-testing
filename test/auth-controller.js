const expect = require("chai").expect;
const authController = require("../controllers/auth");
const sinon = require("sinon");
const User = require("../models/user");

describe("Auth controller - Login", function () {
  // testing async function
  it("should throw error(500) if access to db fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "testing",
      },
    };

    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      });

    User.findOne.restore();
  });
});
