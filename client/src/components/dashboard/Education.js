import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';
import Moment from 'react-moment';
import { withRouter } from 'react-router-dom';

const Education = props => {
  const education = props.education.map(ed => {
    return (
      <tr key={ed._id}>
        <td>{ed.school}</td>
        <td className="hide-sm">{ed.degree}</td>
        <td>
          <Moment format="YYYY/MM/DD">{ed.from}</Moment> -
          {ed.to === null ? (
            ' Now'
          ) : (
            <Moment format="YYYY/MM/DD">{ed.to}</Moment>
          )}
        </td>

        <td>
          <button
            className="btn btn-danger"
            onClick={() => props.deleteEducation(ed._id, props.history)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>

      <table className="table">
        <thead>
          <tr>
            <th>School</th>

            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>

        <tbody>{education}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(withRouter(Education));
