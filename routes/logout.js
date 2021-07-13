const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
	// セッション情報を削除
	req.session = null;
	// トップページに遷移。
	res.redirect('/');
});

module.exports = router;