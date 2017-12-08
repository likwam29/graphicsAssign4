// the-game.js
var gl;
var canvas; 
const WALLHEIGHT     = 70.0; // Some playing field parameters
const ARENASIZE      = 1000.0;
const EYEHEIGHT      = 15.0;
const HERO_VP        = 0.625;

const  upx=0.0, upy=1.0, upz=0.0;    // Some LookAt params 

const fov = 60.0;     // Perspective view params 
const near = 1.0;
const far = 10000.0;
var aspect, eyex, eyez;

const width = 1000;       // canvas size 
const height = 625;
const vp1_left = 0;      // Left viewport -- the hero's view 
const vp1_bottom = 0;

// Lighting stuff
var la0  = [ 0.2,0.2,0.2, 1.0 ]; // light 0 ambient intensity 
var ld0  = [ 1.0,1.0,1.0, 1.0 ]; // light 0 diffuse intensity 
var ls0  = [ 1.0,1.0,1.0, 1.0 ]; // light 0 specular 
var lp0  = [ 0.0,1.0,1.0, 1.0 ]; // light 0 position -- will adjust to hero's viewpoint 
var ma   = [ 0.02 , 0.2  , 0.02 , 1.0 ]; // material ambient 
var md   = [ 0.08, 0.6 , 0.08, 1.0 ]; // material diffuse 
var ms   = [ 0.06  , 0.7, 0.06  , 1.0 ]; // material specular 
var me      =100;             // shininess exponent 

//Lighting stuff for the second light
var la02  = [ 0.5,0.1,0.2, 1.0 ]; // light 0 ambient intensity
var ld02  = [ 1.0,1.0,1.0, 1.0 ]; // light 0 diffuse intensity 
var ls02  = [ 0.0,0.20,0.0, 1.0 ]; // light 0 specular 
var lp02  = [ 0.0,1.0,1.0, 1.0 ]; // light 0 position -- will adjust to hero's viewpoint 
var me2      = 1;             // shininess exponent 


const red  = [ 1.0,0.0,0.0, 1.0 ]; // pure red 
const blue = [ 0.0,0.0,1.0, 1.0 ]; // pure blue 
const green = [ 0.0,1.0,0.0, 1.0 ]; // pure green 
const yellow = [ 1.0,1.0,0.0, 1.0 ]; // pure yellow


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var program;

var totalItems = 15;

var arena;
var hero;
var thingSeeking;
var villain;

var heroCounter = 0;
var villainCounter = 0;

var g_matrixStack = []; // Stack for storing a matrix

var runGame = false;

// How many seconds the game will run for
var timerVal = 60;


window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );
    
    //    gl = WebGLUtils.setupWebGL( canvas );
    gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //  Configure WebGL
    
	// This will dictate the sky color
    gl.clearColor( 0.0, 0.75, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    eyex  = ARENASIZE/2.0;	// Where the hero starts
    eyez  =  -ARENASIZE/2.0;
    aspect=width/height;

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
		 0); // Assume no texturing is the default used in
                     // shader.  If your game object uses it, be sure
                     // to switch it back to 0 for consistency with
                     // those objects that use the defalt.
    
    
    arena = new Arena(program);
    arena.init();

    hero = new Hero(program, eyex, 0.0, eyez, 45, 10.0);
    hero.init();

	// this defines where to put the vw on the page.
    thingSeeking = createItems(totalItems);

    villain = new Villain(program, (3*ARENASIZE)/4.0, 0.0, -ARENASIZE/4.0, 0, 10.0);
    villain.init();
    
    render();
};

// This function will create a ratio of the arena size.
function ratioCreator(){
	var first = Math.floor(Math.random() * 6) + 1;
	var second = Math.floor(Math.random() * 7) + 1;
	if(first > second){
		var temp = second;
		second = first;
		first = temp;
	}
	// this will keep the object off the wall
	if(first > 1 && first == second){
		first--;
	}
	
	return ARENASIZE*first/second;
}

