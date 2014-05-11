/*
Copyright 2004 Michal Škoula

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 
*/

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