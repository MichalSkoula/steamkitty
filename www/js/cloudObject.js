/*
Copyright 2004 Michal Škoula

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 
*/

/* cloud prototype */
function cloudObject(x,y) {
	this.image = _images["cloud"+Math.rand(1,2)];
	this.x = Math.rand(950,3000);
	this.y = Math.rand(5,200);
	this.height = this.image.originalHeight;
	this.width = parseInt(this.image.originalWidth/ 2);

	this.draw = function() {
		var oddOrEven = parseInt(parseInt(_game.odd/4) * this.width);
		_game.context.drawImage(this.image,oddOrEven,0,this.width,this.height,rc(this.x),rc(this.y),rc(this.width),rc(this.height));
	}

	this.move = function() {
		this.x -= parseInt(6 * _game.speed);
		this.y += Math.rand(-1,1);
	}

	this.tick = function() {
		this.move();
		this.draw();
	}
}