import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import step3 from '../../../assets/img/step3.png'

import axios from 'axios'
// var path = require('path');

class WizardFormFourPage extends React.Component{
	constructor(props) {
        super(props);
 
		this.state = {
			selectedFile: null,
			UrlPicture: step3
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
	// let assetsPath = require.context('../../../assets/img/profile', true, /\.(png|jpe?g|svg)$/);
	console.log(res.data)
	const name = res.data
	
	const filename = "../../../assets/img/profile/" + name;
	console.log(filename)
	// const path = "'../../../" + filename + "'"
	// console.log(path)
	this.setState({
		UrlPicture: filename
	  })
}

  render() {
	const { handleSubmit, previousPage } = this.props

	return (
		<div>
		<h2 className="has-text-centered titleOnboarding">Maybe a picture...</h2>
		<progress className="progress progressOnboarding" value="80" max="100">80%</progress>
			<div className="columns">
				<div className="column">
					<figure className="image is-128x128">
					{this.state.UrlPicture}
						<img id="imageid" src={this.state.UrlPicture}/>
					</figure>
				</div>
			</div>
			<form>
				<div className="field">
					<div className="control">
						<input type="file" onChange={this.fileChangedHandler} name="file"/>
					</div>
				</div>
				<div onClick={this.uploadHandler}>Upload!</div>
			</form>
			<br></br>
			<div className="columns">
				<div className="column is-2">
					<button type="button" className="previous button buttonOnboarding" onClick={previousPage}>
						Previous
					</button>
				</div>
				<div className="column is-2 is-offset-8">
					<button className="next button buttonOnboarding" onClick={handleSubmit}>
						Next
					</button>
				</div>
			</div>
		</div>
	)}
}
export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormFourPage)