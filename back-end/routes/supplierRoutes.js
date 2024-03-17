const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/supplierController');

router.get('/', suppliersController.getAllSuppliers);
router.post('/', suppliersController.addSupplier);
router.get('/:id', suppliersController.getSupplierById);
router.put('/:id', suppliersController.updateSupplier);
router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;
