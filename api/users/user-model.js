// user-model
const db = require("../../data/db-config.js");

module.exports = { find, findById, findPosts, add, update, remove };

async function find() {
  return db("users");
}

 function findById(id) {
  return db("users").where({ id }).first();
}

 function findPosts(id) {
  return db("posts as p")
    .join("users as u", "u.id", "p.user_id")
    .select("p.id", "u.username", "p.contents")
    .where({ user_id: id });
}

 function add(user) {
  return db('users').insert(user);
}

 function update(id, changes) {
  return db('users').update(changes).where({id})
}

async function remove(id) {
  return db('users').where({ id }).del();
}
