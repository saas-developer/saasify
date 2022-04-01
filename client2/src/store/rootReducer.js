import { combineReducers } from 'redux';
import auth from '../account/reducerAuth';

const rootReducer = combineReducers({
  auth
});

export default rootReducer;
