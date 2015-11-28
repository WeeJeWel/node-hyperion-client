"use strict";

var Hyperion = require('..');

var hyperion = new Hyperion( process.argv[2] || 'emile-pi.local', process.argv[3] || 19444 );
	hyperion.on('connect', function(){
		console.log('connected');
		
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
					
				}, i * 200);
			})(i)
		}
		
	})
	hyperion.on('error', function(error){
		console.error('error:', error)
	})