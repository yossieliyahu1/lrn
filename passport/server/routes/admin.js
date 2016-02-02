
var uuid = require('uuid');

module.exports = function (app, UserDetails) {

	app.route("/admin/users").get(function (req, res) {

		UserDetails.find(
		function (error, model) {
			if (error || !model) {
				res.jsonp({ "err": (error || "no doc") });
			}
			else {
				res.jsonp(model);
			}
		});
	});
}