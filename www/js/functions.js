/*
Copyright 2004 Michal Škoula

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 
*/

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