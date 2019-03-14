var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/favicon', function(req, res){
  res.sendFile(path.join(__dirname, '../../client/favicon.png'))
});

router.get('/*', function(req, res){
  res.render('index')
});
module.exports = router;