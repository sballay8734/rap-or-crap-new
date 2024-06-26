"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.signin = exports.signupGuest = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../utils/errorHandler");
const successHandler_1 = require("../utils/successHandler");
const user_1 = __importDefault(require("../models/user"));
const authHelpers_1 = require("../helpers/authHelpers");
const SALT = Number(process.env.SALT);
const signup = async (req, res, next) => {
    const { email, displayName, password, confirmPassword } = req.body;
    if (typeof displayName === "string" &&
        displayName.trim().toLocaleLowerCase() === "guest") {
        return next((0, errorHandler_1.errorHandler)(400, '"Guest" as a display name is not allowed'));
    }
    // if a field is blank
    if ((0, authHelpers_1.fieldsAreNotValid)(email, displayName, password, confirmPassword)) {
        return next((0, errorHandler_1.errorHandler)(400, "All fields are required."));
    }
    // if passwords don't match
    if (!authHelpers_1.passwordsMatch) {
        return next((0, errorHandler_1.errorHandler)(400, "Passwords do not match."));
    }
    // if email already exists
    // !FIXME: Need to lowercase email!
    const existingUser = await user_1.default.findOne({ email });
    if (existingUser)
        return next((0, errorHandler_1.errorHandler)(409, "That user already exists."));
    console.log("SALT:", process.env.SALT);
    try {
        const newUser = await user_1.default.create({
            email,
            displayName,
            password: bcrypt_1.default.hashSync(password, SALT)
        });
        if (!newUser)
            return next((0, errorHandler_1.errorHandler)(500, "Could not create user."));
        const userResponse = {
            _id: newUser._id.toString(), // Convert ObjectId to string
            email: newUser.email,
            displayName: newUser.displayName,
            activeGameId: newUser.activeGameId || ""
        };
        const token = jsonwebtoken_1.default.sign({ id: userResponse._id }, process.env.JWT_SECRET);
        return res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(userResponse);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Something went wrong."));
    }
};
exports.signup = signup;
const signupGuest = async (req, res, next) => {
    const { email, displayName, password, confirmPassword } = req.body;
    // if a field is blank
    if ((0, authHelpers_1.fieldsAreNotValid)(email, displayName, password, confirmPassword)) {
        return next((0, errorHandler_1.errorHandler)(400, "All fields are required."));
    }
    // if passwords don't match
    if (!authHelpers_1.passwordsMatch) {
        return next((0, errorHandler_1.errorHandler)(400, "Passwords do not match."));
    }
    // if email already exists
    // !FIXME: Need to lowercase email!
    const existingUser = await user_1.default.findOne({ email });
    if (existingUser)
        return next((0, errorHandler_1.errorHandler)(409, "That user already exists."));
    console.log("SALT:", process.env.SALT);
    try {
        const newUser = await user_1.default.create({
            email,
            displayName,
            password: bcrypt_1.default.hashSync(password, SALT)
        });
        if (!newUser)
            return next((0, errorHandler_1.errorHandler)(500, "Could not create user."));
        const userResponse = {
            _id: newUser._id.toString(), // Convert ObjectId to string
            email: newUser.email,
            displayName: newUser.displayName,
            activeGameId: newUser.activeGameId || ""
        };
        const token = jsonwebtoken_1.default.sign({ id: userResponse._id }, process.env.JWT_SECRET);
        return res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(userResponse);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Something went wrong."));
    }
};
exports.signupGuest = signupGuest;
const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await user_1.default.findOne({ email });
        if (!validUser)
            return next((0, errorHandler_1.errorHandler)(400, "Email or password is incorrect"));
        const validPassword = bcrypt_1.default.compareSync(password, validUser.password);
        if (!validPassword)
            return next((0, errorHandler_1.errorHandler)(400, "Email or password is incorrect"));
        const userObject = validUser.toObject();
        const { password: pass, ...rest } = userObject;
        const token = jsonwebtoken_1.default.sign({ id: userObject._id }, process.env.JWT_SECRET);
        return res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Could not signin."));
    }
};
exports.signin = signin;
const signout = async (req, res, next) => {
    const userId = req.userId;
    try {
        if (!userId)
            return next((0, errorHandler_1.errorHandler)(401, "Unauthorized."));
        const user = await user_1.default.findById(userId);
        console.log(user); // WORKING
        if (!user)
            return next((0, errorHandler_1.errorHandler)(400, "User not found."));
        console.log("User Found"); // WORKING
        if (user.displayName === "Guest") {
            console.log("RUNNING"); // WORKING
            await user_1.default.deleteOne({ _id: userId });
            console.log("DELETED GUEST!");
        }
        // return next(errorHandler(500, "TEST"))
        res.clearCookie("access_token");
        return (0, successHandler_1.successHandler)(res, 200, "User has been logged out!", {});
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Failed to sign out user."));
    }
};
exports.signout = signout;