function createItems(numItems){
	var retArray = [];
	for(var i=0; i<numItems; i++){
		
		var arenaX = ratioCreator();
		
		var arenaZ = ratioCreator() * -1;
		
		var temp = new ThingSeeking(program, arenaX, 0.0, arenaZ, 0, 10.0);
		temp.init();
		retArray.push(temp);
	}
	return retArray;
}

function itemCollision(){
	// if hero.x is within thingSeeking.x +/- thingSeeking.bounding
	// And if hero.z is within thingSeeking.z +/- thingSeeking.bounding
	// then collision has happend
	
	for(var i=0; i<totalItems; i++){
		var thingX = thingSeeking[i].x;
		var thingZ = thingSeeking[i].z;
		var bound = thingSeeking[i].bounding_cir_rad;
		if(hero.x >= (thingX - bound) && hero.x <= (thingX + bound) && hero.z <= (thingZ + bound) && hero.z >= (thingZ - bound)){
			
			heroCounter++;
			//thingSeeking[i].isHit = true;
			/* 
			 we have to change the x and z of the object just hit because it still
			 exists on the page and will continue to hit it if we sit in the spot where it was
			 causing the counter to keep running
			 */
			thingSeeking[i].x = ratioCreator();
			thingSeeking[i].z = ratioCreator() * -1;
			document.getElementById("heroScore").innerHTML = heroCounter;
			break;
		}
		
		if(villain.x >= (thingX - bound) && villain.x <= (thingX + bound) && villain.z <= (thingZ + bound) && villain.z >= (thingZ - bound)){
			villainCounter++;
			//thingSeeking[i].isHit = true;
			thingSeeking[i].x = ratioCreator();
			thingSeeking[i].z = ratioCreator() * -1;
			document.getElementById("villainScore").innerHTML = villainCounter;
			
		}
	}
	
}

function heroWallCollision(){
	// right wall collision
	if(hero.x > 997){
		hero.xdir = (hero.xdir * -1);
		hero.x = 990;
	}
	// left wall collision
	if(hero.x < 3){
		hero.xdir = (hero.xdir * -1);
		hero.x = 10;
	}
	
	// botton wall collision
	if(hero.z > -3){
		hero.zdir = (hero.zdir * -1);
		hero.z = -10;
	}
	
	// top wall collision
	if(hero.z < -998){
		hero.zdir = (hero.zdir * -1);
		hero.z = -988;
	}
	
	// right wall collision
	if(villain.x > 997){
		villain.xdir = (villain.xdir * -1);
		villain.x = 990;
	}
	// left wall collision
	if(villain.x < 3){
		villain.xdir = (villain.xdir * -1);
		villain.x = 10;
	}
	
	// botton wall collision
	if(villain.z > -3){
		villain.zdir = (villain.zdir * -1);
		villain.z = -10;
	}
	
	// top wall collision
	if(villain.z < -998){
		villain.zdir = (villain.zdir * -1);
		villain.z = -988;
	}
}

function heroVillianCollision(){
	// this kinda works, but it's not very smooth
	// the parseInt is there because the hero's location is a float
	var villainX = villain.x;
	var villainZ = villain.z;
	var bound = 10.0;
	if(hero.x >= (villainX - bound) && hero.x <= (villainX + bound) && hero.z <= (villainZ + bound) && hero.z >= (villainZ - bound)){
		villain.x -= 100;
		hero.x += 100;
		var audio = new Audio('sound.mp3');
		audio.play();
	}
}

