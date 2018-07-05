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
		this.handleSubmit = this.handleSubmit.bind(this);
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

	handleSubmit(event) {
		
		var formData = {
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            login: $("#login").val(),
            email: $("#email").val(),
            newPassword: $("#newPassword").val(),
			confirmedPassword: $("#confirmedPassword").val()
		}

		axios({
			method: 'post',
			url: '/api/signup',
			data: formData
		})
		.then((res) => {
			console.log("Réponse : ", res.data);
			if (res.data.error !== null)
				$("#errorSignUp").text(res.data.error);
			else
				$("#errorSignUp").text("");
			if (res.data.errorFirstname !== null)
				$("#errorFirstname").text(res.data.errorFirstname);
			else
				$("#errorFirstname").text("");
			if (res.data.errorLastname !== null)
				$("#errorLastname").text(res.data.errorLastname);
			else
				$("#errorLastname").text("");
			if (res.data.errorLogin !== null)
				$("#errorLogin").text(res.data.errorLogin);
			else
				$("#errorLogin").text("");
			if (res.data.errorEmail !== null)
				$("#errorEmail").text(res.data.errorEmail);
			else
				$("#errorEmail").text("");
			if (res.data.errorPassword !== null)
				$("#errorNewPassword").text(res.data.errorPassword);
			else
				$("#errorNewPassword").text("");
			if (res.data.errorConfirmedPassword !== null)
				$("#errorConfirmedPassword").text(res.data.errorConfirmedPassword);
			else
				$("#errorConfirmedPassword").text("");
			if (res.data.newUser === true)
			{
				document.getElementById('modal').classList.remove("is-active");
				document.getElementById('modalEmail').classList.add("is-active");
			}
		})
		event.preventDefault();
	  }

	render() {
		return (
			<form className="signup" onSubmit={this.handleSubmit}>
				<Input 
					type={'text'}
					id={'firstname'}
					title={'First Name'}
					name={'firstname'}
					value={this.state.firstname}
					placeholder={'First name'}
					handleChange = {this.handleChange}
				/>
				<p id="errorFirstname"></p>
				<Input 
					type={'text'}
					id={'lastname'}
					title={'Last Name'}
					name={'lastname'}
					value={this.state.lastname}
					placeholder={'Last name'}
					handleChange = {this.handleChange}
				/>
				<p id="errorLastname"></p>
				<Input 
					type={'text'}
					id={'login'}
					title={'Login'}
					name={'login'}
					value={this.state.login}
					placeholder={'Username'}
					handleChange = {this.handleChange}
				/>
				<p id="errorLogin"></p>
				<Input 
					type={'email'}
					id={'email'}
					title={'Email'}
					name={'email'}
					value={this.state.email}
					placeholder={'Email address'}
					handleChange = {this.handleChange}
				/>
				<p id="errorEmail"></p>
				<Input 
					type={'password'}
					id={'newPassword'}
					title={'Password'}
					name={'newPassword'}
					value={this.state.newPassword}
					placeholder={'6 characters minimum'}
					handleChange = {this.handleChange}
				/>
				<p id="errorNewPassword"></p>
				<Input 
					type={'password'}
					id={'confirmedPassword'}
					title={'Confirmed password'}
					name={'confirmedPassword'}
					value={this.state.confirmedPassword}
					placeholder={'6 characters minimum'}
					handleChange = {this.handleChange}
				/>
				<p id="errorConfirmedPassword"></p>
				<p id="errorSignUp"></p>
				<Button type='submit' className="button is-rounded" title="submit" style={buttonStyle}/>
			</form>
		);
	}
}
export default FormContainer;