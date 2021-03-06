const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
var userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate(val) {
      if (!validator.isAlpha(val)) {
        throw new Error("The name should be a string");
      }
    }
  },
  username: {
    type: String,
    trim: true,
    validate(val) {
      if (!validator.isAlpha(val)) {
        throw new Error("The user name should be a string");
      }
    }
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Please enter a valid email");
      }
    }
  },
  phone: {
    type: Number
  },
  description: {
    type: String,
    trim: true,
    required: true,
    validate(val) {
      if (!validator.isAlpha(val)) {
        throw new Error("The plan name should be a string");
      }
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 8
  },
  confirmpassword: {
    type: String,
    required: true,
    validate(val) {
      if (val != this.password) {
        throw new Error("This must be same as the password");
      }
    }
  },
  resetToken: {
    type: String
  },
  expiresIn: {
    type: Date
  }
});
userschema.methods.createresetToken = function() {
  const cryptoToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = crypto
    .createHash("sha256")
    .update(cryptoToken)
    .digest("hex");
  this.expiresIn = Date.now() + 1000 * 60 * 60;

  return cryptoToken;
};
userschema.pre("save", async function(next) {
    console.log("jfhkuqfhwelcome");
  var pass = await bcrypt.hash(this.password, 8);
  this.password = pass;
  this.confirmpassword = undefined;
  console.log('hello')
  next();
});
const User = mongoose.model("user", userschema);
module.exports = User;
