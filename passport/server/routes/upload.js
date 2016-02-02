
var uuid = require('uuid');

module.exports = function (app, UserDetails) {


	var multer = require('multer');
	var strg_ = multer.diskStorage({
		destination: function (req, file, cb) {
			//console.log("destination")
			cb(null, __dirname + '/../imgs/uploads/')
		},
		filename: function (req, file, cb) {
			//console.log("multer fn: "+ file.fieldname)
			var fn_ = file.originalname;

			var server_name = fn_.substr(0, fn_.lastIndexOf('.')) + '-' + Date.now() + fn_.substr(fn_.lastIndexOf('.'))
			cb(null, server_name)
		}
	})

	var upload = multer({ storage: strg_ })


	var upld_ = upload.array("pmupload");
	app.route('/upload')
	.post(function (req, res) {

		upld_(req, res, function (err) {
			if (err) {
				console.log("upload err" + err)
				return
			}

			console.log("upload")
			console.log(req.files);
			res.json(req.files);
		})
	});
    
}