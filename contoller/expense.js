
const Expense = require('../models/Expense');
const sequelize = require('../util/database');
// const Awsservice = require('../services/awsservices');
require('dotenv').config();

let userId;

exports.addExpense = async (req, res, next) => {
    try {
        const user = req.user;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const date = new Date().toISOString().split('T')[0];
        console.log(date);
        

        const expense = new Expense({ amount: amount, description: description, category: category, userId: user , date: date});
        expense.save()
            .then(result => {
                user.totalexpenses = user.totalexpenses + parseInt(amount)
                user.save()
            })
            .then(result2 => {
                res.status(201).json({ newExpenseDetail: ""});
                console.log('SUCCESSFULLY ADDED');
            })
            .catch(err => {
                console.log(err);
                // res.send(500).json({message:'Integernal server error'});
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err })
    }
}


exports.getExpenses = (req, res, next) => {
    const page = parseInt(req.query.page);
    let ITEMS_PER_PAGE = parseInt(req.query.pageSize);
    const offset = (page - 1) * 5;

    let totalItems;
    Expense.countDocuments({ "userId": req.user._id })
        .then((total) => {
            totalItems = total;
            return Expense.find({ "userId": req.user._id }).skip(offset).limit(ITEMS_PER_PAGE);
        })
        .then((expenses) => {
            res.status(200).json({
                allExpenses: expenses,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })

    // Expense.count({ where: { userId: req.userId } })
    //     .then((total) => {
    //         totalItems = total;
    //         return Expense.findAll({
    //             where: { userId: req.userId },
    //             limit: ITEMS_PER_PAGE,
    //             offset: (page - 1) * ITEMS_PER_PAGE,
    //             attributes: [
    //                 'id',
    //                 'expense_amount',
    //                 'description',
    //                 'category',
    //                 [sequelize.literal("DATE_FORMAT(updatedAt, '%d-%m-%Y')"), 'date']
    //             ]
    //         })
    //     })
    //     .then((expenses) => {
    //         res.status(200).json({
    //             allExpenses: expenses,
    //             currentPage: page,
    //             hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    //             nextPage: page + 1,
    //             hasPreviousPage: page > 1,
    //             previousPage: page - 1,
    //             lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    //         })
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.status(500).json({ error: err });
    //     })
}


exports.deleteExpense = async (req, res, next) => {
    try {
        const user = req.user;
        const expenseId = req.params.id;
        const expense = await Expense.findById(expenseId);
        const amount = expense.amount;

        user.totalexpenses = user.totalexpenses - parseInt(amount);
        user.save()
            .then(result => {
                return Expense.findByIdAndDelete(expenseId)
            })
            .then(result => {
                console.log('SUCCESSFULLY DELETED');
                res.sendStatus(200);
            })
            .catch(async (err) => {
                // await t.rollback();
                console.log(err);
                // throw new Error(err);
            })
    } catch (err) {
        console.log("yeh hai error:"+err);
        res.status(500).json(err);
    }
}


