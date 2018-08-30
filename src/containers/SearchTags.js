import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { SearchTagsAction } from '../actions/actionFilter';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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

	handleDeleteSearch(i) {
		const { tags } = this.state;
		console.log(this.state.tags)
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
		});
		// this.props.DeleteTagsAction(tags, this.props.history)
    }

	handleSearch(tag) {
		this.setState(state => ({ 
			tags: [...state.tags, tag] 
		}));
		this.props.SearchTagsAction(tag, this.props.history)
    }

	render () {
		const { tags } = this.state;

		return (
			<div>
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