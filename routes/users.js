var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/api/userData', function(req, res) {
	var data = users.find(
		{},
		{firstName: 1}
	).limit(5);
	res.send(data);
});

module.exports = router;
