var check = require('../../../library/tools');

const validate = values => {
	const errors = {}
	if (values.birthdate !== undefined) {
		var array_birthdate = values.birthdate.split('-');
	}

	if (!values.birthdate) {
	  errors.birthdate = 'Required'
	}
	else if (values.birthdate !== undefined)
	{
		if (array_birthdate[0] > 2000) {
			errors.birthdate = 'You must be at least 18'
		} else if (array_birthdate[0] < 1900) {
			errors.birthdate = 'You are too old'
		}
	}

	if (!values.occupation) {
	  errors.occupation = 'Required'
	}
	else if (values.occupation !== undefined)
	{
		if (values.occupation.length > 50) {
			errors.occupation = 'too long'
		}
		if (!check.isOccupation(values.occupation)) {
			errors.occupation = 'at least one character'
		}
	}

	if (!values.sex) {
	  errors.sex = 'Required'
	}

	if (!values.interest) {
	  errors.interest = 'Required'
	}

	if (!values.bio) {
	  errors.bio = 'Required'
	}
	else if (values.bio !== undefined)
	{
		if (values.bio.length > 300) {
		errors.bio = 'too long'
		}
		else if (!check.isBio(values.bio)) {
			errors.bio = 'at least one character'
		}
	}
	
	if (!values.relationship) {
		errors.relationship = 'Required'
	  }
	return errors
  }
  
  export default validate