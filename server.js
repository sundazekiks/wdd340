/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")


app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");



/* ***********************
 * Routes
 *************************/

app.use(static)
app.get('/', (req, res) => {
  const upgradeRev = {
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
  res.render('index', {
    title: "Home",
    vehicleName: "DMC Delorian",
    vehicleDescription: "3 Cup Holders Superman doors Fuzzy dice!",
    uprev: upgradeRev

  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST



/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
