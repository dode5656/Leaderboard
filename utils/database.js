const mysql = require('mysql2/promise')
const {MYSQL_HOST,MYSQL_USERNAME,MYSQL_PASSWORD,MYSQL_DATABASE} = require('../config.json')

const TEAM_TABLE = "teams"
const ADMIN_TABLE = "admin"
let pool;

const setupPool = () => {

    if (pool) throw "Error: Pool already setup."

    pool = mysql.createPool({

        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USERNAME,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE

    });

}

const setupDatabase = () => {

    if (!pool) throw "Error: Pool not setup yet."

    pool.query("CREATE TABLE IF NOT EXISTS "+TEAM_TABLE+" (\
                    id int NOT NULL AUTO_INCREMENT,\
                    name varchar(50) NOT NULL,\
                    scores int DEFAULT 0,\
                    PRIMARY KEY (id)\
                );").catch(console.error)

    pool.query("CREATE TABLE IF NOT EXISTS "+ADMIN_TABLE+" (\
                    id int NOT NULL AUTO_INCREMENT,\
                    username varchar(25) NOT NULL,\
                    password varchar(50) NOT NULL,\
                    PRIMARY KEY (id)\
                );").catch(console.error)

}

const getTeams = async () => {

    if (!pool) throw "Error: Pool not setup yet."

    let [answer] = await pool.execute("SELECT id,name,scores FROM "+TEAM_TABLE+";");
    return answer;

}

const setTeamName = async (id,name) => {

    await pool.execute("UPDATE "+TEAM_TABLE+" SET name=? WHERE id=?", [name, id]);
    return;
}

const setTeamScore = async (id,score) => {

    await pool.execute("UPDATE "+TEAM_TABLE+" SET scores=? WHERE id=?", [score, id])
    return;
}

const createTeam = async (name) => {

    let [answer] = await pool.execute("INSERT INTO "+TEAM_TABLE+" (name) VALUES (?)", [name]);
    return answer.insertId;
}

module.exports = {getTeams,setTeamName,setTeamScore,createTeam,setupPool,setupDatabase};

