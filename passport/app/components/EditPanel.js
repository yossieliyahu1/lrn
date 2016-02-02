
"use strict";

var React = require('react/addons');

var Router = require('react-router');
var Navigation = Router.Navigation;

var action = require('./../actions/AppActionCreator.js')

module.exports = React.createClass({
   
	mixins: [Navigation],

	edit:function(e){
		e.preventDefault();
		this.transitionTo('edit', {id : this.props.data.id});
	},

	del:function(e){
		e.preventDefault();
		var that = this;
		bootbox.confirm("<h3>Square will be deleted</h3><br />Are you sure you want to continue?", function(rslt) {
			if(rslt){
				action.del(that.props.data);
			}
		}); 
	},

	render:function(){

		return <div id="editPanel"> 
				  <div className="btnWrp">
						<div className="fl">
							<button type="button" className="btn btn-default" onClick={this.edit}>Edit</button>
						</div>
						<div className="">
							<button type="button" className="btn btn-default" onClick={this.del}>Delete</button>
						</div>
				  </div>
				</div>

	}
})