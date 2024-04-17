const express = require('express');
// const sequelize = require('./util/database');
const bodyParser = require('body-parser');
var cors = require('cors');

const mongoose = require('mongoose');

const User = require('./models/User');
const Expense = require('./models/Expense');
// const Order = require('./models/Order')
// const ForgetPasswordRequest = require('./models/ForgotPasswordRequests');
// const DownloadedFile = require('./models/DownloadedUrl');

const app = express();

const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const passwordRoutes = require('./routes/password');


app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));


app.use('/home',(req,res,next) => {
    res.sendFile('signup.html',{root:'views'});
})
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', passwordRoutes);
app.get('/', (req, res) => {
    res.sendFile('notfound.html',{root:'views'});
});


// User.hasMany(Expense, { onDelete: 'CASCADE' });
// Expense.belongsTo(User);

// User.hasMany(Order, { onDelete: 'CASCADE' });
// Order.belongsTo(User);

// User.hasMany(ForgetPasswordRequest, { onDelete: 'CASCADE' });
// ForgetPasswordRequest.belongsTo(User);

// User.hasMany(DownloadedFile, { onDelete: 'CASCADE', hooks: true })
// DownloadedFile.belongsTo(User)


const PORT = process.env.PORT


mongoose.connect('mongodb+srv://mrishant:vpG3sxNlAOTh22Eo@cluster0.odp2c2d.mongodb.net/Expensetracker?retryWrites=true&w=majority&appName=Cluster0')
    .then(res => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`)
        })
    })
    .catch(err => console.log(err));





