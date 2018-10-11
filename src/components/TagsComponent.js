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
		// this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount(){
		const ret = await axios.post('/api/searchTags'); //search tag by user_id
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
	console.log(tags.length)
		if (tags.length > 1) {
			const res = await axios.post('/api/deleteTags', currentTag)
			const ret = await axios.post('/api/searchTags');
			if (document.getElementById("disabled")) {
				if (ret.data === false) {
					document.getElementById("disabled").disabled = true; 
				} else {
					document.getElementById("disabled").disabled = false;
				}
			}
				this.setState({
					tags: tags.filter((tag, index) => index !== i),
					message: (ret.data === false) ? 'at least one tag' : '',
					messageSuccess: (ret.data === false) ? '' : ''
				});
		} else if (tags.length === 1) {
			const ret = await axios.post('/api/searchTags');
			this.setState({
				message: (ret.data === false) ? 'at least one tag' : '',
				messageSuccess: (ret.data === false) ? '' : ''
			});
		}
	}

	handleAddition(tag) {
		axios.post(`/api/addTags`, tag)
		.then((res) => {
			if (res.data === "success") {
				this.setState(state => ({ tags: [...state.tags, tag] }));
				this.setState({
					message: '',
					messageSuccess: 'Tag added'
				});
				if (document.getElementById("disabled")) {
					document.getElementById("disabled").disabled = false;
				}
			} else if (res.data === "error") {
				this.setState({
					message: 'Tag is too long',
					messageSuccess: ''
				});
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
					required
					/>
					<p className='help is-danger'>{this.state.message}</p>
					<p className='help is-success'>{this.state.messageSuccess}</p>
			</div>
			</div>
		)
	}

}

export default TagsComponent;
