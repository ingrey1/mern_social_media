import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {addExperience} from '../../actions/profile';



const AddExperience = (props) => {



		return (


			<div>Add Experience</div>


			)









}


AddExperience.propTypes = {
	addExperience: PropTypes.func.isRequired
}

const mapStateToProps = state => {


	return {



	}

}


export default connect(mapStateToProps,{addExperience})(AddExperience)