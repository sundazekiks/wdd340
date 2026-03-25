const express = require("express");
const path = require('path')
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/")
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/vehicles'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVechicleDetails));

router.get("/error-custom", utilities.handleErrors(invController.sendError));

router.get('/', utilities.handleErrors(invController.buildManagement))

router.get('/add-classification', utilities.handleErrors(invController.buildAddClass))

router.post('/add-classification', utilities.handleErrors(invController.addClass))

router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))

router.post('/add-inventory', upload.any(), utilities.handleErrors(invController.addInventory))

module.exports = router;