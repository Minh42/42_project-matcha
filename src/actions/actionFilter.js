export const AGE_CHANGE = 'AGE_CHANGE';
export const AGE_NOTCHANGE = 'AGE_NOTCHANGE';

export const DISTANCE_CHANGE = 'DISTANCE_CHANGE';
export const DISTANCE_NOTCHANGE = 'DISTANCE_NOTCHANGE';

export const POPULARITY_CHANGE = 'POPULARITY_CHANGE';
export const POPULARITY_NOTCHANGE = 'POPULARITY_NOTCHANGE';

export const SORTBY_CHANGE = 'SORTBY_CHANGE';
export const SORTBY_NOTCHANGE = 'SORTBY_NOTCHANGE';

export const SEARCH_TAGS = 'SEARCH_TAGS';
export const NO_TAGS = 'NO_TAGS';

export function FilterAgeAction(values) {
	return (dispatch) => {
		if (values != null) {
			dispatch({ 
				type: AGE_CHANGE,
				payload: values
			});
		} else {
			dispatch({ 
				type: AGE_NOTCHANGE
			});
		}
	}
}

export function FilterDistanceAction(values) {
	return (dispatch) => {
		if (values != null) {
			dispatch({ 
				type: DISTANCE_CHANGE,
				payload: values
			});
		} else {
			dispatch({ 
				type: DISTANCE_NOTCHANGE
			});
		}
	}
}

export function FilterPopularityAction(values) {
	return (dispatch) => {
		if (values != null) {
			dispatch({ 
				type: POPULARITY_CHANGE,
				payload: values
			});
		} else {
			dispatch({ 
				type: POPULARITY_NOTCHANGE
			});
		}
	}
}

export function SortByAction(values) {
	return (dispatch) => {
		if (values != null) {
			dispatch({ 
				type: SORTBY_CHANGE,
				payload: values
			});
		} else {
			dispatch({ 
				type: SORTBY_NOTCHANGE
			});
		}
	}
}

export function SearchTagsAction(values) {
	return (dispatch) => {
		if (values != null) {
			dispatch({ 
				type: SEARCH_TAGS,
				payload: values
			});
		} else {
			dispatch({ 
				type: NO_TAGS
			});
		}
	}
}