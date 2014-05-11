/*
Copyright 2004 Michal Škoula

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 
*/

/* enemy prototype */
function enemyObject(type,x,y) {
	this.image = _images[type];
	this.width = parseInt(this.image.originalWidth/2);
	this.height = this.image.originalHeight;
	this.type = type;
	this.x = x;
	this.y = y;	
	this.bark = null;
	this.counter = 0;

	switch(type) {
		case "dog1": //rocket
			this.jetpack = new emitorObject(this.x,this.y,25,4,4,4,this.height,["#fee69a","#fe775d","#3d3d33"],"right");
			this.bark = _sounds.bark2;
			break;
		case "dog2": //ufo	
			this.bark = _sounds.bark4;
			break;
		case "dog3": //train
			this.jetpack = new emitorObject(this.x,this.y+10,15,4,4,3,this.width/4,["#6A6D5C","#AAAC9D"],"up");
			this.bark = _sounds.bark3;
			break;
		case "dog4": //robot
			this.jumpPath = [383,383,383,383,383,383,383,383,383,383,
							383,383,383,383,383,383,383,383,383,383,
							383,383,383,383,383,383,383,378,373,368,
							363,358,353,348,343,338,333,328,323,318,
							313,308,313,318,323,328,333,338,343,348,
							353,358,363,368,373,378,383,383,383,383];	
			this.bark = _sounds.bark1;
			break;
	}
	

	this.draw = function() {
		var oddOrEven = parseInt(parseInt(_game.odd/4) * this.width);
		_game.context.drawImage(this.image,oddOrEven,0,this.width,this.height,rc(this.x),rc(this.y),rc(this.width),rc(this.height));
	}
 
	this.tick = function() {		
		//set volume via x
		var volume = 1;
		if(this.x > 900)
			volume = -this.x/3100 + 4000/3100; //@Rick Novosad special function MATFYZ
		this.bark.volume(volume); ///mega funkce

		this.counter++;
		if(this.counter > 59)
			this.counter = 0;

		//move enemy and jetpack
		switch(this.type) {
			case "dog1": 
				this.x -= parseInt(10 * _game.speed);
				this.y += Math.rand(-3,3);
				this.jetpack.y = this.y;
				this.jetpack.x = this.x + this.width;
				this.jetpack.tick();

				if(_gameConfig.device != "wp8" && (this.counter == 50 || this.counter == 15))
					this.bark.play();
				break;
			case "dog2":
				this.x -= parseInt(6 * _game.speed);
				this.y += Math.rand(-1,1);

				if(_gameConfig.device != "wp8" && (this.counter == 5 || this.counter == 35))
					this.bark.play();
				break;
			case "dog3":
				this.x -= parseInt(9 * _game.speed);
				this.jetpack.x = this.x + 10;
				this.jetpack.tick();

				if(_gameConfig.device != "wp8" && this.counter == 10) {
					this.bark.play();
				}
				break;
			case "dog4":
				//jumping!!
				if(_gameConfig.device != "wp8" && this.counter == 28) {
					this.bark.play();
				}
				this.x -= parseInt(7 * _game.speed);
				this.y = this.jumpPath[this.counter];
				break;
			default: break;
		}
		

		this.draw();
	}
}