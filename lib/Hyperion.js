"use strict";

var net 		= require('net');

function Hyperion( address, port ){
	
	this.address = address || '127.0.0.1';
	this.port = port || 19444;
	
	this.connected = false;
	this.databuffer = '';
	this.callbackFns = [];
	
	this.socket = new net.Socket()
	
	this.socket.connect(this.port, this.address, function(){	
		this.connected = true;
	}.bind(this));
	
	this.socket.on('data', function(data){
		this.parseData(data);
	}.bind(this));
	
	this.socket.on('error', function(error){
		console.error(error)
	})
	
	this.socket.on('end', function(){
		console.log('end');
	})
		
}

Hyperion.prototype.parseData = function(data){
	this.databuffer += data;
	
	if( this.databuffer.indexOf("\n") > -1 ) {
		this.databuffer.split("\n").forEach(function(response, i){
			
			// not sure why this happens, dual \n
			if( response.length == 0 ) return;
			
			try {
				response = [ null, JSON.parse(response) ];
			} catch(e){
				response = [ e, null ];
			}
						
			var callbackFn = this.callbackFns.shift();
			if( typeof callbackFn == 'function' ) {
				callbackFn.apply(null, response);
			}
			
		}.bind(this));
		
	}
}

Hyperion.prototype.sendMessage = function( message, callback ) {
	
	callback = callback || function(){};
	
	message = JSON.stringify(message);
	
	this.socket.write(message + "\n");
	
	this.callbackFns.push(callback);
}

Hyperion.prototype.setColor = function( color, callback ) {
	this.sendMessage({
		command: 'color',
		priority: 100,
		color: color
	}, callback)
}

Hyperion.prototype.setEffect = function( name, args, callback ) {
	
	if( typeof args == 'function' ) {
		callback = args;
		args = {};
	}
	
	this.sendMessage({
		command: 'effect',
		priority: 100,
		effect: {
			name: name,
			args: args
		}
	}, callback)	
}

Hyperion.prototype.getServerinfo = function( callback ) {
	this.sendMessage({
		command: 'serverinfo'
	}, callback)
}

Hyperion.prototype.close = function(){
	this.socket.end();	
}


module.exports = Hyperion;