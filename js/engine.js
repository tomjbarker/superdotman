var engine = function(){
	var enemyList = [],
	bgcolor = "",
	forecolor = "",
	charcolor = "",
	mainChar = {},
	MAX_DEPTH = 32,
	viewFinderWidth = 750,
	viewFinderHeight = 500,
	currentLevel = "land",
	grid_canvas = document.getElementById("screen"),
	currentOrientation = 0,
	orientation_enum = {"up":0, "right":1, "down": 2, "left": 3},
	stars = [512];
	
	if (grid_canvas.getContext){
		stage = grid_canvas.getContext("2d");
		space = grid_canvas.getContext("2d");
		sky = grid_canvas.getContext("2d");
		foreground = grid_canvas.getContext("2d");		
		sdman = grid_canvas.getContext("2d");
		dirt_color = foreground.createLinearGradient(0,0,0,750);
		dirt_color.addColorStop(0.0, '#eb9a49');
	    dirt_color.addColorStop(0.9, '#faed7d');		
		sky_color = sky.createLinearGradient(0, 0, 0, 750),
		sky_color.addColorStop(0.0, '#3a77bf');
	    sky_color.addColorStop(0.9, '#b8d2ee');
		
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
	
	/* draw space level*/
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
	this.redCrab = data.redCrab; 
	this.redCrab.ref = sdman
	this.bgcolor = data.backColor;
	this.forecolor = data.foreColor;
	this.mainChar = data.sdmanObj;
	this.mainChar.ref = sdman;
	this.loadCharacterImages(this.mainChar);
	this.loadCharacterImages(this.redCrab);
	
	this.mainChar.landImgRef.onload = function(){
		return setInterval("engine.enterFrame()", data.frameRate);
	};
},

setCurrentLevel:function(level){
	currentLevel = level;
},

enterFrame:function(){
	this.clearScreen();
	this.drawStage();
	this.spawnCharacter(this.mainChar, this.mainChar.landImgRef);
	this.spawnCharacter(this.redCrab, this.redCrab.landImgRef);
},

clearScreen:function(){
	stage.clearRect(0, 0, grid_canvas.width, grid_canvas.height);
},

loadCharacterImages:function(character){
	console.log(character)
	character.landImages = preloadImages(character.landImg);
	character.skyImages = preloadImages(character.skyImg);
	if(character.offensiveWeapon){
		character.offensiveWeapon.bulletImages = preloadImages(character.offensiveWeapon.defaultBulletImg);
	}
	character.landImgRef = new Image();
	character.skyImgRef = new Image();
	character.bulletImgRef = new Image();
	character.landImgRef.src = character.landImages[0].src;
	
},

spawnCharacter:function(character, ref){
	try{
		stage.drawImage(ref,character.left,character.top);
	}catch(e){
		console.log(character)	
	}
},

drawLand:function(){
	foreground.fillStyle = dirt_color;
	foreground.fillRect(0,0,750,550);		
},

drawSky:function(){
	sky.fillStyle = sky_color;
	sky.fillRect(0,0,1750,1550);	
},

drawStage:function(){
//	console.log(currentLevel)
	if(currentLevel === "land"){
		this.drawLand();	
	}else if(currentLevel === "sky"){
		this.drawSky();
	}else if(currentLevel === "space"){
		drawSpace()		
	}else{
	this.drawSky();	
	}
	
},

fireWeapon:function(){
	console.log("boom!" + this.mainChar.offensiveWeapon.bulletImages[currentOrientation].src, currentOrientation)
	this.mainChar.bulletImgRef.src = this.mainChar.offensiveWeapon.bulletImages[currentOrientation].src;
	if(currentOrientation === orientation_enum.right){
		this.mainChar.offensiveWeapon.top = this.mainChar.top;
		this.mainChar.offensiveWeapon.left = this.mainChar.left + this.mainChar.landImgRef.height + 10;
	}else if(currentOrientation === orientation_enum.up){
		this.mainChar.offensiveWeapon.top = this.mainChar.top - this.mainChar.bulletImgRef.height - 5;
		this.mainChar.offensiveWeapon.left = this.mainChar.left
	}else if(currentOrientation === orientation_enum.down){
		this.mainChar.offensiveWeapon.top = this.mainChar.top + this.mainChar.landImgRef.height + 5;
		this.mainChar.offensiveWeapon.left = this.mainChar.left
	}else if(currentOrientation === orientation_enum.left){
		this.mainChar.offensiveWeapon.top = this.mainChar.top //-  this.mainChar.bulletImgRef.height;
		this.mainChar.offensiveWeapon.left = this.mainChar.left - this.mainChar.landImgRef.height - this.mainChar.bulletImgRef.height - 10;
	}
	
	this.spawnCharacter(this.mainChar.offensiveWeapon, this.mainChar.bulletImgRef)
},

keyPress:function(e){
	var newTop = this.mainChar.top,
	newLeft = this.mainChar.left;
	if(e.keyCode === 0 ){
		this.fireWeapon();
	}
	if(e.keyCode === 39){
		//if arrow right
		if((this.mainChar.left + this.mainChar.paceOfMovement) < (viewFinderWidth - this.mainChar.landImgRef.width)){
			currentOrientation = orientation_enum.right
			newLeft += this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen right
		}
	}if(e.keyCode === 37){
		//if arrow left
		if((this.mainChar.left - this.mainChar.paceOfMovement) > 0){
			currentOrientation = orientation_enum.left
			newLeft -= this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen left
		}
	}if(e.keyCode === 38){
		//if arrow up
		if((this.mainChar.top - this.mainChar.paceOfMovement) > 0){
			currentOrientation = orientation_enum.up
			newTop -= this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen up
		}

	}if(e.keyCode === 40){
		//if arrow down
		if((this.mainChar.top + this.mainChar.paceOfMovement) < (viewFinderHeight - this.mainChar.landImgRef.height)){
			currentOrientation = orientation_enum.down
			newTop += this.mainChar.paceOfMovement;			
		}else{
			//TODO scroll screen down
		}
	}
	this.setOrientation(this.mainChar.landImgRef, currentOrientation)
	this.mainChar.left = newLeft;
	this.mainChar.top = newTop;
},

setOrientation:function(characterImgRef, orientation){
	if(currentLevel === "land"){
		characterImgRef.src = this.mainChar.landImages[orientation].src;
	}else if(currentLevel === "sky"){
		characterImgRef.src = this.mainChar.skyImages[orientation].src;
	}else if(currentLevel === "space"){
		characterImgRef.src = this.mainChar.skyImages[orientation].src;
	}else{
		characterImgRef.src = this.mainChar.skyImages[orientation].src;
	}

},


bugRoll:function(e){
	xCoord = e.clientX;
	yCoord = e.clientY;
	}
}
}();
	