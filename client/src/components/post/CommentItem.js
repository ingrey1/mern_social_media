import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment, removeComment } from '../../actions/post';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const CommentItem = props => {
  return (
    <div class="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${props.comment.user}`}>
          <img class="round-img" src={props.comment.avatar} alt="" />
          <h4>{props.comment.name}</h4>
        </Link>
      </div>
      <div>
        <p class="my-1">{props.comment.text}</p>
        <p class="post-date">
          Posted on <Moment format="YYYY/MM/DD">{props.comment.date}</Moment>
        </p>
      </div>
      {!props.auth.loading && props.comment.user === props.auth.user._id && (
        <button
          className="btn"
          onClick={() => props.removeComment(props.comment._id, props.postId)}
        >
          Delete Comment
        </button>
      )}
    </div>
  );
};

CommentItem.propTypes = {
  addComment: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { addComment, removeComment }
)(CommentItem);
