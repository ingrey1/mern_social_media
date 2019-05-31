import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {addEducation} from '../../actions/profile';



const AddEducation = (props) => {



		return (


			<div>Add Education</div>


			)









}


AddEducation.propTypes = {
	addEducation: PropTypes.func.isRequired
}

const mapStateToProps = state => {


	return {



	}

}


export default connect(mapStateToProps,{addEducation})(AddEducation)