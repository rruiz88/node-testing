const expect = require("chai").expect;
const authController = require("../controllers/auth");
const sinon = require("sinon");
const User = require("../models/user");
const mongoose = require("mongoose");

describe("Auth controller - Login", function () {
  before(function (done) {
    mongoose
      .connect(
        `mongodb+srv://rruiz88:029513Ac@cluster0.mxgipbq.mongodb.net/node-testing?retryWrites=true&w=majority`
      )
      .then((result) => {
        const user = new User({
          email: "testing@test.com",
          password: "tester",
          name: "Test1",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  this.beforeEach(function () {});
  // testing async function

  it("should send a response with a valid user status for an existing user", function (done) {
    const req = { userId: "5c0f66b979af55031b34728a" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    authController
      .getUserStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I am new!");
        done();
        // remove test User
      })
      .then(() => {
        done();
      });
  });

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

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
