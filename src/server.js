require("dotenv").config();
const express = require("express");
const cors = require("cors");




// server
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(express.static(__dirname + "/public"));


//router
const router = express.Router();
require("./routes/index.js")(router);
server.use("/", router);



//port
const PORT = process.env.PORT || 5000;

server.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is running on port ${PORT}.`);
});
