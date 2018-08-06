import React from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import Button from "../components/Button";
import { WithContext as ReactTags } from 'react-tag-input';

import axios from 'axios';

const KeyCodes = {
	comma: 188,
	enter: 13,
	space: 32,
  };
   
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

class NewInfoUserContainer extends React.Component{
	constructor(props) {
        super(props);
 
        this.state = {
            tags: [
             ],
        };
        this.handleDelete = this.handleDelete.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
	}
	
	handleDelete(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
 
    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
	}
 
	renderField(field) {
		const { meta: { touched, error } } = field;
		const className= `input ${touched && error ? 'is-danger' : ''}`;

		return (
			<div className= "field">
				<label className="label">{field.label}</label>
					<input
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

	renderFieldArea(field) {
		const { meta: { touched, error } } = field;
		const className= `input ${touched && error ? 'is-danger' : ''}`;

		return (
			<div className= "field">
				<label className="label">{field.label}</label>
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
		const res = await axios.get('/api/infoUser');
		const initData = {
			"user_id": res.data[0].user_id,
			"login": res.data[0].username,
			"firstName": res.data[0].firstname,
			"lastName": res.data[0].lastname,
			"email": res.data[0].email
		};
		this.props.initialize(initData);
	  }

	async onSubmit (values){
		const data = {
			values :values,
			tags: this.state.tags
		}
		const res = await axios.post(`/api/changeNewInfo`, data)
	}

	render () {
		const { handleSubmit } = this.props;
		const { tags } = this.state;
		const placeholder = "Add new Tag"

		const renderErrorRadio = ({ meta: { touched, error } }) =>
		touched && error ? <span className= "help is-danger">{error}</span> : false
		  
		const renderErrorInterest = ({ meta: { touched, error } }) =>
  		touched && error ? <span className= "help is-danger">{error}</span> : false

	return (
		<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
				<Field
				label="Birthdate"
                name="birthdate"
                component={this.renderField}
                type="number"
                placeholder="birthdate"
                />
				<label className="label">Sex</label>
					<label className="radio">
						<Field
						name="sex"
						component="input"
						type="radio"
						value="male"
						/>{' '}
						M
					</label>
					<label className="radio">
						<Field
						name="sex"
						component="input"
						type="radio"
						value="female"
						/>{' '}
						F
					</label>
					<Field name="sex" component={renderErrorRadio} />
				<label className="label">Interesting in</label>
					<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="men"
						/>{' '}
						Men
					</label>
					<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="women"
						/>{' '}
						Women
					</label>
					<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="both"
						/>{' '}
						Both
					</label>
					<Field name="interest" component={renderErrorInterest} />
				<div>
					<label className="label">Relationship</label>
					<div className="field">
						<div className="select">
						<Field name="relationship" component="select">
							<option>Marriage</option>
							<option>Casual sex</option>
							<option>friends</option>
							<option>One night stand</option>
							<option>Long term relationship</option>
							<option>Short term relationship</option>
						</Field>
						</div>
					</div>
				</div>
					<Field
					label="Enter your bio"
					name="bio"
					component={this.renderFieldArea}
					type="text"
					/>
				<div class="field">
					<label class="label">Tags</label>
					<ReactTags
						tags={tags}
						handleDelete={this.handleDelete}
						handleAddition={this.handleAddition}
						delimiters={delimiters} 
						placeholder={placeholder}
					/>
				</div>
			<Button type="submit" className="button is-rounded" title="Change these informations"/>
		</form>
	)}
}

function validate(values) {
	console.log(values)
	let check = require('../../library/tools');
	let errors = {};

	if (!values.birthdate)
		errors.birthdate = "Please enter your birthdate";

	if (!values.bio)
		errors.bio = "Please enter your bio";

	if (!values.sex)
		errors.sex = "Required";

	if (!values.interest)
		errors.interest = "Required"

	return errors;
}

const reduxFormNewInfoUserContainer = reduxForm({
	validate,
	form : 'newInfoUser'
}) (NewInfoUserContainer)

export default reduxFormNewInfoUserContainer;