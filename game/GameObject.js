//////////////////////////  GameObject prototype /////////////////////////////////



function GameObject(program, x, y, z, degrees, bounding_cir_rad)  {

    this.x = x;
    this.y = y;
    this.z = z;
    this.degrees = degrees;
    this.xdir    = Math.cos(this.degrees*Math.PI/180.0);
    this.zdir    = Math.sin(this.degrees*Math.PI/180.0);
    this.bounding_cir_rad = bounding_cir_rad;

    GameObject.prototype.turn = function(degreesRotation) {
	this.degrees = (this.degrees + degreesRotation) % 360;
	this.xdir    = Math.cos(this.degrees*Math.PI/180.0);
	this.zdir    = Math.sin(this.degrees*Math.PI/180.0);
    };

    GameObject.prototype.move = function (speed) {		// Pass in negative speed for backward motion
	this.x = this.x + speed * this.xdir;
	this.z = this.z + speed * this.zdir;
    };

    
};



//////////////////////////  End GameObject prototype /////////////////////////////////
