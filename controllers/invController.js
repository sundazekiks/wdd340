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

    try {
        const data = await invModel.getInventoryByVehicleId(vehicleId);
        const container = await utilities.buildVehicleDetailPage(data);
        let nav = await utilities.getNav()
        res.render("./inventory/detailsPage",

            {
                title: data.inv_make,
                container,
                nav,
                v_id: data.inv_id,
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
    const classificationSelect = await utilities.buildClassificationList()
    let nav = await utilities.getNav()
    res.render('./inventory/management',
        {
            title: "for Admin only",
            nav,
            classificationSelect
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

    res.redirect('/inv/add-classification');
}

invCont.buildAddInventory = async (req, res, next) => {
    let nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList()
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

    const modImg = image.path.replace('public', '');
    const modThumb = thumbnail.path.replace('public', '');
    const add = await invModel.addInventory(make, model, year, description, modImg, modThumb, price, miles, color, classification_id)

    res.redirect('/inv/add-inventory');
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    // console.log(classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    // console.log(invData)
    if (invData) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const id = parseInt(req.params.id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByVehicleId(id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)

    const itemName = `${itemData.make} ${itemData.model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        id: itemData.id,
        make: itemData.make,
        model: itemData.model,
        year: itemData.year,
        description: itemData.description,
        image: itemData.image,
        thumbnail: itemData.thumbnail,
        price: itemData.price,
        miles: itemData.miles,
        color: itemData.color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        id,
        make,
        model,
        year,
        description,
        price,
        miles,
        color,
        classification_id,
        image,
        thumbnail
    } = req.body

    const updateResult = await invModel.updateInventory(
        id,
        make,
        model,
        description,
        image,
        thumbnail,
        price,
        year,
        miles,
        color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.make + " " + updateResult.model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${make} ${model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            id,
            make,
            model,
            year,
            description,
            image,
            thumbnail,
            price,
            miles,
            color,
            classification_id
        })
    }
}

module.exports = invCont
