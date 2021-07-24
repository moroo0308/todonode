const express = require('express');
const knex = require('../db/knex');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
  // passport認証を通過(サインイン)している場合、trueを返す。
  const isAuth = req.isAuthenticated();
  res.render('signup', {
    title: 'Sign Up',
    isAuth: isAuth,
  });
});

router.post('/', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;
  // passport認証を通過(サインイン)している場合、trueを返す。
  const isAuth = req.isAuthenticated();

  knex("users")
    .where({ name: username })
    .select("*")
    .then(async function (result) {
      // 入力したユーザ名が既に存在する場合
      if (result.length !== 0) {
        res.render("signup", {
          title: "Sign Up",
          errorMessage: ["このユーザ名は既に使われています"],
          isAuth: isAuth,
        });
        // 入力したパスワードと再入力したパスワードが正しい場合
      } else if (password === repassword) {
        // 10はハッシュ化する回数(一般的には10を指定する)
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword：");
        console.log(hashedPassword);
        knex("users")
          .insert({ name: username, password: hashedPassword })
          .then(function () {
            res.redirect("/");
          })
          .catch(function (err) {
            console.log(err);
            res.render("signup", {
              title: "Sign Up",
              errorMessage: [err.sqlMessage],
              isAuth: isAuth,
            });
          });
      } else {
        res.render("signup", {
          title: "Sign Up",
          errorMessage: ["パスワードが一致しません"],
          isAuth: isAuth,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
      res.render("signup", {
        title: "Sign Up",
        errorMessage: [err.sqlMessage],
        isAuth: isAuth,
      });
    });
});

module.exports = router;