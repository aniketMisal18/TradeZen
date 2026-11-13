const { Users } = require("../model/UsersSchema");
const { Account } = require("../model/AccountSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        const user = await Users.findOne({ email });
        if (user) {
            return res.status(403).json({ message: "User is already exist, You can login ", error });
        }
        const newUser = new Users({ fullName, email, password, phone });
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();
        await Account.create({
            user: newUser._id
        });
        res.status(201).json({ message: "SignUp success ", success: true });

    } catch (error) {
        res.status(403).json({ message: "Something is wrong ", error });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User  not found, email or password is wrong ", success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Email or password is incorrect",
                success: false
            });
        }
        const jwtToken = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const Userid = user._id;

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.cookie("UserID", Userid, {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: "login success ", success: true, userId: user._id, });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
}

const logout = (req, res) => {

    res.clearCookie("token");
    res.clearCookie("UserID");

    res.json({
        success: true,
        message: "Logout successful"
    });
}





module.exports = {

    signup,
    login,
    logout

}