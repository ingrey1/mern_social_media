import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { logout } from '../../actions/auth';
import Spinner from '../layout/Spinner';
import { Link, withRouter } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = props => {
  // component did mount, load profile data
  useEffect(() => {
    console.log('useEffect called');
    props.getCurrentProfile();
  }, [props.profile.loading]);

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
          <Experience experiences={props.profile.profile.experience} />
          <Education education={props.profile.profile.education} />
          <div className="my-2">
            <button
              className="btn btn-danger"
              onClick={() => {
                props.deleteAccount(props.history);
                props.logout();
              }}
            >
              <i className="fas fa-user-minus" />
              Delete My Account
            </button>
          </div>
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
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return { profile: state.profile, auth: state.auth };
};

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, logout }
)(withRouter(Dashboard));
