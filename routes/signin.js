const express = require("express");
const knex = require("../db/knex");
const router = express.Router();

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  res.render('signin', {
    title: 'Sign in',
    isAuth: isAuth,
  });
});

router.post('/', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  knex("users")
    .where({
      name: username,
      password: password,
    })
    .select("*")
    .then((results) => {
      // usersテーブルに入力した会員がない場合、ユーザ無いエラーメッセージを出力する。
      if (results.length === 0) {
        res.render("signin", {
          title: "Signin",
          errorMessage: ["ユーザが見つかりません"],
          isAuth: isAuth,
        });
      } else {
        // usersテーブルのidカラムのデータをセッションに保存
        req.session.userid = results[0].id;
        req.session.username = results[0].username;
        // トップページに遷移する。
        res.redirect('/');
      }
    });
});

module.exports = router;