const client = require('./sql_db');

// app.post('/reviews', (req, res) => {
//   let { chef_name, reviewer_name, date_created, imageurl, review } = req.body
//   let query = "INSERT INTO reviews (chef_name, reviewer_name, date_created, imageurl, review) VALUES($1, $2, $3, $4, $5)"
//   let values = [chef_name, reviewer_name, date_created, imageurl, review]
//   client.query(query, values)
//     .then(data => {
//       res.send({ "all": "good" })
//     })
//     .catch(err => {
//       console.log(err);
//     })
// })
function getReviews(req, res) {
  let query = "SELECT * FROM reviews WHERE chef_name = '$1'";
  let values = [req.params.chef_name]
  client.query(query, values)
    .then(arr => {
      console.log(arr)
    })
}

module.export = {
  getReviews
}