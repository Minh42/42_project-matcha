import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import axios from 'axios';
import { Z_MEM_ERROR } from 'zlib';

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
}

	async componentDidMount(){

		// const res = await axios.get('/api/findLocalisation')
		var platform = new H.service.Platform({
									'app_id': 'HCNqC0RcmL39gXGywpWp',
			  					'app_code': 'TQVQp_tmDvVeacAsGbVbqA'
									});

		var defaultLayers = platform.createDefaultLayers();
		var map = new H.Map(document.getElementById('mapContainer'),
						defaultLayers.normal.map,
						{
						center: {lat: 52.5, lng: 13.4},
						zoom: 10
						});
		var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
		var ui = H.ui.UI.createDefault(map, defaultLayers);
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
		
			document.getElementById("mapContainer").remove()

			const newDiv = document.createElement('div')
			newDiv.setAttribute("id", "mapContainer")
			const currentDiv = document.getElementById("parentContainer"); 
			currentDiv.parentNode.insertBefore(newDiv, currentDiv);

			const divCreate = document.getElementById('mapContainer')
			divCreate.style.height = "300px"

			var platform = new H.service.Platform({
				'app_id': 'HCNqC0RcmL39gXGywpWp',
				'app_code': 'TQVQp_tmDvVeacAsGbVbqA'
				});
			var defaultLayers = platform.createDefaultLayers();		
			var map = new H.Map(document.getElementById('mapContainer'),
						defaultLayers.normal.map,
						{
						center: {lat: lat, lng: lng},
						zoom: 10
						});
			var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
			var ui = H.ui.UI.createDefault(map, defaultLayers);
			}

			this.setState({
					message: error
				})
		}

	
	render () {

	const { pristine, previousPage, submitting } = this.props

		return (
		<div>
		<h2 className="has-text-centered titleOnboarding">Where are you...</h2>
		<progress className="progress progressOnboarding" value="100" max="100">100%</progress>
		<br></br>
		<div className="columns">
			<div className="column is-6">
          <p>Location</p>
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
								<p className="help is-danger">{this.state.message}</p>
								</div>
            </div>
          <div>
            <div className="button buttonOnboarding" onClick={this.handleFormSubmit}>Search</div>
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
				<button type="submit" className="button buttonOnboarding" disabled={pristine || submitting}>
				Submit
				</button>
			</div>
		</div>
		</div>
		)
	}
}
export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormFivePage)