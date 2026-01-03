const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: "recipemobileapp@gmail.com", // generated ethereal user
        pass: "jlbb qsgm xvyx pscd", // generated ethereal password
    },
});


module.exports.sendCode = (email, code, username) => {
    transporter.sendMail({
        from: 'Star Trail Tracking App', // sender address
        to: email,// list of receivers
        subject: "Reset password code", // Subject line
        //text: "Click the following button to confirm your email!", // plain text body
        html: `
      <h3>Hello, ${username}</h3>
        This is your reset password code: <b>${code}</b>`, // html body
    }, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log("email sent", info.response)
        }
    })
}