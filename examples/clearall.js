"use strict";

var Hyperion = require('..');

var hyperion = new Hyperion( process.argv[2] || 'emile-pi.local', process.argv[3] || 19444 );
	hyperion.on('connect', function(){
		console.log('connected');
		
		hyperion.clearall(function( err, result ){
			console.log('err', err, 'result', result)
		})
		
	})
	hyperion.on('error', function(error){
		console.error('error:', error)
	})