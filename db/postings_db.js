const Sequelize = require('sequelize');
const sequelize = new Sequelize('cooking_app', 'ray', '', {
    host: 'localhost',
    dialect: 'postgres' // pick one of 'mysql','sqlite','postgres','mssql',
});

const user_db = require('./users_db');

const Posting = sequelize.define('posting', {
    pid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    capacity: {
        type: Sequelize.STRING
    },
    lat: {
        type: Sequelize.FLOAT
    },
    lon: {
        type: Sequelize.FLOAT
    }
});

Posting.hasMany(user_db.User, {as:'subscribers'});
// Posting.sync({force: true});

// force: true will drop the table if it already exists
let addPosting = function (title, description, capacity, lat, lon, cb) {
    return Posting.create({ title, description, capacity, lat, lon })
        .then((posting) => {
            // console.log(posting);
            cb();
        })
        .catch((err) => { console.error(err); });
};

let getAllPostings = function (cb) {
    return Posting.all()
        .then((postings) => {
            cb(postings);
        })
        .catch((err) => { console.error(err); });
};

let getPosting = function (id, cb) {
    return Posting.findOne({ where: { id }})
        .then((posting) => {
            cb(posting);
        })
        .catch((err) => { console.error(err); });
}

let addPostingToUser = function (userID, postingID, cb) {
    return Posting.findOne({pid: postingID})
        .then((post) => {
            user_db.User.findOne({uid: userID})
                .then((user) => {
                    posting.setUsers([user]);
                    cb();
                });

            // user.setPosting([posting]).success((res) => {
            //     console.log(res);
            //     cb();
            // })
        })
        .catch((err) => { console.error(err); });
};

let testing = function (cb) {
    return Posting.findAll({
        include: [{
            model: user_db.User,
        }]
    })
    .then((res) => { cb(res); })
    .catch((err) => { console.error(err); });
}

module.exports = { 
    addPosting,
    getAllPostings,
    getPosting,
    Posting,
    testing,
    addPostingToUser
}