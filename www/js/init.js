var _game, _cat, _images, _sounds, _math;

//start here
$(document).ready(function() {

    //prepare environment
    app.initialize();
    FastClick.attach(document.body);
    _math = mathjs();

    //prepare game
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");    

    //load images from json
    var filesCount = 0;
    _images = new Object();
    $.each(jsonFiles.images, function(index, value){
        _images[index] = new Image();
        _images[index].onload = function() { filesCount++; };
        _images[index].src = "img/" + value.url;
        _images[index].originalWidth = parseInt(value.width);
        _images[index].originalHeight = parseInt(value.height);
    });


    //load audio files
    _sounds = new Object();
    $.each(jsonFiles.sounds, function(index, value) {
        _sounds[index] = new Audio5js({
            swf_path: 'lib/audio5js.swf',
            codecs: ['mp3', 'vorbis'],
            ready: function(player) {
                switch (player.codec) {
                  case 'vorbis': //OGG
                    this.load(value[1]); break;
                  default: //MP3
                    this.load(value[0]); break;
                }
            }
        });
    });
    _sounds.ingame = _sounds.street;

    //set options
    if (localStorage.getItem("audio") === null)
        localStorage.audio = _gameConfig.audio;
    else
        _gameConfig.audio = localStorage.audio;

    if (localStorage.getItem("vibrate") === null)
        localStorage.vibrate = _gameConfig.vibrate;
    else
        _gameConfig.vibrate = localStorage.vibrate;

    if (localStorage.getItem("retro") === null)
        localStorage.retro = _gameConfig.retro;
    else
        _gameConfig.retro = localStorage.retro;

    //make sure that everything is  loaded..
    var loadingInterval = setInterval(function() {
        if(filesCount === _.size(jsonFiles.images)) {
            clearInterval(loadingInterval);
            _game = new gameObject(canvas,context,_images);
            _game.clouds = [];
            _game.enemies = [];
            _game.coins = [];
            _game.milks = [];
            _game.resize();
            _game.initUser();
            _game.drawIntro();                          
        }
    }, 700);     
});