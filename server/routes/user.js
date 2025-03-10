const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");

router.post("/", async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const { error } = validate(req.body);
        if (error) 
            return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: "User already exists" }); // 🛑 Stop execution

        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

         // Save new user
        user = await new User({ ...req.body, password: hashPassword }).save();

        // Create a verification token
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;

        // ✅ Send email FIRST before responding
        await sendEmail(user.email, "Verify Email", url);

        // ✅ Send response only after email is sent
        res.status(201).send({ message: "An email has been sent to your account. Please verify." });

    } catch (error) {
        console.error("Server Error:", error); 
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });

        // ✅ Update user as verified
        await User.updateOne({ _id: user._id }, { $set: { verified: true } });

        // ✅ Delete token after verification
        await Token.deleteOne({ _id: token._id });

        res.status(200).send({ message: "Email verified successfully" });

    } catch (error) {
        console.error("Server Error:", error); 
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
