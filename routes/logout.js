const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
	req.logOut();
	// トップページに遷移。
	res.redirect('/');
});

module.exports = router;