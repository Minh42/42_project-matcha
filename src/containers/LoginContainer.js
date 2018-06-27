import React, {Component} from 'react';

import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import Button from '../components/Button';

const buttonStyleSubmit = {
    fontFamily: 'Amatic SC',
    fontWeight: 'bold',
    color: 'white',
    backgroundImage: '-moz-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: '-webkit-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: ':-o-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: 'linear-gradient(60deg, #F9BE02, #F53240)',
	borderRadius: '30px',
	border: 'none',
    paddingLeft: '30px',
	paddingRight: '30px',
	fontSize: '18px'
  };

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
			<form method="post" action='/api/signin' encType="application/json" className="signin" onSubmit={this.handleFormSubmit}>
				<Input 
					type={'text'}
					title={'Username'}
					name={'username'}
					value={this.state.login}
					placeholder={'Username'}
					handleChange = {this.handleChange}
				/>
				<Input 
					type={'password'}
					title={'Password'}
					name={'password'}
					value={this.state.newPassword}
					placeholder={'6 characters minimum'}
					handleChange = {this.handleChange}
				/>
				<a href="#">Forgot your password ?</a> 
				<Button type="submit" className="button is-rounded" title="submit" style={buttonStyleSubmit}/>
			</form>
		);
	}
}
export default LoginContainer;