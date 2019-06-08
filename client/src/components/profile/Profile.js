import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProfileById } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';

const Profile = props => {
  useEffect(() => {
    props.getProfileById(props.match.params.id);
  }, []);

  return (
    <Fragment>
      {props.profile.profile === null || props.profile.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link className="btn" to="/profiles">
            Back To profiles
          </Link>

          {props.auth.isAuthenticated &&
            props.auth.loading === false &&
            props.auth.user._id === props.match.params.id && (
              <Link className="btn" to="/edit-profile">
                {' '}
                Edit Profile
              </Link>
            )}

          <div className="profile-grid my-1">
            <ProfileTop profile={props.profile.profile} />
            <ProfileAbout profile={props.profile.profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {props.profile.profile.experience.length > 0 ? (
                <Fragment>
                  {console.log(
                    'checking experience prop',
                    props.profile.profile.experience
                  )}
                  {props.profile.profile.experience.map((experience, index) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No Experience Credentials</h4>
              )}
            </div>

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {props.profile.profile.education.length > 0 ? (
                <Fragment>
                  {console.log(
                    'checking education prop',
                    props.profile.profile.education
                  )}
                  {props.profile.profile.education.map((education, index) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No Education Credentials</h4>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    profile: state.profile,
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { getProfileById }
)(withRouter(Profile));
