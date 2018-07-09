let check = require('../../library/tools');
let user = require('../../models/user.class');

function findLogin(req, res, next) {

	let messages = {};

	user.loginExist(req.body.login)
		.then(function(ret) {
       		console.log(ret);
			if (ret === false)
			{
				next();
			}
			else
			{
				messages.error = "login already exist";
				console.log(messages);
				res.send(messages);
			}
		})
		.catch(err => {
			console.error('loginExists error: ', err);
		})

}

function findEmail(req, res, next) {

	let messages = {};

    console.log("hello");
	user.emailExist(req.body.email)
		.then(function(ret) {
			console.log(ret);
			if (ret === false)
			{
				next();
			}
			else
			{
				messages.error = "email already exist";
				console.log(messages);
				res.send(messages);
			}
		})
		.catch(err => {
			console.error('loginExists error: ', err);
		})
}

function comparePassword(req, res, next) {
	let messages = {};

	if (req.body.newPassword ===  req.body.confirmedPassword) {
		next();
	}
	else {
		messages.error = "password not match";
		console.log(messages);
		res.send(messages);
	}
}

module.exports.findLogin = findLogin;
module.exports.findEmail= findEmail;