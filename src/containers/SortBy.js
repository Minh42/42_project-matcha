import React, { Component } from 'react';
import { SortByAction } from '../actions/actionFilter';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SortBy extends Component { 

	constructor(props) {
		super(props);

		this.handleSort = this.handleSort.bind(this);
	}

	handleSort(event) {
		this.props.SortByAction(event.target.value, this.props.history)
	}

	render() {
		return (
			<div className="field">
				<div className="control">
					<div className="select is-primary">
						<select name="sortby" onChange={this.handleSort}>
							<option value="">Sort by...</option>
							<option value="age">Age</option>
							<option value="popularity">Popularity</option>
							<option value="distance">Distance</option>
						</select>
					</div>
				</div>
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		SortByAction: SortByAction
	}, dispatch);
}

export default connect(null, mapDispatchToProps)(SortBy);
