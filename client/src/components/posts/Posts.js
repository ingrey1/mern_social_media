import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';

const Posts = props => {
  useEffect(() => {
    props.getPosts();
  }, []);

  return props.post.loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome To the Community
      </p>

      <div className="posts">
        {props.post.posts.map(post => {
          return <PostItem key={post._id} post={post} />;
        })}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  post: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    post: state.post,
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { getPosts }
)(Posts);
