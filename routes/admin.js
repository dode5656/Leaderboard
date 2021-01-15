const express = require('express');
const router = express.Router();

router.get("/login", (req, res) => {

    if (req.session.loggedin 
        && req.isAuthenticated) {

        res.sendFile("../public/admin.html")

    } else {
        res.sendFile("../public/login.html")
    }

})

module.exports = {router}