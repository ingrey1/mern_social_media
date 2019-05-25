import { combineReducers } from 'redux';
import alerts from './alerts';
import auth from './auth';
const rootReducer = combineReducers({
  alerts,
  auth
});

export default rootReducer;
