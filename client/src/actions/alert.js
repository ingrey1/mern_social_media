import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => dispatch => {
  const id = uuid.v4();

  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      msg,
      alertType
    }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: { id } }), 5000);
};

export const removeAlert = id => dispatch => {
  dispatch({
    type: REMOVE_ALERT,
    payload: {
      id
    }
  });
};
