const express = require('express');
const router = express.Router();
const database = require('../utils/database.js')

//Callbacks
const getTeams = async (req, res) => {

    let teams = await database.getTeams();
    let result = JSON.stringify(teams);
    res.send(result);

}

const getTeamInfo = async (req, res) => {

    if (!req.params.teamId) {
        res.sendStatus(400).send("Team ID not found.")
        return;
    }
    const teams = await database.getTeams();
    let result = teams.filter(team => team.id === parseInt(req.params.teamId));
    if (!result) {
        res.send("Invalid team ID.")
        return;
    }
    res.sendStatus(400).send(JSON.stringify(result))

}

const updateTeamInfo = async (req, res) => {

    if (!req.isAuthenticated) return res.sendStatus(401);
    if (!req.params.teamId) {
        res.sendStatus(400).send("Team ID not found.")
        return;
    }
    let teams = await database.getTeams();
    if (!teams.filter(team => team.id === req.params.teamId)) {
        res.sendStatus(400).send("Invalid team ID.")
        return;
    }
    if (!req.body.name || typeof req.body.name != "string") {
        res.sendStatus(400).send("Invalid team name.")
        return;
    }
    await database.setTeamName(req.params.teamId,req.body.name)
    res.sendStatus(204);

}

const updateTeamScores = async (req, res) => {

    if (!req.isAuthenticated) return res.sendStatus(401);
    if (!req.params.teamId) {
        res.sendStatus(400).send("Team ID not found.")
        return;
    }
    let teams = await database.getTeams();
    if (!teams.filter(team => team.id === req.params.teamId)) {
        res.sendStatus(400).send("Invalid team ID.")
        return;
    }
    let scores = parseInt(req.body.scores);
    if (!req.body.scores || scores === NaN) {
        res.sendStatus(400).send("Invalid team score.")
        return;
    }
    await database.setTeamScore(req.params.teamId,scores)
    res.sendStatus(204);

}

const createTeam = async (req, res) => {

    if (!req.isAuthenticated) return res.sendStatus(401);

    if (!req.body.name || typeof req.body.name != "string") {
        res.sendStatus(400).send("Invalid team name.")
        return;
    }
    let teamId = await database.createTeam(req.body.name)
    res.send(teamId.toString()); // Change to String to avoid Express thinking I am sending HTTP Status Code

}

//Redirect api pages to callbacks

//Team based api calls
router.get("/teams", getTeams); //No auth needed
router.get("/team/:teamId", getTeamInfo); //No auth needed
router.patch("/team/:teamId", updateTeamInfo); //Auth needed
router.post("/team/create/", createTeam); //Auth needed

//Score based api calls
router.patch("/team/:teamId/scores", updateTeamScores); //Auth needed

module.exports = {router}