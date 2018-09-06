import React, { Component } from 'react';
import { SortByAction } from '../actions/actionFilter';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SortBy extends Component { 

	constructor(props) {
		super(props);

		this.state = {
			sortby : "Sort by..."
		}

		this.handleSort = this.handleSort.bind(this);
	}

	componentDidMount() {
		this.setState({
			sortby: this.props.sort
		})
	}

	handleSort(event) {
		this.setState({
			sortby: event.target.value
		})
		this.props.SortByAction(event.target.value, this.props.history)
	}

	render() {
		return (
		<div className="column is-6 is-offset-6 sortByButton">
			<div className="field">
				<div className="control">
					<div className="select">
						<select id="select" name="sortby" onChange={this.handleSort} value={this.state.sortby}>
							<option value="sort">SortBy...</option>
							<option value="age">Age</option>
							<option value="popularity">Popularity</option>
							<option value="distance">Distance</option>
						</select>
					</div>
				</div>
			</div>
		</div>
		)
	}
}

function mapStateToProps(state) {
    return {
        sort: state.filterUsers.sortby
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		SortByAction: SortByAction
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SortBy);
