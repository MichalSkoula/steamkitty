/*
Copyright 2004 Michal Škoula

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 
*/

/* background prototype */
function backgroundObject() {
	this.images = [_images.country,_images.country2,_images.country3,_images.country4,_images.country5];
	this.image1 = this.images[0];
	this.image1id = 2;
	this.image2 = this.images[0];
	this.image2id = 1;
	this.width = this.image1.originalWidth;
	this.height = this.image1.originalHeight;
	this.position1 = 0;
	this.position2 = this.width;

	this.tick = function() {
		this.position1 -= parseInt(4 * _game.speed);
		this.position2 -= parseInt(4 * _game.speed);

		//set random background, not the same as previous
		if(this.position1 <= -this.width) {
			this.position1 = this.width;	

			var temp = -1;
			do {
				temp = Math.rand(0,this.images.length-1);
			}
			while(temp==this.image1id);

			this.image1id = temp;
			this.image1 = this.images[temp];
		}
		if(this.position2 <= -this.width) {
			this.position2 = this.width;
			var temp = -1;
			do {
				temp = Math.rand(0,this.images.length-1);
			}
			while(temp==this.image2id);

			this.image2id = temp;
			this.image2 = this.images[temp];
		}

		this.draw();
	}

	this.draw = function() {
		_game.context.drawImage(this.image1,rc(this.position1),0,rc(this.width),rc(this.height));
		_game.context.drawImage(this.image2,rc(this.position2),0,rc(this.width),rc(this.height));
	}
}