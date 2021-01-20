const express = require('express');
const session = require('express-session');
const path = require('path');
const {SESSION_SECRET, EXPRESS_PORT} = require('./config.json')

// Routers
const admin = require('./routes/admin.js');
const api = require('./routes/api.js'); 

const app = express();
const database = require('./utils/database.js');

database.setupPool();
database.setupDatabase();

//Trust first proxy (nginx)
app.set('trust proxy', 1);

//Instantiate the express session
app.use(session({

    secret: SESSION_SECRET,
    cookie: {
        secure: true,
        sameSite: true,
        path: '/',
        httpOnly: true,
    },
    resave: true,
    saveUninitialized: false

}));


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('assets'))

//Auth
const auth = require('./utils/auth.js')
app.use(auth);

//Use the routers
app.use("/admin", admin.router)
app.use("/api", api.router)

app.get("/", (req, res) => {

    res.sendFile("index.html", {root: path.join(__dirname, 'public')})

});

app.listen(EXPRESS_PORT)