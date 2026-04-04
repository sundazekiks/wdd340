const jwt = require('jsonwebtoken')
require('dotenv').config()

async function isAdmin(req, res, next) {
    const auth = req.cookies.jwt
    // console.log(auth)
    try {

        const isUserAdmin = jwt.verify(auth, process.env.ACCESS_TOKEN_SECRET)
        // console.log(isUserAdmin)
        if (isUserAdmin.account_type.toLowerCase() === 'admin') {
            next()
        } else {
            req.flash("notice", "You do not have permission to access that page.")
            return res.redirect("/account/")
        }

    } catch (err) {
        console.error(err)
        req.flash("notice", "An error occurred while checking permissions. Please log in again.")
        return res.redirect("/account")
    }
    // console.log(auth)

}

module.exports = isAdmin;