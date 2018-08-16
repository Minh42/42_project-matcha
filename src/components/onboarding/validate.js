const validate = values => {
	// console.log(values)
	const errors = {}
	// if (values.birthdate !== undefined) {
	// 	var array_birthdate = values.birthdate.split('-');
	// 	console.log(array_birthdate[0])
	// }

	// if (!values.birthdate) {
	//   errors.birthdate = 'Required'
	// }
	// else if (values.birthdate !== undefined)
	// {
	// 	if (array_birthdate[0] > 2000) {
	// 		errors.birthdate = 'You must be at least 18'
	// 	}	
	// }

	// if (!values.occupation) {
	//   errors.occupation = 'Required'
	// }
	// else if (values.occupation !== undefined)
	// {
	// 	if (values.occupation.length > 50) {
	// 	errors.occupation = 'too long'
	// 	}
	// }

	// if (!values.sex) {
	//   errors.sex = 'Required'
	// }

	// if (!values.interest) {
	//   errors.interest = 'Required'
	// }

	// if (!values.bio) {
	//   errors.bio = 'Required'
	// }
	// else if (values.bio !== undefined)
	// {
	// 	if (values.bio.length > 300) {
	// 	errors.bio = 'too long'
	// 	}
	// }
	
	// if (!values.relationship) {
	// 	errors.relationship = 'Required'
	//   }
	return errors
  }
  
  export default validate