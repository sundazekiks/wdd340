
const utilities = require('../utilities/');
const accountModel = require('../models/account-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()

    res.render("account/account_management", {
        title: "Account Management",
        nav,
    })
}

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    console.log(regResult);
    if (regResult) {

        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )

        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

async function loginAccount(req, res) {
    const nav = await utilities.getNav()

    const { email, password } = req.body

    const accountData = await accountModel.getAccountByEmail(email)

    console.log('Logging in')
    console.log(accountData)

    if (!accountData) {
        req.flash("notice", "Please check your email and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
        })
        return;
    }

    try {
        if (await bcrypt.compare(password, accountData.account_password)) {
            delete accountData.account_password

            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 })
            }
            else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 3600000 })
            }
            return res.redirect('/account/')

        } else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                email,
            })
        }
    }
    catch (error) {
        throw new Error("Access Forbidden")
    }

}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, buildManagement }