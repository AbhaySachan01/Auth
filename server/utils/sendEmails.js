const nodemailer = require("nodemailer");

module.exports = async(email,subject,text) =>{
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.HOST,
            port:Number(process.env.EMAIL_PORT),
            secure:false,
            auth:{
                user:process.env.USER,
                pass:process.env.PASS
            }
        });

        await transporter.sendMail({
            from:process.env.USER,
            to:email,
            subject:subject,
            text:text,
        })
        console.log("Email send success");
    } catch (error) {
        console.log("Error in sending mail");
        console.log(error);
    }
}