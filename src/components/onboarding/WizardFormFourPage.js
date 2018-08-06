import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'

class WizardFormFourPage extends React.Component{
	constructor(props) {
        super(props);
 
		this.state = {
			selectedFile: null
		}
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.uploadHandler = this.uploadHandler.bind(this);
	}

fileChangedHandler(event) {
	console.log(event.target.files[0].name)
  this.setState({
	  selectedFile: event.target.files[0].name
	})
}

fileChangedHandler(event) {
	const file = event.target.files[0]
}
	  
uploadHandler() {
	console.log(this.state.selectedFile)
	console.log('here upload') 
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
						<img src="https://bulma.io/images/placeholders/256x256.png"/>
					</figure>
				</div>
			</div>
			<div>
				<input type="file" onChange={this.fileChangedHandler}/>
				<button onClick={this.uploadHandler}>Upload!</button>
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