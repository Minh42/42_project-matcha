import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import FilesUploadContainer from '../FilesUploadContainer'

import axios from 'axios'
const path = require('path');

class WizardFormFourPage extends Component{
	constructor(props) {
        super(props);
 
		this.state = {
			selectedFile: null,
			UrlPicture: null
		}
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.uploadHandler = this.uploadHandler.bind(this);
	}

fileChangedHandler(event) {
 	this.setState({
	  selectedFile: event.target.files[0]
	})
}

async uploadHandler() {
	const data = new FormData();
	data.append('file', this.state.selectedFile)

	const res = await axios.post('/api/uploadProfilePicture', data);
		
	// const context = require.context('../../../assets/img/profile', true);
	// console.log(res.data)
	// let filename = (path.basename(res.data))
	// console.log(filename)
	// console.log(typeof filename)
	// var name = '/img/profile/out.jpeg';
	// console.log(typeof name)
	// let src = context(name)
	// alert(src);
		
	// this.setState({
	// 	UrlPicture: name
	// })
}

  render() {
	const { handleSubmit, previousPage } = this.props

	return (
		<div >
		<h2 className="has-text-centered titleOnboarding">Maybe a picture...</h2>
		<progress className="progress progressOnboarding" value="80" max="100">80%</progress>
			<FilesUploadContainer />
			<br></br>
			<div className="columns">
				<div className="column is-2">
					<button type="button" className="previous button buttonOnboarding" onClick={previousPage}>
						Previous
					</button>
				</div>
				<div className="column is-2 is-offset-8">
					<button type="submit" className="next button buttonOnboarding" onClick={handleSubmit}>
						Next
					</button>
				</div>
			</div>
		</div>
	)}
}

export default reduxForm({
  form: 'wizard', //Form name is same,
  multipartForm : true, // <- handle this form as a multipart form and send to handleSubmit a FormData object populated by the form's values
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormFourPage)