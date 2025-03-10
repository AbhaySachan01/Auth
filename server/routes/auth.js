const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");

router.post("/", async (req, res) => {
    try {
        // Validate user input
        const { error } = validate(req.body);
        if (error) 
            return res.status(400).send({ message: error.details[0].message });

        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid email or password" });

        // Validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(401).send({ message: "Invalid email or password" });

        // Email verification check
        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });

            if (!token) {
                token = new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                });
                await token.save();

                const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
                await sendEmail(user.email, "Verify Email", url);
            }

            return res.status(201).send({ message: "An email has been sent to verify your account." });
        }

        // Generate Auth Token
        const authToken = user.generateAuthToken();
        return res.status(200).send({ data: authToken, message: "Login successful" });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Validate Email & Password
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;
