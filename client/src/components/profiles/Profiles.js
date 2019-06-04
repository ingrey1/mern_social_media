import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';

const Profiles = props => {
  useEffect(() => {
    props.getProfiles();
  }, [props.getProfiles]);

  return (
    <Fragment>
      {props.profile.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary"> Developers </h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect with
            Developers
          </p>

          <div className="profiles">
            {props.profile.profiles.length > 0 ? (
              props.profile.profiles.map(profile => {
                return <ProfileItem key={profile._id} profile={profile} />;
              })
            ) : (
              <h4>No Profiles Found</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => {
  return { profile: state.profile };
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
