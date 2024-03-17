const express = require('express');
const router = express.Router();
const barangsController = require('../controllers/barangController');

router.get('/', barangsController.getAllBarangs);
router.post('/', barangsController.addBarang);
router.get('/:id', barangsController.getBarangById);
router.put('/:id', barangsController.updateBarang);
router.delete('/:id', barangsController.deleteBarang);

module.exports = router;
