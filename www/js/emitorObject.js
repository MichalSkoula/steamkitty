function emitorObject(x,y,intensity,width,height,itl,diff,colors,direction) {
	this.x = x;
	this.y = y;
	this.particlesWidth = width;
	this.particlesHeight = height;
	this.particles = [];
	this.intensity = intensity;
	this.realIntensity = intensity;
	this.itl = itl;
	this.realItl = itl;
	this.diff = diff;
	this.on = true;
	this.colors = colors;
	this.direction = direction;

	this.turnOn = function() {
		this.realIntensity = this.intensity * 1.5;
		this.realItl = this.itl + 1;
	}

	this.turnOff = function() {
		this.realIntensity = this.intensity / 1.5;
		this.realItl = this.itl - 1;
	}

	this.emit = function() {
		var tempx, tempy = 0;
		switch(this.direction) {
			case "down":
			case "up": 
				tempx = this.x + Math.rand(0,diff);
				tempy = this.y; 
				break;
			case "right": 
				tempx = this.x;
				tempy = this.y + Math.rand(0,diff); 
				break;
			default: break;
		}
		var p = new particleObject(tempx,tempy,this.particlesWidth,this.particlesHeight,this.realItl,colors,this.direction);
		this.particles.push(p);
	}

	this.tick = function() {
		//remove old particles
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].itl--;
			if(this.particles[i].itl == 0)
				this.particles.splice(i,1);
		}
		//move them
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].move();
		}
		//add new particles
		if(this.on) {
			var left = parseInt(this.realIntensity * 0.8);
			var right = parseInt(this.realIntensity * 1.2);
			for(var i = 0; i < Math.rand(left,right); i++) {
				this.emit();
			}
		}
		this.draw();
	}

	this.draw = function() {
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].draw();
		}
	}
}