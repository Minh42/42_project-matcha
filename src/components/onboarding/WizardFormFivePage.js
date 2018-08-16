import React from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import validate from './validate'
import axios from 'axios';
import { connect } from 'react-redux'
import location from '../../../library/location'

const style = {
	height: "300px",
	background: "white"
}

class WizardFormFivePage extends React.Component{

	constructor(props) {
		super(props);

	this.state = {
		message: ""
	}

	this.handleFormSubmit = this.handleFormSubmit.bind(this);
	this.handleSubmitIP = this.handleSubmitIP.bind(this);
}

	async componentDidMount(){

		const res = await axios.get('/api/findLocalisation')
		var lat = res.data.lat
		var lng = res.data.lng

		if (lat === undefined && lng === undefined) {
			lat = 52.5
			lng = 13.4
		}

		location.showLocation(lat, lng)	
		}

		async handleFormSubmit() {
			const address = document.getElementById("address").value;
			const res = await axios.get('/api/geocoder/?address=' + address)
			console.log(res.data)
			const lat = res.data.lat
			const lng = res.data.lng
			var error = res.data.error
			console.log(error)

			if (error === undefined) {
				error = ""
		
			location.showLocation(lat, lng)	
			}

			this.setState({
					message: error
				})
		}

	handleSubmitIP() {
		var x = document.getElementById("parentContainer");
		function showPosition(position) {
			x.innerHTML = "Latitude: " + position.coords.latitude + 
			"<br>Longitude: " + position.coords.longitude;
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
			axios.get('http://ip-api.com/json') 
			.then((res) => {
				console.log(res)
				var lat = res.data.lat
				var lng = res.data.lon
				location.showLocation(lat, lng)
			})
		} else { 
			x.innerHTML = "Geolocation is not supported by this browser.";
		}

	}

	
	render () {

	const { previousPage } = this.props

		return (
		<div>
		<h2 className="has-text-centered titleOnboarding">Where are you...</h2>
		<progress className="progress progressOnboarding" value="100" max="100">100%</progress>
		<br></br>
		<div className="columns">
			<div className="column is-6 has-text-centered">
				<div className="button is-small buttonOnboarding" onClick={this.handleSubmitIP}>Allow localisation</div>
				<div style={style} id="mapContainer"></div>
				<div id="parentContainer"></div>
			</div>
			<div className="column is-6">
			<form>
            <div className="field">
              <label className="label">Enter your localisation</label>
					<div className="control">
						<input 	type="text"
								id="address"
								className="input" 
								id="address" 
								placeholder="London"
								required />
						<p id="demo" className="help is-danger">{this.state.message}</p>
					</div>
            </div>
          <div>
            <div className="button is-small buttonOnboarding" onClick={this.handleFormSubmit}>Search</div>
					</div>
      </form>

			</div>
		</div>
		<div className="columns">
			<div className="column is-2">
				<button type="button" className="previous button buttonOnboarding" onClick={previousPage}>
				Previous
				</button>
			</div>
			<div className="column is-2 is-offset-8">
				<button type="submit" className="button buttonOnboarding">
				Submit
				</button>
			</div>
		</div>
		</div>
		)
	}
}

const selector = formValueSelector('wizard') // <-- same as form name
WizardFormFivePage = connect(
  state => {
	axios.post('/api/addNewinfoBDD', state.form.wizard.values)
    return {
      state
    }
  }
)(WizardFormFivePage)

export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormFivePage)