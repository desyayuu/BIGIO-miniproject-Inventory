const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

router.get('/', transactionsController.getAllTransactions);
router.post('/', transactionsController.addTransaction);
router.get('/:id', transactionsController.getTransactionById);
router.put('/:id', transactionsController.editTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

module.exports = router;
