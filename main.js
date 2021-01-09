const express = require('express');
const session = require('express-session');

// Routers
const admin = require('./routes/admin.js');
const api = require('./routes/api.js'); 

const app = express();

//Trust first proxy (nginx)
app.set('trust proxy', 1);

//Instantiate the express session
app.use(session({

    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: true
    }

}));


app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Auth
const auth = require('../utils/auth.js')
router.use(auth());

//Use the routers
app.use("/admin", admin)
app.use("/api", api)

app.get("/", (req, res) => {

    res.sendFile("./public/index.html")

});

app.listen(process.env.PORT)