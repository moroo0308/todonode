const express = require('express');
const router = express.Router();
const knex = require("../db/knex");
const mysql = require('mysql');

const titleName = 'Todo App';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'j5awm9b5',
  database: 'todoapp'
});


/**
 * タスク取得
 * ルーティング実行
 */
router.get('/', function (req, res, next) {

  // passport認証を通過(サインイン)している場合、trueを返す。
  const isAuth = req.isAuthenticated();
  if (isAuth) {
    const userid = req.user.id;

    knex("tasks")
      .select("*")
      .where({ user_id: userid })
      .then(function (results) {
        console.log(results);
        res.render('index', {
          title: titleName,
          todos: results,
          isAuth: isAuth,
        });
      })
      .catch(function (err) {
        console.log(err);
        res.render('index', {
          title: titleName,
          isAuth: isAuth,
        });
      });
  } else {
    res.render('index',{
      title: titleName,
      isAuth: isAuth,
    });
  }
});

/**
 * タスク登録
 */
router.post('/', function (req, res, next) {

  // passport認証を通過(サインイン)している場合、trueを返す。
  const isAuth = req.isAuthenticated();
  // ユーザーID取得
  const userid = req.user.id;
  // index.ejsのreq.body.<input>要素のname値
  const todo = req.body.add;

  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return
    }
    console.log('success');
  });

  knex("tasks")
    .insert({ user_id: userid, content: todo })
    .then(function () {
      // ルートパスに対してGETリクエストする
      res.redirect('/');
    })
    .catch(function (err) {
      console.log(err);
      res.render('index', {
        title: titleName,
        isAuth: isAuth,
      });
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;