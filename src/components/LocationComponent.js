import React from 'react'
import location from '../../library/location'
import axios from 'axios';

const style = {
	height: "300px",
	background: "white"
}

class LocationComponent extends React.Component {
	constructor(props) {
		super(props);

	this.state = {
		message: "",
		allow: "Allow localisation"
	}

	this.handleFormSubmit = this.handleFormSubmit.bind(this);
	this.handleSubmitIP = this.handleSubmitIP.bind(this);	
	}

		async componentDidMount(){
			var lat;
			var lng;
			const stateGeolocalisation = await axios.post('/api/localisationAllowedORnot')
			if (stateGeolocalisation.data === 1) {
				const res = await axios.get('/api/findLocalisation')
				lat = res.data.lat
				lng = res.data.lng
				var title = res.data.message

				if (lat === undefined && lng === undefined) {
					lat = 52.5
					lng = 13.4
				}
				location.showLocation(lat, lng)	

				this.setState({
					allow: title
				})
			} else {
				lat = null
				lng = null
				location.showLocation(lat, lng)	
			}
		}

	async handleFormSubmit() {
		var message;
		const address = document.getElementById("address").value;
		const res = await axios.get('/api/geocoder/?address=' + address)
		const lat = res.data.lat
		const lng = res.data.lng
		var error = res.data.error

		const res1 = await axios.get('https://ipinfo.io?token=517ce1a907a9ec')
		const data = {
			ip : res1.data.ip,
			lat: lat,
			lng: lng
		}
		await axios.post('/api/localisationAllowed', data)

		if (error === undefined) {
			error = ""
			message = "Disable localisation";
			this.setState({
				allow: message
			})
			location.showLocation(lat, lng)	
		}

		this.setState({
				message: error
			})
	}

	handleSubmitIP() {
		var message;
		var x = document.getElementById("parentContainer");
		function showPosition(position) {
			x = "Latitude: " + position.coords.latitude + 
			"<br>Longitude: " + position.coords.longitude;
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
				axios.post('/api/localisationAllowedORnot')
					.then((ret) => {
						if (ret.data === 0) {
							message = "Disable localisation"
							axios.get('https://ipinfo.io?token=517ce1a907a9ec')
								.then((res) => {
									var loc = res.data.loc
									var locationSplit = loc.split(',')						
									var lat = locationSplit[0]
									var lng = locationSplit[1]
									const data = {
										ip : res.data.ip,
										lat: lat,
										lng: lng
									}
									axios.post('/api/localisationAllowed', data)
										.then((ret) => {
											location.showLocation(lat, lng)
											this.setState({
												allow: message
											})
										})
								})
						} else {
							message = "Allow localisation"
							const data = {
								ip : null,
								lat: null,
								lng: null
							}
							axios.post('/api/localisationDisable', data)
								.then((ret) => {
									location.showLocation(null, null)
									this.setState({
										allow: message
									})
								})
						}
					})
		} else { 
			x.innerHTML = "Geolocation is not supported by this browser.";
		}

	}

	render () {

		return (
			<div className="columns">
				<div className="column is-6 has-text-centered">
					<div className="button is-small buttonLocation" onClick={this.handleSubmitIP}>{this.state.allow}</div>
					<div style={style} id="mapContainer"></div>
					<div id="parentContainer"></div>
				</div>
				<div className="column is-6">
					<form>
					<div className="field">
					<label className="label is-small labelOnboarding">Enter your localisation</label>
							<div className="control">
								<input 	type="text"
										id="address"
										className="input" 
										id="address" 
										placeholder="ex: 18 rue de la paix Paris"
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
		)
	}
}

export default LocationComponent;