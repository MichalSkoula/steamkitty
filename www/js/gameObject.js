/* game prototype */

function gameObject(canvas,context,_images) {
	this.width = parseInt(window.innerHeight * 1.5);
	this.height = parseInt(window.innerHeight);
	this.menu_height = parseInt(this.height/12);
	this.url = _gameConfig.url;
	this.fps = parseInt(1000/_gameConfig.fps);
	this.speed = parseFloat(_gameConfig.speed);
	this.immortalSpeed = parseInt(_gameConfig.immortalSpeed);
	this.canvas = canvas;
	this.context = context;
	this.context.textBaseline="top"; 
	this.renderInterval = null;
	this.background = new backgroundObject();
	this.fontsize = parseInt(this.height/26);
	this.started = false;
	this.odd = 1;
	this.ratio = this.height/600; //hard coded height of coordinates
	this.vibrations = 0;
	this.enemyPatterns = jsonEnemies;
	this.offset = 1;
	this.offset2 = -150;



	//resize canvas to fit screen with ratio
	this.resize = function() {
		$("#container").css("width",this.width);
	    $("#container").css("height",this.height);
	    $("#canvas").attr("width",this.width);
	    $("#canvas").attr("height",this.height);
	    $("#back_canvas").attr("width",this.width);
	    $("#back_canvas").attr("height",this.height);
	    $("#controls").css({"height": parseInt(this.height-this.menu_height-this.height*0.02) +"px"});
	    $("body,button").css({"font-size": this.fontsize +"px"});
	    $("#menu").css({"height": this.menu_height +"px"});

	    $("#preload").css({"left":window.innerWidth/2-64});
	    $("#preload").css({"top":this.height/2-7});
	}


	//ads
	this.showAd = function() {
		//ad
	    if(typeof jsonAds[_gameConfig.device] !== "undefined") {
		    var myAd = null;
		    if(this.width > 730)
		    	myAd = jsonAds[_gameConfig.device].ad720;
		    else if(this.width > 645)
		    	myAd = jsonAds[_gameConfig.device].ad640;
		    else if(this.width > 470)
		    	myAd = jsonAds[_gameConfig.device].ad468;
		    else 
		    	myAd = jsonAds[_gameConfig.device].ad320;

		    $("#ad").css({width:myAd.width,height:myAd.height,top:this.height/1.5,display:"block"});
		    $("#ad").html(myAd.content);
		}
	}
	this.hideAd = function() {
		$("#ad").css({"display":"none"});
	}

	//get mouse position after clicking on canvas - with ratio
	this.getMousePosition = function(evt) {
		var rect = this.canvas.getBoundingClientRect();
		var ratio = this.width / this.canvas.offsetWidth;
		return {
			x: parseInt((evt.clientX - rect.left) * ratio),
			y: parseInt((evt.clientY - rect.top) * ratio)
		};	
	}








	//SCORE SECTION-------------------------------------------------------------------------------------

	//show score
	this.showScore = function() {
		this.pause();
	    TINY.box.show(
	    	{
	    	    html: "<div style='padding-top:2%'><div id='score_menu'></div> <hr><div id='score_content'></div><br><button style='font-size: "+_game.fontsize+"px' id='close_btn'>close</button></div>",
	    		width: parseInt(this.width),
	    		height: parseInt(this.height),
	    		openjs: function() {
	    			var scorePlatform = "web";
	    			switch(_gameConfig.device) {
	    				case "android": scorePlatform = "Android"; break;
	    				case "wp8": scorePlatform = "Windows Phone"; break;
	    				default: break;
	    			}
	    			//guest??
	    			if(_cat.id == -1)
	    				$("#score_menu").html("<button style='font-size: "+_game.fontsize+"px' id='globalscore_platform_btn'>global "+scorePlatform+"</button> | <button style='font-size: "+_game.fontsize+"px' id='globalscore_btn'>global highscore</button>");
	    			//logged player - show his score?
	    			else {
						$("#score_menu").html("<button style='font-size: "+_game.fontsize+"px' id='myscore_btn'>my</button> | <button style='font-size: "+_game.fontsize+"px' id='globalscore_platform_btn'>global "+scorePlatform+"</button> | <button style='font-size: "+_game.fontsize+"px' id='globalscore_btn'>global</button>");
						$( "#myscore_btn" ).click(function() {
							var id_user = encodeURIComponent(_cat.id);
							_game.showLoading();
	    					jQuery.support.cors = true;
							$.getJSON(_game.url + "score/getMyHighscore?id_user="+id_user, null, function(data) {
						        if(data == false) {
									$("#score_content").html("There was some problem getting your highscore.<br>");
								}
								else {	
									var html = "Your highscore<br><table><tr><th>#</th><th>score</th><th>date</th><th>platform</th></tr>";
										$.each(data, function(index, value) {
										    html += "<tr><td>"+(index+1)+".</td><td>"+value.score+"</td><td>"+value.published+"</td><td>"+value.device+"</td></tr>";
										});
									html += "</table>";
									$("#score_content").html(html);
								}
								_game.hideLoading();
						    });
	    				});
	    			}

	    			$( "#close_btn" ).click(function() {
	    				TINY.box.hide();
	    				_game.resume();
	    			});
	    			
	    			$( "#globalscore_platform_btn" ).click(function() {
	    				_game.showLoading();
						jQuery.support.cors = true;
						$.getJSON(_game.url + "score/getGlobalPlatformHighscore/"+_gameConfig.device, null, function(data) {
					        if(data == false) {
								$("#score_content").html("There was some problem getting the highscore.<br>");
							}
							else {	
								var html = "Global "+scorePlatform+" Highscore<br><table><tr><th>#</th><th>score</th><th>nick</th><th>date</th></tr>";
									$.each(data, function(index, value) {
									    html += "<tr><td>"+(index+1)+".</td><td>"+value.score+"</td><td>"+value.nick+"</td><td>"+value.published+"</td></tr>";
									});
								html += "</table>";
								$("#score_content").html(html);
							}
							_game.hideLoading();
					    });
	    			});

	    			$( "#globalscore_btn" ).click(function() {
	    				_game.showLoading();
						jQuery.support.cors = true;
						$.getJSON(_game.url + "score/getGlobalHighscore", null, function(data) {
					        if(data == false) {
								$("#score_content").html("There was some problem getting the highscore.<br>");
							}
							else {	
								var html = "Global Highscore<br><table><tr><th>#</th><th>score</th><th>nick</th><th>date</th><th>platform</th></tr>";
									$.each(data, function(index, value) {
									    html += "<tr><td>"+(index+1)+".</td><td>"+value.score+"</td><td>"+value.nick+"</td><td>"+value.published+"</td><td>"+value.device+"</td></tr>";
									});
								html += "</table>";
								$("#score_content").html(html);
							}
							_game.hideLoading();
					    });
	    			});

	    			$("#score_content").css({"height":(_game.height * 0.7) +"px"});
	    		}
	    	}
	    );
	}




	//OPTIONS------------------------------------------------------------------------------------
	this.showOptions = function() {
		this.pause();
	    TINY.box.show(
	    	{
	    	    html: "<div style='padding-top:2%;'><h2>Options</h2><hr><div id='score_content'><br>audio <button style='font-size: "+_game.fontsize+"px' id='audio'>on/off</button><br><br>vibrate <button style='font-size: "+_game.fontsize+"px' id='vibrate'>on/off</button><br><br>retro <button style='font-size: "+_game.fontsize+"px' id='retro'>on/off</button></div><br><button style='font-size: "+_game.fontsize+"px' id='close_btn'>close</button></div>",
	    		width: parseInt(this.width),
	    		height: parseInt(this.height),
	    		openjs: function() {
	    			if(localStorage.audio == "true")
	    				$("#audio").css({"border": "2px dashed #00FF00", "color" : "#00FF00"});
	    			else
	    				$("#audio").css({"border": "2px dashed #FF0000", "color": "#FF0000"});
	    			if(localStorage.vibrate == "true")
	    				$("#vibrate").css({"border": "2px dashed #00FF00", "color" : "#00FF00"});
	    			else
	    				$("#vibrate").css({"border": "2px dashed #FF0000", "color": "#FF0000"});
	    			if(localStorage.retro == "true")
	    				$("#retro").css({"border": "2px dashed #00FF00", "color" : "#00FF00"});
	    			else
	    				$("#retro").css({"border": "2px dashed #FF0000", "color": "#FF0000"});

	    			$("#audio").click(function() {
	    				if(localStorage.audio == "true") {
	    					$("#audio").css({"border": "2px dashed #FF0000", "color": "#FF0000"});
	    					localStorage.audio = "false";
	    					_gameConfig.audio = "false";
	    					_sounds.ingame.pause();
	    					_sounds.street.pause();
	    				}
	    				else if(localStorage.audio == "false") {
	    					$("#audio").css({"border": "2px dashed #00FF00", "color" : "#00FF00"});
	    					localStorage.audio = "true";
	    					_gameConfig.audio = "true";
	    					if(_game.started)
	    						_sounds.ingame.play();
	    					else
	    						_sounds.street.play();
	    				}
	    			});

	    			$("#vibrate").click(function() {
	    				if(localStorage.vibrate == "true") {
	    					$("#vibrate").css({"border": "2px dashed #FF0000", "color": "#FF0000"});
	    					localStorage.vibrate = "false";
	    					_gameConfig.vibrate = "false";
	    				}
	    				else if(localStorage.vibrate == "false") {
	    					$("#vibrate").css({"border": "2px dashed #00FF00", "color" : "#00FF00"});
	    					localStorage.vibrate = "true";
	    					_gameConfig.vibrate = "true";
	    				}
	    			});

	    			$("#retro").click(function() {
	    				if(localStorage.retro == "true") {
	    					$("#retro").css({"border": "2px dashed #FF0000", "color": "#FF0000"});
	    					localStorage.retro = "false";
	    					_gameConfig.retro = "false";
	    				}
	    				else if(localStorage.retro == "false") {
	    					$("#retro").css({"border": "2px dashed #00FF00", "color" : "#00FF00"});
	    					localStorage.retro = "true";
	    					_gameConfig.retro = "true";
	    				}
	    			});

	    			$( "#close_btn" ).click(function() {
	    				TINY.box.hide();
	    			});

	    			$("#score_content").css({"height":(_game.height * 0.69) +"px"});
	    		}
	    	}
	    );
	}




	//ABOUT------------------------------------------------------------------------------------
	this.showAbout = function() {
		this.pause();
	    TINY.box.show(
	    	{
	    	    html: "<div style='padding-top:2%;'><h2>About</h2><hr><div id='score_content' style='text-align:left;padding:1%'><h3>The Story</h3>There was some apocalypse etc. and you, The Kitty, must save the world by stealing the time machine from the evil Steamdogs!<br><br><h3>Enemies summary</h3><table id='about_table'><tr><td><img class='about_img' src='img/dog1_half.png'><h4>Doggy WoW</h4>Speedy steam rocket powered fabulous dog!</td><td><img class='about_img' src='img/dog2_half.png'><h4>Benny I.F.O.</h4>Slow but hi-tech flying dog.</td></tr><tr><td><img class='about_img' src='img/dog3_half.png'><h4>Nanny Cho-Cho</h4>Steaming bitch.</td><td><img class='about_img' src='img/dog4_half.png'><h4>Bully 5</h4>Jumping buldog ready to get you.</td></tr></table><br><h3>market items summary</h3><table id='about_table'><tr><td><img class='about_img2' src='img/milk.png'><h4>Milk Bottle</h4>Fresh milk adds you 3 health points!</td><td><img class='about_img2' src='img/coin.png'><h4>Coin</h4>This shiny coin gives you $1</td></tr></table><br><h3>Authors</h3><br><b>Code, desing</b>: Michal Skoula<br><br><b>music</b>: Zander Noriega, Kris Dudley<br><br><b>sounds</b>: Paulius Jurgelevicius, Michel Baradari, Stigler, bart<br><br>Official site: steamkitty.com</div><br><button style='font-size: "+_game.fontsize+"px' id='close_btn'>close</button></div>",
	    		width: parseInt(this.width),
	    		height: parseInt(this.height),
	    		openjs: function() {

	    			$(".about_img").css({"width": _game.width * 0.1 });
	    			$(".about_img2").css({"width": _game.width * 0.04 });

	    			$( "#close_btn" ).click(function() {
	    				TINY.box.hide();
	    			});

	    			$("#score_content").css({"height":(_game.height * 0.66) +"px"});
	    		}
	    	}
	    );
	}





	//GAME LIFE SECTION-------------------------------------------------------------------------------------

	//game tick
	this.tick = function() {
		_game.context.clearRect(0,0,this.width,this.height);

		this.odd++;
		if(this.odd == 8)
			this.odd = 0;

		//background
		this.background.tick();

		//clouds
		if(this.clouds[0].x < 0 - this.clouds[0].width) {
			this.clouds.splice(0,1);
			this.clouds.push(new cloudObject());
		}
		for(var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].tick();
		}

		//coins
		if(this.coins.length == 0) {
			var howMany = Math.rand(0,5);
			for(var i = 0; i < howMany; i++)
				this.coins.push(new coinObject()); 
		}
		else 
			for(var i = 0; i < this.coins.length; i++)
				this.coins[i].tick();
		if(this.coins.length > 0 && this.coins[0].x < 0 - this.coins[0].width) {
			this.coins.splice(0,1);
		}

		//milks
		if(this.milks.length == 0) {
			var howMany = Math.rand(0,2);
			if(_cat.milkyWay == true)
				howMany = Math.rand(2,4);
			for(var i = 0; i < howMany; i++)
				this.milks.push(new milkObject()); 
		}
		else 
			for(var i = 0; i < this.milks.length; i++)
				this.milks[i].tick();
		if(this.milks.length > 0 && this.milks[0].x < 0 - this.milks[0].width) {
			this.milks.splice(0,1);
		}
		

		//enemies
		//add new enemies based on pattern
		if(this.enemies.length == 0) {
			var pattern = this.enemyPatterns["p"+Math.rand(0,_.size(_game.enemyPatterns)-1)];
			//var pattern = this.enemyPatterns["p7"];
			$.each(pattern, function(index, value){
                _game.enemies.push(new enemyObject(value.type,value.x,value.y));
            });
		}
		//remove old?
		if(this.enemies[0].x < 0 - this.enemies[0].width)
			this.enemies.splice(0,1);
		for(var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].tick();
		}

		//cat
		_cat.tick();
		if(_cat.health <= 0) { //GAME OVER??--------------------------------------also update player
			this.stop();
			_cat.score = parseInt(_cat.score);
		    TINY.box.show({
	    	    html: "<div style='padding-top:3%'><h2>GAME OVER</h2><br><br>score: "+_cat.score+"<br><br><div id='score_message'></div><br><button style='font-size: "+_game.fontsize+"px' id='close_btn'>close</button></div>",
	    		width: parseInt(this.width),
	    		height: parseInt(this.height),
	    		openjs: function() {
	    			//guest??
	    			if(_cat.id == -1)
	    				$("#score_message").html("You must be logged in to submit your score.");
	    			//logged player - upload score??
	    			else {
	    				$(this).hide();
	    				var score = encodeURIComponent(_cat.score);
						var id_user = encodeURIComponent(_cat.id);
						var money = encodeURIComponent(_cat.money);
						_game.showLoading();
						jQuery.support.cors = true;
						$.getJSON(_game.url + "cat/gameOver?id_user="+id_user+"&score="+score+"&money="+money+"&device="+_gameConfig.device, null, function(data) {
					        if(data == false) {
								$("#score_message").html("There was some problem uploading your score and progress.<br>");
								$(this).show();
							}
							else {
								$("#score_message").html("Score successfully uploaded!<br>");
							}
							_game.hideLoading();
					    });
	    			}

	    			$( "#close_btn" ).click(function() {
	    				TINY.box.hide();
	    			});

	    			_game.drawGameOver();
	    		}
	    	});
		}

		//speed?
		if(_cat.immortal == 0)
			_game.speed = 1 + _cat.distance/1500; 

		//vibrations??
		if(this.vibrations > 0)
			this.vibrations--;

		//retro effects
		if(_gameConfig.retro == "true") {
			this.context.globalAlpha=0.3;
			this.context.strokeStyle="black";
			this.offset++;
			if(this.offset == 6)
				this.offset=0;
			for(var i = 0; i < 100; i++) {
				this.context.beginPath();
				this.context.moveTo(0,rc(6*i+this.offset));
				this.context.lineTo(rc(900),rc(6*i+this.offset));
				this.context.stroke();
			}
			this.context.globalAlpha=1;

			this.offset2 += 20;
			if(this.offset2 > 600)
				this.offset2=-150;
			this.my_gradient=this.context.createLinearGradient(0,rc(this.offset2),0,rc(this.offset2 + 150));
			this.my_gradient.addColorStop(0,'rgba(0, 0, 0, 0)');
			this.my_gradient.addColorStop(0.5,'rgba(0, 0, 0, 0.15)');
			this.my_gradient.addColorStop(1,'rgba(0, 0, 0, 0)');
			this.context.fillStyle=this.my_gradient;
			this.context.fillRect(0,rc(this.offset2),rc(900),rc(150));
		}
	}



	//start the game - RUN FROM the START
	this.start = function() {
		this.hideAd();
	    //create cat
	    _cat = new catObject(_cat.id,_cat.name,100,70,413,0,_cat.money,_cat.items);
	    this.clouds = [new cloudObject(), new cloudObject(), new cloudObject()];
	    this.enemies = [];
	    this.coins = [new coinObject(),new coinObject()];
	    
	    //set render interval
	    if(this.renderInterval != null)
	    	clearInterval(this.renderInterval);
	    this.renderInterval = setInterval("_game.tick()", this.fps);  

	    
	    //clicking 
	    $("#controls").off("click");
	    $("#controls").click(function(evt) {
	        _cat.jump();
	    }); 
	    $(document).off("keydown");
		$(document).keydown(function(e){
			var evt = e ? e:window.event;
		    switch(e.keyCode) {
		    	case 87: 					//w
		    	case 38: 					//"up"
		    	case 32: 					//space (not woriking)
		    		_cat.jump(); 			
		    		break; 	
		    	default: break;
		    }
		});

		//use items??
		var deleteItems = [];
		if(_cat.items.length > 0) {
			for(var i = 0; i < _cat.items.length; i++) {
				var item = _cat.items[i];
				switch(parseInt(item.type)) {
					case 0: _cat.immortal = 10 * _gameConfig.fps; deleteItems.push(item.id_item); 
							break;
					case 1: _cat.coinValue = 2; deleteItems.push(item.id_item); 
							break;
					case 2: _cat.milkyWay = true; deleteItems.push(item.id_item);
					default: break;
				}
			}
		}
		_cat.deleteItems(deleteItems);

	    this.started = true;
	    
	    //loop sound
	    var gameMusic = ["invasion","wasteland","wreck"];
	    _sounds.street.pause();
	    _sounds.hellfire.pause();
	    if(typeof _sounds.ingame !== "undefined")
	    	_sounds.ingame.pause();
	    _sounds.ingame = _sounds[gameMusic[Math.rand(0,gameMusic.length-1)]];
	    _sounds.ingame.volume(0.6);
	    _sounds.ingame.play();
	    _sounds.ingame.on('ended', function() {
	    	_sounds.ingame = _sounds[gameMusic[Math.rand(0,gameMusic.length-1)]];
	    	_sounds.ingame.volume(0.6);
	    	_sounds.ingame.play();
	    },this);	
	}

	//pause the game
	this.pause = function() {
		if(this.started === true)
			clearInterval(this.renderInterval);
	}

	//resume the game
	this.resume = function() {
		if(this.started === true) {
			clearInterval(this.renderInterval);
			this.renderInterval = setInterval("_game.tick()", this.fps); 
		}
	}

	//stop the game
	this.stop = function() {
		if(this.started === true) {
			clearInterval(this.renderInterval);
			this.started = false;
		}
	}

	//draw initial game intro
	this.drawIntro = function() {
		_sounds.street.play();
		this.showAd();
        this.context.drawImage(_images.logo,0,0,rc(900),rc(194));
	}
	
	//draw game over screen
	this.drawGameOver = function() {
		_sounds.ingame.pause();
		_sounds.street.play();
		this.showAd();
		this.context.clearRect(0,0,this.width,this.height);
		this.context_back.clearRect(0,0,this.width,this.height);
		this.drawIntro();
		this.context.font= _game.fontsize*2 + "px renegade_masternormal";
		this.context.fillText("game over", rc(275), rc(250));
	}





	//ACCOUNT SECTION-------------------------------------------------------------------------------------

	//show menu & maybe log in by token
	this.initUser = function() {
		this.context.clearRect(0, 0, this.width, this.height);
		_cat = new catObject(-1,"Guest",100,100,420,0,0,[]);

		//is there token? try to sign in!
		if(typeof(localStorage.token) !== "undefined" && typeof(localStorage.id) !== "undefined") {
			var id = encodeURIComponent(localStorage.id);
			var token = encodeURIComponent(localStorage.token);
			_game.showLoading();
			jQuery.support.cors = true;
			$.getJSON(this.url + "auth/signInByToken?id="+id+"&token="+token, null, function(data) {
				$("#menu").show();
				_game.hideLoading();
				
		        if(data == false) {
					localStorage.removeItem("id");
					localStorage.removeItem("token");
		        }
				else {
					_game.logInLocal(data);
				}
		    });
		}
		else {
			$("#menu").show();
		}		
		$("#menu").show();
	}

	//logging for sign in & up
	this.logInLocal = function(data) {
		//update cat
		_cat.id = data.id_user;
		_cat.name = data.nick;
		_cat.money = parseInt(data.money);
		_cat.items = data.items;

		//save token
		localStorage.token = data.token;
		localStorage.id = data.id_user;

		//maintain menu buttons
		$("#btn_signin, #btn_signup").hide();
		$("#user_info").html(_cat.name);
		$("#user_info, #btn_signout, #btn_market").show();
		TINY.box.hide();
	}

	//sign in
	this.signInDialog = function() {
	    TINY.box.show(
	    	{
	    	    html: "<div><br><h2>sign in</h2><br><div id='signin_error'></div><table class='sign' border='0' cellspacing='2' cellpadding='2'><tr><th scope='row'>nick:</th><td><input type='text' id='nick'></td></tr><tr><th scope='row'>password:</th><td><input type='password' id='password'></td></tr></table><br><br><button style='font-size: "+_game.fontsize+"px' id='signin'>sign in</button></div>",
	    		width: parseInt(this.width),
	    		height: parseInt(this.height),
	    		openjs: function() {$( "#signin" ).click(function() {_game.signIn();});}
	    	}
	    );
	    


	}
	this.signIn = function() {
		var nick = encodeURIComponent($("#nick").val());
		var password = encodeURIComponent(CryptoJS.SHA256($("#password").val()));
		jQuery.support.cors = true;
		_game.showLoading();
		$.getJSON(this.url + "auth/signIn?nick="+nick+"&password="+password, null, function(data) {
	        if(data == false)
				$("#signin_error").html("User with this nick does not exist, or wrong password.<br>");
			else {
				_game.logInLocal(data);
			}
			_game.hideLoading();
	    });
	}

	//sign up
	this.signUpDialog = function() {
	    TINY.box.show(
	    	{
	    		html: "<div><br><h2>sign up</h2><br><div id='signup_error'></div><table class='sign' border='0' cellspacing='2' cellpadding='2'><tr><th scope='row'>nick:</th><td><input type='text' id='nick'></td></tr><tr><th scope='row'>email (optional):</th><td><input type='text' id='email'></td></tr><tr><th scope='row'>password:</th><td><input type='password' id='password'></td></tr></table><br><br><button style='font-size: "+_game.fontsize+"px' id='signup'>sign up</button></div>",
	    		width: parseInt(this.width),
	    		height: parseInt(this.height),
	    		openjs: function() {$( "#signup" ).click(function() {_game.signUp();});}
	    	}
	    );
	}
	this.signUp = function() {
		var nick = encodeURIComponent($("#nick").val());
		var email = encodeURIComponent($("#email").val());
		var password = encodeURIComponent(CryptoJS.SHA256($("#password").val()));

		if(nick.length < 3 || nick.length > 10)
			alertify.alert("Nick must have between 3 and 10 characters.");
		else if($("#password").val().length < 3 || $("#password").val().length > 30)
			alertify.alert("Password must have between 3 and 30 characters.");
		else {
			_game.showLoading();
			jQuery.support.cors = true;
			$.getJSON(this.url + "auth/signUp?nick="+nick+"&email="+email+"&password="+password, null, function(data) {
		        if(data == false)
					$("#signup_error").html("User with this nick already exists.<br>");
				else {
					_game.logInLocal(data);
				}
				_game.hideLoading();
		    });
		}
	}

	//sign out
	this.signOut = function() {
		_cat.id = -1;
		_cat.name = "Guest";
		localStorage.removeItem("id");
		localStorage.removeItem("token");
		$("#btn_signin, #btn_signup").show();
		$("#user_info").html("");
		$("#btn_signout,#btn_market").hide();
		this.stop();
	}

	

	



	//MARKET SECTION-------------------------------------------------------------------------------------
	
	//show market
	this.showMarket = function() {
		this.pause();
	    TINY.box.show({
    	    html: "<div style='padding-top:2%'><div id='score_menu'><h2>Market (you have "+_cat.money+" coins)</h2></div> <hr><div id='market_content'></div><br><button style='font-size: "+_game.fontsize+"px' id='close_btn'>close</button></div>",
    		width: parseInt(this.width),
    		height: parseInt(this.height),
    		openjs: function() {
    			//guest??
    			if(_cat.id == -1)
    				$("#market_content").html("You must be logged in to shop in this market!");
    			//logged player - can do some shopping
    			else {
					$("#market_content").html("<br><br>loading market content...");
					_game.updateMarket();
    			}

    			$( "#close_btn" ).click(function() {
    				TINY.box.hide();
    				_game.resume();
    			});
    			$("#market_content").css({"height":(_game.height * 0.68) +"px"});
    		}
    	});
	}
	this.updateMarket = function() {
		//load market and users items
		jQuery.support.cors = true;
		_game.showLoading();
		$.getJSON(_game.url + "market/init", null, function(data) {

	        if(data == false) {
				$("#market_content").html("There was some problem while connectiong to market.<br>");
			}
			else {	
				var html = "<div id='left'>left</div><div id='right'>right</div>";
				$("#market_content").html(html);

				//left side - user's items
				var left = "<h4>Your items</h4>";
				$.each(_cat.items, function(index, value) {
				    left += "<div class='item' id='"+value.id_item+"'><h4>"+value.name+"<span style='float:right'>$"+parseInt(value.price/2)+"</span></h4>"+value.description+"</div>";
				});
				$("#left").html(left);

				//market
				var right = "<h4>Market</h4>";
				$.each(data, function(index, value) {
					var alreadyHas = false;
					for(var i = 0; i < _cat.items.length; i++) {
						if(_cat.items[i].id_item == value.id_item)
							alreadyHas = true;
					}
					if(!alreadyHas) {
				    	right += "<div class='item' id='"+value.id_item+"'><h4>"+value.name+"<span style='float:right'>$"+value.price+"</span></h4>"+value.description+"</div>";
					}
				});
				$("#right").html(right);

				//buy it!
				$("#right .item").click(function() {
					$(this).off("click");
					_game.buyItem(data,$(this).attr('id'));
				});

				//sell it!
				$("#left .item").click(function() {
					$(this).off("click");
					_game.sellItem($(this).attr('id'));
				});
			}
			_game.hideLoading();
	    });
	}
	this.buyItem = function(data,id_item) {
		var item = null;
		$.each(data, function(index, value) {
			if(value.id_item == id_item) {
				item = value;
			}
		});
		if(item == null) {
			alertify.alert("Item not found. Error.");
			_game.updateMarket();
		}
		else if(item.price > _cat.money) {
			alertify.alert("You don't have enough money to buy this.");
			_game.updateMarket();
		}
		else {
			alertify.confirm("Are you sure to buy "+item.name+" for "+item.price+" coins?", function (e) {
		    if (e) {
		    	_game.showLoading();
		        jQuery.support.cors = true;
				$.getJSON(_game.url + "cat/buyItem?id_user="+_cat.id+"&id_item="+item.id_item+"&price="+item.price, null, function(data) {
			        if(data == false) {
						alertify.alert("There was some problem while buying this item");
					}
					else {
						_cat.money -= item.price;
						_cat.items.push(item);
					}
					_game.hideLoading();
					_game.updateMarket();
				});
		    } 
		    else
		    	_game.updateMarket();
			});
		}	
	}
	this.sellItem = function(id_item) {
		var item = null;
		var index_item = -1;
		for(var i = 0; i < _cat.items.length; i++) {
			if(_cat.items[i].id_item == id_item) {
				item = _cat.items[i];
				index_item = i;
			}
		}
		var new_price = parseInt(item.price/2);
		if(item == null) {
			alertify.alert("Item not found. Error.");
			_game.updateMarket();
		}
		else {
		 	alertify.confirm("Are you sure to sell "+item.name+" for "+new_price+" coins?", function (e) {
		    if (e) {
		    	_game.showLoading();
				jQuery.support.cors = true;
				$.getJSON(_game.url + "cat/sellItem?id_user="+_cat.id+"&id_item="+item.id_item+"&price="+new_price, null, function(data) {
			        if(data == false) {
						alertify.alert("There was some problem while selling this item");
					}
					else {
						_cat.money += new_price;
						_cat.items.splice(index_item,1);
					}
					_game.hideLoading();
					_game.updateMarket();
				});
			}
			else
				_game.updateMarket();
			});
		}
	}






	//vibrate for certain time (iterations)
	this.vibrate = function(time) {
		if(_gameConfig.vibrate == "true"
				&& (_gameConfig.device == "wp8" || _gameConfig.device == "android")
				&& this.vibrations == 0
		) {
			navigator.notification.vibrate(time); 
			this.vibrations = time/_gameConfig.fps;
		}
	}



	//loading bars
	this.showLoading = function() {
		$("#preload,#preload_overlay").css({"display":"block"});
	}
	this.hideLoading = function() {
		$("#preload,#preload_overlay").css({"display":"none"});
	}
}