import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from '../actions/types';

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

    default:
      return state;
  }
}
