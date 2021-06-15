const { Router } = require("express");
const router = Router();
require("dotenv").config();

const {
  getPases,
  countExp,
  countDocs,
  getExpById
} = require("../controllers/index.controller");

router.get("/pases", getPases);
router.get("/exps", countExp);
router.get("/expbyid", getExpById);
router.get("/docs", countDocs);

module.exports = router;
