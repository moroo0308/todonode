const express = require("express");
const knex = require("../db/knex");
const router = express.Router();
const bcrypt = require("bcrypt");

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
    })
    .select("*")
    .then(async (results) => {
      // usersテーブルに入力した会員がない場合、ユーザ無いエラーメッセージを出力する。
      if (results.length === 0) {
        res.render("signin", {
          title: "Signin",
          errorMessage: ["ユーザが見つかりません"],
          isAuth: isAuth,
        });
      } else if(await bcrypt.compare(password, results[0].password)){
        // usersテーブルのidカラムのデータをセッションに保存
        req.session.userid = results[0].id;
        // トップページに遷移する。
        res.redirect('/');
      } else {
        res.render("signin", {
          title: "Signin",
          errorMessage: ["ユーザが見つかりません"],
          isAuth: isAuth,
        });
      }
    });
});

module.exports = router;