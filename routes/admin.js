const express = require('express');
const path = require('path');
const router = express.Router();
const auth = require('../utils/auth.js')

router.use(express.json())
router.use(express.urlencoded({extended:true}));

router.get("/", (req, res) => {

    if (req.session.loggedin) {

        res.sendFile("admin.html", {root: path.join(__dirname, '../public')})

    } else {
        res.sendFile("login.html", {root: path.join(__dirname, '../public')})
    }

})
router.post("/login", auth.handleLogin);

module.exports = {router}