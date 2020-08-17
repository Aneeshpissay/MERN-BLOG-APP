const multer = require('multer');
const path = require( 'path' );
const Blog = require('../models/blog');
const Comment = require('../models/comments');
var express = require('express');
const router = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

router.options(cors.corsWithOptions, (req, res, next) => { res.sendStatus(200); })
      .get('/',cors.cors, (req, res)=>{
    Blog.find({})
    .then((blogs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogs);
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.post('/', cors.corsWithOptions,authenticate.verifyUser,(req, res, next)=>{
    Blog.create(req.body)
    .then((blog) => {
        blog.author.id = req.user._id;
        blog.author.username = req.user.username;
        blog.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
      }, (err) => next(err))
    .catch((err) => next(err));
});

router.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
      .get("/:blogId",(req ,res)=>{
	Blog.findById(req.params.blogId).populate("comments").exec((err, foundBlog)=>{
			if(err){
                res.json(err);
		}
		else{
			  res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(foundBlog);
		}
	})
})

router.delete('/:blogId',cors.corsWithOptions,authenticate.verifyUser,(req, res, next)=>{
    Blog.findByIdAndRemove(req.params.blogId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post("/:blogId/comment",cors.corsWithOptions,authenticate.verifyUser,(req, res)=>{
	Blog.findById(req.params.blogId).populate("comments").exec((err, blog)=>{
    if(err){
        res.json(err);
      }
      else{
        Comment.create(req.body, function(err, comment){
          if(err){
            res.json(err);
          }
          else{
              comment.author.id = req.user._id
              comment.author.username = req.user.username
              comment.save();
              blog.comments.push(comment);
              blog.save();
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(blog);
          }
        })
      }
    })
})

router.delete("/:blogId/comment/:commentId",cors.corsWithOptions, (req, res)=>{
    Blog.findById(req.params.blogId,(err, blog)=>{
        if(err){
          res.json(err);
        }
        else{
        Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
          if(err){
            res.json(err);
          }
          else{
            blog.comments.pull(comment)
            blog.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
          }
        })
    }
})
});
module.exports = router;