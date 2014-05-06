Math.rand = function(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}

//source: http://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
function intersect(a, b) {
  return (a.x <= b.x+b.width &&
          b.x <= a.x+a.width &&
          a.y <= b.y+b.height &&
          b.y <= a.y+a.height)
}

function rc(number) {
	return parseInt(number * _game.ratio); 
}