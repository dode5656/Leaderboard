const database = require('./database.js');
const bcrypt = require('bcrypt');

const handleLogin = async (req,res) => {

    if (req.session.loggedin) {
        res.status(400).send("Already logged in");
        return;
    }
    if (!req.body.username || !req.body.password) {
        res.status(400).send("Username or Password field must not be blank or undefined.")
        return;
    }
    if (!(await database.checkUsername(req.body.username))) {
        res.status(400).send("Username or Password is incorrect. Please try again.")
        return;
    }
    let user = await database.getUser(req.body.username);
    if (!(await bcrypt.compare(req.body.password,user[0].password))) {
        res.status(400).send("Username or Password is incorrect. Please try again.")
        return;
    }

    //Once passed all these checks. Then we can confirm they are the correct person.
    req.session.loggedin = true;
    req.session.userID = user[0].id;
    res.sendStatus(204);
}

const handleRegister = async (req,res) => {

    if (req.session.loggedin) {
        res.status(400).send("Already logged in");
        return;
    }
    if (!req.body.username || !req.body.password) {
        res.status(400).send("Username or Password field must not be blank or undefined.")
        return;
    }
    if (!(await database.checkUsername(req.body.username))) {
        res.status(400).send("Username already registered. Please try another username.")
        return;
    }
    await database.register(req.body.username,await bcrypt.hash(req.body.password,10))
    res.status(204);
} 

module.exports = {handleLogin,handleRegister}