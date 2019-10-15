const User = require("./../Model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const sendEmail = require('../utility/email');
const crypto = require("crypto");
const signup = function (req, res) {
  // console.log(req.body+" i was here");
  if (req.body.email != undefined && req.body.password != undefined) {
    // console.log("dsjdj")
    var token = createtoken(req.body.email, req.body.username);
    res.cookie("jwt", token, { httpOnly: true });
    var user = User(req.body)
      .save()
      .then(async doc => {
        console.log(doc);
        const url = "http://localhost:3000/me";
        await new Email(doc, url).sendWelcome();
        res.json({
          document: doc,
          token: token
        });
      })
      .catch(err => {
        console.log(err);
        res.status(403).json({
          error: err
        });
      });
  } else {
    res.status(403).json({
      err: "Email or password cannot be empty"
    });
  }
};
const login = async function (req, res) {
  console.log(req.body, "hjhjhjg");
  User.findOne({ email: req.body.email }).then( (doc) => {

    if (!doc) {
      res.status(403).json({
        err: "Enter valid email "
      });
    } else {
      console.log(doc)
      let pass = doc.password;
      let value =  bcrypt.compare(req.body.password, pass);
      // console.log(pass, req.body.password, value)
      if (value) {
        var email = doc.email;
        var username = doc.username;
        var token = createtoken(email, username);
        res.cookie("jwt", token, { httpOnly: true });
        console.log("User logged in");
        res.json({
          status: "user logged in",
          token: token
        });
      } else {
        res.status(403).json({
          err: "Password incorrect"
        });
      }
    }
  });
};
const authorize = async function (req, res, next) {
  // console.log(req.headers.role);
  if (req.headers.role === "admin" || req.headers.role === "RestaurantOwner") {
    console.log("You are authorised");
    next();
  } else {
    res.status(404).send("You are not authorised");
  }
};
const putupdateid = async function (req, res, next) {
  try {
    const token = req.cookies.jwt;
    var data = await jwt.decode(token, "shebangfkboi");
    console.log("the data is");
    console.log(data);
    const user = await User.findOne({ email: data.email });
    console.log(user);
    req.headers.user = user;
    console.log(req.headers.id);
    next();
  } catch (err) {
    console.log(err);
  }
};
const protectroute = async function (req, res, next) {
  try {
    console.log("in protect route");
    // console.log("afjvfjwf");
    // var token = req.headers.authorization.replace("Bearer ", "")||req.cookies.jwt;
    var token = req.cookies.jwt;
    console.log(token);
    // console.log(token);
    var data = await jwt.verify(token, "shebangfkboi");
    // console.log(data);
    var user = await User.findOne({ email: data["email"] });
    if (user === undefined) {
      res.send(401).json({
        err: "Please enter valid details"
      });
    }
    console.log("You are set to go");
    req.headers.role = user.role;
    next();
  } catch (e) {
    res.send(e);
  }
};
function createtoken(email, username) {
  var token = jwt.sign({ email: email, username: username }, "shebangfkboi", {
    expiresIn: "10d"
  });
  return token;
}
function authorise(...args) {
  let roles = args;
  return function (req, res, next) {
    if (roles.includes(req.headers.role)) {
      next();
    } else {
      res.end("User is not authorised");
    }
  };
}
const forgetPassword = async function (req, res) {
  try {
    console.log("fh");
    console.log(req.body)
    console.log(req.protocol + '://' + req.get('host'))
    var email = req.body.email;
    console.log(email);
    if (!email) {
      res.status(404).json({
        status: 'Email invalid'
      });
    }
    else {
      var user = await User.findOne({ email: email });
      console.log(user);
      if (user === undefined) {
        res.status(404).json({ status: "No user of such mail exists" });
      } else {
        // console.log('jhjk');
        const token = user.createresetToken();
        // console.log('egjiwehgiu')
        await user.save({ validateBeforeSave: false });
        // console.log('fhif')
        let message =
          "Your reset token is sent to your email id please send a patch req in order to change your password \n" +
          token;
        //  console.log(message)
        let arrurl = req.url.split('/');
        arrurl.pop();
        console.log(arrurl);
        let url = req.protocol + '://' + req.get('host') + "/api/resetPassword?id=" + user.email + "&token=" + token;
        console.log(url)
        // let url="https://google.com"
        // sendEmail(options);

        console.log('doadad')
        let x = await new sendEmail(user, url).sendForgot();
        console.log(x)
        // sendmail({
        //   receiverid: user.email,
        //   message: message,
        //   subject: "Token is only for 10 minutes"
        // });
        //  console.log('wldfjilwjf')
        res.status(201).json({
          status: 'Email sent'
        });
      }

     }
     } // res.json({token:user.resetToken});

      catch(err) {
        status(404).json({
          status: err
        })}
      }
    
    
    const resetPassword = async function (req, res) {
          try{
            console.log('fheuf')
            let email = req.query.id;
            let token1 = req.query.token;
            let token = crypto
            .createHash("sha256")
            .update(token1)
            .digest("hex");
            console.log(email)
            console.log()
            console.log(token);
            let user = await User.findOne({ email: email });
            console.log(user)
            if(!user) {
          res.status(404).send("User Not Found")
            }
          else {
            if(user.resetToken != token) {
              res.json({
                status: "The token does not match."
              });
            }
    else {
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  console.log(password);
  console.log(confirmPassword)
  if (password != confirmPassword) {
    res.status(404).send("Password Doesn't Match")
  }
  else {
    console.log(user.resetToken);
    console.log(token1)

    let hashToken = crypto.createHash('sha256').update(token1).digest('hex');
    if (user.resetToken != hashToken) {
      res.status(404).json({
        status: '"Token Invalid"'
      })
    }
    else {
      user.password = password;
      user.confirmPassword = confirmPassword;
      console.log("hello")

      console.log(user)
      user.resetToken = undefined;
      user.expiresIn = undefined;
      console.log(user)
      console.log('*************')
      console.log(email)
      console.log('hello')
      // let nuser = await user.updateOne({ 'email': email }, { $set: { 'password': password, 'resetToken': undefined, 'expiresIn': undefined } })
      // let nuser = await user.save()
      await user.save({ validateBeforeSave: false });
      // console.log('*//////////')
      // console.log(nuser)
      console.log('hkfjg')
      res.status(201).json({
        status: "Done"
      })

    }

  }


}
    }

    // console.log(user.resetToken)


  } 
          catch (err) {
            res.status(404).json({

              status: 'Error Occured'
            });
          }
};
const logout = async function (req, res) {
  res.cookie("jwt", "Logged out", {
    expires: new Date(Date.now() * 20),
    httpOnly: true
  });
  res.status(201).json({
    status: "user logged out"
  });
};
const isLoggedin = async function (req, res, next) {
  try {
    console.log("efhuiewfiue");
    console.log(req.cookies);
    if (req.cookies.jwt) {
      var token = req.cookies.jwt;
      console.log(token);
      var decode = await jwt.verify(token, "shebangfkboi");
      if (!decode) {
        return next();
      }
      console.log(decode);
      const user = await User.find({ email: decode.email });
      if (!user) {
        return next();
      }
      req.headers.role = user.role;
      res.locals.user = user;
      return next();
    } else {
      return next();
    }
  } catch (err) {
    // console.log(err);
    next();
  }
};

module.exports = {
  signup,
  login,
  protectroute,
  authorize,
  authorise,
  forgetPassword,
  resetPassword,
  isLoggedin,
  logout,
  putupdateid
}; 
