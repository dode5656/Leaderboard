const express = require('express');
const router = express.Router();
const database = require('../utils/database.js')

//Callbacks
const getTeams = async (req, res) => {

    res.send(JSON.stringify(database.getTeams()));

}

const getTeamInfo = async (req, res) => {

    if (!req.params.teamId) {
        res.send("Team ID not found.")
        return;
    }
    const teams = database.getTeams();
    let result = teams.filter(team => team.id === req.params.teamId);
    if (!result) {
        res.send("Invalid team ID.")
        return;
    }
    res.send(JSON.stringify(result))

}

const updateTeamInfo = async (req, res) => {

    if (!req.isAuthenticated) return res.sendStatus(401);
    if (!req.params.teamId) {
        res.send("Team ID not found.")
        return;
    }
    if (!database.getTeams().filter(team => team.id === req.params.teamId)) {
        res.send("Invalid team ID.")
        return;
    }
    if (!req.body.name || typeof req.body.name != "string") {
        res.send("Invalid team name.")
        return;
    }
    database.setTeamName(req.params.teamId,req.body.name)
    res.sendStatus(204);

}

const updateTeamScores = async (req, res) => {

    if (!req.isAuthenticated) return res.sendStatus(401);
    if (!req.params.teamId) {
        res.send("Team ID not found.")
        return;
    }
    if (!database.getTeams().filter(team => team.id === req.params.teamId)) {
        res.send("Invalid team ID.")
        return;
    }
    if (!req.body.scores || typeof req.body.name != "number") {
        res.send("Invalid team score.")
        return;
    }
    database.setTeamScore(req.params.teamId,req.body.scores)
    res.sendStatus(204);

}

const createTeam = async (req, res) => {

    if (!req.isAuthenticated) return res.sendStatus(401);

    if (!req.body.name || typeof req.body.name != "string") {
        res.send("Invalid team name.")
        return;
    }
    database.createTeam(req.body.teamName)
    res.sendStatus(204);

}

//Redirect api pages to callbacks

//Team based api calls
router.get("/teams", getTeams); //No auth needed
router.get("/team/:teamId", getTeamInfo); //No auth needed
router.post("/team/:teamId", updateTeamInfo); //Auth needed
router.post("/team/create/", createTeam); //Auth needed

//Score based api calls
router.post("/team/:teamId/scores", updateTeamScores); //Auth needed
