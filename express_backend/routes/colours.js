const express = require("express");
const router = express.Router();

let colours = require("../database.js");

router.get("/list", async (req, res) => {
  try {
    res.send(colours);
  } catch (err) {
    res.status(400).send({
      message: "Some error occured",
      err
    });
  }
});

router.get("/list/:id", async (req, res, next) => {
  let id;
  try {
    // parse id
    id = Number(req.params.id);
  } catch (err) {
    // input is invalid if the above fails
    return res.sendStatus(400);
  }

  try {
    // find colour
    let colour = colours.find(colour => colour._id === id);
    // if found send the text, else send 404
    if (colour) {
      res.send(colour.colour);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    // we did something wrong
    next(err);
  }
});

module.exports = router;
