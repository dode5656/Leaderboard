const express = require('express');
const path = require('path');
const router = express.Router();

router.get("/login", (req, res) => {

    if (req.session.loggedin 
        && req.isAuthenticated) {

        res.sendFile("admin.html", {root: path.join(__dirname, 'public')})

    } else {
        res.sendFile("login.html", {root: path.join(__dirname, 'public')})
    }

})

module.exports = {router}