const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const classModel = require('../models/classification-model')
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

invCont.buildManagement = async (req, res, next) => {
    req.flash('notice', 'for admins only')
    let nav = await utilities.getNav()
    res.render('./inventory/management',
        {
            title: "for Admin only",
            nav
        }
    )
}

invCont.buildAddClass = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.render('./inventory/add_classification',
        {
            title: "Add a classification",
            nav,
        }
    )
}

invCont.addClass = async (req, res, next) => {
    const { classification_name } = req.body;
    classModel.addClass(classification_name);
    console.log(classification_name)
    res.redirect('/inv/add-classification');
}

invCont.buildAddInventory = async (req, res, next) => {
    let nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList()
    console.log(classifications)
    res.render('./inventory/add_inventory',
        {
            title: 'Add to inventory',
            nav,
            classificationList: classifications
        }
    )
}

invCont.addInventory = async (req, res, next) => {
    const [image, thumbnail] = req.files;
    const { make, model, year, description, price, miles, color, classification_id } = req.body
    console.log(req.body)
    const modImg = image.path.replace('/Users/travisabuton/Desktop/School Files/WDD340/public', '')
    const modThumbnail = thumbnail.path.replace('/Users/travisabuton/Desktop/School Files/WDD340/public', '');
    console.log(modImg, modThumbnail)
    const add = await invModel.addInventory(make, model, year, description, modImg, modThumbnail, price, miles, color, classification_id)
    console.log(add)
    res.redirect('/inv/add-inventory');
}

module.exports = invCont
