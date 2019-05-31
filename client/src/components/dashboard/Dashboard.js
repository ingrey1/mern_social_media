import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';

const Dashboard = props => {
  // component did mount, load profile data
  useEffect(() => {
    props.getCurrentProfile();
  }, []);

  return props.profile.loading && props.profile.profile === null ? (
    Spinner
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="Lead">
        <i className="fa fa-user" />{' '}
        {props.auth.user && 'Welcome, ' + props.auth.user.name}
      </p>

      {props.profile.profile !== null ? (
        <Fragment>
          <DashboardActions />
        </Fragment>
      ) : (
        <Fragment>
          You have not yet set up a profile, please add some info
          <Link to="create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return { profile: state.profile, auth: state.auth };
};

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
