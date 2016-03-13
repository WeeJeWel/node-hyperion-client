/**
 * @author Emile Nijssen
 */

"use strict";

var net 		= require('net');
var util		= require('util');
var events		= require('events');

function Hyperion( address, port, priority ){
	
	this.address 	= address || '127.0.0.1';
	this.port 		= port || 19444;
	this.priority 	= priority || 1;
	
	this.connected = false;
	this.databuffer = '';
	this.callbackFns = [];
	
	this.socket = new net.Socket()
	
	this.socket.connect(this.port, this.address, function(){	
		this.connected = true;
		this.emit('connect');
	}.bind(this));
	
	this.socket.on('data', function(data){
		this.parseData(data);
	}.bind(this));
	
	this.socket.on('error', function(error){
		this.emit('error', error);
	}.bind(this))
		
}

var EventEmitter = events.EventEmitter;
util.inherits(Hyperion, EventEmitter);

/**
 * This method parses incoming data, and fires the corresponding callback
 *
 * @param {string} data			data string
 * @param {Function} callback	callback function, using (err, result)
 */
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

/**
 * Send a message
 *
 * @param {object} message		can be anything, but an invalid object might crasg hyperion
 * @param {Function} callback	callback function, using (err, result)
 */
Hyperion.prototype.sendMessage = function( message, callback ) {
	
	callback = callback || function(){};
	
	message = JSON.stringify(message);
	
	if(this.socket.writable) {
		this.socket.write(message + "\n");
		this.callbackFns.push(callback);
	} else {
		callback( new Error("not connected"), null );
	}
}

/**
 * Set a single color
 *
 * @param {array} color			an array of 3 ints between 0 and 255, e.g. [0, 255, 0]
 * @param {Function} callback	callback function, using (err, result)
 */
Hyperion.prototype.setColor = function( color, callback ) {
	this.sendMessage({
		command		: 'color',
		priority	: this.priority,
		color		: color
	}, callback)
}

/**
 * Play an effect (animation)
 *
 * @param {string} name			effect name. Note: this is the full name, e.g. "Knight riger"
 * @param {object} args			object with optional arguments for the animation
 * @param {Function} callback	callback function, using (err, result)
 */
Hyperion.prototype.setEffect = function( name, args, callback ) {
	
	if( typeof args == 'function' ) {
		callback = args;
		args = {};
	}
	
	this.sendMessage({
		command		: 'effect',
		priority	: this.priority,
		effect		: {
			name: name,
			args: args
		}
	}, callback)
}

/**
 * Clear the color or effect, and revert to default mode (usually capture)
 *
 * @param {Function} callback	callback function, using (err, result)
 */
Hyperion.prototype.clear = function( callback ) {
	this.sendMessage({
		command		: 'clear',
		priority	: this.priority
	}, callback)
}

/**
 * Clear all of the colors or effects, and revert to default mode (usually capture)
 *
 * @param {Function} callback	callback function, using (err, result)
 */
Hyperion.prototype.clearall = function( callback ) {
	this.sendMessage({
		command		: 'clearall'
	}, callback)
}

/**
 * Get server information, like a list of effects
 *
 * @param {Function} callback	callback function, using (err, result)
 */
Hyperion.prototype.getServerinfo = function( callback ) {
	this.sendMessage({
		command: 'serverinfo'
	}, callback)
}

/**
 * Close the connection
 */
Hyperion.prototype.close = function(){
	this.socket.end();	
}


module.exports = Hyperion;