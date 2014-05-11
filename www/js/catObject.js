/*
Copyright 2004 Michal Škoula

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 
*/

/* cat prototype */
function catObject(id,name,health,x,y,distance,money,items) {
	this.name = name;
	this.id = id;
	this.health = health;
	this.x = x;
	this.y = y;
	this.image = _images.cat;
	this.width = parseInt(_images.cat.originalWidth/2);
	this.height = _images.cat.originalHeight;
	this.jumpPath = [];
	this.jetpack = new emitorObject(x,y,12,4,4,2,parseInt(this.width/3),["#fee69a","#fe775d","#3d3d33"],"down");
	this.score = 0;
	this.distance = 0;
	this.money = parseInt(money);
	this.lasty = y;
	this.suffering = false;
	this.screaming = false;
	this.milking = false;

	this.items = items;
	this.coinValue = 1;
	this.milkValue = 3;
	this.immortal = 0;
	this.milkyWay = false;

	this.draw = function() {
		var oddOrEven = parseInt(parseInt(_game.odd/4) * this.width);
		_game.context.drawImage(this.image,oddOrEven,0,this.width,this.height,rc(this.x),rc(this.y),rc(this.width),rc(this.height));
		if(this.suffering) {
			_game.context.globalAlpha=0.2;
			_game.context.fillStyle="red"; 
			_game.context.fillRect(0,0,_game.width,_game.height);
			_game.context.globalAlpha=1;
		}
		else if(this.milking) {
			_game.context.globalAlpha=0.2;
			_game.context.fillStyle="green"; 
			_game.context.fillRect(0,0,_game.width,_game.height);
			_game.context.globalAlpha=1;
		}

		//draw score, health and money and maybe powerups?
        _game.context.globalAlpha=0.5;
		_game.context.fillStyle="cyan"; 
		_game.context.fillRect(rc(650),rc(20),rc(250),rc(110));
		_game.context.globalAlpha=1;

		_game.context.fillStyle="white";
        _game.context.font= _game.fontsize + "px renegade_masternormal";
        _game.context.fillText("Score: "+parseInt(this.score), rc(665), rc(50));
        _game.context.fillText("Coins: "+parseInt(this.money)+"", rc(665), rc(80));
        _game.context.fillText("Health: "+parseInt(this.health)+"%", rc(665), rc(110));

        var top = 170;
    	_game.context.font= _game.fontsize + "px renegade_masternormal";

		if(this.coinValue != 1) {
			_game.context.globalAlpha=0.5;
			_game.context.fillStyle="red"; 
			_game.context.fillRect(rc(650),rc(top),rc(250),rc(50));
			_game.context.globalAlpha=1;
			_game.context.fillStyle="white";
	        _game.context.fillText("Double coins!", rc(665), rc(top+35)); 
	        top += 60;
		}
		if(this.milkyWay == true) {
			_game.context.globalAlpha=0.5;
			_game.context.fillStyle="red"; 
			_game.context.fillRect(rc(650),rc(top),rc(250),rc(50));
			_game.context.globalAlpha=1;
			_game.context.fillStyle="white";
	        _game.context.fillText("Milky Way!", rc(665), rc(top+35)); 
	        top += 60;
		}
		if(this.immortal != 0) {
			_game.context.globalAlpha=0.5;
			_game.context.fillStyle="red"; 
			_game.context.fillRect(rc(650),rc(top),rc(250),rc(50));
			_game.context.globalAlpha=1;
			_game.context.fillStyle="white";
	        _game.context.fillText("God Mode: "+parseInt(this.immortal / _gameConfig.fps), rc(665), rc(top+35)); 
	        top += 60;
		}

		
	}

	this.tick = function() {
		this.lasty = this.y;
		this.distance++;
		this.score += _game.speed; 
		
		//suffering - red screen and vibrations
		this.suffering = false;
		//immortal--------------------------
		if(this.immortal > 0) {
			_sounds.ingame.pause();
			_sounds.hellfire.play();
			this.immortal--;
			_game.speed = _game.immortalSpeed;
			if(this.immortal == 0) {
				_game.speed = 1;
				_sounds.hellfire.pause();
				_sounds.ingame.play();
			}
		}
		//mortal----------------------------
		else {
			//collisions
			for(var i = 0; i < _game.enemies.length; i++) {
				if(intersect(this,_game.enemies[i])) {
					this.suffering = true;
					this.health--;				
				}
			}
			//is cat in the stratosphere?
			if(this.y < 0) {
				this.health -= 0.1;
				this.suffering = true;
			}
			if(this.suffering == true) {
				_game.vibrate(500);

				if(this.screaming == false && _gameConfig.device != "wp8") {
					this.screaming = true;
					var painMusic = ["pain1","pain2","pain3"];
					_sounds.pain = _sounds[painMusic[Math.rand(0,painMusic.length-1)]];
					_sounds.pain.play();
					_sounds.pain.on('ended', function() {
						this.screaming = false;
				    },this);	
				}
			}
		}


		//collecting coins
		if(_game.coins.length > 0) {
			for(var i = 0; i < _game.coins.length; i++) {
				if(intersect(this,_game.coins[i])) {
					_game.coins.splice(i,1);
					this.money += this.coinValue;
					this.score += 200;
				}
			}
		}

		//milk? add health
		this.milking = false;
		if(_game.milks.length > 0) {
			for(var i = 0; i < _game.milks.length; i++) {
				if(intersect(this,_game.milks[i])) {
					_game.milks.splice(i,1);
					if(this.health + this.milkValue > 100)
						this.health = 100;
					else
						this.health += this.milkValue;
					this.milking = true;
				}
			}
		}




		//is cat jumping - going up only? - jetpack
		if(this.jumpPath.length > 0) {
			this.y = this.jumpPath[0];
			this.jumpPath.splice(0,1);

			if(this.jumpPath[0] > this.jumpPath[1])
				this.jetpack.turnOn();
			else {
				this.jetpack.turnOff();
			}
		}
		else {
			this.jetpack.turnOff();
		}

		//jetpack
		this.jetpack.y = this.y + this.height;
		this.jetpack.tick();

		this.draw();
	}

	this.jump = function() {
		//h = h0 + v0.t - 1/2 g t2
		var h0 = 413 - this.y;
		var g = 11;
		var v0 = 45;

		if(h0 <= 0)
			h0 = 1;
		for(var i = 0; i < 200; i++) {
			var t = i/3;
			var h = h0 + v0*t - 0.5*g*t*t;
			if(h >= 0)
				this.jumpPath[i] = 413 - Math.round(h);
		}
		this.jumpPath.push(413);

		if(_gameConfig.device != "wp8") {
			_sounds.thud.volume(0.5);
			_sounds.thud.play();
		}
	}

	this.deleteItems = function(toDelete) {
		var temp = this.items;
		for(var i = 0; i < this.items.length; i++) {
			for(var j = 0; j < toDelete.length; j++) {
				if(this.items[i].id_item == toDelete[j]) {
					temp.splice(i,1);
					jQuery.support.cors = true;
					$.getJSON(_game.url + "cat/useItem?id_user="+_cat.id+"&id_item="+toDelete[j], null, function(data) { });
				}
			}
		}
		this.items = temp;
	}
}