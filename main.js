const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const {SESSION_SECRET, EXPRESS_PORT,MYSQL_HOST,MYSQL_USERNAME,MYSQL_PASSWORD,MYSQL_DATABASE} = require('./config.json')

// Routers
const admin = require('./routes/admin.js');
const api = require('./routes/api.js'); 

const app = express();
const database = require('./utils/database.js');

database.setupPool();
(async () => {await database.setupDatabase();})();

//Trust first proxy (nginx)
app.set('trust proxy', 1);

const sessionStore = new MySQLStore({
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
});

//Instantiate the express session
app.use(session({

    secret: SESSION_SECRET,
    store: sessionStore,
    cookie: {
        secure: process.env.PRODUCTION ? false : true,
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

//Use the routers
app.use("/admin", admin.router)
app.use("/api", api.router)

app.get("/", (req, res) => {

    res.sendFile("index.html", {root: path.join(__dirname, 'public')})

});

app.listen(EXPRESS_PORT)