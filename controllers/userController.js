const userService = require('../services/userService')

exports.createAccount = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { username, email, password } = req.body;
        const user = await userService.createAccount(username, email, password);
        return res.status(201).send({ user });
    } catch (error) {
        if(error.name === 'ValidationError'){
            const validationMsgs = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({error: validationMsgs.join(', ')});
        }
        res.status(500).send({ error : error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await userService.login(email, password);
        return res.status(200).send({ token, user });
    } catch (error) {
        res.status(500).send({ "loginError": error.message });
    }
}

exports.sendResetPasswordCode = async (req, res) => {
    try {
        const email = req.body.email;
        const result = await userService.sendResetPasswordCode(email);
        res.status(200).send({ "Reset password code sending result": result });
    } catch (error) {
        res.status(500).send({ "ERROR sending reset password code :": error.message });
    }
}

exports.verifyResetPasswordCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const result = await userService.verifyResetPasswordCode(email, code);
        res.status(200).send({ "Reset password code verifying result": result });
    } catch (error) {
        res.status(500).send({ "ERROR verifying reset password code :": error.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const result = await userService.resetPassword(email, newPassword);
        res.status(200).send({ "Reset password result": result });
    } catch (error) {
        res.status(500).send({ "ERROR resetting reset password :": error.message });
    }
}

// exports.addChild = async (req, res) => {
//     try {
//         const namee = req.body.name;
//         console.log("child name:", namee);
//         const res = await userService.addChild(namee);
//         console.log(res);
        
//     } catch (error) {
//         res.status(500).send({ "ERROR add child": error.message });
//     }
// }