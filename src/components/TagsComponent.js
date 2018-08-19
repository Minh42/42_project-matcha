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
           empty: ""
        };
        this.handleDelete = this.handleDelete.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount(){
    const ret = await axios.post('/api/searchTags'); //search tag by user_id
      const res = await axios.post('/api/findTags'); // find tags user
      const tags = res.data
      const i = 0
      this.setState({
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

		this.setState({
		tags: tags.filter((tag, index) => index !== i),
		});
	}

	handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
	}

	async onSubmit (){
		const res = await axios.post(`/api/addTags`, this.state.tags)
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
			</div>
				<div className="button is-small buttonOnboarding" onClick={this.onSubmit} >Add</div>
			</div>
		)
	}

}

export default TagsComponent;
