const client = require('./sql_db');

// force: true will drop the table if it already exists
let addUser = function (firstName, lastName, email, phoneNumber, lat, lon, imagePath, cb) {
    let query = "INSERT INTO users(firstName, lastName, email, phoneNumber, lat, lon) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;";
    let values = [firstName, lastName, email, phoneNumber, lat, lon];
    return client.query(query, values)
        .then((res) => {
            console.log(res.rows[0]);
            cb();
        })
        .catch((err) => {
            console.error(err.stack);
        });
};

let getAllUsers = function (cb) {
    return client.query('SELECT * FROM users;')
        .then((res) => {
            console.log(res.rows);
            cb(res.rows);
        })
        .catch((e) => {
            console.error(e.stack);
        });
};

let getUserByID = function (id, cb) {
    const query = {
        text: 'SELECT * FROM users WHERE id=$1;',
        values: [id]
    }
    return client.query(query)
        .then((res) => {
            console.log(res.rows);
            cb(res.rows);
        })
        .catch((e) => {
            console.error(e.stack);
        });
}

let addUserToPosting = function (userID, postingID, cb) {
    const query = "INSERT INTO subscribedusers(pid, uid) VALUES($1, $2) RETURNING *;";
    let values = [postingID, userID];
    return client.query(query, values)
        .then((res) => {
            console.log(res.rows);
            cb(res.rows);
        })
        .catch((e) => {
            console.error(e.stack);
        });
}

let getUsersForAPosting = function (pid, cb) {
    const query = {
        text: 'SELECT su.pid, u.id, u.firstname, u.lastname, u.email, u.phoneNumber, u.lat, u.lon FROM subscribedusers as su, users as u WHERE u.id=su.uid AND pid = $1;',
        values: [pid]
    }
    return client.query(query)
        .then((res) => {
            console.log(res.rows);
            cb(res.rows);
        })
        .catch((e) => {
            console.error(e.stack);
        });
}

module.exports = {
    addUser,
    getAllUsers,
    getUserByID,
    addUserToPosting,
    getUsersForAPosting
}