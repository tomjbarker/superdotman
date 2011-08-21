gameFeed({
	sdmanObj:{
		color:"#e42217",
		top:400,
		left:20,
		landImg: ["img/tank_up.png", "img/tank_right.png", "img/tank_down.png", "img/tank_left.png"],
		skyImg: ["img/flyingcharacter_up.png", "img/flyingcharacter_right.png", "img/flyingcharacter_down.png", "img/flyingcharacter_left.png"],
		waterImg: ["img/kayak.png"],
		paceOfMovement:12,
		offensiveWeapon:{
			top:0,
			left:0,
			defaultBulletImg: ["img/blast_small_up.png", "img/blast_small_right.png", "img/blast_small_down.png", "img/blast_small_left.png"]
		}
	},
	foreColor:"#7F5A58",
	backColor:"#3bb9ff",
	frameRate:10,
	redCrab:{
		top:40,
		left:200,
		defaultBulletImg: [],
		landImg:["img/crab_up.png", "img/crab_right.png", "img/crab_down.png", "img/crab_left.png"],
		skyImg:["img/purple_crab_up.png", "img/purple_crab_right.png", "img/purple_crab_down.png", "img/purple_crab_left.png"],
		paceOfMovement:10
	}		
});