import { combineReducers } from 'redux';
import alerts from './alerts';
import auth from './auth';
import profile from './profile';
const rootReducer = combineReducers({
  alerts,
  auth,
  profile
});

export default rootReducer;
