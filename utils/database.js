const mysql = require('mysql2/promise')
const {hash} = require('bcrypt');
const {MYSQL_HOST,MYSQL_USERNAME,MYSQL_PASSWORD,MYSQL_DATABASE} = require('../config.json')

const TEAM_TABLE = "teams"
const ADMIN_TABLE = "admin"
const SCORERECORDS_TABLE = "scoreRecords"
let pool;
let scoreHistoryCache = [];

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

const setupDatabase = async () => {

    if (!pool) throw "Error: Pool not setup yet."

    await pool.query("CREATE TABLE IF NOT EXISTS "+TEAM_TABLE+" (\
                    id int NOT NULL AUTO_INCREMENT,\
                    name varchar(50) NOT NULL,\
                    scores int DEFAULT 0,\
                    PRIMARY KEY (id)\
                );").catch(console.error);

    await pool.query("CREATE TABLE IF NOT EXISTS "+ADMIN_TABLE+" (\
                    id int NOT NULL AUTO_INCREMENT,\
                    username varchar(25) NOT NULL,\
                    password varchar(100) NOT NULL,\
                    PRIMARY KEY (id)\
                );").catch(console.error);

    await pool.query("CREATE TABLE IF NOT EXISTS "+SCORERECORDS_TABLE+" (\
                    id int NOT NULL AUTO_INCREMENT,\
                    scores int NOT NULL,\
                    dateAdded datetime NOT NULL DEFAULT NOW(),\
                    teamId int NOT NULL,\
                    PRIMARY KEY (id),\
                    FOREIGN KEY (teamId) REFERENCES "+TEAM_TABLE+"(id)\
                );").catch(console.error);

    let [rows] = await pool.query("SELECT id FROM "+ADMIN_TABLE+";");
    if (rows.length == 0) {
        await register("admin",await hash("admin",10));
    }

}

const getTeams = async () => {

    if (!pool) throw "Error: Pool not setup yet."

    let [answer] = await pool.execute("SELECT id,name,scores FROM "+TEAM_TABLE+";");
    return answer;

}

const setTeamName = async (id,name) => {

    await pool.execute("UPDATE "+TEAM_TABLE+" SET name=? WHERE id=?;", [name, id]);
    return;
}

const setTeamScore = async (id,score) => {

    await pool.execute("UPDATE "+TEAM_TABLE+" SET scores=? WHERE id=?;", [score, id])
    await pool.execute("INSERT INTO "+SCORERECORDS_TABLE+" (scores,teamId) VALUES (?,?);", [score,id]);
    return;
}

const createTeam = async (name) => {

    let [answer] = await pool.execute("INSERT INTO "+TEAM_TABLE+" (name) VALUES (?);", [name]);
    return answer.insertId;
}

const checkUsername = async (username) => {

    let [answer] = await pool.execute("SELECT username FROM "+ADMIN_TABLE+" WHERE username=?;", [username]);
    return answer.length==0 ? false : true;
}

const checkUserID = async (id) => {

    let [answer] = await pool.execute("SELECT id FROM "+ADMIN_TABLE+" WHERE id=?;", [id]);
    return answer.length==0 ? false : true;
}

const getUser = async (username) => {

    let [answer] = await pool.execute("SELECT id,username,password FROM "+ADMIN_TABLE+" WHERE username=?;", [username]);
    return answer;
}

const register = async (username, hashedPassword) => {

    let [answer] = await pool.execute("INSERT INTO "+ADMIN_TABLE+" (username,password) VALUES (?,?);",[username,hashedPassword]);
    return answer.insertId;
}

const updateUsername = async (id, username) => {

    await pool.execute("UPDATE "+ADMIN_TABLE+" SET username=? WHERE id=?;", [username,id]);
    return;
}

const updatePassword = async (id, password) => {

    await pool.execute("UPDATE "+ADMIN_TABLE+" SET password=? WHERE id=?;", [await hash(password,10),id]);
    return;
}

const getScoreHistory = async () => {
    // Get count of rows in table and compare. If it is greater than cache, we update the cache. Otherwise we return the cache.
    let [count] = await pool.execute("SELECT COUNT(1) FROM "+SCORERECORDS_TABLE+";");
    if (count[0]["COUNT(1)"] > scoreHistoryCache.length) {
        let [answer] = await pool.execute("SELECT scores,dateAdded, (SELECT name FROM "+TEAM_TABLE+" WHERE teamId=id) AS name FROM "+SCORERECORDS_TABLE+";");
        scoreHistoryCache = answer;
        return answer;
    }
    return scoreHistoryCache;
}

module.exports = {getTeams,setTeamName,setTeamScore,
    createTeam,setupPool,setupDatabase,
    checkUsername,getUser,register,
    updateUsername,updatePassword,checkUserID,getScoreHistory};

