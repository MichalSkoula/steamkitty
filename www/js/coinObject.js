/* coin prototype */
function coinObject() {
	this.image = _images.coin;
	this.width = this.image.originalWidth;
	this.height = this.image.originalHeight;
	
	this.x = Math.rand(2500,3200);
	this.y = Math.rand(0,520-this.height);

	this.draw = function() {
		_game.context.drawImage(this.image,rc(this.x),rc(this.y),rc(this.width),rc(this.height));
	}
 
	this.tick = function() {		
		this.x -= parseInt(4 * _game.speed);
		this.draw();
	}
}