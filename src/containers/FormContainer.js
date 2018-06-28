import React, {Component} from 'react';

import axios from 'axios'
import $ from 'jquery'

import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import Button from '../components/Button'; 

const buttonStyle = {
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
    paddingRight: '30px'
  };

class FormContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newUser: {
				firstname: '',
				lastname: '',
				login: '',
				email: '',
				newPassword: '',
				confirmedPassword: '',
				gender: '',
				about: '',
				skills: []
			},
			genderOptions: ['Male', 'Female', 'Others'],
			skillOptions: ['Programming', 'Development', 'Design', 'Testing']
		}

		this.handleChange = this.handleChange.bind(this);
		this.send = this.send.bind(this);
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

	// handleCheckBox(e) {

	// 	const newSelection = e.target.value;
	// 	let newSelectionArray;
	
	// 	if(this.state.newUser.skills.indexOf(newSelection) > -1) {
	// 	  newSelectionArray = this.state.newUser.skills.filter(s => s !== newSelection)
	// 	} else {
	// 	  newSelectionArray = [...this.state.newUser.skills, newSelection];
	// 	}
	
	// 	  this.setState( prevState => ({ newUser:
	// 		{...prevState.newUser, skills: newSelectionArray }
	// 	  })
	// 	  )
	// }


	send(){
		var formData = {
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            login: $("#login").val(),
            email: $("#email").val(),
            newPassword: $("#newPassword").val(),
            confirmedPassword: $("#confirmedPassword").val()
		} 

		console.log(formData)

		axios({
			method: 'post',
			url: '/api/signup',
			data: formData
		})
		.then((res) => {
			console.log("Réponse : ", res.data.empty);
			if (res.data.empty !== null)
				$("#error").text(res.data.empty);
			else
				$("#error").text("");

		})
	}

	render() {
		return (
			<form className="signup">
				<Input 
					type={'text'}
					id={'firstname'}
					title={'First Name'}
					name={'firstname'}
					value={this.state.firstname}
					placeholder={'First name'}
					handleChange = {this.handleChange}
				/>
				<Input 
					type={'text'}
					id={'lastname'}
					title={'Last Name'}
					name={'lastname'}
					value={this.state.lastname}
					placeholder={'Last name'}
					handleChange = {this.handleChange}
				/>
				<Input 
					type={'text'}
					id={'login'}
					title={'Login'}
					name={'login'}
					value={this.state.login}
					placeholder={'Username'}
					handleChange = {this.handleChange}
				/>
				<Input 
					type={'email'}
					id={'email'}
					title={'Email'}
					name={'email'}
					value={this.state.email}
					placeholder={'Email address'}
					handleChange = {this.handleChange}
				/>
				<Input 
					type={'password'}
					id={'newPassword'}
					title={'Password'}
					name={'newPassword'}
					value={this.state.newPassword}
					placeholder={'6 characters minimum'}
					handleChange = {this.handleChange}
				/>
				<Input 
					type={'password'}
					id={'confirmedPassword'}
					title={'Confirmed password'}
					name={'confirmedPassword'}
					value={this.state.confirmedPassword}
					placeholder={'6 characters minimum'}
					handleChange = {this.handleChange}
				/>
				{/* <Select 
					title={'Gender'}
					name={'gender'}
					options = {this.state.genderOptions} 
					value = {this.state.newUser.gender}
					placeholder = {'Select Gender'}
					handleChange = {this.handleChange}
				/>
				<TextArea
					title={'About you'}
					rows={10}
					cols={10}
					value={this.state.newUser.about}
					name={'about'}
					handleChange={this.handleChange}
					placeholder={'Describe your past experience and skills'} 
				/> */}
				<p id="error"></p>
				<Button type='button' className="button is-rounded" title="submit" style={buttonStyle} action={this.send}/>
			</form>
		);
	}
}
export default FormContainer;