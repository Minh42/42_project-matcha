import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { SearchTagsAction } from '../actions/actionFilter';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

var newTags = new Array();

const KeyCodes = {
	comma: 188,
	enter: 13,
	space: 32,
  };
   
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

class SearchTags extends Component { 

	constructor(props) {
		super(props)

		this.state = {
			tags: [
			 ],
			}

		this.handleDeleteSearch = this.handleDeleteSearch.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		const i = 0
		this.setState(state => ({ 
			tags: (newTags.length > 0) ? addTag(i, newTags) : []
		}));

		function addTag(i, newTags) {
			var array = []
			while (i < newTags.length) {
			  array[i] = newTags[i]
			  i++
			}
			return array
		}
	}

	handleDeleteSearch(i) {
		const { tags } = this.state
		newTags.splice(i, 1)
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
		});
		this.props.SearchTagsAction(newTags, this.props.history)
    }

	handleSearch(tag) {
		newTags.push(tag)
		this.setState(state => ({ 
			tags: [...state.tags, tag] 
		}));
		this.props.SearchTagsAction(newTags, this.props.history)
    }

	render () {
		const { tags } = this.state;

		return (
			<div className="column is-offset-2">
			<div className="field">
				<label className="label">Tags</label>
					<ReactTags tags={tags}
					handleDelete={this.handleDeleteSearch}
					handleAddition={this.handleSearch}
					delimiters={delimiters}
					/>
			</div>
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		SearchTagsAction: SearchTagsAction
	}, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchTags);