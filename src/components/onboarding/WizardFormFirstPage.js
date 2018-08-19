import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import validate from './validate'

import renderField from '../renderField'

  class WizardFormFirstPage extends React.Component{
  
  renderError(field) {
      const { meta: { touched, error } } = field;
      if (touched) {
        return <span className="help is-danger">{error}</span>
      } else {
        return false
      }
    }

  render () {
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit}>
      <p className="has-text-centered titleOnboarding">Tell us more about you</p>
        <progress className="progress progressOnboarding" value="20" max="100">20%</progress>
        <Field
          name="birthdate" 
          type="date"
          component={renderField}
          label="Birthdate"
          className="input"
        />
        
        <div>
          <label className="label labelOnboarding">Sex</label>
          <div>
            <label className="radio">
              <Field
                name="sex"
                component="input"
                type="radio"
                value="man"
              />{' '}
              Male
            </label>
            <label className="radio">
              <Field
                name="sex"
                component="input"
                type="radio"
                value="woman"
              />{' '}
              Female
            </label>
            <Field name="sex" component={this.renderError} />
          </div>
        </div>
        <Field
          name="occupation"
          type="text"
          component={renderField}
          label="Occupation"
          className="input"
        />
        <br></br>
        <div className="columns">
          <div className="column is-2 is-offset-10">
            <button type="submit" className="next button buttonOnboarding">
              Next
            </button>
          </div>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form: 'wizard', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormFirstPage)
