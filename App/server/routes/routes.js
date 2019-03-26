require('dotenv').config();
var express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const okta = require('@okta/okta-sdk-nodejs');
var router = express.Router();
var path = require('path');
var multer  = require('multer');
const MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const storage = require('multer-gridfs-storage')({
  url: process.env.MONGO_URI
});

var upload = multer({ storage: storage });

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
  orgUrl: process.env.OKTA_URL,
  token: process.env.OKTA_TOKEN,
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
    Problem.find({subject: {$in: user.profile.subjects}, isJoined: false, isOpen: true}, function(err, docs){
      res.send({problems: docs});
    });
    //console.log(user.profile.subjects);
  });
});

router.get('/api/getUserProblems', authenticationRequired, function(req, res){
  oktaClient.getUser(req.jwt.claims.uid)
  .then(user => {
    Problem.find({studentId: req.jwt.claims.uid}, function(err, docs){
      res.send({problems: docs});
    })
  });
});

router.post('/api/addcredits/:no', authenticationRequired, function(req, res){
  oktaClient.getUser(req.jwt.claims.uid)
  .then(user => {
    user.profile.credits = user.profile.credits || 0;
    user.profile.credits += parseInt(req.params.no);
    console.log(user);
    console.log(req.params.no);
    user.update()
    .then(() => res.send({good: "yes"}));
  });
});

router.post('/api/addphoto', authenticationRequired, upload.single("photo"), function(req, res){
  Problem.findOne({_id: req.body.pid, studentId: req.jwt.claims.uid}, function(err, p){
    if(err){throw err}
    else{
      p.GRIDid = req.file.id;
      p.save(function(err, pr){
        res.status(200);
        res.send("done");
      })
    }
  });
});

router.get('/api/getphoto/:id', function(req, res){
  //Gets photo from problem id
  Problem.findOne({_id: req.params.id}, function(err, p){
    let fileId = " ";
    if(p && p.GRIDid){
      fileId = p.GRIDid || " ";
      MongoClient.connect(process.env.MONGO_URI, function(err, client){
        if(err){
          res.send("err");
        }
        const db = client.db("test");
        
        const collection = db.collection('fs.files');
        const collectionChunks = db.collection('fs.chunks');
        collection.find({_id: ObjectId(fileId)}).toArray(function(err, docs){
          if(err){
            res.send("err finding file")
          }
          if(!docs || docs.length === 0){
            res.send("no file found")
          }else{
            //Retrieving the chunks from the db
            collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
              if(err){
                res.send("err getting chunks")
              }
              if(!chunks || chunks.length === 0){
                //No data found
                res.send("no data found")
              }
              //Append Chunks
              let fileData = [];
              for(let i=0; i<chunks.length;i++){
                //This is in Binary JSON or BSON format, which is stored
                //in fileData array in base64 endocoded string format
                fileData.push(chunks[i].data.toString('base64'));
              }
              //Display the chunks using the data URI format
              let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
              res.send(finalFile);
            });
          }
          
        });
      });
    }
    else{
      res.send("not found");
    }
  })
});

router.get('/*', function(req, res){
  res.render('index')
});

module.exports = router;