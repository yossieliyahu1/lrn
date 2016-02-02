
"use strict";

var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;

var action = require('./../actions/AppActionCreator.js');

var Uploader = require('./Uploader');
var PicEditor = Uploader.PicEditor;

var Square = require('./Square.js');
var AppStore = require('../stores/AppStore');

module.exports = React.createClass({
   
	mixins: [Navigation],

	getInitialState : function(){
		return {
			id : "",
			title : "",
			image : "",
			link : ""
		}
	},

	onInputChange: function(event) {
		var state = this.state;
		state[event.target.name] = event.target.value;
		this.setState(state);
	},
	
	onImageChange : function(path){
		this.setState({ image : path });
	},

	componentWillMount : function (){
		var data = AppStore.getSquare(this.props.params.id);
		if(data){  // if not .. its a new square
			this.setState(data);
		}
	},

	saveChanges : function(){
		action.addSquare(this.state);
		this.transitionTo('content');
	},


	render:function(){

		
		return (<div>
					<div className="row">
						<div className="col-md-6">
							<div className="modal-body">
								
								<div className="input-group">
								  <input name="title" type="text" className="form-control" id="txtTitle" placeholder="Title" value={this.state.title} onChange={this.onInputChange} />
								</div>
								<div className="input-group">
								  <input name="link" type="text" className="form-control" id="txtUrl" placeholder="URL" value={this.state.link} onChange={this.onInputChange} />
								</div>
								 <PicEditor ref="picEditor" title="Upload Image" hndlr={this} reviewPanel={true} />
								
							</div>
						</div>
						<div className="col-md-6">
							<div>
								<Square mode="site" data={this.state} />
							</div>
							<div>
								<input type="button" value="Done" onClick={this.saveChanges} />
							</div>
						</div>
					</div>

		</div>
					  
        )
    }
})