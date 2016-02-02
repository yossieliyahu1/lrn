
"use strict";

var React = require('react/addons');

var Square = require('./Square.js');

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
		var that = this;
		return (<div id="cntnt">
                <div className="main">
					<div className="row">
                    {this.state.app.user.content.map(function(square, index){
                    	return (
                            <Square mode={that.state.app.mode} data={square} key={"item" + index} />
                        )
                    })                       
					}
					
					{
						(this.state.app.mode == "edit") ? 
						<Square mode={that.state.app.mode} data={{"link" : "new_square"}} />
							:
						<div />
					}
                </div>
						</div>
						</div>
        )
    }
})