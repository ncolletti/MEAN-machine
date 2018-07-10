const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/meanmachine')
  .then(() => {
    console.log('connected to db')
  }).catch((err) => {
    console.log('something went wrong', err)
  })

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
})


app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    console.log(post);
    res.status(201).json({
      message: 'Post added successfully!',
      postId: result._id
    });
  });

});

// can add as many args as you want as long as it ends with the function
// that handles the request
// the first is the path
app.get('/api/posts',(req, res, next) => {
  Post.find()
    .then(docs => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: docs
      });
    }).catch(err => console.log(err));
});

app.delete('/api/posts/:id', (req, res, next) => {
  //let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.sendStatus(200).json({
      message: 'Deleted!'
    });
  });
});

module.exports = app;
