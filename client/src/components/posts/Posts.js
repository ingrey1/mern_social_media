import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import { loadUser } from '../../actions/auth';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = props => {
  useEffect(() => {
    props.getPosts();
  }, []);

  return props.post.loading || props.auth.user === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome To the Community
      </p>

      <PostForm />
      <div className="posts">
        {console.log('checking load status', props.post.loading)}
        {props.post.posts.map(post => {
          return <PostItem key={post._id} post={post} detail={false} />;
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
  { getPosts, loadUser }
)(Posts);
