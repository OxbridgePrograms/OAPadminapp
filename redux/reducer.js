import ActionList from './actions/ActionList';

const reducer = (state = {}, action) => {
	switch (action.type) {
		case ActionList.ADD_USER_DATA:
			return Object.assign({}, state, {userData: action.userData} );
		case ActionList.ADD_PROGRAM_DATA:
			return Object.assign({}, state, {program: action.program} );
		case ActionList.ADD_PAGE_DATA:
			return Object.assign({}, state, {pageData: action.pageData} );
		case ActionList.ADD_USER_MASTER_LIST:
			return Object.assign({}, state, {userList: action.userList} );
		case ActionList.ADD_FOCUSED_EVENT:
			return Object.assign({}, state, {focusedEvent: action.focusedEvent} );
		case ActionList.REPLACE_USER_EVENTS: {
			const data = Object({}, state.userData, {events: action.events} );
			return Object.assign({}, state, {userData: data} );
		} case ActionList.SET_LOGIN:
			return Object({}, state, {login: action.login} );
		default:
			return state;

	}
}

export default reducer;