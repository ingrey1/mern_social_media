import React, { useEffect, Fragment } from 'react';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import PostItem from '../posts/PostItem';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = props => {
  useEffect(() => {
    props.getPost(props.match.params.id);
  }, []);

  return (
    <div>
      {props.post.loading || props.auth.user === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/posts">
            <button className="btn">Back To Posts</button>
          </Link>

          <PostItem post={props.post.post} detail={true} />
          <CommentForm post={props.post.post} />
          <div className="comments">
            {props.post.post.comments.map(comment => {
              return (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postId={props.post.post._id}
                />
              );
            })}
          </div>
        </Fragment>
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    post: state.post,
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { getPost }
)(Post);
