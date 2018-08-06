import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import WizardFormFirstPage from './WizardFormFirstPage'
import WizardFormSecondPage from './WizardFormSecondPage'
import WizardFormThirdPage from './WizardFormThirdPage'
import WizardFormFourPage from './WizardFormFourPage'
import WizardFormFivePage from './WizardFormFivePage'

class WizardForm extends Component {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = {
      user_id: this.props.match.params.id,
      page: 1
    }
    console.log(this.state.page)
    console.log(this.state.user_id) // recuperation de l'ID via l'URL
  }

  componentDidMount() {
		this.handleInitialize();
  }
  
  async handleInitialize() {
    const user_id = this.state.user_id
		console.log(user_id)
		this.props.initialize(user_id);
    }
    
  nextPage() {
    this.setState({ 
      page: this.state.page + 1
    })
  }

  previousPage() {
    this.setState({ 
      page: this.state.page - 1
    })
  }

  render() {
    
    const { onSubmit } = this.props
    const { page } = this.state

    return (
      <div>
      <section className="hero is-fullheight background">
        <div className="columns is-mobile is-centered">
          <div className="column is-half columnWizard">
          {page === 1 && 
            <WizardFormFirstPage 
              onSubmit={this.nextPage} 
            />}
          {page === 2 && (
            <WizardFormSecondPage
              previousPage={this.previousPage}
              onSubmit={this.nextPage}
            />
          )}
          {page === 3 && (
            <WizardFormThirdPage
              previousPage={this.previousPage}
              onSubmit={this.nextPage}
            />
          )}
          {page === 4 && (
            <WizardFormFourPage
              previousPage={this.previousPage}
              onSubmit={this.nextPage}
            />
          )}
          {page === 5 && (
            <WizardFormFivePage
              previousPage={this.previousPage}
              onSubmit={onSubmit}
            />
          )}
          </div>
        </div>
      </section>
      </div>
    )
  }
}

WizardForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'wizard', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true,
  initialValues : {
		user_id: null
	  } // <------ unregister fields on unmount
})(WizardForm)