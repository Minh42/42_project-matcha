var bcrypt = require('bcryptjs');

function isEmpty(data) {
	if (data === undefined || data === "") return true;
	return false;
}

function isFirstname(firstname) {
	var regex = /^[a-zA-Z_]{1,32}$/
	if (!regex.test(firstname)) return false;
	return true;
}

function isLastname(lastname) {
	var regex = /^[a-zA-Z_]{1,32}$/
	if (!regex.test(lastname)) return false;
	return true;
}

function isUsername(username) {
	var regex = /^[a-zA-Z0-9_]{5,16}$/;
	if (!regex.test(username)) return false;
	return true;
}

function isPassword(password) {
	var regex = /(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
	if (!regex.test(password)) return false;
	return true;
}

function isEmail(email) {
	var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!regex.test(email)) return false;
	return true;
}

function isHash(password) {
	const saltRounds = 10;
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash; 
	hash = bcrypt.hashSync(password, salt);
	return hash;
}

module.exports = {
	isEmpty: isEmpty,
	isFirstname: isFirstname,
	isLastname: isLastname,
	isUsername: isUsername,
	isPassword: isPassword,
	isEmail: isEmail,
	isHash: isHash
}