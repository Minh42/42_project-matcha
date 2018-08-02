let check = require('../../library/tools');
let user = require('../../models/user.class');

function findLogin(req, res, next) {

	let messages = {};
	try { 
		user.findOne("username", req.body.login).then(function(ret) {
			if (ret) {
				messages.error = "login already exist";
				res.send(messages);
			}
			else
				next();
		})
	} catch(err) {
		throw new Error(err)
	}  
}

function findEmail(req, res, next) {

	let messages = {};
	try {
		user.findOne("email", req.body.email).then(function(ret) {
			if (ret) {
				messages.error = "email already exist";
				res.send(messages);
			}
			else
				next();	
		})
	} catch(err) {
		throw new Error(err)
	}
}

function comparePassword(req, res, next) {
	let messages = {};

	if (req.body.newPassword ===  req.body.confirmedPassword) {
		next();
	}
	else {
		messages.error = "password not match";
		res.send(messages);
	}
}

module.exports.findLogin = findLogin;
module.exports.findEmail= findEmail;