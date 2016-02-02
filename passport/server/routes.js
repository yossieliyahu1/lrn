

module.exports = function (app) {

	var UserDetails = require('./models/UserDetails.js');

	// handle user route
	require("./routes/user")(app, UserDetails);

	// handle content route
	require("./routes/content")(app, UserDetails);

	// handle images upload route
	require("./routes/upload")(app, UserDetails);

	// handle admin data
	require("./routes/admin")(app, UserDetails);
}