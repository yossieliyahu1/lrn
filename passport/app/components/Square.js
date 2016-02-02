
"use strict";

var React = require("react/addons");
var Router = require('react-router');
var Navigation = Router.Navigation;

var action = require("./../actions/AppActionCreator.js");

var EditPanel = require("./EditPanel.js");

module.exports = React.createClass({
    
	mixins: [Navigation],

	edit:function(data){ // called by EditPanel after square edit
        action.edit(data);
	},

	del:function(){
        action.delete(this.props.data);
	},

	addSquare : function(){
		this.transitionTo('edit', {id : 0});
	},

	nvgtSquare : function(){
		if(this.props.mode == "edit"){
			return;
		}
		document.location.href = this.props.data.link;
	},

	render:function(){

		if(this.props.data.link == "new_square"){
			// new square
			return <div id="newSquare" onClick={this.addSquare}>
					<div className="txt">Create <br />New</div>
				</div>
		}

		return ( <div id="square">
					<div className="col-md-3 col-sm-6 wrpr">

						<div className="row">
							<div className="col-md-12">
								<img src={this.props.data.image} className="imgs" onClick={this.nvgtSquare} />
							</div>
						</div>

						<div className="row">
							<div className="col-md-12 txt" onClick={this.nvgtSquare}>
								{this.props.data.title}
							</div>
						</div>

				
						{
							(this.props.mode == "edit" ? <EditPanel hndlr={this} data={this.props.data} /> : <div /> )
						}

				</div>
			</div>
        )
    }
})