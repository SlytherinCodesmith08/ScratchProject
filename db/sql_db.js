const { Client } = require('pg');

const url = 'postgres://npswmowv:xofEFECl6YhQcxr9JjuxzxeTxmKeZhf0@baasu.db.elephantsql.com:5432/npswmowv'
const client = new Client(url);
client.connect((err) => {
  console.log('Connected to ElephantSQL!');
    console.log(err);
});

module.exports = client;