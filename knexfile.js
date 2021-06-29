module.exports = {

  development: {
    // 使用するデータベースのモジュール
    client: "mysql",
    // 接続情報の設定
    connection: {
      // データベース名
      database: "todoapp",
      // 接続に使用するユーザ
      user: "root",
      // 接続に使用するユーザのパスワード
      password: "j5awm9b5",
    },
    // コネクションプールの設定
    // データベースの接続を保持して、再利用する機能のこと
    pool: {
      // 接続数の最小限度
      min: 2,
      // 接続数の最大限度
      max: 10
    },
  },
  staging: {
    client: "mysql",
    connection: {
      database: "todoapp",
      user: "root",
      password: "j5awm9b5",
    },
    pool: {
      min: 2,
      max: 10
    },
  },
  production: {
    client: "mysql",
    connection: {
      database: "todoapp",
      user: "root",
      password: "j5awm9b5",
    },
    pool: {
      min: 2,
      max: 10
    },
  }

}