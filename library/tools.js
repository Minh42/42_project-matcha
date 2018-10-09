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

function isAddress(address) {
	var regex = /[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/;
	if (!regex.test(address)) return false;
	return true;
}

function isOccupation(occupation) {
	var regex = /[-a-zA-Zàâäéèêëïîôöùûüç]{1}/;
	if (!regex.test(occupation)) return false;
	return true;
}

function isBio(bio) {
	var regex = /[-a-zA-Z0-9àâäéèêëïîôöùûüç]{1}/;
	if (!regex.test(bio)) return false;
	return true;
}

function isHash(password) {
	const saltRounds = 10;
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash; 
	console.log(password)
	console.log(salt)
	hash = bcrypt.hashSync(password, salt);
	return hash;
}

function MakeQuerablePromise(promise) {
    // Don't modify any promise that has been already modified.
    if (promise.isResolved) return promise;

    // Set initial state
    var isPending = true;
    var isRejected = false;
    var isFulfilled = false;

    // Observe the promise, saving the fulfillment in a closure scope.
    var result = promise.then(
        function(v) {
            isFulfilled = true;
            isPending = false;
            return v; 
        }, 
        function(e) {
            isRejected = true;
            isPending = false;
            throw e; 
        }
    );

    result.isFulfilled = function() { return isFulfilled; };
    result.isPending = function() { return isPending; };
    result.isRejected = function() { return isRejected; };
    return result;
}

module.exports = {
	isEmpty: isEmpty,
	isFirstname: isFirstname,
	isLastname: isLastname,
	isUsername: isUsername,
	isPassword: isPassword,
	isEmail: isEmail,
	isAddress: isAddress,
	isOccupation: isOccupation,
	isBio: isBio,
	isHash: isHash,
	MakeQuerablePromise: MakeQuerablePromise
}