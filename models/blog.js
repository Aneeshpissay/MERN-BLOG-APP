var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Blog = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
      type: String,
      required: true
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }]
},{
  timestamps: true
});

module.exports = mongoose.model('Blog', Blog);