// ストラテジーと呼ばれる認証処理

const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const cookieSession = require("cookie-session");
const secret = "secretCuisine123";
const app = require("../app");
const knex = require("../db/knex");

module.exports = function (app) {


  /**
   * シリアライズ
   * ユーザー情報をセッションに保存する。
   * サインイン時のみ実行される。
   */
  passport.serializeUser(function (user, done) {
    console.log("serializeUser");
    done(null, user.id);
  });

  /**
   * デシリアライズ
   * IDからユーザー情報を特定し、req.userに格納する。
   * セッションが有効な間、リクエストの度に実行される。
   * ログアウトされたらセッションは無効。
   */
  passport.deserializeUser(async function (id, done) {
    console.log("deserializeUser");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(new LocalStrategy({
    // inputタグのname属性で指定したデータ名が入る。
    usernameField: "username",
    passwordField: "password"
    // ここから認証処理
  }, function (username, password, done) {
    knex("users")
      .where({
        name: username,
      })
      .select("*")
      .then(async (results) => {
        // 認証失敗 usersテーブルに入力した会員がない場合、ユーザ無いエラーメッセージを出力する。
        if (results.length === 0) {
          return done(null, false, { message: "Invalid User" });
          // 認証成功 認証済のユーザ情報を与えて実行。
        } else if (await bcrypt.compare(password, results[0].password)) {
          return done(null, results[0]);
        } else {
          return done(null, false, { message: "Invalid User" });
        }
      })
      .catch(function (err) {
        console.log(err);
        return done(null, false, { message: "Invalid User" });
      });
  }
  ));

  // セッションの設定
  app.use(
    cookieSession({
      // cookie名
      name: "session",
      // cookieに格納するデータを暗号化するための文字列(キー)の指定。
      keys: [secret],
      // cookieの有効期限
      maxAge: 24 * 60 * 60 * 1000, // 24h
    })
  );

  // passportを初期化するミドルウェア ※必ず実行する必要あり。
  app.use(passport.initialize());
  app.use(passport.session());
};