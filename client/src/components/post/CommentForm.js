import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = props => {
  const [text, setText] = useState('');

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Comment Here</h3>
      </div>
      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault();
          props.addComment({ text }, props.post._id);
          setText('');
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Feel free to write whatever"
          required
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

export default connect(
  null,
  { addComment }
)(CommentForm);
