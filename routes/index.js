const express = require('express');
const router = express.Router();
const knex = require("../db/knex");
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'j5awm9b5',
  database: 'todoapp'
});


/* ルーティング実行. */
router.get('/', function (req, res, next) {
  knex("tasks")
    .select("*")
    .then(function (results) {
      console.log(results);
      res.render('index', {
        title: 'Todo App',
        todos: results,
      });
    });
});

router.post('/', function (req, res, next) {
  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return
    }
    console.log('success');
  });

  // index.ejsのreq.body.<input>要素のname値
  const todo = req.body.add;
  knex("tasks")
    .insert({ user_id: 1, content: todo })
    .then(function () {
      // ルートパスに対してGETリクエストする
      res.redirect('/');
    })
    .catch(function (err) {
      console.log(err);
    });
});

router.use('/signup', require('./signup'));

module.exports = router;