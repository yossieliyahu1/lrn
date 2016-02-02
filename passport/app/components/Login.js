
"use strict";

var React = require('react/addons');
var action = require('./../actions/AppActionCreator')

var helper = require('./../helpers/RestHelper');
var AppStore = require('./../stores/AppStore.js');

module.exports = React.createClass({
    
	getInitialState : function (){
		return { 
			msg : "Please sign in",
			user : "",
			pass : ""
		}
	},

	onInputChange : function (){
		var state = this.state;
		state[event.target.name] = event.target.value;
		this.setState(state);
	},

	submit : function (e){
		e.preventDefault();
		
		var that = this;
		helper.get("api/user/" + this.state.user + "/" + this.state.pass + "/" + AppStore.getApp().user._id).then(function(data){

			if(that.props.mode == "loginlogout" && data && data._id && data._id != "0_0"){
				helper.get("api/user/0").then(function(data){
					action.changeUser(data);
				});
			}
			else if (data && data._id && data._id != "0_0") {
				if(that.props.mode == "loginedit"){
					action.chmode("edit");
				}
				else{
					action.changeUser(data);
				}
			}
			else{
				that.setState({msg : "Wrong user or pass", user : "", pass : ""});
			}
		})
	},

	cancel : function (){
		var mode = "site";
		if(this.props.mode != "login"){
			// the user already loggedin -> he tries to logout or edit -> just refresh it without the toolbar login panel
			mode = "loggedin";
		}
		action.chmode(mode);
	},

	logout : function (){
		action.chmode("loginlogout");
	},

	render:function(){

		if(this.props.type == "logout"){
			return <a href="javascript:void(0);" onClick={this.logout} >log-out</a>
		}

		var msg = (this.props.mode == "loginlogout") ? "Enter user and password" : this.state.msg;
		return <form id="login" className="form-signin form-horizontal lh" role="form">
					<div className="row form-wrp">
						<div className="col-md-2 align-right no-right-pad">
							<div className="form-msg">{msg}</div>
						</div>
						<div className="col-md-2 no-right-pad">
							<input name="user" type="text" className="form-control" id="txtUser" placeholder="User Name" value={this.state.user} onChange={this.onInputChange} />
						</div>
						<div className="col-md-2 small-left-pad">
							<input name="pass" type="password" className="form-control" id="txtPass" placeholder="Password" value={this.state.pass} onChange={this.onInputChange} />
						</div>
						<div className="btnWrp">
							<div className="fl">
								<button type="button" className="btn btn-default" onClick={this.submit}>OK</button>
							</div>
							<div className="">
								<button type="button" className="btn btn-default" onClick={this.cancel}>Cancel</button>
							</div>
						</div>
					</div>
					
				</form>
    }
})