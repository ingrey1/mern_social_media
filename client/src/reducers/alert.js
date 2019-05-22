const initialState = []
import {SET_ALERT, REMOVE_ALERT} from '../actions/types'

export default function(state = initialState, action) {
	switch (action.type) {

		case SET_ALERT:

			return [...state, action.payload]

		case REMOVE_ALERT: 

			return state.filter(alert => action.payload.id !== alert.id)


		default:

			return state
	}
}