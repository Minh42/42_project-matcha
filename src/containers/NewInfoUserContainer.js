import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from "../components/Button";
import renderField from '../components/renderField'
import axios from 'axios';

const relationship = ['marriage', 'casual sex', 'friends', 'one night stand', 'long term relationship', 'short term relationship']

const renderRelationshipSelector = ({ input , meta: { touched, error } }) => (
	<div>
		<select {...input}>
			<option value="">Select a relation...</option>
			{relationship.map(val => (
				<option value={val} key={val}>
					{val}
				</option>
			))}
		</select>
		{touched && error && <span className="help is-danger">{error}</span>}
	</div>
)

class NewInfoUserContainer extends React.Component{

	constructor() {
        super()
        this.state = {
            messagesSuccess : ""
        }
    }

	renderFieldArea(field) {
		const { meta: { touched, error } } = field;
		const className= `input is-small ${touched && error ? 'is-danger' : ''}`;

		return (
			<div className= "field">
				<label className="label is-small labelOnboarding">{field.label}</label>
					<textarea
						className={className}
						type={field.type}
						placeholder={field.placeholder}
						{ ...field.input}
					/>
				<div className= "help is-danger">
					{touched ? error : ''}
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.handleInitialize();
	}
	
	async handleInitialize() {
		const birthdate = this.props.user.infos.birth_date
		const birthdateSplit = birthdate.substring(0, 10);
		const initData = {
			"birthdate": birthdateSplit,
			"sex": this.props.user.infos.gender,
			"occupation" : this.props.user.infos.occupation,
			"bio": this.props.user.infos.bio,
			"interest": this.props.user.interest[0].name,
			"relationship": this.props.user.relationship[0].name
		};
		this.props.initialize(initData);
	  }

	onSubmit (values){
		axios.post(`/api/addNewinfoBDD`, values)
		.then((ret) => {
			if (ret)
				axios.post('/api/addRelationshipBDD', values)
				 	.then((res) => {
						if (res.data === "success" && ret.data === "success") {
							this.setState({
								messagesSuccess: 'modifications changed'
							})
						}
					 })
		})
	}

	render () {
		const { handleSubmit } = this.props;

		const renderErrorRadio = ({ meta: { touched, error } }) =>
		touched && error ? <span className= "help is-danger">{error}</span> : false
		  
		const renderErrorInterest = ({ meta: { touched, error } }) =>
  		touched && error ? <span className= "help is-danger">{error}</span> : false

	return (
		<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
				<Field
					name="birthdate" 
					type="date"
					component={renderField}
					label="Birthdate"
					className="input"
				/>
				<label className="label is-small labelOnboarding">Sex</label>
				<label className="radio">
					<Field
						name="sex"
						component="input"
						type="radio"
						value="man"
					/>{' '}
					Male
					</label>
					<label className="radio">
					<Field
						name="sex"
						component="input"
						type="radio"
						value="woman"
					/>{' '}
					Female
					</label>
					<Field name="sex" component={renderErrorRadio} />

					<Field
						name="occupation"
						type="text"
						component={renderField}
						label="Occupation"
						className="input"
					/>

				<label className="label is-small labelOnboarding">Interesting in</label>
				<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="man"
						/>{' '}
						Men
					</label>
					<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="woman"
						/>{' '}
						Women
					</label>
					<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="man and woman"
						/>{' '}
						Both
					</label>
					<Field name="interest" component={renderErrorInterest} />
				<div>
					<label className="label is-small labelOnboarding">Relationship</label>
					<div className="field">
						<div className="select">
						<Field name="relationship" component={renderRelationshipSelector}/>
						</div>
					</div>
				</div>
					<Field
					label="Enter your bio"
					name="bio"
					component={this.renderFieldArea}
					type="text"
					/>
			<p className="help is-success">{this.state.messagesSuccess}</p>
			<Button type="submit" className="button is-small is-fullwidth buttonOnboarding" title="Change these informations"/>
		</form>
	)}
}

function validate(values) {
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
			errors.birthdate = 'Please enter a valid birth year'
		}
	}

	if (!values.occupation) {
	  errors.occupation = 'Required'
	}
	else if (values.occupation !== undefined)
	{
		if (values.occupation.length > 50) {
		errors.occupation = 'Please write a shorter description of your occupation'
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
		errors.bio = 'Please write a shorter description of yourself'
		}
	}
	
	if (!values.relationship) {
		errors.relationship = 'Required'
	  }
	return errors
}

const reduxFormNewInfoUserContainer = reduxForm({
	validate,
	form : 'newInfoUser'
}) (NewInfoUserContainer)

export default reduxFormNewInfoUserContainer;