/*
Copyright 2004 Michal Škoula

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 
*/

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