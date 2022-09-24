const Post = require("../models/post");
const jwtUtils = require('../helpers/jwtUtils');
const UserCrtl = require('./userController')

exports.getPosts = (req, res) => {
    const posts = Post.find()
    .select("_id title content category user")
    .then(posts => {
        res.status(200).json({
            posts
        });
    })
    .catch(err => console.log(err))
};

exports.createPost = (req, res) => {
    var headerAuth = req.headers['authorization']
    var userId = jwtUtils.getUserId(headerAuth)
    
    if(userId < 0) {
        res.status(404).json({'error' : 'wrong token'})
    }
    
    const post = new Post(req.body)
    post.save().then(result => {
        res.status(200).json({
            post: result
        });
    });

}

exports.updatePost = (req, res) => {
    var headerAuth = req.headers['authorization']
    var userId = jwtUtils.getUserId(headerAuth)
    
    if(userId < 0) {
        res.status(404).json({'error' : 'wrong token'})
    }

    Post.findOneAndUpdate(
        {_id: req.params.postId}, 
        {
            $set: {
                title: req.body.title, 
                content: req.body.content, 
                picture: req.body.picture, 
                state: req.body.state, 
                category: req.body.category, 
                user: req.body.user,
            }
        },
        {
            new: true
        },(err, post) => {
            if(err) {
                res.status(403).json({"error" : err})
            }else res.status(201).json({ post })
        }
    )

}

exports.deletePost = (req, res) => {
    var headerAuth = req.headers['authorization']
    var userId = jwtUtils.getUserId(headerAuth)
    
    if(userId < 0) {
        res.status(404).json({'error' : 'wrong token'})
    }
    Post.findOneAndDelete({ _id: req.params.postId}).then(() => {
        res.status(200).json("post deleted successful")
    })
}