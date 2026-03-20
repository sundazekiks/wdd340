const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    try {
        const nav = await utilities.getNav()
        res.render("index", {
            title: "Home",
            nav,
            vehicleName: "DMC Delorian",
            vehicleDescription: "3 Cup Holders Superman doors Fuzzy dice!",
            uprev: utilities.initialData
        })
    } catch (err) {
        next(err);
    }
}


module.exports = baseController;