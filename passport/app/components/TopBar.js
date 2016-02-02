
"use strict";

var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;

var action = require('./../actions/AppActionCreator')

var AppStore = require('../stores/AppStore');
var Login = require('../components/Login');

module.exports = React.createClass({
    
	mixins: [Navigation],

	getInitialState : function (){
		return { 
			app : {}
		}
	},

	componentWillMount : function (){

		this.setState({ app : AppStore.getApp()});

		var that = this;
		AppStore.onChange(function(app){
			that.setState({ app : app });
		})
	},

	edit : function (){
		action.chmode({mode : "loginedit"});
	},

	register : function (){
		this.transitionTo('user');
	},

	login : function(){
		action.chmode({mode : "login"});
	},

	done : function(){
		action.chmode({mode : "loggedin"});
	},

	render : function(){

		if(this.state.app.mode == "site"){
			return <div className="row tbh">
						<div className="col-md-2 col-sm-6">
							<div className="hello-label">Hello {this.state.app.user.name}</div>
						</div>
						<div className="col-md-2 col-sm-6 link">
							<a href="javascript:void(0);" onClick={this.login} >log-in</a>
							<a href="javascript:void(0);" onClick={this.register} >register</a>
						</div>
				   </div>
		}
		else if(this.state.app.mode == "login" || this.state.app.mode == "loginedit" || this.state.app.mode == "loginlogout"){
			return <div className="row tbh">
						<div className="col-md-8">
							<Login type="login" mode={this.state.app.mode} />
						</div>
				   </div>
		}
		else if(this.state.app.mode == "loggedin"){
				return <div className="row tbh">
							<div className="col-md-2 col-sm-6">
								<div className="hello-label">Hello {this.state.app.user.name}</div>
							</div>
							<div className="col-md-2 col-sm-6 link">
								<a href="javascript:void(0);" onClick={this.edit} >edit</a>
								<Login type="logout" mode={this.state.app.mode} />
							</div>
					   </div>
		}
		else if(this.state.app.mode == "edit"){
				return <div className="row tbh">
						<div className="col-md-2 col-sm-6">
							<div className="edit-label">Edit your content</div>
						</div>
						<div className="col-md-2 col-sm-6">
							<a href="javascript:void(0);" onClick={this.done} >done editing</a>
						</div>
					</div>
		}
    }
})