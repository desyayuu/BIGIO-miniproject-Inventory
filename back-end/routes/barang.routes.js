const express = require("express");
const router = express.Router(); // Buat objek router dari Express

const barangs = require("../controllers/barang.controller.js");

// Tambahkan rute menggunakan objek router
router.post("/", barangs.create);
router.get("/", barangs.findAll);
router.get("/:id", barangs.findOne);
router.put("/:id", barangs.update);
router.delete("/:id", barangs.delete); 

// Ekspor objek router
module.exports = router;
