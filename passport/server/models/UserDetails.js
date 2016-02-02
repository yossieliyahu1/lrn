

var mongoose = require('mongoose');

var UserDetailsSchema = {

	_id : String,  // unique uuid
	name: String,
	email: String,
	username: String,
	password: String,

	content : [   // an array of Squares
		{
			id: String,
			title: String,  // Square title
			image: String,
			link : String
		}
	]
};

var UserDetails = mongoose.model("UserDetails", UserDetailsSchema, "userDetails1");

module.exports = UserDetails;


