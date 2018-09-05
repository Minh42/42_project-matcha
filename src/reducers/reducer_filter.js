import { AGE_CHANGE, AGE_NOTCHANGE, DISTANCE_CHANGE, DISTANCE_NOTCHANGE, POPULARITY_CHANGE, POPULARITY_NOTCHANGE, SORTBY_CHANGE, SORTBY_NOTCHANGE, SEARCH_TAGS, NO_TAGS } from '../actions/actionFilter';

const initialState = {
    ageChange: false,
    distanceChange: false,
	popularityChange: false,
	sortByChange: false,
	searchTag: false
  };

export default function (state = initialState, action) {
	switch(action.type) {
		case AGE_CHANGE:
        return {
			...state,
			ageChange: true,
            ageFilter: action.payload
		};
		case AGE_NOTCHANGE:
        return {
            ...state,
			ageChange: false
		};
		case DISTANCE_CHANGE:
        return {
			...state,
			distanceChange: true,
            distanceFilter: action.payload
		};
		case DISTANCE_NOTCHANGE:
        return {
            ...state,
			distanceChange: false
		};
		case POPULARITY_CHANGE:
        return {
			...state,
			popularityChange: true,
            popularityFilter: action.payload
		};
		case POPULARITY_NOTCHANGE:
        return {
            ...state,
			popularityChange: false
		};
		case SORTBY_CHANGE:
        return {
			...state,
			sortbyChange: true,
            sortby: action.payload
		};
		case SORTBY_NOTCHANGE:
        return {
            ...state,
			sortbyChange: false
		};
		case SEARCH_TAGS:
        return {
            ...state,
			searchTag: true,
			tag: action.payload
		};
		case NO_TAGS:
        return {
            ...state,
			searchTag: false
		};
		default:
      	return state;
	}
}