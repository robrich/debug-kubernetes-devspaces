var express = require('express');
var router = express.Router();

var shoot = require('../lib/shoot');

router.get('/', (req, res) => {
  return res.json({use:'post'});
});

router.post('/', (req, res) => {
  const url = req.body.url;
  console.log(`post to /, url: ${url}`);
  if (!url || url[0] !== '/') {
    return res.status(400).end();
  }
  shoot(url).then(path => {
    res.sendFile(path);
  }).catch(err => {
    console.log(err);
    res.status(500).end();
  });
});

module.exports = router;
