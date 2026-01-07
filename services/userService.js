const user = require('../models/userModel');
const jwt = require('jsonwebtoken')
const prvKey = "prvkeyfortrackappusertoken"
const { sendCode } = require('./nodemailer');

const create_token = (_id) => {
    return jwt.sign({ _id }, prvKey);
}

async function createAccount(username, email, password) {
    const newUser = await user.create_account(username, email, password);
    return ({ user: newUser });
}

async function login(email, password) {
    const userDetails = await user.login(email, password);
    console.log("userDetails (login func service)",userDetails);
    
    const token = create_token(userDetails._id);
    return ({ token, userDetails });
}

async function sendResetPasswordCode(email) {
    const fetchedUser = await user.findOne({ email: email });
    if (!fetchedUser) {
        throw new Error('Email address doesn\'t exist!');
    }
    var code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const codeExpiry = Date.now() + 5 * 60 * 1000;
    await fetchedUser.updateOne({ $set: { changePasswordCode: code, changePasswordCodeExpiry: codeExpiry } })
        .then((result) => {
            sendCode(email, code, fetchedUser.username);
            return result;
        }).catch((err) => {
            console.log("Error sending code", err);
            throw new Error({ "Error sending code": err.message })
        });
}

async function verifyResetPasswordCode(email, code) {
    const fetchedUser = await user.findOne({ email });
    const currentTime = Date.now();

    if (!fetchedUser) {
        throw new Error('Email address doesn\'t exist!');
    }

    if (fetchedUser.changePasswordCodeExpiry < currentTime) {
        return "Code has expired!";
    }

    if (fetchedUser.changePasswordCode == code) {
        console.log("req body code: ", code);
        console.log("user code: ", fetchedUser.changePasswordCode);
        return "Code is correct!";
    } else {
        console.log("req body code: ", code);
        console.log("user code: ", fetchedUser.changePasswordCode);
        return "Code is not correct!";
    }
}

async function resetPassword(email, newPassword) {
    const fetchedUser = user.findOne({ email });
    if (!fetchedUser) {
        throw new Error('User not found!');
    }

    await user.updateOne({ $set: { password: newPassword } })
        .then(result => {
            return result;
        }).catch(err => {
            return err.message;
        });
}

// async function addChild(name, userID){
//     const fetchedChild = await user.findOne({ _id: userID, childrenNames: name })
//     if (!fetchedChild) {
        
//     }
//     return "nothing found";
// }

module.exports = { createAccount, login, sendResetPasswordCode, verifyResetPasswordCode, resetPassword }