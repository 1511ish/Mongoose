const express = require('express');

const router = express.Router();

const expenseController = require('../contoller/expense');
const userAuthentication = require('../middleware/auth');

router.post('/add-expense', userAuthentication.authenticate, expenseController.addExpense);
router.get('/get-expenses', userAuthentication.authenticate,expenseController.getExpenses);

// --------------------y wala portion phele se hi commented tha---------------------
// router.get('/get-expensesById',expenseController.getExpensesById);
// router.get('/get-expenses-byDate/:date', userAuthentication.authenticate, expenseController.getDailyExpenses);
// router.get('/get-expenses-byMonth/:month', userAuthentication.authenticate, expenseController.getMonthlyExpenses);
// --------------------y wala portion phele se hi commented tha---------------------


router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

module.exports = router;