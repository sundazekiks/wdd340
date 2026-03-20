const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {

    const classification_id = req.params.classificationId;

    try {
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        })
    }
    catch (err) {
        next(err);
    }
}

invCont.buildVechicleDetails = async (req, res, next) => {

    const vehicleId = req.params.vehicleId;
    console.log(vehicleId)
    try {
        const data = await invModel.getInventoryByVehicleId(vehicleId);
        const container = await utilities.buildVehicleDetailPage(data);
        let nav = await utilities.getNav()
        res.render("./inventory/detailsPage",

            {
                title: data[0].inv_make,
                container,
                nav
            }
        )

    } catch (err) {
        next(err)
    }

}

invCont.sendError = async (req, res, next) => {
    const err = new Error("500 Intentional Errors")
    err.status = 500;
    next(err)
}


module.exports = invCont
