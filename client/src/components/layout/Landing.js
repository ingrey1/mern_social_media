import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
const Landing = props => {
  if (props.isAuthenticated) return <Redirect to="/dashboard" />;

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Social Media</h1>
          <p className="lead">Social Media For Developers</p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

export default connect(mapStateToProps)(Landing);
