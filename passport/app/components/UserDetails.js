
"use strict";

var React = require('react/addons');
var action = require('./../actions/AppActionCreator.js')

var AppStore = require('../stores/AppStore');

module.exports = React.createClass({
    
	getInitialState : function(){
		return {
			user : {
				_id : "0_0"
			}
		}	
	},

	componentWillMount : function (){
		var user = AppStore.getUser();
		if(user._id == "0_0"){
			user.name = user._id = "";
		}

		this.setState(user);
	},

    updateUser:function(event){
        event.preventDefault();
        action.addUser(this.state);
    },

	handleInputChange : function(){
		var state = this.state;
		state[event.target.name] = event.target.value;
		this.setState(state);
	},

    render:function(){
    	return (
			<div id="user-details" className="row">
				<div className="col-md-offset-2 col-md-8">
					<form onSubmit={this.updateUser}>
						<div className="row">
							<div className="col-md-5">
								<input type="text" name="name" className="form-control" placeholder="App Display Name" value={this.state.name} onChange={this.handleInputChange} />
							</div>
							<div className="col-md-5" style={{"padding-top" : "7px;"}}>
								{ (this.state.user._id == "0_0") ? "The name to display on the screen when using the app" : "" } 
							</div>
						</div>
						<div className="row input-top-margin">
							<div className="col-md-5">
								<input type="text" name="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleInputChange} />
							</div>
							<div className="col-md-5" style={{"padding-top" : "7px;"}}>
								{ (this.state.user._id == "0_0") ? "Your email in case of recover password" : "" } 
							</div>
						</div>
						<div className="row input-top-margin">
							<div className="col-md-5">
								<input type="text" name="userName" className="form-control" placeholder="Login User Name" value={this.state.userName} onChange={this.handleInputChange} />
							</div>
							<div className="col-md-5" style={{"padding-top" : "7px;"}}>
								{ (this.state.user._id == "0_0") ? "username used to login into the system" : "" } 
							</div>
						</div>
						<div className="row input-top-margin">
							<div className="col-md-5">
								<input type="text" name="password" className="form-control" placeholder="Login Password" value={this.state.password} onChange={this.handleInputChange} />
							</div>
							<div className="col-md-5" style={{"padding-top" : "7px;"}}>
								{ (this.state.user._id == "0_0") ? "password used to login into the system" : "" } 
							</div>
						</div>
					
						<div className="row input-top-margin">
							<div className="col-md-1">
								<button type="submit" className="btn btn-primary">{(this.state.user._id == "0_0") ? "Create User" : "Update User"}</button>
							</div>
						</div>

    				</form>
				</div>
			</div>
        )
    }
})