import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import renderField from './renderField'
		  
const renderErrorInterest = ({ meta: { touched, error } }) =>
  touched && error ? <span className= "help is-danger">{error}</span> : false
      
const WizardFormSecondPage = props => {
  const { handleSubmit, previousPage } = props
  return (
    <form onSubmit={handleSubmit}>
    <h2 className="has-text-centered titleOnboarding">Little bit more...</h2>
    <progress className="progress progressOnboarding" value="40" max="100">40%</progress>
    <label className="label labelOnboarding">Interesting in</label>
					<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="men"
						/>{' '}
						Men
					</label>
					<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="women"
						/>{' '}
						Women
					</label>
					<label className="radio">
						<Field
						name="interest"
						component="input"
						type="radio"
						value="both"
						/>{' '}
						Both
					</label>
					<Field name="interest" component={renderErrorInterest} />
				<div>
					<label className="label labelOnboarding">Relationship</label>
					<div className="field">
						<div className="select">
						<Field name="relationship" component="select">
							<option>Marriage</option>
							<option>Casual sex</option>
							<option>friends</option>
							<option>One night stand</option>
							<option>Long term relationship</option>
							<option>Short term relationship</option>
						</Field>
						</div>
					</div>
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
  )
}

export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormSecondPage)