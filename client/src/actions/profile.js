import axios from 'axios';
import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from './types';
import { setAlert } from './alert';

// get current user's profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const clearProfile = () => dispatch => {
  dispatch({
    type: CLEAR_PROFILE
  });
};
