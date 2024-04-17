const Sib = require('sib-api-v3-sdk')
const dotenv = require('dotenv');
dotenv.config();
const uuid = require('uuid')
const bcrypt = require('bcrypt')


const User = require('../models/User')
const ForgotPasswordRequest = require('../models/ForgotPasswordRequests');

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
    email: 'email1@gmail.com'
}
// const receiver = [{
//     email: 'email2@gmail.com'
// }]


exports.postResetPassword = async (req, res, next) => {
    try {
        const email = req.body.email
        const receiver = [{ email: email }]
        const user = await User.findOne({ email_Id: email });
        console.log(user);

        if (user) {
            const forget_Pass_Req = new ForgotPasswordRequest({ isActive: true, userId: user._id, createdAt: new Date() });
            await forget_Pass_Req.save();
            await tranEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: 'Password reset',
                htmlContent: `<p>Hello ${user.name}<br>
                            You are receiving this mail as per your request to change your password for your expense tracker account.
                            You can change your password from here:<br>
                            <a href='${process.env.WEBSITE}/password/resetPassword/${forget_Pass_Req._id}'>reset pasword</a></p>`
            })
            return res.status(202).json({ message: 'Link to reset password sent to your mail ', sucess: true })
        } else {
            throw new Error("Incorrect email Id!!");
        }

    } catch (err) {
        console.log(err)
        return res.status(403).json({ message: 'Error sending email!' })
    }
}



exports.getResetPassword = async (req, res, next) => {
    try {
        const forgetpassId = req.params.forgotPassId;
        const forgetReq = await ForgotPasswordRequest.findById(forgetpassId);

        if (forgetReq && forgetReq.isActive) {
            res.status(200).send(`<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                    }
            
                    .signup-container {
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                        width: 350px;
                        text-align: center;
                    }
            
                    input {
                        width: 100%;
                        padding: 10px;
                        margin: 8px 0;
                        box-sizing: border-box;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
            
                    button {
                        background-color: #4caf50;
                        color: white;
                        padding: 10px 15px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                    }
            
                    button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            
            <body>
                <div class="signup-container">
                    <h2>Log In</h2>
                    <form action="/password/updatepassword/${forgetpassId}" method="POST" id="form">
                        <label for="password">Enter New Password</label>
                        <input name="newpassword" type="password" required id="password"></input>
                        <button id="login_btn">reset password</button>
                    </form>
                </div>
            </body>
            
            </html>`)

        } else {
            return new Error('Invalid link to reset password!');
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Error in resetting the password!' });
    }
}



exports.updatePassword = async (req, res, next) => {
    try {
        const forgotPassId = req.params.forgotPassId;
        const newPassword = req.body.newpassword;

        const forgotReq = await ForgotPasswordRequest.findById(forgotPassId);
        const user = await User.findById(forgotReq.userId);
        if (user) {
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            user.password = hashedPassword;
            const promise1 = user.save();
            forgotReq.isActive = false;
            const promise2 = forgotReq.save();

            Promise.all([promise1, promise2])
                .then(() => {
                    return res.status(201).json({ message: 'Successfuly update the new password' })
                })
                .catch((err) => {
                    console.log(err)
                    throw new Error('Could not change the user password!')
                })
        } else {
            throw new Error("User doesn't exist!")
        }
    } catch (err) {
        console.log(err)
        res.status(403).json({ message: err })
    }

}