import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addLike, removeLike } from '../../actions/post';

const PostItem = props => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${props.post.user}`}>
          <img className="round-img" src={props.post.avatar} alt="" />
          <h4>{props.auth.user.name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{props.post.text}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{props.post.date}</Moment>
        </p>
        <button
          type="button"
          className="btn btn-light"
          onClick={() => props.addLike(props.post._id)}
        >
          <i className="fas fa-thumbs-up" />
          {props.post.likes.length > 0 && (
            <span> {props.post.likes.length}</span>
          )}
        </button>
        <button
          type="button"
          className="btn btn-light"
          onClick={() => props.removeLike(props.post._id)}
        >
          <i className="fas fa-thumbs-down" />
        </button>
        <Link to={`/post/${props.post._id}`} className="btn btn-primary">
          Discussion{' '}
          {props.post.comments.length > 0 && (
            <span className="comment-count"> {props.post.comments.length}</span>
          )}
        </Link>

        {!props.auth.loading && props.post.user === props.auth.user._id && (
          <button type="button" className="btn btn-danger">
            <i className="fas fa-times" />
          </button>
        )}
      </div>
    </div>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { addLike, removeLike }
)(PostItem);
