const express = require("express");
const router = express.Router();

let paragraphs = require("../database.js");

router.get("/list", async (req, res) => {
    try {
      res.status(200).json({
        data: paragraphs
      });
    } catch (err) {
      res.status(400).json({
        message: "Some error occured",
        err
      });
    }
  });

router.get("/list/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    try {
      let paragraph = paragraphs.find(paragraph => paragraph._id === id);
      res.status(200).json({
        data: paragraph
      });
    } catch (err) {
      res.status(400).json({
        message: "Some error occured",
        err
      });
    }
  });

module.exports = router;