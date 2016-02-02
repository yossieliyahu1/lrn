
"use strict";

var React = require('react/addons');

var Router = require('react-router');
var Navigation = Router.Navigation;

var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Content = require('./components/Content');
var UserDetails = require('./components/UserDetails');
var EditSquare = require("./components/EditSquare");
var TopBar = require('./components/TopBar');
var Footer = require('./components/Footer');

var AppStore = require('./stores/AppStore');

var AdminUserList = require('./admin/UserList');

var App = React.createClass({

	mixins: [Navigation],

	componentWillMount : function (){       
		var that = this;
		AppStore.onChange(function(app){
			/*
			var type = app.event.type.split(":")[0];
			if(type == "user-details" || type == "app-init"){
				that.setState(app.user);
			}*/
			that.transitionTo('content');
		})
	},

	render : function () {
		return <div className="container-fluid">
					 <div className="row" id="topbar">
						<div className="col-md-12">
							<TopBar />
						</div>
					</div>
					<div className="row">
						<div className="col-md-10 col-md-offset-1">
							<RouteHandler />
						</div>
					</div>
					<div className="row" id="footer">
						<div className="col-md-12">
							<Footer />
						</div>
					</div>
				</div>
	}
});



var routes = (
	<Route name="home" path="/" handler={App}>
		<Route name="content" path="content" handler={Content} />
		<Route name="user" path="user" handler={UserDetails} />
		<Route name="edit" path="edit/:id" handler={EditSquare} />
		
		<Route name="admin" path="/admin" >
			<Route path="users" handler={AdminUserList} />
		</Route>	
	</Route>
);


Router.run(routes, function (Root, state) {
	React.render(<Root/>, app);
});