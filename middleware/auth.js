const jwt = require('jsonwebtoken');
const config = require('config');



module.exports = function(req, res, next) {

	// get the token from header

	const token = req.header('x-auth-token');


	// if no token

	if (!token) return res.status(401).json({msg: 'no token, authorization denied'})


	// verify token
	
	try {

		const decodedToken = jwt.verify(token, config.get("jwtSecret"));

		req.user = decodedToken.user;
		next();


	} catch(err) {
		
		res.status(401).json({msg: 'token not valid'})

	}	
}