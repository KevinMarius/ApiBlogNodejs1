const express = require('express')
const postController = require('../controllers/postController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const validator = require('../validator')

const router = express.Router()

//=================== posts ====================
router.get("/posts", postController.getPosts)
router.put("/post/:postId", postController.updatePost)
router.post("/post/create", validator.createPostValidator, postController.createPost)
router.delete("/post/:postId", postController.deletePost)

//=================== users =====================
router.get("/users", userController.getUsers)
router.post("/user/create", userController.createUser)
router.post("/user/login", userController.login)
router.get("/user/me", userController.getUserProfile)
router.put("/user/:userId", userController.updateUser)
router.delete("/user/:userId", userController.deleteUser)

//===================== category ======================
router.get("/categories", categoryController.getCategories)
router.post("/category", categoryController.createCategory)
router.delete("/category/:categoryId", categoryController.deleteCategory)
router.put("/category/:categoryId", categoryController.updateCategory)

module.exports = router;