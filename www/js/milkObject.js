/* milk prototype */
function milkObject() {
	this.image = _images.milk;
	this.width = this.image.originalWidth;
	this.height = this.image.originalHeight;
	
	this.x = Math.rand(2000,3500);
	this.y = Math.rand(0,520-this.height);

	this.draw = function() {
		_game.context.drawImage(this.image,rc(this.x),rc(this.y),rc(this.width),rc(this.height));
	}
 
	this.tick = function() {		
		this.x -= parseInt(4 * _game.speed);
		this.draw();
	}
}