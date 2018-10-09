import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'

import axios from 'axios';
import TagsComponent from '../TagsComponent';

class WizardFormThirdPage extends React.Component{

	renderFieldArea(field) {
		const { meta: { touched, error } } = field;
		const className= `input ${touched && error ? 'is-danger' : ''}`;

		return (
			<div className= "field">
				<label className="label labelOnboarding">{field.label}</label>
					<textarea
						className={className}
						type={field.type}
						placeholder={field.placeholder}
						{ ...field.input}
					/>
				<div className="help is-danger">
					{touched ? error : ''}
				</div>
			</div>
		);
	}

	render () {
		const { handleSubmit, previousPage } = this.props;

	return (
		<form onSubmit={handleSubmit}>
      <h2 className="has-text-centered titleOnboarding">We are so curious...</h2>
      <progress className="progress progressOnboarding" value="60" max="100">60%</progress>
					<Field
					label="Enter your bio (max 300)"
					name="bio"
					component={this.renderFieldArea}
					type="text"
					/>
          <TagsComponent />
        <br></br>
        <div className="columns">
          <div className="column is-2">
            <button type="button" className="previous button buttonOnboarding" onClick={previousPage}>
              Previous
            </button>
          </div>
          <div className="column is-2 is-offset-8">
            <button id="disabled" type="submit" className="next button buttonOnboarding" disabled={false} >
              Next
            </button>
          </div>
        </div>
		</form>
	)}
}

export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormThirdPage)