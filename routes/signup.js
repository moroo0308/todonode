const express = require('express');
const knex = require('../db/knex');
const router = express.Router();

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  res.render('signup', {
    title: 'Sign Up',
    isAuth: isAuth,
  });
});

router.post('/', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  knex("users")
    .where({ name: username })
    .select("*")
    .then(function (result) {
      // 入力したユーザ名が既に存在する場合
      if (result.length !== 0) {
        res.render("signup", {
          title: "Sign Up",
          errorMessage: ["このユーザ名は既に使われています"],
          isAuth: isAuth,
        });
        // 入力したパスワードと再入力したパスワードが正しい場合
      } else if (password === repassword) {
        knex("users")
          .insert({ name: username, password: password })
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