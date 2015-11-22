"use strict";

var Hyperion = require('..');

var hyperion = new Hyperion( process.argv[2] || 'emilefe-pi.local', process.argv[3] || 19444 );

/*
for( var i = 0; i < 10; i++ ) {
	(function(i){
		setTimeout(function(){

			var color = [];
			for( var j = 0; j < 3; j++ ) {
				color[j] = Math.floor(Math.random()*255);
			}
			
			console.log("Setting to color", color)
			hyperion.setColor(color, function( err, result ){
				console.log(i, 'err', err, 'result', result)
			})
			
		}, i * 10);
	})(i)
}
*/

hyperion.getServerinfo(function( err, result ){
	console.log('err', err, 'result', JSON.stringify(result, false, 4))
})

hyperion.setEffect('Knight rider', {}, function( err, result ){
	console.log('err', err, 'result', result)
})