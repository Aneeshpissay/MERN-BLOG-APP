var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var randomstring = require('randomstring');
const cors = require('./cors');

if(process.env.NODE_ENV=== 'development'){
  router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } );
}

router.use(bodyParser.json());

router.post('/signup',cors.corsWithOptions, (req, res, next) => {
    User.register(new User({username: req.body.username}), 
      req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        if (req.body.email)
          user.email = req.body.email;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return ;
          }
          passport.authenticate('local')(req, res, () => {
            var verifyEmail = randomstring.generate();
            user.verifyEmail = verifyEmail;
            user.active = false;
            user.save();
            var smtpTransport = nodemailer.createTransport({
              service: 'Gmail', 
              auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
              }
            });
            var mailOptions = {
              to: user.email,
              from: process.env.GMAIL_USER,
              subject: 'Blog Register Verification',
              text: 'You are receiving this because you have to verify your account.\n\n' +
             "Copy this token and paste in link with your email: https://mern-stack-blog-app.herokuapp.com/verify\n\n" + `${verifyEmail}`
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              res.send('An e-mail has been sent to ' + user.email + ' with further instructions.');
              done(err, 'done');
            });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        });
      }
    });
});

router.post('/verify',cors.corsWithOptions, (req, res)=>{
  var {email,verifyEmail} = req.body;
    User.findOne({email:email,verifyEmail: verifyEmail },(err, users)=>{
      users.active = true;
      users.verifyEmail = null;
      users.save();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Your account has been verified now you can login'});
    })
})

router.post('/login', cors.corsWithOptions,passport.authenticate('local'), (req, res) => {

    passport.authenticate('local', (err, user, info) => { 
      if(err){
        res.json(err);
      }
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: info});
      }
      req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
        }
        else if(user.active == false){
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Please verify your account!', err: 'Could not log in user!'});     
        }
        var token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Login Successful!', token: token, user: user});
      }); 
    }) (req, res)
  });

router.post('/forgot',cors.corsWithOptions, function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({email: req.body.email}, function(err, user) {
        if (!user) {
          res.send('No account with that email address exists.');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.GMAIL_USER,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://mern-stack-blog-app.herokuapp.com/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        res.send('An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.send('Successfull sent');
  });
});

router.post('/reset/:token',cors.corsWithOptions, function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          res.send('Password reset token is invalid or has expired.');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
                  });
                })
          })
        } else {
            res.send("Passwords do not match.");
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.GMAIL_USER,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        res.send('Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.send('Successfully changed');
  });
});

router.post("/contact",cors.corsWithOptions,(req, res)=>{
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail', 
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
  })

  // Specify what the email will look like
  const mailOptions = {
    from: `${req.body.email}`, // This is ignored by Gmail
    to: process.env.GMAIL_USER,
    subject: `New Message from ${req.body.username}`,
    text: `${req.body.message}`
  }

  // Attempt to send the email
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.json(error);
    }
    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Message Successfully Sent'});
    }
  })
})


router.get('/logout', (req, res,next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;