import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import FilesUploadContainer from '../FilesUploadContainer'

class WizardFormFourPage extends Component {
	render() {
	const { handleSubmit, previousPage } = this.props
	return (
		<form onSubmit={handleSubmit}>
			<h2 className="has-text-centered titleOnboarding">Maybe a picture...</h2>
			<progress className="progress progressOnboarding" value="80" max="100">80%</progress>
			<FilesUploadContainer />
			<div className="columns">
				<div className="column is-2">
					<button type="button" className="previous button buttonOnboarding" onClick={previousPage}>
						Previous
					</button>
				</div>
				<div className="column is-2 is-offset-8">
					<button id="next" type="submit" className="next button buttonOnboarding" disabled={false}>
						Next
					</button>
				</div>
			</div>
		</form>
	)}
}

export default reduxForm({
  form: 'wizard', //Form name is same,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormFourPage)