const expect = require("chai").expect;
const feedController = require("../controllers/feed");
const sinon = require("sinon");
const User = require("../models/user");
const mongoose = require("mongoose");

describe("Feed controller", function () {
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

  it("should add created post to posts of creator", function (done) {
    const req = {
      body: {
        title: "test post",
        content: "a test post",
      },
      file: {
        path: "abc",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = { status: function () {}, json: function () {} };

    feedController
      .createPost(req, res, () => {})
      .then((savedUser) => {
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);
        done();
      });
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
