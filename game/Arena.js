//////////////////////////  Arena class /////////////////////////////////

function Arena () {

    this.vertices = [
        0.0,0.0,0.0,
        0.0,0.0,-ARENASIZE,
        0.0,WALLHEIGHT,-ARENASIZE,
        0.0,WALLHEIGHT,0.0,
        ARENASIZE,0.0,0.0,
        ARENASIZE,WALLHEIGHT,0.0,
        ARENASIZE,WALLHEIGHT,-ARENASIZE,
        ARENASIZE,0.0,-ARENASIZE,
        0.0,0.0,-ARENASIZE,
        ARENASIZE,0.0,-ARENASIZE,
        ARENASIZE,WALLHEIGHT,-ARENASIZE,
        0.0,WALLHEIGHT,-ARENASIZE,
        0.0,0.0,0.0,
        0.0,WALLHEIGHT,0.0,
        ARENASIZE,WALLHEIGHT,0.0,
        ARENASIZE,0.0,0.0,
        0.0,0.0,0.0,
        ARENASIZE,0.0,0.0,
        ARENASIZE,0.0,-ARENASIZE,
        0.0,0.0,-ARENASIZE
    ];

    this.normals = [
	1.0,0.0,0.0,
        1.0,0.0,0.0,
        1.0,0.0,0.0,
        1.0,0.0,0.0,
        -1.0,0.0,0.0,
        -1.0,0.0,0.0,
        -1.0,0.0,0.0,
        -1.0,0.0,0.0,
        0.0,0.0,1.0,
        0.0,0.0,1.0,
        0.0,0.0,1.0,
        0.0,0.0,1.0,
        0.0,0.0,-1.0,
        0.0,0.0,-1.0,
        0.0,0.0,-1.0,
        0.0,0.0,-1.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0
    ];

    this.vBuffer = null;
    this.nBuffer = null;
    this.vPosition = null;
    this.vNormal = null;
    
    this.init = function () {

	this.vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

	this.nBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW );
	
    };

    this.show = function () {

	gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
	this.vPosition = gl.getAttribLocation( program, "vPosition" );
	if (this.vPosition < 0) {
	    console.log('Failed to get the storage location of vPosition');
	}
	gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( this.vPosition );    

	gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer );
	this.vNormal = gl.getAttribLocation( program, "vNormal" );
	if (this.vPosition < 0) {
	    console.log('Failed to get the storage location of vPosition');
	}
	gl.vertexAttribPointer( this.vNormal, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( this.vNormal );
	
	// This is the wall's color
	var ambientProduct = mult(la0, red);
	var diffuseProduct = mult(ld0, red);
	var specularProduct = mult(ls0, red);
	
	//more ambient products and math
	var ambientProduct2 = mult(la02, red);
	var diffuseProduct2 = mult(ld02, red);
	var specularProduct2 = mult(ls02, red);
	gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
 		 0);
	
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
		      flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
		      flatten(diffuseProduct) );
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
		      flatten(specularProduct) );
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
		      flatten(lp0) );
	gl.uniform1f(gl.getUniformLocation(program, "shininess"),
		     me);
			 
			 
	//This is for assigning the second light source it's values 
			 
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct2"),
		      flatten(ambientProduct2));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct2"),
		      flatten(diffuseProduct2) );
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct2"), 
		      flatten(specularProduct2) );
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition2"), 
		      flatten(lp02) );
	gl.uniform1f(gl.getUniformLocation(program, "shininess2"),
		     me2);
	
	// This will draw the walls
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);

	// This is the floor's color
	ambientProduct = mult(la0, blue);
	//	ambientProduct = mult(vec4(1.0,1.0,1.0,1.0), blue);
	diffuseProduct = mult(ld0, blue);
	specularProduct = mult(ls0, blue);
	
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
		      flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
		      flatten(diffuseProduct) );
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
		      flatten(specularProduct) );	
			  
			  
			  //Second lighting variables
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct2"),
		      flatten(ambientProduct2));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct2"),
		      flatten(diffuseProduct2) );
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct2"), 
		      flatten(specularProduct2) );	
	
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	// IMPORTANT: Disable current vertex attribute arrays so those in
	// a different object can be activated.  
	gl.disableVertexAttribArray(this.vPosition);
	gl.disableVertexAttribArray(this.vNormal);
    };

};

//////////////////////////  End Arena object /////////////////////////////////
