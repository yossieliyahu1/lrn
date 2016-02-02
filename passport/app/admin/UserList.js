
"use strict";

var React = require('react/addons');
var helper = require('./../helpers/RestHelper.js');

module.exports = React.createClass({

	getInitialState : function (){
		return {
			users : []
		}
	},

	componentWillMount : function (){
		var that = this;
		helper.get("admin/users").then(function(data){
			if (data) {
				that.setState({ users : data });
			}
		});
	},

	render:function(){
        return (
            <div>
                <h1>All Users</h1>
                     <div className="table-responsive">
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Email</th>
									<th>User</th>
									<th>Password</th>
									<th>Squares</th>
								</tr>
							</thead>
							<tbody>
								{
                    				this.state.users.map(function(user, index){
                    					return (<tr><td>{user._id}</td><td>{user.name}</td><td>{user.email}</td><td>{user.userName}</td><td>{user.password}</td><td>{user.content.length}</td></tr>)
									})                       
								}	
							</tbody>
					</table>
                </div>
            </div>
        )
    }
})