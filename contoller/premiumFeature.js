const User = require('../models/User');
const Expense = require('../models/Expense');
const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const DownloadedFiles = require('../models/DownloadedUrl');
const Awsservice = require('../services/awsservices');



exports.getLeaderBoard = async (req, res, next) => {
    try {
        const leaderBoardUsers = await User.find().select('_id name totalexpenses')
        res.status(200).json(leaderBoardUsers);
    } catch (err) {
        console.log(err)
        res.status(403).json({ message: 'Error fetching leader board!' })
    }
}

exports.getReportPage = (req, res, next) => {
    res.sendFile('report.html', { root: 'views' });
}

exports.getLeaderboardPage = (req, res, next) => {
    res.sendFile('leaderboard.html', { root: 'views' });
}

exports.getDailyExpenses = async (req, res, next) => {
    const desiredDate = (req.params.date);

    try {
        const expenses = await Expense.find({ "userId": req.user._id, "date": desiredDate });
        console.log(expenses);
        let total = 0;
        expenses.forEach(expenses => {
            total += expenses.amount;
        });
        res.status(200).json({
            allExpenses: expenses,
            total: total
        })
    } catch (err) {
        console.log("Err:", err);
        console.log(desiredDate);
    }

}

exports.getMonthlyExpenses = async (req, res, next) => {
    const desiredDate = (req.params.month);
    const desiredDateObj = new Date(desiredDate);

    try {
        const expenses = await Expense.find({
            userId: req.user._id,
            $expr: {
                $eq: [
                    { $year: "$date" },
                    { $year: desiredDateObj }
                ],
                $eq: [
                    { $month: "$date" },
                    { $month: desiredDateObj }
                ]
            }
        });
        let total = 0;
        expenses.forEach(expenses => {
            total += expenses.amount;
        });
        res.status(200).json({
            allExpenses: expenses,
            total: total
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getDownlodedFileUrls = async (req, res) => {
    const userId = req.userId;
    //i dont know why nicje wali line kaam ni krri hai..
    // const downlodedFileUrls = await user.getDownloadedFiles();
    // const downlodedFileUrls = await DownloadedUrl.findAll({ where: { userId: userId }, order: [['id', 'DESC']], limit: 10 });
    const downlodedFileUrls = await DownloadedFiles.find({ userId: userId }).sort({ _id: -1 }).limit(10);
    res.status(200).json({ fileURL: downlodedFileUrls, success: true });
}

exports.downloadExpense = async (req, res) => {
    const desiredDate = (req.params.date);
    try {
        let expenses;
        if (desiredDate.length == 10) {
            // expenses = await req.user.getExpenses({
            //     where: Sequelize.literal(`DATE(updatedAt) = '${desiredDate}'`),
            //     attributes: [
            //         'expense_amount',
            //         'description',
            //         'category',
            //         [sequelize.literal("DATE_FORMAT(updatedAt, '%d-%m-%Y')"), 'date']
            //     ]
            // });
            expenses = await Expense.find({ "userId": req.user._id, "date": desiredDate });
            console.log(expenses);
            console.log("yaha tk toh fine kaam kr rra hai..");
        }
        else {
            const desiredDateObj = new Date(desiredDate);
            expenses = await Expense.find({
                userId: req.user._id,
                $expr: {
                    $eq: [
                        { $year: "$date" },
                        { $year: desiredDateObj }
                    ],
                    $eq: [
                        { $month: "$date" },
                        { $month: desiredDateObj }
                    ]
                }
            });
        }

        const stringifiedExpenses = JSON.stringify(expenses);
        const filename = `Expense${req.user._id}/${new Date()}.txt`;
        const fileURL = await Awsservice.uploadToS3(stringifiedExpenses, filename);
        const downloaded_files = new DownloadedFiles({
            fileUrl: fileURL,
            userId: req.user._id
        })
        const response = await downloaded_files.save()
        // const response = await req.user.createDownload({ fileUrl: fileURL })
        // res.status(200).json({ id: response.id, fileUrl: fileURL, success: true });
        res.status(200).json({ fileUrl: fileURL, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ fileURL: '', success: false, err: err });
    }
}


