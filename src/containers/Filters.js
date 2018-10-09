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
			min: 0,
			max: 100,
		  },
		  valueDistance: {
			min: 0,
			max: 30,
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
		
		componentDidMount() {
			this.setState ({
				valueAge: {
				min: (this.props.ageRange === undefined) ? 0 : this.props.ageRange.min,
				max: (this.props.ageRange === undefined) ? 100 : this.props.ageRange.max,
				},
				valueDistance: {
				min: (this.props.distanceRange === undefined) ? 0 : this.props.distanceRange.min,
				max: (this.props.distanceRange === undefined) ? 30 : this.props.distanceRange.max,
				},
				valuePopularity: {
				min: (this.props.popularityRange === undefined) ? 0 : this.props.popularityRange.min,
				max: (this.props.popularityRange === undefined) ? 100 : this.props.popularityRange.max,
				},
			})
		}
		
	  handleAge(values) {
		  this.props.FilterAgeAction(values, this.props.history);
	  }

	  handleDistance(values) {
			this.props.FilterDistanceAction(values, this.props.history);
	  }

	  handlePopularity(values) {
			this.props.FilterPopularityAction(values, this.props.history);
	  }
	
	  render() {
		if (this.state.valueAge.min < 0){
			this.state.valueAge.min = 0;
		}
		if (this.state.valueAge.max > 100){
			this.state.valueAge.max = 100;
		}
		if (this.state.valueDistance.min < 0){
			this.state.valueDistance.min = 0;
		}
		if (this.state.valueDistance.max > 100){
			this.state.valueDistance.max = 100;
		}
		if (this.state.valuePopularity.min < 0){
			this.state.valuePopularity.min = 0;
		}
		if (this.state.valuePopularity.max > 100){
			this.state.valuePopularity.max = 100;
		}
		return (
			<div className="column">
	<div className="formRange">
		<div>Age</div>
		<div >
			<InputRange
			  maxValue={100}
			  minValue={0}
			  value={this.state.valueAge}
			  onChange={value => this.setState({ valueAge: value })}
			  onChangeComplete={value => this.handleAge(value)} />
		</div>
		<label>Distance</label>
		<div >
			<InputRange
			  maxValue={30}
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
	</div>
		);
	  }
}

function mapStateToProps(state) {
	return {
			ageRange: state.filterUsers.ageFilter,
			popularityRange: state.filterUsers.popularityFilter,
			distanceRange: state.filterUsers.distanceFilter
	}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		FilterAgeAction: FilterAgeAction,
		FilterDistanceAction: FilterDistanceAction,
		FilterPopularityAction: FilterPopularityAction
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);