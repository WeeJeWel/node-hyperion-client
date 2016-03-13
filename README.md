# hyperion-client

This is a library to connect to a [Hyperion](https://github.com/tvdzwan/hyperion) server and control it in a Node.js application.

## Usage
### Install
`npm install hyperion-client`

### Example

```javascript
"use strict";

var Hyperion = require('hyperion-client');

var hyperion = new Hyperion( process.argv[2] || 'emile-pi.local', process.argv[3] || 19444 );
	hyperion.on('connect', function(){
		console.log('connected');
		
		hyperion.setEffect('Knight rider', {}, function( err, result ){
			console.log('err', err, 'result', result)
		})
		
	})
	hyperion.on('error', function(error){
		console.error('error:', error)
	})
```

## Reference Guide
### Methods
#### Hyperion ( address, port )

```javascript
var hyperion = new Hyperion( '192.168.0.123', 19444 );
	hyperion.on('connect', function(){
		// your magic here
	});
	hyperion.on('error', function(err){
		console.error('oops...', err);
	});
```

#### .setColor ( color, callback )

Set a single color

___color___ _(Array)_

An array of three Red, Green and Blue numbers between 0-255.

___callback___ _(Function)_

Called when the color is set.

```javascript
hyperion.setColor([ 255, 0, 0 ], function( err, result ){
	console.log(i, 'err', err, 'result', result)
})
```

#### .setEffect ( effect, args, callback )

Play an effect (animation)

___effect___ _(String)_

Name of the effect.

___args___ _(Object)_

Optional effect args.

___callback___ _(Function)_

Called when the effect is set.

```javascript
hyperion.setEffect('Knight rider', {}, function( err, result ){
	console.log('err', err, 'result', result)
})
```

#### .clear ( callback )

Clear the color or effect, and revert to default mode (usually capture)

___callback___ _(Function)_

Called when the effect is set.

#### .getServerinfo ( callback )

Get server information, like a list of effects

___callback___ _(Function)_

Called when the effect is set.


### Events
#### .on('connect', callback)
#### .on('error', callback)

## License (MIT)
Copyright (c) 2015 Emile Nijssen


Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.