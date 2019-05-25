import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alert = props => {
  console.log(props.alerts);
  return (
    props.alerts !== null &&
    props.alerts.length > 0 &&
    props.alerts.map(alert => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    ))
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  return { alerts: state.alerts };
};

export default connect(mapStateToProps)(Alert);
