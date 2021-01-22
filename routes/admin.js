const express = require('express');
const path = require('path');
const router = express.Router();
const auth = require('../utils/auth.js')

router.get("/(login)?", (req, res) => {

    if (req.session.loggedin) {

        if (req.url == "/admin/login") return res.redirect("../");
        res.sendFile("admin.html", {root: path.join(__dirname, 'public')})

    } else {
        res.sendFile("login.html", {root: path.join(__dirname, 'public')})
    }

})

router.post("/login", auth.handleLogin);

module.exports = {router}