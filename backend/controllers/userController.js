const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const prisma = require("../config/prisma");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.TOKEN_SIGN, { expiresIn: "3d" });
};

// NOTE: unlike apps/dashboard/backend/controllers/userController.js, this
// app's original Mongoose User model only ever read/wrote email+password —
// no signup validation, no company profile fields. Per an earlier codebase
// audit, Signup.jsx/Login.jsx aren't even wired into this app's routes
// (App.jsx only registers the application-form route), so these two
// functions are effectively dead code kept only for parity with the
// pre-migration behavior.
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw Error("All fields must be filled");
        }

        const user = await prisma.company.findUnique({ where: { email } });
        if (!user) {
            throw Error("Incorrect email");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw Error("Incorrect password");
        }

        const user_id = user.id;
        const token = createToken(user.id);

        res.status(200).json({ user_id, email, token });
    } catch (error) {
        if (req.password) {
            console.log("Incorrect password");
            res.json({ error: "Incorrect password" });
        }
        res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw Error("All fields must be filled");
        }

        const exists = await prisma.company.findUnique({ where: { email } });
        if (exists) {
            throw Error("Email already in use");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const { ObjectId } = require("bson");
        const id = new ObjectId().toHexString();

        // This app's original signup never collected companyName/fields/etc,
        // but the shared companies table requires them (NOT NULL) — filled
        // with placeholders since this path is unreachable from the live UI
        // (see note above) and was never exercised with real data.
        const user = await prisma.company.create({
            data: {
                id, email, password: hash,
                companyName: email, representatives: "", sector: "", city: "",
                noOfPositions: "", fields: [],
            },
        });

        const user_id = user.id;
        const token = createToken(user.id);

        res.status(200).json({ user_id, email, token });
    } catch (error) {
        console.log("ERROR....");
        res.status(400).json({ error: error.message });
    }
};

module.exports = { loginUser, signupUser };
