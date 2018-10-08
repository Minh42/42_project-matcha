import React, { Component } from 'react'
import WizardFormFirstPage from './WizardFormFirstPage'
import WizardFormSecondPage from './WizardFormSecondPage'
import WizardFormThirdPage from './WizardFormThirdPage'
import WizardFormFourPage from './WizardFormFourPage'
import WizardFormFivePage from './WizardFormFivePage'
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setOnboarding, fetchCurrentUser } from '../../actions/actionUsers';
import { bindActionCreators } from 'redux';

class WizardForm extends Component {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = {
      page: 1
    }
  }

  async componentDidMount() {
    const res = await axios.get('/api/onboarding');
    if (!res.data) {
      this.props.fetchCurrentUser().then(() => {
        if (this.props.isAuthenticated && this.props.currentUser != undefined) {
          this.props.history.push('/homepage');
        }
      })
    }
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
  isAuthenticated: PropTypes.bool
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.authenticated,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    setOnboarding: setOnboarding,
    fetchCurrentUser: fetchCurrentUser
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WizardForm));