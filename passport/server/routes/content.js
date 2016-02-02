
var uuid = require('uuid');

module.exports = function (app, UserDetails) {

    
	// add or update square
    app.route('/api/square').post(function (req, res) {  

    	console.log("/api/square");
    	UserDetails.findById(req.body.uid, function (error, doc) {

			if (error) {
				res.jsonp({ "err": (error || "no doc") });
				return;
			}


			if (req.body.id) { // square is already in - update or delete it
				
				for (var i = 0 ; i < doc._doc.content.length ; i++) {
					if (doc._doc.content[i].id == req.body.id) {

						if (req.body.del) {
							// delete
							doc._doc.content.splice(i, 1);
						}
						else {
							// update
							doc._doc.content[i].title = req.body.title;
							doc._doc.content[i].image = req.body.image;
							doc._doc.content[i].link = req.body.link;
						}
						doc.save();
						res.jsonp(doc._doc.content[i]);
					}
				}
			}
			else {   // create new square
				
				var square = {
					id: uuid.v1(),
					title: req.body.title,  // Square title
					image: req.body.image,
					link: req.body.link
				}

				doc._doc.content.push(square);
				doc.save();
				res.jsonp(square);
			}
		});
	});
    
}