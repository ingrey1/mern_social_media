import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };

    case ADD_COMMENT:
      return {
        ...state,
        loading: false,
        post: { ...state.post, comments: action.payload }
      };

    case REMOVE_COMMENT:
      return {
        ...state,
        loading: false,
        post: { ...state.post, comments: action.payload }
      };

    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      };

    case POST_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case UPDATE_LIKES:
      return {
        ...state,
        loading: false,
        posts: state.posts.map(post => {
          if (post._id === action.payload.postId) {
            return { ...post, likes: action.payload.likes };
          }

          return post;
        })
      };

    case DELETE_POST:
      return {
        ...state,
        loading: false,
        posts: state.posts.filter(post => post._id !== action.payload.postId)
      };

    case ADD_POST:
      return {
        ...state,
        loading: false,
        posts: [action.payload, ...state.posts]
      };

    default:
      return state;
  }
}
