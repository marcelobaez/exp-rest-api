const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use(require("./routes/index"));

app.listen(4000);
console.log("Server listening on port 4000");
