import React from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import Button from "../components/Button";
import { WithContext as ReactTags } from 'react-tag-input';

import axios from 'axios';

const KeyCodes = {
	comma: 188,
	enter: 13,
  };
   
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

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
				<div className={field.icon ? "control has-icons-left" : ''}>
                    <span className={field.icon ? "icon is-small is-left" : ''}>
                        <i className={field.icon}></i>
                    </span>
					<input
						className={className}
						type={field.type}
						placeholder={field.placeholder}
						{ ...field.input}
					/>
				</div>
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
				<div className={field.icon ? "control has-icons-left" : ''}>
                    <span className={field.icon ? "icon is-small is-left" : ''}>
                        <i className={field.icon}></i>
                    </span>
					<textarea
						className={className}
						type={field.type}
						placeholder={field.placeholder}
						{ ...field.textarea}
					/>
				</div>
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
		console.log(initData)
		this.props.initialize(initData);
	  }

	async onSubmit (values){
		console.log(values)
		const res = await axios.post(`/api/modifData`, values)
        console.log(res)
	}

	render () {
		const { handleSubmit } = this.props;
		const { tags } = this.state;
		let placeholder = "Add new Tag"

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
				<div className="field">
				<label className="radio">
					<Field
					name="sex"
					component="input"
					type="radio"
					value="male"
					checked
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
				</div>
				<label className="label">Interesting in</label>
				<div className="field">
				<label className="radio">
					<Field
					name="sex"
					component="input"
					type="radio"
					value="male"
					defaultChecked={true}
					/>{' '}
					Male
				</label>
				<label className="radio">
					<Field
					name="sex"
					component="input"
					type="radio"
					value="women"
					/>{' '}
					women
				</label>
				<label className="radio">
					<Field
					name="sex"
					component="input"
					type="radio"
					value="both"
					checked
					/>{' '}
					Both
				</label>
				</div>
				<div>
					<label className="label">Relationship</label>
					<div className="field">
						<div className="select">
						<Field name="relationship" component="select">
							<option >Marriage</option>
							<option>Casual sex</option>
							<option>friends</option>
							<option>One night stand</option>
							<option>Long term relationship</option>
							<option>Short term relationship'</option>
						</Field>
						</div>
					</div>
				</div>
					<Field
					label="Enter your bio"
					name="bio"
					component={this.renderField}
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

	return errors;
}

const reduxFormNewInfoUserContainer = reduxForm({
	validate,
	form : 'newInfoUser'
}) (NewInfoUserContainer)

export default reduxFormNewInfoUserContainer;