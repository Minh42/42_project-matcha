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
		const res = await axios.post('/api/changeOnboardingStatus')
		if (res.data === "success") {
			this.props.fetchCurrentUser().then(() => {
				this.props.history.push('/homepage');
			})
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
			if (ret)
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