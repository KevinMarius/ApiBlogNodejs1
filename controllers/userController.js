const User = require('../models/user')
const Role = require('../models/role')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const jwtUtils = require('../helpers/jwtUtils')
const { decode } = require('jsonwebtoken')
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

dotenv.config()

exports.getUsers = (req, res) => {
	var headerAuth = req.headers['authorization']
	var userId = jwtUtils.getUserId(headerAuth)

	if (userId < 0) {
		res.status(404).json({ 'error': 'wrong token' })
	}

	this.isAdmin(userId)

	User.find()
		.select("_id name surname dateBorn email role")
		.then((users) => {
			res.status(200).json({
				users
			});
		})
		.catch((err) => console.log(err));
}

exports.login = (req, res) => {

	if (!emailRegex.test(req.body.email)) {
		res.status(404).json({ "error": "email is not valid" });
	}
	if (!passwordRegex.test(req.body.password)) {
		res.status(404).json({ "error": "password is not valid" });
	}

	User.findOne({
		email: req.body.email
	})
		.then((userExist) => {

			if (userExist) {
				const passwordValid = bcrypt.compareSync(req.body.password, userExist.password)

				if (passwordValid) {
					res.status(200).json({
						'token': jwtUtils.generateTokenForUser(userExist)
					})
				} else {
					res.status(400).json({ "error": "Password isn't correct" })
				}
			} else {
				res.status(400).json({ "error": "User is not exist" })
			}
		})
		.catch((err) => console.log(err));
}

exports.getUserProfile = (req, res) => {
	var headerAuth = req.headers['authorization']
	var userId = jwtUtils.getUserId(headerAuth)

	if (userId < 0) {
		res.status(404).json({ 'error': 'wrong token' })
	}

	User.findOne({ id: userId })
		.then(function (user) {
			if (user) {
				res.status(201).json({
					user
				})
			} else {
				res.status(400).json({
					"error": "user not found"
				})
			}
		})
		.catch((err) => {
			res.status(500).json({
				"error": "cannot fetch user"
			})
		})
}

exports.createUser = (req, res) => {
	var headerAuth = req.headers['authorization']
	var userId = jwtUtils.getUserId(headerAuth)
	const email = req.body.email

	if (userId < 0) {
		res.status(404).json({ 'error': 'wrong token' })
	}

	this.isAdmin(userId)

	User.findOne({ email: email })
		.then((userExist) => {

			if (!userExist) {

				const user = new User({
					name: req.body.name,
					surname: req.body.surname,
					dateBorn: req.body.dateBorn,
					email: email,
					password: bcrypt.hashSync(req.body.password, 10),
					phone: req.body.phone,
					picture: req.body.picture,
					role: req.body.role
				});

				user.save()
					.then((newUser) => {
						res.status(200).json({
							newUser
						})
					})

			} else {
				res.status(400).json({ "error": "user already exist" })
			}
		})
		.catch((err) => console.log(err))
}

exports.updateUser = (req, res) => {
	var headerAuth = req.headers['authorization']
	var userId = jwtUtils.getUserId(headerAuth)

	if (userId < 0) {
		res.status(404).json({ 'error': 'wrong token' })
	}

	User.findOneAndUpdate(
		{ _id: req.params.userId },
		{
			$set: {
				name: req.body.name,
				surname: req.body.surname,
				dateBorn: req.body.dateBorn,
				email: req.body.email,
				phone: req.body.phone,
				picture: req.body.picture,
			}
		},
		{
			new: true
		}, (err, user) => {
			if (err) {
				res.status(403).json({ "error": err })
			} else res.status(201).json({ user })
		})
}

exports.deleteUser = (req, res) => {
	var headerAuth = req.headers['authorization']
	var userId = jwtUtils.getUserId(headerAuth)

	if (userId < 0) {
		res.status(404).json({ 'error': 'wrong token' })
	}
	this.isAdmin(userId)
	User.findOneAndDelete({ _id: req.params.userId }).then(() => {
		res.status(200).json("user deleted successful")
	})
}

exports.isAdmin = (userId) => {

	User.findById(userId).exec((err, user) => {
		if (err) {
			return (req, res, next) => {
				res.status(500).json({ message: err });
			}
		}

		Role.find({ _id: { $in: user.role } }, (err, roles) => {
			if (err) {
				return (req, res, next) => {
					res.status(500).json({ message: err });
				}
			}

			for (let i = 0; i < roles.length; i++) {
				console.log(roles[i].title)
				if (roles[i].title === "admin") {
					next();
					return
				}
			}

			return (req, res, next) => {
				res.status(403).json({ message: "Require Admin Role!" });
			}
		});
	});
}

exports.isAuthor = (userId) => {

	User.findById(userId).exec((err, user) => {
		if (err) {
			return (req, res, next) => {
				res.status(500).json({ message: err });
			}
		}

		console.log(user.role)

		Role.find({ _id: { $in: user.role } }, (err, roles) => {
			if (err) {
				return (req, res, next) => {
					res.status(500).json({ message: err });
				}
			}

			for (let i = 0; i < roles.length; i++) {
				if (roles[i].title === "author") {
					return (req, res, next) => {
						next()
					}
				}
			}

			return (req, res, next) => {
				res.status(403).json({ message: "Require Author Role!" });
			}
		}
		);
	});
}