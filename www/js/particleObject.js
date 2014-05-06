/* particles */

function particleObject(x,y,width,height,itl,colors,direction) { 
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.width = parseInt(width);
	this.height = parseInt(height);
	this.itl = itl;
	this.colors = colors;
	this.direction = direction;

	this.move = function() {
		switch(this.direction) {
			case "down": 	this.y += Math.rand(14,16);  break;
			case "up": 		this.y -= Math.rand(14,16);  break;
			case "right": 	this.x += Math.rand(14,16); break;
			default: break;
		}
		
	}
	this.draw = function() {
		_game.context.fillStyle = colors[Math.floor(Math.random()*colors.length)];
      	_game.context.fillRect(rc(this.x), rc(this.y), rc(this.width), rc(this.height));
	}
}