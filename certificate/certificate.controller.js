import express from "express";
export const router = express.Router();

/* GET home page. */
router
  .get("/", function (req, res) {
    res.render("index", { title: "Express" });
  })

  .get("/", function (req, res) {
    res.render("index", { title: "Express" });
  });
