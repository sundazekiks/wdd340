const express = require("express");
const router = new express.Router();
const accountController = require('../controllers/accountController')
const utilities = require("../utilities/")

// Handle Logout
router.get('/logout', accountController.logout)

router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
// Login Page
router.get('/login', utilities.checkIfLoggedIn, utilities.handleErrors(accountController.buildLogin));
// Register Page
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Handle Registration
router.post('/register', utilities.handleErrors(accountController.registerAccount))
// Handle Login
router.post('/login', accountController.loginAccount)

router.get('/update', utilities.checkLogin, utilities.handleErrors(accountController.updateAccount))

router.post('/update', utilities.checkLogin, utilities.handleErrors(accountController.updateAccountInfo))

router.get('/update-password', utilities.checkLogin, utilities.handleErrors(accountController.buildUpdatePassword))

router.post('/update-password', utilities.checkLogin, utilities.handleErrors(accountController.updatePassword))


module.exports = router;


