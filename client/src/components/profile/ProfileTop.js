import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = props => {
  console.log(props.profile);

  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={props.profile.user.avatar} alt="" />
      <h1 className="large">{props.profile.user.name}</h1>
      <p className="lead">
        {props.profile.status}{' '}
        {props.profile.company && <span>at {props.profile.company}</span>}
      </p>
      <p>{props.profile.location && <span> {props.profile.location}</span>}</p>

      <div className="icons my-1">
        {props.profile.website && (
          <a
            href={props.profile.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-globe fa-2x" />
          </a>
        )}

        {props.profile.social.twitter && props.profile.social.twitter !== '' && (
          <a
            href={props.profile.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter fa-2x" />
          </a>
        )}

        {props.profile.social.facebook && props.profile.social.facebook !== '' && (
          <a
            href={props.profile.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook fa-2x" />
          </a>
        )}

        {props.profile.social.linkedin && props.profile.social.linkedin !== '' && (
          <a
            href={props.profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin fa-2x" />
          </a>
        )}

        {props.profile.social.youtube && props.profile.social.youtube !== '' && (
          <a
            href={props.profile.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-youtube fa-2x" />
          </a>
        )}

        {props.profile.social.instagram &&
          props.profile.social.instragram !== '' && (
            <a
              href={props.profile.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram fa-2x" />
            </a>
          )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
