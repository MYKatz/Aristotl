var express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const okta = require('@okta/okta-sdk-nodejs');
var router = express.Router();
var path = require('path');

var Problem = require('../models/problem.js');

// middleware to validate jwt
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-994297.okta.com/oauth2/default',
  clientId: '0oacpwujcUNre4PDC356',
  assertClaims: {
    aud: 'api://default',
  },
});

//okta token 00jjwA-cffmIKzA_M50v-0Ke-R2hHNmMKJhXEoJyN3
const oktaClient = new okta.Client({
  orgUrl: "https://dev-994297.okta.com/",
  token: "00jjwA-cffmIKzA_M50v-0Ke-R2hHNmMKJhXEoJyN3",
  requestExecutor: new okta.DefaultRequestExecutor()
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



router.post('/api', authenticationRequired, function(req, res){
  oktaClient.getUser(req.jwt.claims.uid)
  .then(user => {
    user.profile.bio = req.body.bio;
    user.profile.firstName = req.body.name.split(" ")[0];
    user.profile.lastName = req.body.name.split(" ")[1];
    user.profile.gradelevel = parseInt(req.body.gradeLevel);
    user.profile.isTutor = (req.body.type == "Tutor");
    var subjectsarr = req.body.subjects.map(x => x.value);
    user.profile.subjects = subjectsarr;
    user.update()
    .then(() => res.send({good: "yes"}))
  });
});

router.get('/api/getProblems', authenticationRequired, function(req, res){
  oktaClient.getUser(req.jwt.claims.uid)
  .then(user => {
    Problem.find({subject: {$in: user.profile.subjects}, isJoined: false, isActive: true}, function(err, docs){
      res.send({problems: docs});
    });
    //console.log(user.profile.subjects);
  });
});

router.get('/*', function(req, res){
  res.render('index')
});

module.exports = router;