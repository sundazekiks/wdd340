const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

Util.initialData = {

    upgrades: [
        ["Flux Capacitor", "/images/upgrades/flux-cap.png"],
        ["Flame Decals", "/images/upgrades/flame.jpg"],
        ["Bumper Stickers", "/images/upgrades/bumper_sticker.jpg"],
        ["Hub Caps", "/images/upgrades/hub-cap.jpg"]
    ],
    reviews: [
        "So fast it's almost like travelling in time",
        "Coolest ride on the road. (4/5)",
        "I'm feeling McFly! (5/5)",
        "The most futuristic ride of our day (4.5/5)",
        "80's livin and I love it (5/5)"
    ]

}

/* **************************************
classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            // grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
            grid += '<hr />'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildVehicleDetailPage = async (data) => {
    const vehicle = data[0];
    let container = '<div id="detail-wrapper">'
    if (vehicle) {
        container += `
        <section id="vehicleTitlePic">
            <img src=${vehicle.inv_image} alt="${vehicle.inv_model} profile pic">
            <div id="priceName">
                <h1 id="vehicleName">${vehicle.inv_make} 
                    ${vehicle.inv_model} 
                    ${vehicle.inv_year} 
                </h1>
                <p> $ ${new Intl.NumberFormat('en-Us').format(vehicle.inv_price)}</p>
            </div>
        </section>
        `
        container += `
        <section>
            <p>
                ${vehicle.inv_description}
            </p>
            <section id="availColors">
                <h3>
                <div id="colorBall"></div>
                ${vehicle.inv_color}
                </h3>
            </section>
        </section>
        `
    }
    container += '</div>'
    return container;
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {

    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("notice", "Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

Util.checkLogin = (req, res, next) => {
    const auth = req.cookies.jwt
    const userId = jwt.verify(auth, process.env.ACCESS_TOKEN_SECRET).account_id
    res.locals.userId = userId
    const firstName = jwt.verify(auth, process.env.ACCESS_TOKEN_SECRET).account_firstname
    const user = jwt.verify(auth, process.env.ACCESS_TOKEN_SECRET).account_type
    res.locals.firstName = firstName
    res.locals.user = user

    if (res.locals.loggedin) {

        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

Util.checkIfLoggedIn = (req, res, next) => {
    if (res.locals.loggedin) {
        req.flash("notice", "You are already logged in.")
        return res.redirect("/account/")
    } else {
        next()
    }
}


Util.checkRoute = (req, res) => {
    const isLoggedIn = req.cookies.jwt;

    if (isLoggedIn) {
        return res.status(200).json({ loggedIn: true });
    } else {
        return res.status(401).json({ loggedIn: false });
    }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;