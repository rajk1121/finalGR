const mongoose = require("mongoose");
const express = require("express");
const app = require("./app.js");
const cookieParser = require('cookie-parser');
const fs = require("fs");
const str = fs.readFileSync("./template/index.html").toString();
const propRouter = require("./Router/property");


const reviewrouter = require("./Router/reviewcrouter");
const agentrouter = require("./Router/agentcRouter");
const viewrouter = require("./Router/viewRouter");
const userRouter = require("./Router/userRouter")
const DB =
  "mongodb+srv://rajk1121:Rajat1121@cluster0-chamy.mongodb.net/test?retryWrites=true&w=majority";
const port = process.env.PORT || 80;
mongoose
  .connect(DB, {
    useNewUrlParser: true
  })
  .then(conn => {
    console.log("Connnected to DataBase");
  });
// app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "pug");
app.set("views", "template2");
app.get(["/home", "/"], (req, res) => {
  res.send(str);
});

app.use("/rcard", reviewrouter);
app.use("/property-grid", propRouter);
app.use("/acard", agentrouter);
app.use("/user", userRouter);
app.use("/api", viewrouter);

// app.use('/about' , agentrouter );
app.listen(port);
