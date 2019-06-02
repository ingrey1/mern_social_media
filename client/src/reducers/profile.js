import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  DELETE_ACCOUNT,
  GET_PROFILES,
  GET_REPOS
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };

    case GET_REPOS:
      return {
        ...state,
        repos: action.payload,
        loading: false
      };

    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CLEAR_PROFILE:
      return {
        ...state,
        loading: false,
        profile: null,
        repos: []
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };

    case DELETE_ACCOUNT:
      localStorage.removeItem('token');

      return state;

    default:
      return state;
  }
}
