var express = require("express"),
    mongoose = require("mongoose"),
    app = express(),
    blogRouter = require('./router/blog'),
    userRouter = require('./router/users'),
    config = require('./config/keys'),
    url = config.mongoUrl,
    session = require('express-session'),
    passport = require('passport'),
    createError = require('http-errors'),
    cors = require('cors'),
    path = require("path");

app.use(cors());

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

app.set('view engine', 'html');
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    name: 'session-id',
    secret: '12345',
    saveUninitialized: false,
    resave: false
  }));

app.use('/', userRouter);
app.use('/blog', blogRouter);

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });

if(process.env.NODE_ENV=== 'production'){
    app.use(express.static('client/build'))
    app.get("*",(req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
    })
}


app.listen(process.env.PORT || 3001)