import {createStore, combineReducers} from 'redux';  
import reducer from './reducer';

// Here we combine all the reducers and make a store
const configureStore = () => {  
  return createStore(
  	reducer
  );
}
export default configureStore;