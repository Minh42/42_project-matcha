import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
// import step3 from '../../../assets/img/step3.png'

import axios from 'axios'
const path = require('path');

class WizardFormFourPage extends Component{
	constructor(props) {
        super(props);
 
		this.state = {
			selectedFile: null,
			UrlPicture: require('../../../assets/img/step3.png')
		}
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.uploadHandler = this.uploadHandler.bind(this);
	}

fileChangedHandler(event) {
 	this.setState({
	  selectedFile: event.target.files[0]
	})
}

// uploadPicture(file) {
//     for (let i = 0; i < file.length; i++) {
//       var reader = new FileReader();
//       reader.onload = (e) => {
//         axios.post('http://localhost:3001/upload_picture', { "userId": Cookies.get('id'), "picture": e.target.result
//         }).then(response => {
//           const pictures = this.state.pictures
//           console.log(pictures)
//           let i
//           for (i = 0; i < pictures.length; i++) {
//             if (pictures[i] === null)
//               break
//           }
//           pictures.splice(i, 1, response.data)
//           this.setState({pictures: pictures})
//         })
//       }
//       reader.readAsDataURL(file[i])
//     }
// }



uploadHandler() {


	var reader = new FileReader();

	reader.readAsDataURL(this.state.selectedFile)

	reader.onload = (e) => {
		const data = new FormData();
		data.append('file', e.target.result);
		const res = axios.post('/api/uploadProfilePicture', data).then(res => {
			console.log('hello');
		})
	}




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