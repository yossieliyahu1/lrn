
"use strict";

var dispatcher = require('./../dispatcher.js');
var helper = require('./../helpers/RestHelper.js');

function AppStore(){
    

    var app = {

    	/*
			"site" - guest entering the site. topbar shows "Hello Guest" and "log-in", "register" options.
			         "log-in" button moves the system to "login" mode. "register" button open the registration page 
					 and after complete registration moves the system to "loggedin" mode.
			"login" - to enter the system and to enable editing. topbar shows login panel
			"loginedit" - edit clicked and we should display login screen
			"loggedin" - user is logged-in. topbar shows "edit" and "log-out" buttons. the store is saving its unique _id for future edit, delete, add etc. 
			"edit" - the system is in edit mode. topbar shows "save-changes" (return to "loggedin" mode) 

		*/
    	mode: "site",   // can be: site, edit, newuser

    	event : {
			type : "app-init"
    	},

    	env : {
    		host: "http://localhost:7777/"
    	},

    	user: {
    		_id: "0_0",  // guest
    		name: "Guest",
    		email: "",
    		userName: "",
    		password: "",

    		content: []
    	}
	};
    
    helper.get("api/user/0")
    .then(function(data){
    	if (data) {
    		app.user = data;
    		console.log("received user data [" + app.user._id + "]");
			triggerListeners();
		}
    })
    




    var listeners = [];

    function getApp() {
    	return app;
    }

	function getUser(){
		return app.user;
    }

    function getContent(){
    	return app.user.content;
    }
    
    function getSquare(id) {
    	for (var i = 0 ; i < app.user.content.length ; i++) {
    		if (app.user.content[i].id == id) {
    			return app.user.content[i];
    		}
    	}
    	return null;
    }

    function getMode() {
    	return app.mode;
    }

    function getEnv() {
    	return app.env;
    }

	//////////////////////////////////////////////////////////////////////////////////////////////
	
    function changeUser(data) {

    	if (data._id == "0_0") // log-out
    	{
    		app.mode = "site";
    	}
    	else {
    		app.mode = "loggedin";
    	}
    	app.user = data;
    	triggerListeners();
    }

    function addSquare(item) {
        
    	item.uid = app.user._id;

        helper.post("api/square", item).then(function (rslt) {
        	// rslt will contain the new square with its id or the updated one
        	var bSet = false;
        	for (var i = 0 ; i < app.user.content.length ; i++) {
        		if (app.user.content[i].id == rslt.id) {
        			app.user.content[i] = rslt; // update
        			bSet = true;
        			break;
        		}
        	}
        	if (!bSet) {
        		app.user.content.push(rslt);
        	}
        	triggerListeners();
        });
    }

    function addUser(user) {
		helper.post("api/user/", user).then(function (data) {
        	changeUser(data);
        });
    }
    
    function chmode(data) {
    	app.mode = data.mode || data;
    	triggerListeners();
    }

	function deleteItem(item) {

		item.uid = app.user._id;
		item.del = true;

		for (var i = 0 ; i < app.user.content.length ; i++) {
			if (app.user.content[i].id == item.id) {
				app.user.content.splice(i, 1);
				break;
			}
		}
        
        triggerListeners();
        
        helper.post("api/square", item);
    }
   
    
	//////////////////////////////////////////////////////////////////////////////////////////////
    function onChange(listener){
        listeners.push(listener);
    }
    
    function triggerListeners(){
		listeners.forEach(function(listener){
			listener(app);
		})
	};
    
    dispatcher.register(function (event) {
    	app.event.type = event.type;
        var split = event.type.split(':');
        if (split[0] === 'content-square'){
            switch(split[1]){
                case "add": // add (with no id) or edit existing one 
                    addSquare(event.payload);
                    break;
                case "delete":
                    deleteItem(event.payload);
                    break;
            }
        }
		else if (split[0] === 'user-details'){
            switch(split[1]){
                case "add":
                    addUser(event.payload);
                    break;
                    break;
            	case "change":
            		changeUser(event.payload);
            		break;
            	case "logout":
            		logout(event.payload);
            		break;
            }
		}
		else if (split[0] === 'app-mode') {
			chmode(event.payload);
		}
    });
    
    return {
    	getApp : getApp,
        getContent : getContent,
        getUser: getUser,
        getMode: getMode,
        getSquare: getSquare,
        getEnv : getEnv,
        onChange : onChange
    }
    
    

}

module.exports = new AppStore();