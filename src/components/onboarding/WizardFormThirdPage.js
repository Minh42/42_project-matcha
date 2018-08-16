import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import { WithContext as ReactTags } from 'react-tag-input';

import axios from 'axios';

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
          suggestions: [
              { id: 'USA', text: 'USA' },
              { id: 'Germany', text: 'Germany' },
              { id: 'Austria', text: 'Austria' },
              { id: 'Costa Rica', text: 'Costa Rica' },
              { id: 'Sri Lanka', text: 'Sri Lanka' },
              { id: 'Thailand', text: 'Thailand' }
           ]
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
  }
  
  async componentDidMount(){
    //recuperer les tags de la BDD de l'utilisateur et les afficher
    const res = await axios.post('/api/findTags');
    const tags = res.data
    const i = 0
    this.setState({
      tags: addTag(i, tags)
     });

     function addTag(i, tags) {
       var array = []
      //  console.log(tags)
      //  console.log(tags.length)
       while (i < tags.length) {
        // console.log(i)
        array[i] = { id: tags[i], text: tags[i] }
        // console.log(array[i])
        i++
       }
      //  console.log(array)
       return array
     }
   
  }
	
	async handleDelete(i) {
        const { tags } = this.state
        const currentTag = this.state.tags[i]
        console.log(currentTag)
        const res = await axios.post('/api/deleteTags', currentTag)

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

	async onSubmit (){
    // console.log('HERE')
    // console.log(this.state.tags)
		const res = await axios.post(`/api/addTags`, this.state.tags)
        // console.log(res)
	}

	render () {
		const { key, handleSubmit, previousPage } = this.props;
		const { tags, suggestions } = this.state;
    const placeholder = "Add new Tag"

	return (
		<form onSubmit={handleSubmit} onClick={this.onSubmit}>
      <h2 className="has-text-centered titleOnboarding">We are so curious...</h2>
      <progress className="progress progressOnboarding" value="60" max="100">60%</progress>
					<Field
					label="Enter your bio (max 300)"
					name="bio"
					component={this.renderFieldArea}
					type="text"
					/>
				<div className="field">
					<label className="label">Tags</label>
					<ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters} />
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

export default reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(WizardFormThirdPage)