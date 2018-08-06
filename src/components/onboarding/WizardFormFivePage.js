import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'

const WizardFormFivePage = props => {
  const { handleSubmit, pristine, previousPage, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
	<h2 className="has-text-centered titleOnboarding">Where are you...</h2>
	<progress className="progress progressOnboarding" value="100" max="100">100%</progress>

	<br></br>
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
    </form>
  )
}
export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormFivePage)