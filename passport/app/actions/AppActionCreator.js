
"use strict";

var dispatcher = require('./../dispatcher.js');

module.exports = {

    addUser:function(item){
        dispatcher.dispatch({
            payload:item,
            type:"user-details:add"
        })
    },

    changeUser:function(item){
    	dispatcher.dispatch({
    		payload:item,
    		type:"user-details:change"
    	})
    },

	// change app mode
    chmode : function(data){
    	dispatcher.dispatch({
    		payload: data,
    		type: "app-mode:chmode"
    	})
    },

    del:function(item){
        dispatcher.dispatch({
            payload:item,
            type:"content-square:delete"
        })
    },

    edit:function(item){
        dispatcher.dispatch({
            payload:item,
            type:"content-square:edit"
        })
    },

    addSquare:function(item){
    	dispatcher.dispatch({
    		payload:item,
    		type:"content-square:add"
    	})
    }
}