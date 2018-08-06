import React from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import validate from './validate'
import { WithContext as ReactTags } from 'react-tag-input';
import { connect } from 'react-redux'

const KeyCodes = {
	comma: 188,
	enter: 13,
	space: 32,
  };
   
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

class WizardFormThirdPage extends React.Component{
	constructor(props) {
        super(props);
 
        this.state = {
            tags: [
             ],
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
	}
	
	handleDelete(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
 
  handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
	}

	renderFieldArea(field) {
		const { meta: { touched, error } } = field;
		const className= `input ${touched && error ? 'is-danger' : ''}`;

		return (
			<div className= "field">
				<label className="label labelOnboarding">{field.label}</label>
					<textarea
						className={className}
						type={field.type}
						placeholder={field.placeholder}
						{ ...field.input}
					/>
				<div className="help is-danger">
					{touched ? error : ''}
				</div>
			</div>
		);
  }
  
  componentDidMount(){
    //recuperer les tags de la BDD de l'utilisateur et les afficher
  }

	async onSubmit (values){
    console.log('HERE')
    console.log(this.state.tags)
		// const data = {
		// 	values :values,
		// 	tags: this.state.tags
		// }
		// console.log(data)
		// const res = await axios.post(`/api/changeNewInfo`, data)
        // console.log(res)
	}

	render () {
		const { key, handleSubmit, previousPage } = this.props;
		const { tags } = this.state;
    const placeholder = "Add new Tag"

	return (
		<form onSubmit={handleSubmit} onClick={this.onSubmit}>
      <h2 className="has-text-centered titleOnboarding">We are so curious...</h2>
      <progress class="progress progressOnboarding" value="60" max="100">60%</progress>
					<Field
					label="Enter your bio (max 300)"
					name="bio"
					component={this.renderFieldArea}
					type="text"
					/>
				<div className="field">
					<label className="label">Tags</label>
					<ReactTags
						tags={tags}
						handleDelete={this.handleDelete}
						handleAddition={this.handleAddition}
						delimiters={delimiters} 
						placeholder={placeholder}
					/>
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
	)}
}

const selector = formValueSelector('wizard') // <-- same as form name
WizardFormThirdPage = connect(
  state => {
    // can select values individually
    console.log(state.form.wizard.values)
    // const birthdate = selector(state, 'birthdate')
    // console.log(birthdate)
    return {
      state
    }
  }
)(WizardFormThirdPage)

export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormThirdPage)