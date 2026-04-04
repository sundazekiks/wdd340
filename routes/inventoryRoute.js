const express = require("express");
const path = require('path')
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/")
const isAdmin = require("../middlewares/admin.middleware")
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/vehicles')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventoryView))

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVechicleDetails));

router.get("/error-custom", utilities.handleErrors(invController.sendError));

router.get('/', isAdmin, utilities.handleErrors(invController.buildManagement))

router.get('/add-classification', utilities.handleErrors(invController.buildAddClass))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.post('/add-classification', utilities.handleErrors(invController.addClass))

router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))

router.post('/add-inventory', upload.any(), utilities.handleErrors(invController.addInventory))

router.post('/update', upload.any(), utilities.handleErrors(invController.updateInventory))

module.exports = router;