// This function will move the villain toward the closest item at the time.
function villainMove(){
	var neg = -1.0;
	var moveRate = 2.8;
	var negX = true;
	var negZ = true;
	
	var currX = villain.x;
	var currZ = villain.z;
	
	// this will make it so the villain grabs all the items in order.
	var nextVictim = villainCounter % totalItems;
	
	var closestX = thingSeeking[nextVictim].x;
	var closestZ = thingSeeking[nextVictim].z;
	// move towards closest x value, either positive or negative
	
	// move x and z closer to that item.
	
	if(currX > closestX){
		negX = true;
	}else{
		negX = false;
	}
	
	if(currZ > closestZ){
		negZ = true;
	}else{
		negZ = false;
	}
	
	if(negX){
		// move left
		villain.x += (moveRate) * neg;
	}else{
		// move right
		villain.x += moveRate;
	}
	
	// move toward closest z value, either positive or negative
	
	if(negZ){
		// move up
		villain.z += (moveRate) * neg;
	}else{
		// move down
		villain.z += moveRate;
	}
}

function render()
{
	// this needs to be here so while holding movement key it still moves.
	executeMovement();
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	itemCollision();
	heroVillianCollision()
	heroWallCollision();
	
	villainMove();
    
    // Hero's eye viewport 
    gl.viewport( vp1_left, vp1_bottom, (HERO_VP * width), height );
    
    lp0[0] = hero.x + hero.xdir; // Light in front of hero, in line with hero's direction
    lp0[1] = EYEHEIGHT;
    lp0[2] = hero.z + hero.zdir;
    modelViewMatrix = lookAt( vec3(hero.x, EYEHEIGHT, hero.z),
			      vec3(hero.x + hero.xdir, EYEHEIGHT, hero.z + hero.zdir),
			      vec3(upx, upy, upz) );
    projectionMatrix = perspective( fov, HERO_VP * aspect, near, far );
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    arena.show();
	
	hero.show();
	
    for(var i=0; i<totalItems; i++){
		thingSeeking[i].show();
	}
    
	
	villain.show();
	
    
    // Overhead viewport 
    var horiz_offset = (width * (1.0 - HERO_VP) / 20.0);
    gl.viewport( vp1_left + (HERO_VP * width) + horiz_offset ,
		 vp1_bottom, 18 * horiz_offset, height );
    modelViewMatrix = lookAt(  vec3(500.0,100.0,-500.0),
			       vec3(500.0,0.0,-500.0),
			       vec3(0.0,0.0,-1.0) );
    projectionMatrix = ortho( -500,500, -500,500, 0,200 );
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    arena.show();
    hero.show();
	
    for(var i=0; i<totalItems; i++){
		thingSeeking[i].show();
	}
	
	villain.show();
	
	if(runGame){
		requestAnimFrame( render );
	}
    
};

// Key listener

var keyMap = [];
document.addEventListener("keydown", onDocumentKeyDown, true); 
document.addEventListener("keyup", onDocumentKeyUp, true);

// the start button click listener
document.getElementById("startGameButton").addEventListener("click", gameStart);

// This will start/stop the game
function gameStart(){
	
	// if the game has finished change the click functionality
	if (timerVal < 0){
		location.reload();
	}
	
	// if the game is not in progress then start it
	if(!runGame){
		runGame = !runGame;
		render();
		onTimer();
	}
	
}


function onTimer() {
  document.getElementById('mycounter').innerHTML = timerVal + " sec";
  timerVal--;
  // if this gets hit then the time has run out and the game is over
  if (timerVal < 0) {
	var alertText = "You Lost!";
	runGame =  false;
	if(heroCounter > villainCounter){
		alertText = "You Won!";
	}
	document.getElementById("startGameButton").innerHTML = "Reset game";
	alert(alertText);
  }
  else {
    setTimeout(onTimer, 1000);
  }
}

function onDocumentKeyDown(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = true;
    executeMovement();
}
function onDocumentKeyUp(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;
    executeMovement();
}
function executeMovement(){
    if(keyMap[37] == true){
        //rotate left
		hero.turn(-3);
    }
    if(keyMap[39] == true){
        //rotate right
		hero.turn(3);
    }
    if(keyMap[38] == true){
        //move front
		hero.move(4.0);
    }
    if(keyMap[40] == true){
        //move back
		hero.move(-2.0);
	}
}

