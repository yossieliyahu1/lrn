
"use strict";


var React = require('react');

var AppStore = require("../stores/AppStore");

var  PicReview =module.exports.PicReview= React.createClass({

	getInitialState:function(){

	return { slctdIndx:0 };
	},
	componentDidMount:function() {
		// console.log("picReview componentDidMount")
		var state_=this.state;
		state_.slctdIndx=this.props.select || 0;
		this.setState(state_);
	},
	
	selectImg:function(ev_){
		var slctd_=$(ev_.target).attr("src");
		// console.log(slctd_);
		$('#picDialogMainImg').attr({"src":slctd_});
		(this.props.changeIndex || function () {} )(ev_.target.name);
		return false;
	},
	onImgLoad:function(ix_,ev_){
		if(this.props.updateSize)
			this.props.updateSize(ix_,ev_.target.naturalWidth,ev_.target.naturalHeight);
	},	
	render: function() {
	 	// console.log("picDialog render")
	 	var footerBtns= this.props.footerBtns ||  [];

	 	var rvw_= this.props.reviewPanel ? (
			    		<div  id="pcdPreview  " style={{"height":"400px", "border" : "1px solid gray"}} >
			    			<div  className=" ">
			    				<img  id="picDialogMainImg" src={this.props.pics.length > 0 ? this.props.pics[this.state.slctdIndx].src : ""} 
			    				alt="" style={{"max-height":"400px", "max-width":"400px"}} className="center-block img-rounded img-responsive " />
			    			</div>
			    		</div>
	    			) :null;

	    return (<div claaName="container"  >
	    		{rvw_}
		    		<div className="picaption ">
		    			<span>{this.props.title}</span>
		    			<a className="close" href='#' onClick={this.props.add} href="#">+</a>
		     		</div>

	    			<div   className="picContent"   >
		    				<ul  className="thumnail-list">
							{(this.props.pics || []).map(function(el_, ix_) {
						        return (	<li  className="thumbnail thumbnail-item"   >
						        			<a className="close" href='#' onClick={this.props.onRemoveItem.bind(null,ix_ )} href="#">×</a>
						    				<a href="#" className="" data={el_.ix_} name={'' +ix_} onClick={this.selectImg}>
							    			<img src={el_.src} name={'' +ix_} onLoad={this.onImgLoad.bind(null, ix_)} alt="" className="" style={{"max-width":"100px","max-height":"100px","display":"inline"}} />
					    			    	</a> 	
					    			 	</li>
						        	);}.bind(this))}
							</ul>
		    		</div>
				    	
	    		</div>);
		}
});

module.exports.PicEditor=React.createClass({
	
	getInitialState:function(){

		return { slctdIndx:0,
				 pics: this.props.pics ||  []
				};
	},
	componentDidMount:function() {
		var state_=this.state;
		state_.slctdIndx=this.props.select || 0;
		state_.pics=this.props.pics || [];
		this.setState(state_);
	},
	getPics:function(){
		return this.state.pics;
	},
	removeItem:function(ix_,ev_){
		var pics = this.state.pics =  this.state.pics  || [];
		var o  = this.state.pics.splice(ix_,1);
		this.setState({ pics : pics });	
		ev_.preventDefault();
	},
	addPic:function(url_){
		/*
		var state_=this.state;
		state_.pics.push({"src":url_});
		this.setState(state_);
		*/
		this.setState({pics : [{"src":url_}]});
	},
	updateSize:function(ix_,w_,h_){
		var state_=this.state;
		state_.pics[ix_].width=w_;
		state_.pics[ix_].height=h_;
		this.setState(state_);
	},
	onAddPicture:function(ev_){
		$('#filePicker').trigger('click',ev_);
		ev_.preventDefault();
	},
	onFiledPicked:function(ev_){		
		console.log($(ev_.target).val())
		//$(this.refs.myForm.getDOMNode()).submit();
		this.handleSubmit(ev_);
	},

	changeIndex : function(i){
     this.setState({slctdIndx : i});
	},

 	handleSubmit: function(ev_) {
    	// console.log("handleSubmit");

    	
	  	var file = document.getElementById("filePicker");
      	var formData = new FormData();
      	$.each(file.files,function(ix_,file_){
        	formData.append("pmupload", file.files[ix_]);
        });
        var thisPicDialog=this;
		// console.log("posting ..");
        $.ajax({
            url: "/upload",
            type: "POST",
            data:formData,
        	processData: false,
    		contentType: false,
            success: function(data) {
                // do stuff
                console.log("success");

                var host = AppStore.getEnv().host;
                $.each(data, function(k_,v_){
	                console.log(v_.path);
	                thisPicDialog.addPic(host + 'uploads/' + v_.filename);
	                thisPicDialog.props.hndlr.onImageChange(host + 'uploads/' + v_.filename);
                });

            },
            error: function(xhr, status, err) {
                // do stuff
                console.log("error");
            }
        });
     
    },
    


	render: function() {
	 	console.log("picDialog render")
	    return (<div claaName="container"  >
	    		   <PicReview pics={this.state.pics} reviewPanel={this.props.reviewPanel} title={this.props.title} add={this.onAddPicture}
	    		   		onRemoveItem={this.removeItem} select={this.state.slctdIndx} changeIndex={this.changeIndex} updateSize={this.updateSize} />
	    		   
				   <div style={{"display":"none"}}>			
				    	<form ref="myForm" method="post" action="upload" encType="multipart/form-data" onSubmit={this.handleSubmit}>
							<span  className="btn btn-default btn-file">
						    	<input id="filePicker" type="file" name="pmupload" accept="image/*" multiple={"multiple"} onChange={this.onFiledPicked} />
							</span>	       
				    	</form>
			     	</div>
	     	</div> );
	}
});
