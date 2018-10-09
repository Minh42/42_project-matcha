import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import validate from './validate';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchCurrentUser } from '../../actions/actionUsers';
import LocationComponent from '../LocationComponent';
import { bindActionCreators } from 'redux';

class WizardFormFivePage extends Component{

	constructor(props) {
		super(props);

	this.handleOnboardingSubmit = this.handleOnboardingSubmit.bind(this);
}

	async handleOnboardingSubmit() {
		const stateGeolocalisation = await axios.post('/api/localisationAllowedORnot')
		if (stateGeolocalisation.data === 0) {
			const ret = await axios.get('https://ipinfo.io?token=517ce1a907a9ec')
			var loc = ret.data.loc
			var locationSplit = loc.split(',')						
			var lat = locationSplit[0]
			var lng = locationSplit[1]
			const data = {
				ip : ret.data.ip,
				lat: lat,
				lng: lng
			}
			await axios.post('/api/localisationNotAllowed', data)
			const res1 = await axios.post('/api/changeOnboardingStatus')
				if (res1.data === "success") {
					this.props.fetchCurrentUser().then(() => {
						this.props.history.push('/homepage');
					})
				}
		} else if (stateGeolocalisation.data === 1) {
			const res = await axios.post('/api/changeOnboardingStatus')
			if (res.data === "success") {
				this.props.fetchCurrentUser().then(() => {
					this.props.history.push('/homepage');
				})
			}
		}
	}

	render () {

	const { previousPage } = this.props

		return (
		<div>
		<h2 className="has-text-centered titleOnboarding">Where are you...</h2>
		<progress className="progress progressOnboarding" value="100" max="100">100%</progress>
		<br></br>
			<LocationComponent/>
		<div className="columns">
			<div className="column is-2">
				<button type="button" className="previous button buttonOnboarding" onClick={previousPage}>
				Previous
				</button>
			</div>
			<div className="column is-2 is-offset-8">
				<button type="submit" className="button buttonSubmit" onClick={this.handleOnboardingSubmit}>
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
		.then((ret) => {
				axios.post('/api/addRelationshipBDD', state.form.wizard.values)
		})
    return {
      state
    }
  }
)(WizardFormFivePage)

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    fetchCurrentUser: fetchCurrentUser
  }, dispatch);
}

WizardFormFivePage = withRouter(connect(null, mapDispatchToProps)(WizardFormFivePage));
export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormFivePage)