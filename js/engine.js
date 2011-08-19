var engine = function(){
	var enemyList = [],
	bgcolor = "",
	forecolor = "",
	charcolor = "",
	mainChar = {},
	viewFinderWidth = 750,
	viewFinderHeight = 500,
	oceanPixelData = [],
	foregroundPixelData = [],
	oceanColorArray = [];
	
	var grid_canvas = document.getElementById("screen");
	if (grid_canvas.getContext){
		ocean = grid_canvas.getContext("2d");
		foreground = grid_canvas.getContext("2d");		
		sdman = grid_canvas.getContext("2d");
		water_color = ocean.createLinearGradient(0, 0, 0, 750),
		water_color.addColorStop(0.0, '#3a77bf');
	    water_color.addColorStop(0.9, '#b8d2ee');
		
	}else{
		alert("canvas is not supported");
	}
	
return {
	
gameInit:function(data){
	this.enemyList = data.enemyList; 
	this.bgcolor = data.backColor;
	this.forecolor = data.foreColor;
	this.mainChar = data.sdmanObj;
	this.mainChar.ref = sdman;
	this.mainChar.landImgRef = new Image();
	this.mainChar.waterImgRef = new Image();
	this.mainChar.landImgRef.src = this.mainChar.landImg;
	this.mainChar.landImgRef.onload = function(){
		return setInterval("engine.enterFrame()", 10);
	};
	this.mainChar.waterImgRef.src = this.mainChar.waterImg;
},

enterFrame:function(){
	this.clearScreen();
	this.drawStage();
	this.spawnCharacter(this.mainChar);
},

clearScreen:function(){
	this.mainChar.ref.clearRect(0, 0, grid_canvas.width, grid_canvas.height);
},

spawnCharacter:function(character){	
	character.ref.drawImage(character.landImgRef,character.left,character.top);
	
},

drawStage:function(){
	
	ocean.fillStyle = water_color;
	ocean.fillRect(0,0,1750,1550);
	foreground.fillStyle = this.forecolor;
	foreground.fillRect(0,100,750,450);		
	if(oceanColorArray.length < 1){
		oceanColorArray = ocean.getImageData(10,10,100,100).data
	}
},

keyPress:function(e){
	var newTop = this.mainChar.top,
	newLeft = this.mainChar.left;
	if(e.keyCode === 39){
		//if arrow right
		if((this.mainChar.left + this.mainChar.paceOfMovement) < (viewFinderWidth - this.mainChar.landImgRef.width)){
			if(this.mainChar.facing !== "right"){
				//this.mainChar.ref.rotate(90);
				this.mainChar.facing = "right";
			}
			newLeft += this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen right
		}
	}if(e.keyCode === 37){
		//if arrow left
		if((this.mainChar.left - this.mainChar.paceOfMovement) > 0){
			newLeft -= this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen left
		}
	}if(e.keyCode === 38){
		//if arrow up
		if((this.mainChar.top - this.mainChar.paceOfMovement) > 0){
			newTop -= this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen up
		}

	}if(e.keyCode === 40){
		//if arrow down
		if((this.mainChar.top + this.mainChar.paceOfMovement) < (viewFinderHeight - this.mainChar.landImgRef.height)){
			newTop += this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen down
		}
	}
	this.checkTerrain(newLeft, newTop);
	this.mainChar.left = newLeft;
	this.mainChar.top = newTop;
},

checkTerrain:function(l,t){
	var imgd = grid_canvas.getContext("2d").getImageData(l, t, this.mainChar.landImgRef.height, this.mainChar.landImgRef.width);
	var pix = imgd.data;
	console.log(l, t, this.mainChar.landImgRef.height, this.mainChar.landImgRef.width)
	console.log(pix[0], pix[1], pix[2], pix[3]);
	console.log(oceanColorArray[0], oceanColorArray[1], oceanColorArray[2], oceanColorArray[3])
},

bugRoll:function(e){
	xCoord = e.clientX;
	yCoord = e.clientY;
//	console.log(xCoord, yCoord);
	}
}
}();
	