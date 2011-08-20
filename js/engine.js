var engine = function(){
	var enemyList = [],
	bgcolor = "",
	forecolor = "",
	charcolor = "",
	mainChar = {},
	MAX_DEPTH = 32,
	viewFinderWidth = 750,
	viewFinderHeight = 500,
	oceanPixelData = [],
	foregroundPixelData = [],
	oceanColorArray = [], 
	grid_canvas = document.getElementById("screen"),
	orientation_enum = {"up":0, "right":1, "down": 2, "left": 3},
	stars = [512];
	
	if (grid_canvas.getContext){
		space = grid_canvas.getContext("2d");
		ocean = grid_canvas.getContext("2d");
		foreground = grid_canvas.getContext("2d");		
		sdman = grid_canvas.getContext("2d");
		water_color = ocean.createLinearGradient(0, 0, 0, 750),
		water_color.addColorStop(0.0, '#3a77bf');
	    water_color.addColorStop(0.9, '#b8d2ee');
		
	}else{
		alert("canvas is not supported");
	}
	
	function preloadImages(imgList){
		var imgArray = [imgList.length];
		for(var i=0; i<imgList.length;i++){
			imgArray[i] = new Image();
			imgArray[i].src = imgList[i];
		}
		return imgArray
	}
	
	/* draw space*/
	
	
	/* Returns a random number in the range [minVal,maxVal] */
	  function randomRange(minVal,maxVal) {
	    return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
	  }

	  function initStars() {
	    for( var i = 0; i < stars.length; i++ ) {
	      stars[i] = {
	        x: randomRange(-25,25),
	        y: randomRange(-25,25),
	        z: randomRange(1,MAX_DEPTH)
	       }
	    }
	  }

	  function drawSpace() {
	    var halfWidth  = grid_canvas.width / 2;
	    var halfHeight = grid_canvas.height / 2;

	    space.fillStyle = "rgb(0,0,0)";
	    space.fillRect(0,0,grid_canvas.width,grid_canvas.height);

	    for( var i = 0; i < stars.length; i++ ) {
	      stars[i].z -= 0.2;

	      if( stars[i].z <= 0 ) {
	        stars[i].x = randomRange(-25,25);
	        stars[i].y = randomRange(-25,25);
	        stars[i].z = MAX_DEPTH;
	      }

	      var k  = 128.0 / stars[i].z;
	      var px = stars[i].x * k + halfWidth;
	      var py = stars[i].y * k + halfHeight;

	      if( px >= 0 && px <= 500 && py >= 0 && py <= 400 ) {
	        var size = (1 - stars[i].z / 32.0) * 5;
	        var shade = parseInt((1 - stars[i].z / 32.0) * 255);
	        space.fillStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
	        space.fillRect(px,py,size,size);
	      }
	    }
	  }
	
return {
	
gameInit:function(data){
	initStars()
	this.enemyList = data.enemyList; 
	this.bgcolor = data.backColor;
	this.forecolor = data.foreColor;
	this.mainChar = data.sdmanObj;
	this.mainChar.ref = sdman;
	this.mainChar.landImages = preloadImages(this.mainChar.landImg)
	this.mainChar.landImgRef = new Image();
	this.mainChar.waterImgRef = new Image();
	this.mainChar.landImgRef.src = this.mainChar.landImages[0].src;
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
	drawSpace()
/*	ocean.fillStyle = water_color;
	ocean.fillRect(0,0,1750,1550);
	foreground.fillStyle = this.forecolor;
	foreground.fillRect(0,100,750,450);		
	if(oceanColorArray.length < 1){

	}*/
},

keyPress:function(e){
	var newTop = this.mainChar.top,
	newLeft = this.mainChar.left;
	if(e.keyCode === 39){
		//if arrow right
		if((this.mainChar.left + this.mainChar.paceOfMovement) < (viewFinderWidth - this.mainChar.landImgRef.width)){
			this.setOrientation(this.mainChar.landImgRef, orientation_enum.right)
			newLeft += this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen right
		}
	}if(e.keyCode === 37){
		//if arrow left
		if((this.mainChar.left - this.mainChar.paceOfMovement) > 0){
			this.setOrientation(this.mainChar.landImgRef, orientation_enum.left)
			newLeft -= this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen left
		}
	}if(e.keyCode === 38){
		//if arrow up
		if((this.mainChar.top - this.mainChar.paceOfMovement) > 0){
			this.setOrientation(this.mainChar.landImgRef, orientation_enum.up)
			newTop -= this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen up
		}

	}if(e.keyCode === 40){
		//if arrow down
		if((this.mainChar.top + this.mainChar.paceOfMovement) < (viewFinderHeight - this.mainChar.landImgRef.height)){
			this.setOrientation(this.mainChar.landImgRef, orientation_enum.down)
			newTop += this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen down
		}
	}
	this.checkTerrain(newLeft, newTop);
	this.mainChar.left = newLeft;
	this.mainChar.top = newTop;
},

setOrientation:function(characterImgRef, orientation){
	characterImgRef.src = this.mainChar.landImages[orientation].src;
},

checkTerrain:function(l,t){
/*	var imgd = grid_canvas.getContext("2d").getImageData(l, t, this.mainChar.landImgRef.height, this.mainChar.landImgRef.width);
	var pix = imgd.data;
	console.log("current pixel data: " + pix[0], pix[1], pix[2], pix[3], pix[4], pix[5], pix[6]);
	console.log("ocean pixel data: " + oceanColorArray[0], oceanColorArray[1], oceanColorArray[2], oceanColorArray[3], oceanColorArray[4], oceanColorArray[5], oceanColorArray[6])*/
},

bugRoll:function(e){
	xCoord = e.clientX;
	yCoord = e.clientY;
//	console.log(xCoord, yCoord);
	}
}
}();
	