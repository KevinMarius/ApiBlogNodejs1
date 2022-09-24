const Category = require("../models/category")
const jwtUtils = require('../helpers/jwtUtils')

exports.getCategories = (req, res) => {
    const categories = Category.find()
    .select("_id title description")
    .then(categories => {
        res.status(200).json({
            categories
        });
    })
    .catch(err => console.log(err))
};

exports.createCategory = (req, res) => {
    var headerAuth = req.headers['authorization']
    var userId = jwtUtils.getUserId(headerAuth)
    
    if(userId < 0) {
        res.status(404).json({'error' : 'wrong token'})
    }
    const category = new Category(req.body)
    category.save().then(result => {
        res.status(200).json({
            category: result
        });
    });

}

exports.deleteCategory = (req, res) => {
    var headerAuth = req.headers['authorization']
    var userId = jwtUtils.getUserId(headerAuth)
    
    if(userId < 0) {
        res.status(404).json({'error' : 'wrong token'})
    }
    Category.findOneAndDelete({ _id: req.params.categoryId}).then(() => {
        res.status(200).json("category deleted successful")
    })
}

exports.updateCategory = (req, res) => {
    var headerAuth = req.headers['authorization']
    var userId = jwtUtils.getUserId(headerAuth)
    
    if(userId < 0) {
        res.status(404).json({'error' : 'wrong token'})
    }

    Category.findOneAndUpdate(
        { _id: req.params.categoryId }, 
        {
            $set: {
                title: req.body.title, 
                description: req.body.description
            }
        },
        {
            new: true
        },(err, category) => {
            if(err) {
                res.status(403).json({"error" : err})
            }else res.status(201).json({ category })
        }
    )

}