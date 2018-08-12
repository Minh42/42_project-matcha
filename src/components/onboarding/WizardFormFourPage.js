import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
// import step3 from '../../../assets/img/step3.png'

import axios from 'axios'

class WizardFormFourPage extends React.Component{
	constructor(props) {
        super(props);
 
		this.state = {
			selectedFile: null,
			UrlPicture: require('../../../assets/img/profile/Sat Aug 11 2018 18:14:37 GMT+0200 (CEST).jpeg')
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

	const res = await axios.post('/api/uploadProfilePicture', data) 
	const filename = res.data
	console.log(filename)
	const path = "../../../" + filename
	console.log(path)
	this.setState({
		UrlPicture: require(path)
	  })
}

  render() {
	const { handleSubmit, previousPage } = this.props

	return (
		<form onSubmit={handleSubmit}>
		<h2 className="has-text-centered titleOnboarding">Maybe a picture...</h2>
		<progress className="progress progressOnboarding" value="80" max="100">80%</progress>
			<div className="columns">
				<div className="column">
					<figure className="image is-128x128">
					{this.state.UrlPicture}
						<img src={this.state.UrlPicture}/>
					</figure>
				</div>
			</div>
			<div>
				<input type="file" onChange={this.fileChangedHandler} name="file"/>
				<div onClick={this.uploadHandler}>Upload!</div>
			</div>
			<br></br>
			<div className="columns">
				<div className="column is-2">
					<button type="button" className="previous button buttonOnboarding" onClick={previousPage}>
						Previous
					</button>
				</div>
				<div className="column is-2 is-offset-8">
					<button type="submit" className="next button buttonOnboarding">
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
})(WizardFormFourPage)