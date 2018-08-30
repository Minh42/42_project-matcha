import React, { Component } from 'react';
import InputRange from 'react-input-range';
import { FilterAgeAction, FilterDistanceAction, FilterPopularityAction } from '../actions/actionFilter';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Filters extends Component { 

	constructor(props) {
		super(props);
	
		this.state = {
		  valueAge: {
			min: 18,
			max: 100,
		  },
		  valueDistance: {
			min: 0,
			max: 60,
		  },
		  valuePopularity: {
			min: 0,
			max: 100,
		  },
		};
		this.handleAge =this.handleAge.bind(this);
		this.handleDistance =this.handleDistance.bind(this);
		this.handlePopularity =this.handlePopularity.bind(this);
	  }

	  handleAge(values) {
		  console.log(values)
		  this.props.FilterAgeAction(values, this.props.history);
	  }

	  handleDistance(values) {
		console.log(values)
		this.props.FilterDistanceAction(values, this.props.history);
	  }

	  handlePopularity(values) {
		console.log(values)
		this.props.FilterPopularityAction(values, this.props.history);
	  }
	
	  render() {
		return (
	<div className="formRange">
		<div>Age</div>
		<div >
			<InputRange
			  maxValue={100}
			  minValue={18}
			  value={this.state.valueAge}
			  onChange={value => this.setState({ valueAge: value })}
			  onChangeComplete={value => this.handleAge(value)} />
		</div>
		<label>Distance</label>
		<div >
			<InputRange
			  maxValue={60}
			  minValue={0}
			  formatLabel={value => `${value} km`}
			  value={this.state.valueDistance}
			  onChange={value => this.setState({ valueDistance: value })}
			  onChangeComplete={value => this.handleDistance(value)} />
		</div>
		<label>Popularity</label>
		<div >
			<InputRange
			  draggableTrack
			  maxValue={100}
			  minValue={0}
			  onChange={value => this.setState({ valuePopularity: value })}
			  onChangeComplete={value => this.handlePopularity(value)}
			  value={this.state.valuePopularity} />
		</div>
	</div>
		);
	  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		FilterAgeAction: FilterAgeAction,
		FilterDistanceAction: FilterDistanceAction,
		FilterPopularityAction: FilterPopularityAction
	}, dispatch);
}

export default connect(null, mapDispatchToProps)(Filters);