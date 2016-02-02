
var uuid = require('uuid');


var guest = {

	_id: "0_0",
	name: "Guest",
	email: "",
	userName: "",
	password: "",

	content: [   // an array of Squares
		{
			id: "1000001",
			title: "Apple",
			image: "../imgs/apple.jpg",
			link: "http://www.apple.com"
		},
		{
			id: "1000002",
			title: "Microsoft Corporation",
			image: "../imgs/microsoft.png",
			link: "http://www.microsoft.com"
		},
		{
			id: "1000003",
			title: "Google Search Engine, #1 on the Web",
			image: "../imgs/google.jpg",
			link: "http://www.google.com"
		},
		{
			id: "1000004",
			title: "Yahoo",
			image: "../imgs/yahoo.jpg",
			link: "http://www.yahoo.com"
		},
		{
			id: "1000005",
			title: "YouTube",
			image: "../imgs/youtube.png",
			link: "http://www.youtube.com"
		}
	]
};


module.exports = function (app, UserDetails) {


	// Used for login (with user + password) or to get user details (with _id)
	app.route('/api/user/:u?/:p?/:id?').get(function (req, res) {

		console.log("searching for user [" + req.params.u + "]");

		var filter = {};
		if (req.params.p) {
			// login / logout
			filter.userName = req.params.u;
			filter.password = req.params.p;
			if (req.params.id != "0_0") {
				filter._id = req.params.id;
			}
		}
		else {
			filter._id = req.params.u;
		}

		UserDetails.findOne(filter, "-userName,-password", function (error, model) {

			if (error) {
				console.log("searching for user [" + req.params.u + "] - error [" + error + "]");
				res.jsonp({ "err": (error || "no doc") });
			}
			else {
				var data = model ? model._doc : guest;

				// delete data.userName;
				// delete data.password;

				console.log(data);
				res.jsonp(data);
			}
		});
    })
	.post(function (req, res) {

		var data = {

			_id: uuid.v1(),
			name: req.body.name,
			email: req.body.email,
			userName: req.body.userName,
			password: req.body.password,

			content: guest.content
		};

		var userDetails = new UserDetails(data);

		userDetails.save(function (error, data) {
			if (error) {
				res.jsonp({ "err": error });
			}
			else {

				delete data.userName;
				delete data.password;

				res.jsonp(data._doc);
			}
		})
	});
    
}