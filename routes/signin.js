const express = require("express");
const router = express.Router();
const passport = require("passport");

/**
 * サインイン画面に遷移
 */
router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  res.render('signin', {
    title: 'Sign in',
    isAuth: isAuth,
  });
});

/**
 * passport認証の認証処理
 * passport.authenticate
 * ・第一引数 使用するストラテジーの指定
 */
router.post('/', passport.authenticate('local', {
  // 認証成功時のリダイレクト先
  successRedirect: '/',
  // 認証失敗時のリダイレクト先
  failureRedirect: '/signin',
  // 認証時に発生したエラーメッセージを利用
  failureFlash: false,
})
);

module.exports = router;