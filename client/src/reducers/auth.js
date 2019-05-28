import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function(state = initialState, action) {
  console.log('auth reducer called', action.type);

  switch (action.type) {
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
      };

    case REGISTER_FAILURE:
      localStorage.removeItem('token');

      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };

    case USER_LOADED:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload
      };

    case AUTH_ERROR:
      localStorage.removeItem('token');

      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null
      };

    case LOGIN_FAILURE:
      localStorage.removeItem('token');

      return {
        ...state,
        loading: false,
        isAthenticated: false,
        user: null
      };

    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);

      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload
      };

    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null
      };

    default:
      return state;
  }
}
