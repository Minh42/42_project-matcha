import React, {Component} from 'react';

import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Select from '../components/Select';

class LoginContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newUser: {
				login: '',
				Password: ''
			},
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		console.log(event.target.value);
		let value = event.target.value;
		let name = event.target.name;
		this.setState( prevState => {
		   return { 
			  newUser : {
					   ...prevState.newUser, [name]: value
					  }
		   }
		}, () => console.log(this.state.newUser)
		)
	}

	handleCheckBox(e) {

		const newSelection = e.target.value;
		let newSelectionArray;
	
		if(this.state.newUser.skills.indexOf(newSelection) > -1) {
		  newSelectionArray = this.state.newUser.skills.filter(s => s !== newSelection)
		} else {
		  newSelectionArray = [...this.state.newUser.skills, newSelection];
		}
	
		  this.setState( prevState => ({ newUser:
			{...prevState.newUser, skills: newSelectionArray }
		  })
		  )
	}

	render() {
		return (
			<form className="login" onSubmit={this.handleFormSubmit}>
				<Input 
					type={'text'}
					title={'Login'}
					name={'login'}
					value={this.state.login}
					placeholder={'Username'}
					handleChange = {this.handleChange}
				/>
				<Input 
					type={'password'}
					title={'Password'}
					name={'newPassword'}
					value={this.state.newPassword}
					placeholder={'6 characters minimum'}
					handleChange = {this.handleChange}
				/>		
			</form>
		);
	}
}
export default LoginContainer;