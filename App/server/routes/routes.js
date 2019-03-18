var express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var router = express.Router();
var path = require('path');

// middleware to validate jwt
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-994297.okta.com/oauth2/default',
  clientId: '0oacpwujcUNre4PDC356',
  assertClaims: {
    aud: 'api://default',
  },
});

function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    return res.status(401).end();
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}

router.get('/favicon', function(req, res){
  res.sendFile(path.join(__dirname, '../../client/favicon.png'))
});

router.get('/*', function(req, res){
  res.render('index')
});

router.post('/api', authenticationRequired, function(req, res){
  //res.json(req.jwt);
  console.log(req.body);
});

module.exports = router;