const express = require("express");

const db = require("../../data/db-config.js");
const Users = require("./user-model.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to get users" });
  }

  db("users")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to get users" });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id);
    if (user) {
    } else {
    }
  } catch (error) {}

  db("users")
    .where({ id })
    .then((users) => {
      const user = users[0];

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Could not find user with given id." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to get user" });
    });
});

router.post("/", async (req, res) => {
  const userData = req.body;
  try {
    const newUser = await Users.add(userData);
    res.json(newUser);
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "failed" });
  }

  db("users")
    .insert(userData, "id")
    .then((ids) => {
      res.status(201).json({ created: ids[0] });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create new user" });
    });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    const newUser = await Users.update(id, changes);
    if (newUser) {
      res.json(newUser);
    } else {
      res.status(404).json({ message: "invalid id" });
    }
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "failed" });
  }

  db("users")
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count) {
        res.json({ update: count });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to update user" });
    });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const count = await Users.remove(id);
    if (count) {
      res.json({ message: `${count} records remove` });
    } else {
      res.status(404).json({ message: "invalid id" });
    }
  } catch (error) {}

  db("users")
    .where({ id })
    .del()
    .then((count) => {
      if (count) {
        res.json({ removed: count });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to delete user" });
    });
});

router.get("/:id/posts", (req, res) => {
  const { id } = req.params;

  db("posts as p")
    .join("users as u", "u.id", "p.user_id")
    .select("p.id", "u.username", "p.contents")
    .where({ user_id: id })
    .then((posts) =>
      db("posts")
        .where({ user_id: id })
        .then((posts) => {
          res.json(posts);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "failed to get posts" });
        })
    );
});

module.exports = router;
