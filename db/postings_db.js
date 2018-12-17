const { Client } = require('pg')
const client = new Client({
    user: 'ray',
    host: 'localhost',
    database: 'cooking_app',
    password: '',
    port: 5432,
})

client.connect();

// force: true will drop the table if it already exists
let addPosting = function (title, description, capacity, lat, lon, firstname, lastname, time, email, cb) {
    let query = "INSERT INTO postings(title, description, capacity, lat, lon, firstname, lastname, time, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    let values = [title, description, capacity, lat, lon, firstname, lastname, time, email];
    return client.query(query, values)
        .then((res) => {
            console.log(res.rows[0]);
            cb();
        })
        .catch((err) => {
            console.error(err.stack);
        });
};

let getAllPostings = function (cb) {
    return client.query('SELECT * FROM postings;')
        .then((res) => {
            console.log(res.rows);
            cb(res.rows);
        })
        .catch((e) => {
            console.error(e.stack);
        });
};

let getPostingByID = function (id, cb) {
    const query = {
        text: 'SELECT * FROM postings WHERE id=$1;',
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

let addPostingToUser = function (userID, postingID, cb) {
    const query = "INSERT INTO subscribedusers(pid, uid) VALUES($1, $2) RETURNING *;";
    let values = [userID, postingID];
    return client.query(query, values)
        .then((res) => {
            console.log(res.rows);
            cb(res.rows);
        })
        .catch((e) => {
            console.error(e.stack);
        });
};

let approveUserToPost = function(userID, postingID, cb) {
    const query = "UPDATE subscribedusers SET approved=true WHERE uid=$1 AND pid=$2";
    let values = [userID, postingID];
    return client.query(query, values)
        .then((res) => {
            console.log(res.rows);
            cb();
        })
        .catch((e) => {
            console.error(e);
        });
}

module.exports = { 
    addPosting,
    getAllPostings,
    getPostingByID,
    addPostingToUser,
    approveUserToPost
}