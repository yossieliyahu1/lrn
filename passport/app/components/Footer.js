
"use strict";

var React = require('react/addons');

var AppStore = require('../stores/AppStore.js');

module.exports = React.createClass({
    
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

    render:function(){
        return (
           <div className="row" style={{"height":"30px", "width" : "100%", "background-color": "gray", "position" : "fixed", "bottom" : "0"}}>
				<div className="col-md-12">
					Footer
				</div>
			</div>
        )
    }
})