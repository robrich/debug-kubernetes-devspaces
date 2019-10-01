var express = require('express');
var router = express.Router();

var shoot = require('../lib/shoot');

router.get('/', (req, res) => {
  return res.json({use:'post'});
});

router.post('/', (req, res) => {
  const url = req.body.url;
  const header = req.headers['azds-route-as'];
  console.log(`post to /, url: ${url}, header: ${header}`);
  if (!url) {
    return res.status(400).end();
  }
  shoot({url, header}).then(path => {
    res.sendFile(path);
  }).catch(err => {
    console.log(err);
    res.status(500).end();
  });
});

module.exports = router;
