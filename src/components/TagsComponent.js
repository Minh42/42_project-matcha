import React from 'react'
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';

const KeyCodes = {
	comma: 188,
	enter: 13,
	space: 32,
  };
   
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

class TagsComponent extends React.Component{
	constructor(props) {
        super(props);
 
        this.state = {
          tags: [
           ],
					 message: '',
					 messageSuccess: ''
        };
        this.handleDelete = this.handleDelete.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount(){
		const ret = await axios.post('/api/searchTags'); //search tag by user_id
		console.log(ret.data)
		if (document.getElementById("disabled")) {
			if (ret.data === false) {
				document.getElementById("disabled").disabled = true; 
			} else {
				document.getElementById("disabled").disabled = false;
			}
		}
			this.setState({
				message: (ret.data === false) ? 'at least one tag' : ''
			});
			const res = await axios.post('/api/findTags'); // find tags user
		
			const tags = res.data
      const i = 0
      this.setState({
				message: (ret.data === false) ? 'at least one tag' : '',
				tags: (ret.data === true) ? addTag(i, tags) : []
      });

      function addTag(i, tags) {
        var array = []
        while (i < tags.length) {
          array[i] = { id: tags[i], text: tags[i] }
          i++
        }
        return array
      }
  }

  async handleDelete(i) {
	const { tags } = this.state
	const currentTag = this.state.tags[i]
	console.log(currentTag)
	const res = await axios.post('/api/deleteTags', currentTag)
	const ret = await axios.post('/api/searchTags');
	console.log(ret.data)

	if (document.getElementById("disabled")) {
		if (ret.data === false) {
			document.getElementById("disabled").disabled = true; 
		} else {
			document.getElementById("disabled").disabled = false;
		}
	}

		this.setState({
			tags: tags.filter((tag, index) => index !== i),
			message: (ret.data === false) ? 'at least one tag' : ''
		});
	}

	handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
	}

	onSubmit (){
		console.log(this.state.tags)
		axios.post(`/api/addTags`, this.state.tags)
			.then((res) => {
				if (res) {
					if (document.getElementById("disabled")) {
							if (this.state.tags.length === 0) {
								document.getElementById("disabled").disabled = true;
								this.setState({
									message: 'at least one tag',
									messageSuccess: 'tags added'
								}); 
							} else {
								document.getElementById("disabled").disabled = false;
								this.setState({
									message: '',
									messageSuccess: 'tags added'
								});
							}
						} else {
							this.setState({
								message: '',
								messageSuccess: 'tags added'
							});
						}
				}
			})	
	}

	render () {
		const { tags } = this.state;

		return (
			<div>
			<div className="field">
				<label className="label">Tags</label>
					<ReactTags tags={tags}
					handleDelete={this.handleDelete}
					handleAddition={this.handleAddition}
					delimiters={delimiters}
					/>
					<p className='help is-danger'>{this.state.message}</p>
					<p className='help is-success'>{this.state.messageSuccess}</p>
			</div>
				<div className="button is-small buttonOnboarding" onClick={this.onSubmit}>Add</div>
			</div>
		)
	}

}

export default TagsComponent;
