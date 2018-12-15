const Sequelize = require('sequelize');
const sequelize = new Sequelize('cooking_app', 'ray', '', {
    host: 'localhost',
    dialect: 'postgres' // pick one of 'mysql','sqlite','postgres','mssql',
});

const posting_db = require('./postings_db');

const User = sequelize.define('user', {
    uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    lat: {
        type: Sequelize.FLOAT
    },
    lon: {
        type: Sequelize.FLOAT
    },
    image: {
        type: Sequelize.STRING
    },
    postingPID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'postings',
            key: 'pid'
        },
        onDelete: 'CASCADE'
    }
});

// User.belongsTo(posting_db.Posting, { foreignKey: 'postingPID', targetKey: 'pid' });
User.sync({force: true});

// force: true will drop the table if it already exists
let addUser = function (firstName, lastName, email, lat, lon, imagePath, cb) {
    return User.create({ firstName, lastName, email, lat, lon, image: imagePath })
        .then((user) => {
            // console.log(user);
            cb();
        })
        .catch((err) => { console.error(err); });
};

let getAllUsers = function (cb) {
    return User.all()
        .then((users) => {
            cb(users);
        })
        .catch((err) => { console.error(err); });
};

let getUserByID = function (id, cb) {
    return User.findOne({ where: { id }})
        .then((user) => {
            cb(user);
        })
        .catch((err) => { console.error(err); });
}

let addUserToPosting = function (userID, postingID, cb) {
    return User.findOne({uid: userID})
        .then((user) => {
            posting_db.Posting.findOne({pid: postingID})
                .then((posting) => {
                    user.setPosting(posting);
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
    return User.findAll({
        include: [{
            model: posting_db.Posting,
        }]
    })
    .then((res) => { cb(res); })
    .catch((err) => { console.error(err); });
}

module.exports = {
    addUser,
    getAllUsers,
    getUserByID,
    addUserToPosting,
    testing,
    User
}