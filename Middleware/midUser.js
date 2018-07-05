let check = require('../library/tools');
let user = require('../models/user.class');

function empty(req, res, next) {

	var messages = {};

	if (check.isEmpty(req.body.firstname) || check.isEmpty(req.body.lastname) || check.isEmpty(req.body.login) 
	|| check.isEmpty(req.body.email) || check.isEmpty(req.body.newPassword) || check.isEmpty(req.body.confirmedPassword))
	{
		messages.error = "Veuillez remplir les champs vide";
		console.log(messages);
		res.send(messages);
	}
	else
	{
		next();
	}
}

function regex(req, res, next) {

	var messages = {};

	messages.error = null;
	if (!check.isFirstname(req.body.firstname) || !check.isLastname(req.body.lastname) || !check.isUsername(req.body.login)
	|| !check.isEmail(req.body.email) || !check.isPassword(req.body.newPassword) || !check.isPassword(req.body.confirmedPassword))
	{
		if (!check.isFirstname(req.body.firstname))
			messages.errorFirstname = "Votre prenom n'est pas valide";
		else
			messages.errorFirstname = null;
		if (!check.isLastname(req.body.lastname))
			messages.errorLastname = "Votre nom n'est pas valide";
		else
			messages.errorLastname = null;
		if (!check.isUsername(req.body.login))
			messages.errorLogin = "Votre login n'est pas valide";
		else
			messages.errorLogin = null;
		if (!check.isEmail(req.body.email))
			messages.errorEmail = "Votre email n'est pas valide";
		else
			messages.errorEmail = null;
		if (!check.isPassword(req.body.newPassword))
			messages.errorPassword = "Votre password n'est pas valide";
		else
			messages.errorPassword = null;
		if (!check.isPassword(req.body.confirmedPassword))
			messages.errorConfirmedPassword = "Votre password n'est pas valide";
		else
			messages.errorConfirmedPassword = null;
		console.log(messages);
		res.send(messages);
	}
	else
    {
		messages.errorFirstname = null;
		messages.errorLastname = null;
		messages.errorLogin = null;
		messages.errorEmail = null;
		messages.errorPassword = null;
		messages.errorConfirmedPassword = null;
		
		next();
	}
}

function findLogin(req, res, next) {

	let messages = {};

	messages.errorFirstname = null;
	messages.errorLastname = null;
	messages.errorLogin = null;
	messages.errorEmail = null;
	messages.errorPassword = null;
	messages.errorConfirmedPassword = null;

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


module.exports.empty = empty;
module.exports.regex = regex;
module.exports.findLogin = findLogin;
module.exports.findEmail= findEmail;
module.exports.comparePassword= comparePassword;