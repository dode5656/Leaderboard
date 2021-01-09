const mysql = require('mysql')

const TEAM_TABLE = "teams"
const ADMIN_TABLE = "admin"
let pool;

const setupPool = () => {

    if (pool) throw "Error: Pool already setup."

    pool = mysql.createPool({

        connectionLimit: 10,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
        
    });
    
}

con.connect(err => {
    if (err) throw err;
})

const setupDatabase = () => {

    if (!pool) throw "Error: Pool not setup yet."

    pool.query("CREATE TABLE IF NOT EXSITS ? (\
                    id int NOT NULL AUTO_INCREMENT,\
                    name varchar(50) NOT NULL,\
                    scores int DEFAULT 0,\
                    PRIMARY KEY (id)\
                );", TEAM_TABLE, (err, result) => {

        if (err) throw err;
    })

    pool.query("CREATE TABLE IF NOT EXSITS ? (\
                    id int NOT NULL AUTO_INCREMENT,\
                    username varchar(25) NOT NULL,\
                    password varchar(50) NOT NULL,\
                    PRIMARY KEY (id)\
                );", ADMIN_TABLE, (err, result) => {

        if (err) throw err;
    })

}

const getTeams = async () => {

    if (!pool) throw "Error: Pool not setup yet."

    let answer;
    pool.query("SELECT id,name,scores FROM ? ;", TEAM_TABLE, (err, result) => {
        if (err) throw err;
        answer = result;
    });
    return answer; // TODO: Verify getTeams works

}

const setTeamName = async (id,name) => {} // TODO: Setup setTeamName

const setTeamScore = async (id,score) => {} // TODO: Setup setTeamScore

const createTeam = async (name) => {} // TODO: Setup createTeam

module.exports = {getTeams,setTeamName,setTeamScore,createTeam,setupPool,setupDatabase};

