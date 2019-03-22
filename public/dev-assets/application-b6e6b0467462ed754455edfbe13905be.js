/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
(function() {
  var CSRFToken, Click, ComponentUrl, EVENTS, Link, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsCustomEvents, browserSupportsPushState, browserSupportsTurbolinks, bypassOnLoadPopstate, cacheCurrentPage, cacheSize, changePage, clone, constrainPageCacheTo, createDocument, currentState, enableTransitionCache, executeScriptTags, extractTitleAndBody, fetch, fetchHistory, fetchReplacement, historyStateIsDefined, initializeTurbolinks, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, manuallyTriggerHashChangeForFirefox, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, setAutofocusElement, transitionCacheEnabled, transitionCacheFor, triggerEvent, visit, xhr, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  pageCache = {};

  cacheSize = 10;

  transitionCacheEnabled = false;

  currentState = null;

  loadedAssets = null;

  referer = null;

  createDocument = null;

  xhr = null;

  EVENTS = {
    BEFORE_CHANGE: 'page:before-change',
    FETCH: 'page:fetch',
    RECEIVE: 'page:receive',
    CHANGE: 'page:change',
    UPDATE: 'page:update',
    LOAD: 'page:load',
    RESTORE: 'page:restore',
    BEFORE_UNLOAD: 'page:before-unload',
    EXPIRE: 'page:expire'
  };

  fetch = function(url) {
    var cachedPage;
    url = new ComponentUrl(url);
    rememberReferer();
    cacheCurrentPage();
    if (transitionCacheEnabled && (cachedPage = transitionCacheFor(url.absolute))) {
      fetchHistory(cachedPage);
      return fetchReplacement(url);
    } else {
      return fetchReplacement(url, resetScrollPosition);
    }
  };

  transitionCacheFor = function(url) {
    var cachedPage;
    cachedPage = pageCache[url];
    if (cachedPage && !cachedPage.transitionCacheDisabled) {
      return cachedPage;
    }
  };

  enableTransitionCache = function(enable) {
    if (enable == null) {
      enable = true;
    }
    return transitionCacheEnabled = enable;
  };

  fetchReplacement = function(url, onLoadFunction) {
    if (onLoadFunction == null) {
      onLoadFunction = (function(_this) {
        return function() {};
      })(this);
    }
    triggerEvent(EVENTS.FETCH, {
      url: url.absolute
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', url.withoutHashForIE10compatibility(), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent(EVENTS.RECEIVE, {
        url: url.absolute
      });
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        manuallyTriggerHashChangeForFirefox();
        reflectRedirectedUrl();
        onLoadFunction();
        return triggerEvent(EVENTS.LOAD);
      } else {
        return document.location.href = url.absolute;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onerror = function() {
      return document.location.href = url.absolute;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent(EVENTS.RESTORE);
  };

  cacheCurrentPage = function() {
    var currentStateUrl;
    currentStateUrl = new ComponentUrl(currentState.url);
    pageCache[currentStateUrl.absolute] = {
      url: currentStateUrl.relative,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset,
      cachedAt: new Date().getTime(),
      transitionCacheDisabled: document.querySelector('[data-no-transition-cache]') != null
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var cacheTimesRecentFirst, key, pageCacheKeys, _i, _len, _results;
    pageCacheKeys = Object.keys(pageCache);
    cacheTimesRecentFirst = pageCacheKeys.map(function(url) {
      return pageCache[url].cachedAt;
    }).sort(function(a, b) {
      return b - a;
    });
    _results = [];
    for (_i = 0, _len = pageCacheKeys.length; _i < _len; _i++) {
      key = pageCacheKeys[_i];
      if (!(pageCache[key].cachedAt <= cacheTimesRecentFirst[limit])) {
        continue;
      }
      triggerEvent(EVENTS.EXPIRE, pageCache[key]);
      _results.push(delete pageCache[key]);
    }
    return _results;
  };

  changePage = function(title, body, csrfToken, runScripts) {
    triggerEvent(EVENTS.BEFORE_UNLOAD);
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    setAutofocusElement();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent(EVENTS.CHANGE);
    return triggerEvent(EVENTS.UPDATE);
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      if (!script.hasAttribute('async')) {
        copy.async = false;
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function(node) {
    node.innerHTML = node.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/ig, '');
    return node;
  };

  setAutofocusElement = function() {
    var autofocusElement, list;
    autofocusElement = (list = document.querySelectorAll('input[autofocus], textarea[autofocus]'))[list.length - 1];
    if (autofocusElement && document.activeElement !== autofocusElement) {
      return autofocusElement.focus();
    }
  };

  reflectNewUrl = function(url) {
    if ((url = new ComponentUrl(url)).absolute !== referer) {
      return window.history.pushState({
        turbolinks: true,
        url: url.absolute
      }, '', url.absolute);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      location = new ComponentUrl(location);
      preservedHash = location.hasNoHash() ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location.href + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      url: document.location.href
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  manuallyTriggerHashChangeForFirefox = function() {
    var url;
    if (navigator.userAgent.match(/Firefox/) && !(url = new ComponentUrl).hasNoHash()) {
      window.history.replaceState(currentState, '', url.withoutHash());
      return document.location.hash = url.hash;
    }
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  clone = function(original) {
    var copy, key, value;
    if ((original == null) || typeof original !== 'object') {
      return original;
    }
    copy = new original.constructor();
    for (key in original) {
      value = original[key];
      copy[key] = clone(value);
    }
    return copy;
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    if (typeof Prototype !== 'undefined') {
      Event.fire(document, name, data, true);
    }
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function(url) {
    return !triggerEvent(EVENTS.BEFORE_CHANGE, {
      url: url
    });
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      var contentType;
      return ((contentType = xhr.getResponseHeader('Content-Type')) != null) && contentType.match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.querySelector('head').childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, removeNoscriptTags(doc.querySelector('body')), CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var buildTestsUsing, createDocumentUsingDOM, createDocumentUsingFragment, createDocumentUsingParser, createDocumentUsingWrite, docTest, docTests, e, _i, _len;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    createDocumentUsingFragment = function(html) {
      var body, doc, head, htmlWrapper, _ref, _ref1;
      head = ((_ref = html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)) != null ? _ref[0] : void 0) || '<head></head>';
      body = ((_ref1 = html.match(/<body[^>]*>([\s\S.]*)<\/body>/i)) != null ? _ref1[0] : void 0) || '<body></body>';
      htmlWrapper = document.createElement('html');
      htmlWrapper.innerHTML = head + body;
      doc = document.createDocumentFragment();
      doc.appendChild(htmlWrapper);
      return doc;
    };
    buildTestsUsing = function(createMethod) {
      var buildTest, formNestingTest, structureTest;
      buildTest = function(fallback, passes) {
        return {
          passes: passes(),
          fallback: fallback
        };
      };
      structureTest = buildTest(createDocumentUsingWrite, (function(_this) {
        return function() {
          var _ref, _ref1;
          return ((_ref = createMethod('<html><body><p>test')) != null ? (_ref1 = _ref.body) != null ? _ref1.childNodes.length : void 0 : void 0) === 1;
        };
      })(this));
      formNestingTest = buildTest(createDocumentUsingFragment, (function(_this) {
        return function() {
          var _ref, _ref1;
          return ((_ref = createMethod('<html><body><form></form><div></div></body></html>')) != null ? (_ref1 = _ref.body) != null ? _ref1.childNodes.length : void 0 : void 0) === 2;
        };
      })(this));
      return [structureTest, formNestingTest];
    };
    try {
      if (window.DOMParser) {
        docTests = buildTestsUsing(createDocumentUsingParser);
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      docTests = buildTestsUsing(createDocumentUsingDOM);
      return createDocumentUsingDOM;
    } finally {
      for (_i = 0, _len = docTests.length; _i < _len; _i++) {
        docTest = docTests[_i];
        if (!docTest.passes) {
          return docTest.fallback;
        }
      }
    }
  };

  ComponentUrl = (function() {
    function ComponentUrl(original) {
      this.original = original != null ? original : document.location.href;
      if (this.original.constructor === ComponentUrl) {
        return this.original;
      }
      this._parse();
    }

    ComponentUrl.prototype.withoutHash = function() {
      return this.href.replace(this.hash, '').replace('#', '');
    };

    ComponentUrl.prototype.withoutHashForIE10compatibility = function() {
      return this.withoutHash();
    };

    ComponentUrl.prototype.hasNoHash = function() {
      return this.hash.length === 0;
    };

    ComponentUrl.prototype._parse = function() {
      var _ref;
      (this.link != null ? this.link : this.link = document.createElement('a')).href = this.original;
      _ref = this.link, this.href = _ref.href, this.protocol = _ref.protocol, this.host = _ref.host, this.hostname = _ref.hostname, this.port = _ref.port, this.pathname = _ref.pathname, this.search = _ref.search, this.hash = _ref.hash;
      this.origin = [this.protocol, '//', this.hostname].join('');
      if (this.port.length !== 0) {
        this.origin += ":" + this.port;
      }
      this.relative = [this.pathname, this.search, this.hash].join('');
      return this.absolute = this.href;
    };

    return ComponentUrl;

  })();

  Link = (function(_super) {
    __extends(Link, _super);

    Link.HTML_EXTENSIONS = ['html'];

    Link.allowExtensions = function() {
      var extension, extensions, _i, _len;
      extensions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = extensions.length; _i < _len; _i++) {
        extension = extensions[_i];
        Link.HTML_EXTENSIONS.push(extension);
      }
      return Link.HTML_EXTENSIONS;
    };

    function Link(link) {
      this.link = link;
      if (this.link.constructor === Link) {
        return this.link;
      }
      this.original = this.link.href;
      this.originalElement = this.link;
      this.link = this.link.cloneNode(false);
      Link.__super__.constructor.apply(this, arguments);
    }

    Link.prototype.shouldIgnore = function() {
      return this._crossOrigin() || this._anchored() || this._nonHtml() || this._optOut() || this._target();
    };

    Link.prototype._crossOrigin = function() {
      return this.origin !== (new ComponentUrl).origin;
    };

    Link.prototype._anchored = function() {
      return (this.hash.length > 0 || this.href.charAt(this.href.length - 1) === '#') && (this.withoutHash() === (new ComponentUrl).withoutHash());
    };

    Link.prototype._nonHtml = function() {
      return this.pathname.match(/\.[a-z]+$/g) && !this.pathname.match(new RegExp("\\.(?:" + (Link.HTML_EXTENSIONS.join('|')) + ")?$", 'g'));
    };

    Link.prototype._optOut = function() {
      var ignore, link;
      link = this.originalElement;
      while (!(ignore || link === document)) {
        ignore = link.getAttribute('data-no-turbolink') != null;
        link = link.parentNode;
      }
      return ignore;
    };

    Link.prototype._target = function() {
      return this.link.target.length !== 0;
    };

    return Link;

  })(ComponentUrl);

  Click = (function() {
    Click.installHandlerLast = function(event) {
      if (!event.defaultPrevented) {
        document.removeEventListener('click', Click.handle, false);
        return document.addEventListener('click', Click.handle, false);
      }
    };

    Click.handle = function(event) {
      return new Click(event);
    };

    function Click(event) {
      this.event = event;
      if (this.event.defaultPrevented) {
        return;
      }
      this._extractLink();
      if (this._validForTurbolinks()) {
        if (!pageChangePrevented(this.link.absolute)) {
          visit(this.link.href);
        }
        this.event.preventDefault();
      }
    }

    Click.prototype._extractLink = function() {
      var link;
      link = this.event.target;
      while (!(!link.parentNode || link.nodeName === 'A')) {
        link = link.parentNode;
      }
      if (link.nodeName === 'A' && link.href.length !== 0) {
        return this.link = new Link(link);
      }
    };

    Click.prototype._validForTurbolinks = function() {
      return (this.link != null) && !(this.link.shouldIgnore() || this._nonStandardClick());
    };

    Click.prototype._nonStandardClick = function() {
      return this.event.which > 1 || this.event.metaKey || this.event.ctrlKey || this.event.shiftKey || this.event.altKey;
    };

    return Click;

  })();

  bypassOnLoadPopstate = function(fn) {
    return setTimeout(fn, 500);
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent(EVENTS.CHANGE);
      return triggerEvent(EVENTS.UPDATE);
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent(EVENTS.UPDATE);
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[(new ComponentUrl(event.state.url)).absolute]) {
        cacheCurrentPage();
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', Click.installHandlerLast, true);
    window.addEventListener('hashchange', function(event) {
      rememberCurrentUrl();
      return rememberCurrentState();
    }, false);
    return bypassOnLoadPopstate(function() {
      return window.addEventListener('popstate', installHistoryChangeHandler, false);
    });
  };

  historyStateIsDefined = window.history.state !== void 0 || navigator.userAgent.match(/Firefox\/2[6|7]/);

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && historyStateIsDefined;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  browserSupportsCustomEvents = document.addEventListener && document.createEvent;

  if (browserSupportsCustomEvents) {
    installDocumentReadyPageEventTriggers();
    installJqueryAjaxSuccessPageUpdateTrigger();
  }

  if (browserSupportsTurbolinks) {
    visit = fetch;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    enableTransitionCache: enableTransitionCache,
    allowLinkExtensions: Link.allowExtensions,
    supported: browserSupportsTurbolinks,
    EVENTS: clone(EVENTS)
  };

}).call(this);
/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */

(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);
// reload all charts on the page
function reloadCharts() {
  // exit if this is not firefox
  if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) { return false; }

  // for each iframe that is about to be activated
  $('.ui-widget-content [aria-expanded="false"]').find('iframe').each(function() {
    // get the src of the iframe
    var iframe_src = $(this).attr('src');
    // if this is a chart
    if (iframe_src.indexOf('charts') !== -1) {
      // hide the chart
      $(this).hide();
      // reload the src
      $(this).attr('src', iframe_src);
      // show the chart
      $(this).show();
    }
  });
}

// update the chart with all the textbox values
function openDialogCenter(element) {
    element.dialog("open");
    var sizeArr = getDimensions( element.parent() );
    element.dialog({position:[ sizeArr[0], sizeArr[1] ] });

}
function getDimensions(element) {
    var sizeArr = new Array(2);
    sizeArr[0] = $(window).width()/2 - element.width()/2;
    sizeArr[1] = $(window).height()/2 - element.height()/2;
    return sizeArr;
}

function updateChart(index,
             postUpdate,
             width,
             height,
             channelId,
             newOptionsSave) {
    // default width and height
    var width = width;
    var height = height;

    // get old src
    var iframe = $('#iframe' + index).attr("default_src");

    if (!iframe) { iframe = $('#iframe' + index).attr('src'); }

    src = iframe.split('?')[0];
    // if bar or column chart, a timeslice should be present or set timescale=30
    if ($('#type_' + index).val() === 'bar' || $('#type_' + index).val() === 'column') {
      if ($('#timescale_' + index).val().length == 0 && $('#average_' + index).val().length == 0 && $('#median_' + index).val().length == 0 && $('#sum_' + index).val().length == 0) {
          $('#timescale_' + index).val(30);
      }
    }

    // add inputs to array
    var inputs = [];
    $('.chart_options' + index).each(function() {
                         var v = $(this).val();
                         var id = $(this).attr('id');
                     var tag = id.split("_")[0];

                         if (v.length > 0) { inputs.push([tag, v]); }
                         });

    // create querystring
    var qs = '';
    while (inputs.length > 0) {
      var p = inputs.pop();
      if (p[0] == 'width') { width = parseInt(p[1]); }
      if (p[0] == 'height') { height = parseInt(p[1]); }

      // don't add type=line to querystring, it's the default value
      if (!(p[0] == 'type' && p[1] == 'line')) {
          qs += '&' + p[0] + '=' + encodeURIComponent(p[1]);
      }
    }
    // if querystring exists, add it to src
    if (qs.length > 0) { src += '?' + qs.substring(1); }

    // save chart options to database
    if (postUpdate && index > 0 && newOptionsSave) {
    $.update("/channels/" + channelId +  "/charts/" + index,
         {
             newOptions : { options: qs }
         } );
    }
    else if (postUpdate && index > 0) {
    $.update("/channels/" + channelId +  "/charts/" + index,
         { options: qs } );
    }

    // set embed code
    $('#embed' + index).val('<iframe width="' + width + '" height="' + height + '" style="border: 1px solid #cccccc;" src="' + src + '"></iframe>');

    // set new src
    $('#iframe' + index).attr('src', src);
    $('#iframe' + index).attr('width', width);
    $('#iframe' + index).attr('height', height);
}
function updateSelectValues() {
  selectedValue = $(this).val();
  $(".mutuallyexclusive"+index).each(function () { $(this).val("");  });
  $(this).val(selectedValue);
}

function setupChartForm(channelIndex) {
  return function(index, value) {
    if (value.length > 0) {
      $('#' + value.split('=')[0] + "_" + channelIndex).val(decodeURIComponent(value.split('=')[1]));
    }
  };
}

function setupColumns(current_user, channel_id) {
  $( sortColumnSetup(current_user, channel_id) );
  $( ".column" ).disableSelection();
}

function createWindowsWithData (data, current_user, channel_id, colName) {

    for (var i in data) {

        // set the window and window_type
        var window = data[i].window;
        var window_type = window.window_type;
        colId = window.col;
        title = window.title;

        var content = window.html;
        if (window.window_type === 'chart') {
          $("body").append("<div id='chartConfig" + window.id + "'></div>");
        }
        var portlet = addWindow(colName, colId, window.id, window_type, title, content);
        portlet.each ( decoratePortlet(current_user) ) ;

        portlet.find( ".ui-toggle" ).click( uiToggleClick );
        portlet.find( ".ui-view" ).click( uiViewClick (channel_id) );
        portlet.find( ".ui-edit" ).click( uiEditClick (channel_id) );
        portlet.find( ".ui-close" ).click( uiCloseClick (channel_id) );
    }
}
var createWindows = function (current_user, channel_id, colName) {
    return function(data) {
    createWindowsWithData(data, current_user, channel_id, colName);
    };
}

function addWindow(colName, colId, windowId, window_type, title, content) {
    $("#"+colName+"_dialog"+colId).append('<div class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" ' +
                      'id="portlet_' + windowId +
                      '"><div class="portlet-header window_type window_type-'+ window_type
                      + ' ui-widget-header  ui-corner-all">' + title +
                      '</div><div class="portlet-content">'+content+'</div>') ;

    if ($("#portlet_"+windowId).length > 1) {
    throw "Portlet count doesn't match what's expected";
    } else {
    return $("#portlet_"+windowId);
    }

}


var updatePortletPositions = function( current_user, channel_id) {
    return function() {
    if (current_user) {
    var result = $(this).sortable('serialize');
    colId = $(this).attr('id').charAt($(this).attr('id').length - 1);
    portletArray = getPortletArray(result);
    jsonResult = {
        "col" : colId,
        "positions" : portletArray
    } ;

    if (portletArray.length > 0) {
        $.ajax({
               type: 'PUT',
               url: '../channels/' + channel_id + '/windows',
               data: {_method:'PUT', page : JSON.stringify(jsonResult ) },
               dataType: 'json'
           });
    }
    }
}
}

function sortColumnSetup(current_user, channel_id) {

     $( ".column" ).sortable({
                    opacity: 0.6,
                    helper: function( event ) {
                        return $("<div class='ui-widget-header'>Drop to re-position</div>");
                    },
                    connectWith: ".column",
                    update:  updatePortletPositions(current_user, channel_id)
                     });
}
var decoratePortlet = function (current_user) {
    return function() {
    var portletHeader = $(this).find( ".portlet-header") ;
    portletHeader.append( "<span id='commentBtn' class='ui-view ui-icon ui-icon-comment'></span>");

    thisObject = $(this);
    if (current_user == "true") {
        // Use feature Rollout here - needs to be implemented for this user, and this channel needs to belong to this user.
        thisObject.find('.window_type').prepend( "<span id='minusBtn' class='ui-toggle ui-icon ui-icon-minusthick'></span>");
        thisObject.find(".window_type-chart").append("<span id='pencilBtn' class='ui-edit ui-icon ui-icon-pencil'></span>");
        thisObject.find(".window_type").append("<span id='closeBtn' class='ui-close ui-icon ui-icon-close'></span>");
        thisObject.find(".portlet-header").css("cursor","move");
    }
    else  {
        $(".column").sortable({ disabled:true });
    }
    return $(this).attr("id");
    }
}
function getPortletArray(data) {

    var resultArray = new Array();
    var inputArray = data.split("&");

    for (i in inputArray) {

    val = inputArray[i].split("=")[1] ;
    resultArray.push(val);
    }

    return resultArray;
}


var uiEditClick = function (channel_id) {
    return function() {
    var id =  $( this ).parents( ".portlet:first" ).attr("id").substring(8);

    var options = "";
    $("#chartConfig"+id).load("/channels/"+channel_id+"/charts/"+id+"/edit",
                  function() {
                      options = $("#chartOptions"+id).html();

                      if (options != "undefined" && options.length >2) {
                      $.each((options.split('&amp;')), setupChartForm( id ));
                      }
                      $("#button"+id).click( function() {
                                 updateChart(id, true, 450, 250, channel_id, true);
                                 $("#chartConfig"+id).dialog("close");

                                 });
                  })
        .dialog({  title:"Chart Options", modal: true, resizable: false, width: 500, dialogClass: "dev-info-dialog" });

    };
}

var uiViewClick = function (channel_id) {
    return function() {
    var x =  $( this ).parents( ".portlet:first" ).offset().left;
    var y =  $( this ).parents( ".portlet:first" ).offset().top;
    var id =  $( this ).parents( ".portlet:first" ).attr("id").substring(8);

    $("body").append('<div id="iframepopup'+id+'" style="display:none">' +
                 '<div id="iframeinner'+id+'"style="font-size:1.2em;overflow:auto;height:115px;background-color:white">' +
                 '</div></div>');

    $.get("/channels/"+channel_id+"/windows/"+id+"/iframe",
              function(response) {
          var display = response.replace(/id=\"iframe[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?\"/, "" );
              $("#iframeinner"+id).text(display);
              }
             );

    $("#iframepopup"+id).dialog({
                        resizable:false,
                        width: "300px",
                        position:[x+200,y-200],
                    title: "Chart Iframe",
                    dialogClass: "dev-info-dialog"
                        });
    };
}

var uiCloseClick = function (channel_id) {
    return function() {
    var id =  $( this ).parents( ".portlet:first" ).attr("id").substring(8);
    var portlet =  $( this ).parents( ".portlet:first" ) ;
     $.update("/channels/"+channel_id+"/windows/"+id+"/hide" ,
          function(response) {
              portlet.hide("drop", function(){
                       portlet.remove();});
              }) ;
    }
}


function uiToggleClick() {
    $( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
    $( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
}

;
/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.4.1
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */


(function($){$.timeago=function(timestamp){if(timestamp instanceof Date){return inWords(timestamp);}else if(typeof timestamp==="string"){return inWords($.timeago.parse(timestamp));}else{return inWords($.timeago.datetime(timestamp));}};var $t=$.timeago;$.extend($.timeago,{settings:{refreshMillis:60000,allowFuture:false,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",numbers:[]}},inWords:function(distanceMillis){var $l=this.settings.strings;var prefix=$l.prefixAgo;var suffix=$l.suffixAgo;if(this.settings.allowFuture){if(distanceMillis<0){prefix=$l.prefixFromNow;suffix=$l.suffixFromNow;}
distanceMillis=Math.abs(distanceMillis);}
var seconds=distanceMillis/1000;var minutes=seconds/60;var hours=minutes/60;var days=hours/24;var years=days/365;function substitute(stringOrFunction,number){var string=$.isFunction(stringOrFunction)?stringOrFunction(number,distanceMillis):stringOrFunction;var value=($l.numbers&&$l.numbers[number])||number;return string.replace(/%d/i,value);}
var words=seconds<45&&substitute($l.seconds,Math.round(seconds))||seconds<90&&substitute($l.minute,1)||minutes<45&&substitute($l.minutes,Math.round(minutes))||minutes<90&&substitute($l.hour,1)||hours<24&&substitute($l.hours,Math.round(hours))||hours<48&&substitute($l.day,1)||days<30&&substitute($l.days,Math.floor(days))||days<60&&substitute($l.month,1)||days<365&&substitute($l.months,Math.floor(days/30))||years<2&&substitute($l.year,1)||substitute($l.years,Math.floor(years));return $.trim([prefix,words,suffix].join(" "));},parse:function(iso8601){var s=$.trim(iso8601);s=s.replace(/\.\d\d\d+/,"");s=s.replace(/-/,"/").replace(/-/,"/");s=s.replace(/T/," ").replace(/Z/," UTC");s=s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2");return new Date(s);},datetime:function(elem){var isTime=$(elem).get(0).tagName.toLowerCase()==="time";var iso8601=isTime?$(elem).attr("datetime"):$(elem).attr("title");return $t.parse(iso8601);}});$.fn.timeago=function(){var self=this;self.each(refresh);var $s=$t.settings;if($s.refreshMillis>0){setInterval(function(){self.each(refresh);},$s.refreshMillis);}
return self;};function refresh(){var data=prepareData(this);if(!isNaN(data.datetime)){$(this).text(inWords(data.datetime));}
return this;}
function prepareData(element){element=$(element);if(!element.data("timeago")){element.data("timeago",{datetime:$t.datetime(element)});var text=$.trim(element.text());if(text.length>0){element.attr("title",text);}}
return element.data("timeago");}
function inWords(date){return $t.inWords(distance(date));}
function distance(date){return(new Date().getTime()-date.getTime());}
document.createElement("abbr");document.createElement("time");}(jQuery));

/*
 *
 * TableSorter 2.0 - Client-side table sorting with ease!
 * Version 2.0.5b
 * @requires jQuery v1.2.3
 *
 * Copyright (c) 2007 Christian Bach
 * Examples and docs at: http://tablesorter.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($){$.extend({tablesorter:new
function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'/\.|\,/g',onRenderHeader:null,selectorHeaders:'thead th',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}if(table.tBodies.length==0)return;var rows=table.tBodies[0].rows;if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,rows,-1,i);}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;while(nodeValue==''&&keepLooking){rowIndex++;if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);nodeValue=trimAndGetNodeText(table.config,node);if(table.config.debug){log('Checking if value was empty on row:'+rowIndex);}}else{keepLooking=false;}}for(var i=1;i<l;i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i];}}return parsers[0];}function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex];}function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node));}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=$(table.tBodies[0].rows[i]),cols=[];if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);continue;}cache.row.push(c);for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]));}cols.push(cache.normalized.length);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}return cache;};function getElementText(config,node){var text="";if(!node)return"";if(!config.supportsTextContent)config.supportsTextContent=node.textContent||false;if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent;}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML;}else{text=node.innerHTML;}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node);}else{text=$(node).text();}}return text;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){var pos=n[i][checkCell];rows.push(r[pos]);if(!table.config.appender){var l=r[pos].length;for(var j=0;j<l;j++){tableBody[0].appendChild(r[pos][j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false;var header_index=computeTableHeaderCellIndexes(table);$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];this.order=formatSortingOrder(table.config.sortInitialOrder);this.count=this.order;if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(checkHeaderOptionsSortingLocked(table,index))this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index);if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);if(table.config.onRenderHeader)table.config.onRenderHeader.apply($th);}table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}return $tableHeaders;};function computeTableHeaderCellIndexes(t){var matrix=[];var lookup={};var thead=t.getElementsByTagName('THEAD')[0];var trs=thead.getElementsByTagName('TR');for(var i=0;i<trs.length;i++){var cells=trs[i].cells;for(var j=0;j<cells.length;j++){var c=cells[j];var rowIndex=c.parentNode.rowIndex;var cellId=rowIndex+"-"+c.cellIndex;var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1
var firstAvailCol;if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[];}for(var k=0;k<matrix[rowIndex].length+1;k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;break;}}lookup[cellId]=firstAvailCol;for(var k=rowIndex;k<rowIndex+rowSpan;k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[];}var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++){matrixrow[l]="x";}}}}return lookup;}function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder))return table.config.headers[i].lockedOrder;return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0;}else{return(v==1)?1:0;}}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));var e="e"+i;dynamicExp+="var "+e+" = "+s;dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}dynamicExp+="return 0; ";dynamicExp+="}; ";if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date());}eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}return cache;};function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";if(type=='text'&&direction=='asc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));";}else if(type=='text'&&direction=='desc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));";}else if(type=='numeric'&&direction=='asc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));";}else if(type=='numeric'&&direction=='desc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));";}};function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));";};function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));";};function makeSortNumeric(i){return"a["+i+"]-b["+i+"];";};function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];";};function sortText(a,b){if(table.config.sortLocaleCompare)return a.localeCompare(b);return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){if(table.config.sortLocaleCompare)return b.localeCompare(a);return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$.data(this,"tablesorter",config);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");var $cell=$(this);var i=this.column;this.order=this.count++%2;if(this.lockedOrder)this.order=this.lockedOrder;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){var me=this;setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);cache=buildCache(me);},1);}).bind("updateCell",function(e,cell){var config=this.config;var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,'')));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLocaleLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[Â£$â‚¬?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[Â£$â‚¬]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}var $tr,row=-1,odd;$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);if(!$tr.hasClass(table.config.cssChildRow))row++;odd=(row%2==0);$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])});if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);

(function($) {
  window.NestedFormEvents = function() {
    this.addFields = $.proxy(this.addFields, this);
    this.removeFields = $.proxy(this.removeFields, this);
  };

  NestedFormEvents.prototype = {
    addFields: function(e) {
      // Setup
      var link      = e.currentTarget;
      var assoc     = $(link).data('association');                // Name of child
      var blueprint = $('#' + $(link).data('blueprint-id'));
      var content   = blueprint.data('blueprint');                // Fields template

      // Make the context correct by replacing <parents> with the generated ID
      // of each of the parent objects
      var context = ($(link).closest('.fields').closestChild('input, textarea, select').eq(0).attr('name') || '').replace(new RegExp('\[[a-z_]+\]$'), '');

      // context will be something like this for a brand new form:
      // project[tasks_attributes][1255929127459][assignments_attributes][1255929128105]
      // or for an edit form:
      // project[tasks_attributes][0][assignments_attributes][1]
      if (context) {
        var parentNames = context.match(/[a-z_]+_attributes(?=\]\[(new_)?\d+\])/g) || [];
        var parentIds   = context.match(/[0-9]+/g) || [];

        for(var i = 0; i < parentNames.length; i++) {
          if(parentIds[i]) {
            content = content.replace(
              new RegExp('(_' + parentNames[i] + ')_.+?_', 'g'),
              '$1_' + parentIds[i] + '_');

            content = content.replace(
              new RegExp('(\\[' + parentNames[i] + '\\])\\[.+?\\]', 'g'),
              '$1[' + parentIds[i] + ']');
          }
        }
      }

      // Make a unique ID for the new child
      var regexp  = new RegExp('new_' + assoc, 'g');
      var new_id  = this.newId();
      content     = $.trim(content.replace(regexp, new_id));

      var field = this.insertFields(content, assoc, link);
      // bubble up event upto document (through form)
      field
        .trigger({ type: 'nested:fieldAdded', field: field })
        .trigger({ type: 'nested:fieldAdded:' + assoc, field: field });
      return false;
    },
    newId: function() {
      return new Date().getTime();
    },
    insertFields: function(content, assoc, link) {
      var target = $(link).data('target');
      if (target) {
        return $(content).appendTo($(target));
      } else {
        return $(content).insertBefore(link);
      }
    },
    removeFields: function(e) {
      var $link = $(e.currentTarget),
          assoc = $link.data('association'); // Name of child to be removed
      
      var hiddenField = $link.prev('input[type=hidden]');
      hiddenField.val('1');
      
      var field = $link.closest('.fields');
      field.hide();
      
      field
        .trigger({ type: 'nested:fieldRemoved', field: field })
        .trigger({ type: 'nested:fieldRemoved:' + assoc, field: field });
      return false;
    }
  };

  window.nestedFormEvents = new NestedFormEvents();
  $(document)
    .delegate('form a.add_nested_fields',    'click', nestedFormEvents.addFields)
    .delegate('form a.remove_nested_fields', 'click', nestedFormEvents.removeFields);
})(jQuery);

// http://plugins.jquery.com/project/closestChild
/*
 * Copyright 2011, Tobias Lindig
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */
(function($) {
        $.fn.closestChild = function(selector) {
                // breadth first search for the first matched node
                if (selector && selector != '') {
                        var queue = [];
                        queue.push(this);
                        while(queue.length > 0) {
                                var node = queue.shift();
                                var children = node.children();
                                for(var i = 0; i < children.length; ++i) {
                                        var child = $(children[i]);
                                        if (child.is(selector)) {
                                                return child; //well, we found one
                                        }
                                        queue.push(child);
                                }
                        }
                }
                return $();//nothing found
        };
})(jQuery);
// if on api subdomain except for charts and plugins, redirect
var wloc = window.location.toString();
if (wloc.indexOf('api') !== -1 && wloc.indexOf('api') < 10 && wloc.indexOf('charts') === -1 && wloc.indexOf('plugins') === -1) {
  window.location = wloc.replace('api', 'www');
}

;
/*
* Copyright (c) 2010 Lyconic, LLC.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/


(function($){

    // Change the values of this global object if your method parameter is different.
    $.restSetup = { methodParam: '_method' };

    // collects the csrf-param and csrf-token from meta tags
    $(document).on('page:load ready', function(){
      $.extend($.restSetup, {
        csrfParam: $('meta[name=csrf-param]').attr('content'),
        csrfToken: $('meta[name=csrf-token]').attr('content')
      });
    });

    // jQuery doesn't provide a better way of intercepting the ajax settings object
    var _ajax = $.ajax, options;

    function collect_options (url, data, success, error) {
      options = { dataType: 'json' };
      if (arguments.length === 1 && typeof arguments[0] !== "string") {
        options = $.extend(options, url);
        if ("url" in options)
        if ("data" in options) {
          fill_url(options.url, options.data);
        }
      } else {
        // shift arguments if data argument was omitted
        if ($.isFunction(data)) {
          error = success;
          success = data;
          data = null;
        }

        url = fill_url(url, data);

        options = $.extend(options, {
          url: url,
          data: data,
          success: success,
          error: error
        });
      }
    }

    function fill_url (url, data) {
      var key, u, val;
      for (key in data) {
        val = data[key];
        u = url.replace('{'+key+'}', val);
        if (u != url) {
          url = u;
          delete data[key];
        }
      }
      return url;
    }

    // public functions

    function ajax (settings) {
      settings.type = settings.type || "GET";

      if (typeof settings.data !== "string")
      if (settings.data != null) {
          settings.data = $.param(settings.data);
      }

      settings.data = settings.data || "";

      if ($.restSetup.csrf && !$.isEmptyObject($.restSetup.csrf))
      if (!/^(get)$/i.test(settings.type))
      if (!/(authenticity_token=)/i.test(settings.data)) {
          settings.data += (settings.data ? "&" : "") + $.restSetup.csrfParam + '=' + $restSetup.csrfToken;
      }

      if (!/^(get|post)$/i.test(settings.type)) {
          settings.data += (settings.data ? "&" : "") + $.restSetup.methodParam + '=' + settings.type.toLowerCase();
          settings.type = "POST";
      }

      return _ajax.call(this, settings);
    }

    function read () {
      collect_options.apply(this, arguments);
      $.extend(options, { type: 'GET' })
      return $.ajax(options);
    }

    function create () {
      collect_options.apply(this, arguments);
      $.extend(options, { type: 'POST' });
      return $.ajax(options);
    }

    function update () {
      collect_options.apply(this, arguments);
      $.extend(options, { type: 'PUT' });
      return $.ajax(options);
    }

    function destroy () {
      collect_options.apply(this, arguments);
      $.extend(options, { type: 'DELETE' });
      return $.ajax(options);
    }

    $.extend({
      ajax: ajax,
      read: read,
      create: create,
      update: update,
      destroy: destroy
    });

})(jQuery);

/*
 * validate.js 1.0.1
 * Copyright (c) 2011 Rick Harrison, http://rickharrison.me
 * validate.js is open sourced under the MIT license.
 * Portions of validate.js are inspired by CodeIgniter.
 * http://rickharrison.github.com/validate.js
 */


(function(j,k,i){var l={required:"The %s field is required.",matches:"The %s field does not match the %s field.",valid_email:"The %s field must contain a valid email address.",min_length:"The %s field must be at least %s characters in length.",max_length:"The %s field must not exceed %s characters in length.",exact_length:"The %s field must be exactly %s characters in length.",greater_than:"The %s field must contain a number greater than %s.",less_than:"The %s field must contain a number less than %s.",
alpha:"The %s field must only contain alphabetical characters.",alpha_numeric:"The %s field must only contain alpha-numeric characters.",alpha_dash:"The %s field must only contain alpha-numeric characters, underscores, and dashes.",numeric:"The %s field must contain only numbers.",integer:"The %s field must contain an integer."},m=function(){},n=/^(.+)\[(.+)\]$/,g=/^[0-9]+$/,o=/^\-?[0-9]+$/,h=/^\-?[0-9]*\.?[0-9]+$/,p=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,q=/^[a-z]+$/i,r=/^[a-z0-9]+$/i,s=/^[a-z0-9_-]+$/i,
e=function(a,b,d){this.callback=d||m;this.errors=[];this.fields={};this.form=k.forms[a]||{};this.messages={};this.handlers={};a=0;for(d=b.length;a<d;a++){var c=b[a];c.name&&c.rules&&(this.fields[c.name]={name:c.name,display:c.display||c.name,rules:c.rules,type:null,value:null,checked:null})}this.form.onsubmit=function(a){return function(b){try{return a._validateForm(b)}catch(c){}}}(this)};e.prototype.setMessage=function(a,b){this.messages[a]=b;return this};e.prototype.registerCallback=function(a,
b){a&&typeof a==="string"&&b&&typeof b==="function"&&(this.handlers[a]=b);return this};e.prototype._validateForm=function(a){this.errors=[];for(var b in this.fields)if(this.fields.hasOwnProperty(b)){var d=this.fields[b]||{},c=this.form[d.name];if(c&&c!==i)d.type=c.type,d.value=c.value,d.checked=c.checked;this._validateField(d)}typeof this.callback==="function"&&this.callback(this.errors,a);if(this.errors.length>0)if(a&&a.preventDefault)a.preventDefault();else return false;return true};e.prototype._validateField=
function(a){var b=a.rules.split("|");if(!(a.rules.indexOf("required")===-1&&(!a.value||a.value===""||a.value===i)))for(var d=0,c=b.length;d<c;d++){var f=b[d],e=null,g=false;if(parts=n.exec(f))f=parts[1],e=parts[2];typeof this._hooks[f]==="function"?this._hooks[f].apply(this,[a,e])||(g=true):f.substring(0,9)==="callback_"&&(f=f.substring(9,f.length),typeof this.handlers[f]==="function"&&this.handlers[f].apply(this,[a.value])===false&&(g=true));if(g){(b=this.messages[f]||l[f])?(a=b.replace("%s",a.display),
e&&(a=a.replace("%s",this.fields[e]?this.fields[e].display:e)),this.errors.push(a)):this.errors.push("An error has occurred with the "+a.display+" field.");break}}};e.prototype._hooks={required:function(a){var b=a.value;return a.type==="checkbox"?a.checked===true:b!==null&&b!==""},matches:function(a,b){return(el=this.form[b])?a.value===el.value:false},valid_email:function(a){return p.test(a.value)},min_length:function(a,b){return!g.test(b)?false:a.value.length>=b},max_length:function(a,b){return!g.test(b)?
false:a.value.length<=b},exact_length:function(a,b){return!g.test(b)?false:a.value.length==b},greater_than:function(a,b){return!h.test(a.value)?false:parseFloat(a.value)>parseFloat(b)},less_than:function(a,b){return!h.test(a.value)?false:parseFloat(a.value)<parseFloat(b)},alpha:function(a){return q.test(a.value)},alpha_numeric:function(a){return r.test(a.value)},alpha_dash:function(a){return s.test(a.value)},numeric:function(a){return h.test(a.value)},integer:function(a){return o.test(a.value)}};
j.FormValidator=e})(window,document);
$(document).on('page:load ready', function() {
  $("div.progressbar").each(function() {
    var element = this;
    $(element).progressbar({ value: parseInt($(element).attr("rel")) });
  });
});

// execute on window load (and not document.ready), so that the sidebar is positioned correctly
$(window).on('page:load load', function() {
  // if affix function exists
  if ($.fn.affix) {

    // add sidebar affix, wrapped in a timeout so that it displays correctly
    setTimeout(function() {
      $('#bootstrap-sidebar').affix();
    }, 100);

    // add sidebar scrollspy
    $(document.body).scrollspy({ target: '#leftcol', offset: 300 });

    // add smooth scrolling
    $("#bootstrap-sidebar li a[href^='#']").on('click', function(e) {
      // prevent default anchor click behavior
      e.preventDefault();

      // store hash
      var hash = this.hash;

      // animate
      $('html, body').animate({
        scrollTop: $(this.hash).offset().top - 90
      }, 300, function(){
        // when done, add hash to url
        // (default click behaviour)
        window.location.hash = hash;
      });

    });

  }
});

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


var q=null;window.PR_SHOULD_USE_CONTINUATION=!0;
(function(){function L(a){function m(a){var f=a.charCodeAt(0);if(f!==92)return f;var b=a.charAt(1);return(f=r[b])?f:"0"<=b&&b<="7"?parseInt(a.substring(1),8):b==="u"||b==="x"?parseInt(a.substring(2),16):a.charCodeAt(1)}function e(a){if(a<32)return(a<16?"\\x0":"\\x")+a.toString(16);a=String.fromCharCode(a);if(a==="\\"||a==="-"||a==="["||a==="]")a="\\"+a;return a}function h(a){for(var f=a.substring(1,a.length-1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g),a=
[],b=[],o=f[0]==="^",c=o?1:0,i=f.length;c<i;++c){var j=f[c];if(/\\[bdsw]/i.test(j))a.push(j);else{var j=m(j),d;c+2<i&&"-"===f[c+1]?(d=m(f[c+2]),c+=2):d=j;b.push([j,d]);d<65||j>122||(d<65||j>90||b.push([Math.max(65,j)|32,Math.min(d,90)|32]),d<97||j>122||b.push([Math.max(97,j)&-33,Math.min(d,122)&-33]))}}b.sort(function(a,f){return a[0]-f[0]||f[1]-a[1]});f=[];j=[NaN,NaN];for(c=0;c<b.length;++c)i=b[c],i[0]<=j[1]+1?j[1]=Math.max(j[1],i[1]):f.push(j=i);b=["["];o&&b.push("^");b.push.apply(b,a);for(c=0;c<
f.length;++c)i=f[c],b.push(e(i[0])),i[1]>i[0]&&(i[1]+1>i[0]&&b.push("-"),b.push(e(i[1])));b.push("]");return b.join("")}function y(a){for(var f=a.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g),b=f.length,d=[],c=0,i=0;c<b;++c){var j=f[c];j==="("?++i:"\\"===j.charAt(0)&&(j=+j.substring(1))&&j<=i&&(d[j]=-1)}for(c=1;c<d.length;++c)-1===d[c]&&(d[c]=++t);for(i=c=0;c<b;++c)j=f[c],j==="("?(++i,d[i]===void 0&&(f[c]="(?:")):"\\"===j.charAt(0)&&
(j=+j.substring(1))&&j<=i&&(f[c]="\\"+d[i]);for(i=c=0;c<b;++c)"^"===f[c]&&"^"!==f[c+1]&&(f[c]="");if(a.ignoreCase&&s)for(c=0;c<b;++c)j=f[c],a=j.charAt(0),j.length>=2&&a==="["?f[c]=h(j):a!=="\\"&&(f[c]=j.replace(/[A-Za-z]/g,function(a){a=a.charCodeAt(0);return"["+String.fromCharCode(a&-33,a|32)+"]"}));return f.join("")}for(var t=0,s=!1,l=!1,p=0,d=a.length;p<d;++p){var g=a[p];if(g.ignoreCase)l=!0;else if(/[a-z]/i.test(g.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi,""))){s=!0;l=!1;break}}for(var r=
{b:8,t:9,n:10,v:11,f:12,r:13},n=[],p=0,d=a.length;p<d;++p){g=a[p];if(g.global||g.multiline)throw Error(""+g);n.push("(?:"+y(g)+")")}return RegExp(n.join("|"),l?"gi":"g")}function M(a){function m(a){switch(a.nodeType){case 1:if(e.test(a.className))break;for(var g=a.firstChild;g;g=g.nextSibling)m(g);g=a.nodeName;if("BR"===g||"LI"===g)h[s]="\n",t[s<<1]=y++,t[s++<<1|1]=a;break;case 3:case 4:g=a.nodeValue,g.length&&(g=p?g.replace(/\r\n?/g,"\n"):g.replace(/[\t\n\r ]+/g," "),h[s]=g,t[s<<1]=y,y+=g.length,
t[s++<<1|1]=a)}}var e=/(?:^|\s)nocode(?:\s|$)/,h=[],y=0,t=[],s=0,l;a.currentStyle?l=a.currentStyle.whiteSpace:window.getComputedStyle&&(l=document.defaultView.getComputedStyle(a,q).getPropertyValue("white-space"));var p=l&&"pre"===l.substring(0,3);m(a);return{a:h.join("").replace(/\n$/,""),c:t}}function B(a,m,e,h){m&&(a={a:m,d:a},e(a),h.push.apply(h,a.e))}function x(a,m){function e(a){for(var l=a.d,p=[l,"pln"],d=0,g=a.a.match(y)||[],r={},n=0,z=g.length;n<z;++n){var f=g[n],b=r[f],o=void 0,c;if(typeof b===
"string")c=!1;else{var i=h[f.charAt(0)];if(i)o=f.match(i[1]),b=i[0];else{for(c=0;c<t;++c)if(i=m[c],o=f.match(i[1])){b=i[0];break}o||(b="pln")}if((c=b.length>=5&&"lang-"===b.substring(0,5))&&!(o&&typeof o[1]==="string"))c=!1,b="src";c||(r[f]=b)}i=d;d+=f.length;if(c){c=o[1];var j=f.indexOf(c),k=j+c.length;o[2]&&(k=f.length-o[2].length,j=k-c.length);b=b.substring(5);B(l+i,f.substring(0,j),e,p);B(l+i+j,c,C(b,c),p);B(l+i+k,f.substring(k),e,p)}else p.push(l+i,b)}a.e=p}var h={},y;(function(){for(var e=a.concat(m),
l=[],p={},d=0,g=e.length;d<g;++d){var r=e[d],n=r[3];if(n)for(var k=n.length;--k>=0;)h[n.charAt(k)]=r;r=r[1];n=""+r;p.hasOwnProperty(n)||(l.push(r),p[n]=q)}l.push(/[\S\s]/);y=L(l)})();var t=m.length;return e}function u(a){var m=[],e=[];a.tripleQuotedStrings?m.push(["str",/^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/,q,"'\""]):a.multiLineStrings?m.push(["str",/^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/,
q,"'\"`"]):m.push(["str",/^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/,q,"\"'"]);a.verbatimStrings&&e.push(["str",/^@"(?:[^"]|"")*(?:"|$)/,q]);var h=a.hashComments;h&&(a.cStyleComments?(h>1?m.push(["com",/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,q,"#"]):m.push(["com",/^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\n\r]*)/,q,"#"]),e.push(["str",/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/,q])):m.push(["com",/^#[^\n\r]*/,
q,"#"]));a.cStyleComments&&(e.push(["com",/^\/\/[^\n\r]*/,q]),e.push(["com",/^\/\*[\S\s]*?(?:\*\/|$)/,q]));a.regexLiterals&&e.push(["lang-regex",/^(?:^^\.?|[!+-]|!=|!==|#|%|%=|&|&&|&&=|&=|\(|\*|\*=|\+=|,|-=|->|\/|\/=|:|::|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|[?@[^]|\^=|\^\^|\^\^=|{|\||\|=|\|\||\|\|=|~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\s*(\/(?=[^*/])(?:[^/[\\]|\\[\S\s]|\[(?:[^\\\]]|\\[\S\s])*(?:]|$))+\/)/]);(h=a.types)&&e.push(["typ",h]);a=(""+a.keywords).replace(/^ | $/g,
"");a.length&&e.push(["kwd",RegExp("^(?:"+a.replace(/[\s,]+/g,"|")+")\\b"),q]);m.push(["pln",/^\s+/,q," \r\n\t\xa0"]);e.push(["lit",/^@[$_a-z][\w$@]*/i,q],["typ",/^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/,q],["pln",/^[$_a-z][\w$@]*/i,q],["lit",/^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i,q,"0123456789"],["pln",/^\\[\S\s]?/,q],["pun",/^.[^\s\w"-$'./@\\`]*/,q]);return x(m,e)}function D(a,m){function e(a){switch(a.nodeType){case 1:if(k.test(a.className))break;if("BR"===a.nodeName)h(a),
a.parentNode&&a.parentNode.removeChild(a);else for(a=a.firstChild;a;a=a.nextSibling)e(a);break;case 3:case 4:if(p){var b=a.nodeValue,d=b.match(t);if(d){var c=b.substring(0,d.index);a.nodeValue=c;(b=b.substring(d.index+d[0].length))&&a.parentNode.insertBefore(s.createTextNode(b),a.nextSibling);h(a);c||a.parentNode.removeChild(a)}}}}function h(a){function b(a,d){var e=d?a.cloneNode(!1):a,f=a.parentNode;if(f){var f=b(f,1),g=a.nextSibling;f.appendChild(e);for(var h=g;h;h=g)g=h.nextSibling,f.appendChild(h)}return e}
for(;!a.nextSibling;)if(a=a.parentNode,!a)return;for(var a=b(a.nextSibling,0),e;(e=a.parentNode)&&e.nodeType===1;)a=e;d.push(a)}var k=/(?:^|\s)nocode(?:\s|$)/,t=/\r\n?|\n/,s=a.ownerDocument,l;a.currentStyle?l=a.currentStyle.whiteSpace:window.getComputedStyle&&(l=s.defaultView.getComputedStyle(a,q).getPropertyValue("white-space"));var p=l&&"pre"===l.substring(0,3);for(l=s.createElement("LI");a.firstChild;)l.appendChild(a.firstChild);for(var d=[l],g=0;g<d.length;++g)e(d[g]);m===(m|0)&&d[0].setAttribute("value",
m);var r=s.createElement("OL");r.className="linenums";for(var n=Math.max(0,m-1|0)||0,g=0,z=d.length;g<z;++g)l=d[g],l.className="L"+(g+n)%10,l.firstChild||l.appendChild(s.createTextNode("\xa0")),r.appendChild(l);a.appendChild(r)}function k(a,m){for(var e=m.length;--e>=0;){var h=m[e];A.hasOwnProperty(h)?window.console&&console.warn("cannot override language handler %s",h):A[h]=a}}function C(a,m){if(!a||!A.hasOwnProperty(a))a=/^\s*</.test(m)?"default-markup":"default-code";return A[a]}function E(a){var m=
a.g;try{var e=M(a.h),h=e.a;a.a=h;a.c=e.c;a.d=0;C(m,h)(a);var k=/\bMSIE\b/.test(navigator.userAgent),m=/\n/g,t=a.a,s=t.length,e=0,l=a.c,p=l.length,h=0,d=a.e,g=d.length,a=0;d[g]=s;var r,n;for(n=r=0;n<g;)d[n]!==d[n+2]?(d[r++]=d[n++],d[r++]=d[n++]):n+=2;g=r;for(n=r=0;n<g;){for(var z=d[n],f=d[n+1],b=n+2;b+2<=g&&d[b+1]===f;)b+=2;d[r++]=z;d[r++]=f;n=b}for(d.length=r;h<p;){var o=l[h+2]||s,c=d[a+2]||s,b=Math.min(o,c),i=l[h+1],j;if(i.nodeType!==1&&(j=t.substring(e,b))){k&&(j=j.replace(m,"\r"));i.nodeValue=
j;var u=i.ownerDocument,v=u.createElement("SPAN");v.className=d[a+1];var x=i.parentNode;x.replaceChild(v,i);v.appendChild(i);e<o&&(l[h+1]=i=u.createTextNode(t.substring(b,o)),x.insertBefore(i,v.nextSibling))}e=b;e>=o&&(h+=2);e>=c&&(a+=2)}}catch(w){"console"in window&&console.log(w&&w.stack?w.stack:w)}}var v=["break,continue,do,else,for,if,return,while"],w=[[v,"auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],
"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],F=[w,"alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],G=[w,"abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"],
H=[G,"as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var"],w=[w,"debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],I=[v,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],
J=[v,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],v=[v,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"],K=/^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/,N=/\S/,O=u({keywords:[F,H,w,"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END"+
I,J,v],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),A={};k(O,["default-code"]);k(x([],[["pln",/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],["com",/^<\!--[\S\s]*?(?:--\>|$)/],["lang-",/^<\?([\S\s]+?)(?:\?>|$)/],["lang-",/^<%([\S\s]+?)(?:%>|$)/],["pun",/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),
["default-markup","htm","html","mxml","xhtml","xml","xsl"]);k(x([["pln",/^\s+/,q," \t\r\n"],["atv",/^(?:"[^"]*"?|'[^']*'?)/,q,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],["pun",/^[/<->]+/],["lang-js",/^on\w+\s*=\s*"([^"]+)"/i],["lang-js",/^on\w+\s*=\s*'([^']+)'/i],["lang-js",/^on\w+\s*=\s*([^\s"'>]+)/i],["lang-css",/^style\s*=\s*"([^"]+)"/i],["lang-css",/^style\s*=\s*'([^']+)'/i],["lang-css",
/^style\s*=\s*([^\s"'>]+)/i]]),["in.tag"]);k(x([],[["atv",/^[\S\s]+/]]),["uq.val"]);k(u({keywords:F,hashComments:!0,cStyleComments:!0,types:K}),["c","cc","cpp","cxx","cyc","m"]);k(u({keywords:"null,true,false"}),["json"]);k(u({keywords:H,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:K}),["cs"]);k(u({keywords:G,cStyleComments:!0}),["java"]);k(u({keywords:v,hashComments:!0,multiLineStrings:!0}),["bsh","csh","sh"]);k(u({keywords:I,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),
["cv","py"]);k(u({keywords:"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["perl","pl","pm"]);k(u({keywords:J,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb"]);k(u({keywords:w,cStyleComments:!0,regexLiterals:!0}),["js"]);k(u({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,true,try,unless,until,when,while,yes",
hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]);k(x([],[["str",/^[\S\s]+/]]),["regex"]);window.prettyPrintOne=function(a,m,e){var h=document.createElement("PRE");h.innerHTML=a;e&&D(h,e);E({g:m,i:e,h:h});return h.innerHTML};window.prettyPrint=function(a){function m(){for(var e=window.PR_SHOULD_USE_CONTINUATION?l.now()+250:Infinity;p<h.length&&l.now()<e;p++){var n=h[p],k=n.className;if(k.indexOf("prettyprint")>=0){var k=k.match(g),f,b;if(b=
!k){b=n;for(var o=void 0,c=b.firstChild;c;c=c.nextSibling)var i=c.nodeType,o=i===1?o?b:c:i===3?N.test(c.nodeValue)?b:o:o;b=(f=o===b?void 0:o)&&"CODE"===f.tagName}b&&(k=f.className.match(g));k&&(k=k[1]);b=!1;for(o=n.parentNode;o;o=o.parentNode)if((o.tagName==="pre"||o.tagName==="code"||o.tagName==="xmp")&&o.className&&o.className.indexOf("prettyprint")>=0){b=!0;break}b||((b=(b=n.className.match(/\blinenums\b(?::(\d+))?/))?b[1]&&b[1].length?+b[1]:!0:!1)&&D(n,b),d={g:k,h:n,i:b},E(d))}}p<h.length?setTimeout(m,
250):a&&a()}for(var e=[document.getElementsByTagName("pre"),document.getElementsByTagName("code"),document.getElementsByTagName("xmp")],h=[],k=0;k<e.length;++k)for(var t=0,s=e[k].length;t<s;++t)h.push(e[k][t]);var e=q,l=Date;l.now||(l={now:function(){return+new Date}});var p=0,d,g=/\blang(?:uage)?-([\w.]+)(?!\S)/;m()};window.PR={createSimpleLexer:x,registerLangHandler:k,sourceDecorator:u,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:"atv",PR_COMMENT:"com",PR_DECLARATION:"dec",PR_KEYWORD:"kwd",PR_LITERAL:"lit",
PR_NOCODE:"nocode",PR_PLAIN:"pln",PR_PUNCTUATION:"pun",PR_SOURCE:"src",PR_STRING:"str",PR_TAG:"tag",PR_TYPE:"typ"}})();

!function ($) {
  $(function(){
    window.prettyPrint && prettyPrint()
  })
}(window.jQuery)

;
$(document).on('page:load ready', function() {

  // when a response is clicked
  $('.response').click(function() {
    // get the response type
    var response_type = $(this).data('response_type');

    // remove active responses
    $('.response').removeClass('active');

    // add active response
    $('.response-' + response_type).addClass('active');

    // hide other formats
    $('.format').hide();

    // show this format
    $('.format-' + response_type).show();

  });

});

// when the document is ready
$(document).on('page:load ready', function() {

  // allow flash notices to be dismissed
  if ($(".flash").length > 0) {
    $(".flash").on("click", function() {
      $(this).hide("slow");
    });
    // hide flash automatically after 15 seconds
    setTimeout(function() {
      if ($(".flash").length > 0) {
        $(".flash").hide("slow");
      }
    }, 15000);
  }

  // show form to add a talkback command
  $('#talkback_command_add').click(function() {
    $(this).hide();
    $('#talkback_command_add_form').removeClass('hide');
  });

  // toggle contact form
  $('#contact_link').click(function() {
    $('#contact_form').toggle();
  });

  // activate any tablesorters
  $('.tablesorter').tablesorter();

  // set value for userlogin_js, which is used to determine if a form was submitted with javascript enabled
  $('#userlogin_js').val('6H2W6QYUAJT1Q8EB');

});

// https://stackoverflow.com/a/6941653  20190321
var current_host_port = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

/*
 Highcharts JS v7.0.3 (2019-02-06)

 (c) 2009-2018 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(N,I){"object"===typeof module&&module.exports?(I["default"]=I,module.exports=N.document?I(N):I):"function"===typeof define&&define.amd?define(function(){return I(N)}):N.Highcharts=I(N)})("undefined"!==typeof window?window:this,function(N){var I=function(){var a="undefined"===typeof N?"undefined"!==typeof window?window:{}:N,y=a.document,F=a.navigator&&a.navigator.userAgent||"",G=y&&y.createElementNS&&!!y.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,k=/(edge|msie|trident)/i.test(F)&&
!a.opera,c=-1!==F.indexOf("Firefox"),p=-1!==F.indexOf("Chrome"),t=c&&4>parseInt(F.split("Firefox/")[1],10);return a.Highcharts?a.Highcharts.error(16,!0):{product:"Highcharts",version:"7.0.3",deg2rad:2*Math.PI/360,doc:y,hasBidiBug:t,hasTouch:y&&void 0!==y.documentElement.ontouchstart,isMS:k,isWebKit:-1!==F.indexOf("AppleWebKit"),isFirefox:c,isChrome:p,isSafari:!p&&-1!==F.indexOf("Safari"),isTouchDevice:/(Mobile|Android|Windows Phone)/.test(F),SVG_NS:"http://www.w3.org/2000/svg",chartCount:0,seriesTypes:{},
symbolSizes:{},svg:G,win:a,marginNames:["plotTop","marginRight","marginBottom","plotLeft"],noop:function(){},charts:[]}}();(function(a){a.timers=[];var y=a.charts,F=a.doc,G=a.win;a.error=function(k,c,p){var t=a.isNumber(k)?"Highcharts error #"+k+": www.highcharts.com/errors/"+k:k;p&&a.fireEvent(p,"displayError",{code:k});if(c)throw Error(t);G.console&&console.log(t)};a.Fx=function(a,c,p){this.options=c;this.elem=a;this.prop=p};a.Fx.prototype={dSetter:function(){var a=this.paths[0],c=this.paths[1],
p=[],t=this.now,v=a.length,w;if(1===t)p=this.toD;else if(v===c.length&&1>t)for(;v--;)w=parseFloat(a[v]),p[v]=isNaN(w)?c[v]:t*parseFloat(c[v]-w)+w;else p=c;this.elem.attr("d",p,null,!0)},update:function(){var a=this.elem,c=this.prop,p=this.now,t=this.options.step;if(this[c+"Setter"])this[c+"Setter"]();else a.attr?a.element&&a.attr(c,p,null,!0):a.style[c]=p+this.unit;t&&t.call(a,p,this)},run:function(k,c,p){var t=this,v=t.options,w=function(a){return w.stopped?!1:t.step(a)},r=G.requestAnimationFrame||
function(a){setTimeout(a,13)},h=function(){for(var e=0;e<a.timers.length;e++)a.timers[e]()||a.timers.splice(e--,1);a.timers.length&&r(h)};k!==c||this.elem["forceAnimate:"+this.prop]?(this.startTime=+new Date,this.start=k,this.end=c,this.unit=p,this.now=this.start,this.pos=0,w.elem=this.elem,w.prop=this.prop,w()&&1===a.timers.push(w)&&r(h)):(delete v.curAnim[this.prop],v.complete&&0===Object.keys(v.curAnim).length&&v.complete.call(this.elem))},step:function(k){var c=+new Date,p,t=this.options,v=this.elem,
w=t.complete,r=t.duration,h=t.curAnim;v.attr&&!v.element?k=!1:k||c>=r+this.startTime?(this.now=this.end,this.pos=1,this.update(),p=h[this.prop]=!0,a.objectEach(h,function(a){!0!==a&&(p=!1)}),p&&w&&w.call(v),k=!1):(this.pos=t.easing((c-this.startTime)/r),this.now=this.start+(this.end-this.start)*this.pos,this.update(),k=!0);return k},initPath:function(k,c,p){function t(a){var d,g;for(b=a.length;b--;)d="M"===a[b]||"L"===a[b],g=/[a-zA-Z]/.test(a[b+3]),d&&g&&a.splice(b+1,0,a[b+1],a[b+2],a[b+1],a[b+2])}
function v(a,g){for(;a.length<d;){a[0]=g[d-a.length];var e=a.slice(0,n);[].splice.apply(a,[0,0].concat(e));x&&(e=a.slice(a.length-n),[].splice.apply(a,[a.length,0].concat(e)),b--)}a[0]="M"}function w(a,b){for(var e=(d-a.length)/n;0<e&&e--;)g=a.slice().splice(a.length/u-n,n*u),g[0]=b[d-n-e*n],l&&(g[n-6]=g[n-2],g[n-5]=g[n-1]),[].splice.apply(a,[a.length/u,0].concat(g)),x&&e--}c=c||"";var r,h=k.startX,e=k.endX,l=-1<c.indexOf("C"),n=l?7:3,d,g,b;c=c.split(" ");p=p.slice();var x=k.isArea,u=x?2:1,H;l&&(t(c),
t(p));if(h&&e){for(b=0;b<h.length;b++)if(h[b]===e[0]){r=b;break}else if(h[0]===e[e.length-h.length+b]){r=b;H=!0;break}void 0===r&&(c=[])}c.length&&a.isNumber(r)&&(d=p.length+r*u*n,H?(v(c,p),w(p,c)):(v(p,c),w(c,p)));return[c,p]},fillSetter:function(){a.Fx.prototype.strokeSetter.apply(this,arguments)},strokeSetter:function(){this.elem.attr(this.prop,a.color(this.start).tweenTo(a.color(this.end),this.pos),null,!0)}};a.merge=function(){var k,c=arguments,p,t={},v=function(c,r){"object"!==typeof c&&(c=
{});a.objectEach(r,function(h,e){!a.isObject(h,!0)||a.isClass(h)||a.isDOMElement(h)?c[e]=r[e]:c[e]=v(c[e]||{},h)});return c};!0===c[0]&&(t=c[1],c=Array.prototype.slice.call(c,2));p=c.length;for(k=0;k<p;k++)t=v(t,c[k]);return t};a.pInt=function(a,c){return parseInt(a,c||10)};a.isString=function(a){return"string"===typeof a};a.isArray=function(a){a=Object.prototype.toString.call(a);return"[object Array]"===a||"[object Array Iterator]"===a};a.isObject=function(k,c){return!!k&&"object"===typeof k&&(!c||
!a.isArray(k))};a.isDOMElement=function(k){return a.isObject(k)&&"number"===typeof k.nodeType};a.isClass=function(k){var c=k&&k.constructor;return!(!a.isObject(k,!0)||a.isDOMElement(k)||!c||!c.name||"Object"===c.name)};a.isNumber=function(a){return"number"===typeof a&&!isNaN(a)&&Infinity>a&&-Infinity<a};a.erase=function(a,c){for(var k=a.length;k--;)if(a[k]===c){a.splice(k,1);break}};a.defined=function(a){return void 0!==a&&null!==a};a.attr=function(k,c,p){var t;a.isString(c)?a.defined(p)?k.setAttribute(c,
p):k&&k.getAttribute&&((t=k.getAttribute(c))||"class"!==c||(t=k.getAttribute(c+"Name"))):a.defined(c)&&a.isObject(c)&&a.objectEach(c,function(a,c){k.setAttribute(c,a)});return t};a.splat=function(k){return a.isArray(k)?k:[k]};a.syncTimeout=function(a,c,p){if(c)return setTimeout(a,c,p);a.call(0,p)};a.clearTimeout=function(k){a.defined(k)&&clearTimeout(k)};a.extend=function(a,c){var k;a||(a={});for(k in c)a[k]=c[k];return a};a.pick=function(){var a=arguments,c,p,t=a.length;for(c=0;c<t;c++)if(p=a[c],
void 0!==p&&null!==p)return p};a.css=function(k,c){a.isMS&&!a.svg&&c&&void 0!==c.opacity&&(c.filter="alpha(opacity\x3d"+100*c.opacity+")");a.extend(k.style,c)};a.createElement=function(k,c,p,t,v){k=F.createElement(k);var w=a.css;c&&a.extend(k,c);v&&w(k,{padding:0,border:"none",margin:0});p&&w(k,p);t&&t.appendChild(k);return k};a.extendClass=function(k,c){var p=function(){};p.prototype=new k;a.extend(p.prototype,c);return p};a.pad=function(a,c,p){return Array((c||2)+1-String(a).replace("-","").length).join(p||
0)+a};a.relativeLength=function(a,c,p){return/%$/.test(a)?c*parseFloat(a)/100+(p||0):parseFloat(a)};a.wrap=function(a,c,p){var k=a[c];a[c]=function(){var a=Array.prototype.slice.call(arguments),c=arguments,r=this;r.proceed=function(){k.apply(r,arguments.length?arguments:c)};a.unshift(k);a=p.apply(this,a);r.proceed=null;return a}};a.datePropsToTimestamps=function(k){a.objectEach(k,function(c,p){a.isObject(c)&&"function"===typeof c.getTime?k[p]=c.getTime():(a.isObject(c)||a.isArray(c))&&a.datePropsToTimestamps(c)})};
a.formatSingle=function(k,c,p){var t=/\.([0-9])/,v=a.defaultOptions.lang;/f$/.test(k)?(p=(p=k.match(t))?p[1]:-1,null!==c&&(c=a.numberFormat(c,p,v.decimalPoint,-1<k.indexOf(",")?v.thousandsSep:""))):c=(p||a.time).dateFormat(k,c);return c};a.format=function(k,c,p){for(var t="{",v=!1,w,r,h,e,l=[],n;k;){t=k.indexOf(t);if(-1===t)break;w=k.slice(0,t);if(v){w=w.split(":");r=w.shift().split(".");e=r.length;n=c;for(h=0;h<e;h++)n&&(n=n[r[h]]);w.length&&(n=a.formatSingle(w.join(":"),n,p));l.push(n)}else l.push(w);
k=k.slice(t+1);t=(v=!v)?"}":"{"}l.push(k);return l.join("")};a.getMagnitude=function(a){return Math.pow(10,Math.floor(Math.log(a)/Math.LN10))};a.normalizeTickInterval=function(k,c,p,t,v){var w,r=k;p=a.pick(p,1);w=k/p;c||(c=v?[1,1.2,1.5,2,2.5,3,4,5,6,8,10]:[1,2,2.5,5,10],!1===t&&(1===p?c=c.filter(function(a){return 0===a%1}):.1>=p&&(c=[1/p])));for(t=0;t<c.length&&!(r=c[t],v&&r*p>=k||!v&&w<=(c[t]+(c[t+1]||c[t]))/2);t++);return r=a.correctFloat(r*p,-Math.round(Math.log(.001)/Math.LN10))};a.stableSort=
function(a,c){var k=a.length,t,v;for(v=0;v<k;v++)a[v].safeI=v;a.sort(function(a,r){t=c(a,r);return 0===t?a.safeI-r.safeI:t});for(v=0;v<k;v++)delete a[v].safeI};a.arrayMin=function(a){for(var c=a.length,k=a[0];c--;)a[c]<k&&(k=a[c]);return k};a.arrayMax=function(a){for(var c=a.length,k=a[0];c--;)a[c]>k&&(k=a[c]);return k};a.destroyObjectProperties=function(k,c){a.objectEach(k,function(a,t){a&&a!==c&&a.destroy&&a.destroy();delete k[t]})};a.discardElement=function(k){var c=a.garbageBin;c||(c=a.createElement("div"));
k&&c.appendChild(k);c.innerHTML=""};a.correctFloat=function(a,c){return parseFloat(a.toPrecision(c||14))};a.setAnimation=function(k,c){c.renderer.globalAnimation=a.pick(k,c.options.chart.animation,!0)};a.animObject=function(k){return a.isObject(k)?a.merge(k):{duration:k?500:0}};a.timeUnits={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5,month:24192E5,year:314496E5};a.numberFormat=function(k,c,p,t){k=+k||0;c=+c;var v=a.defaultOptions.lang,w=(k.toString().split(".")[1]||"").split("e")[0].length,
r,h,e=k.toString().split("e");-1===c?c=Math.min(w,20):a.isNumber(c)?c&&e[1]&&0>e[1]&&(r=c+ +e[1],0<=r?(e[0]=(+e[0]).toExponential(r).split("e")[0],c=r):(e[0]=e[0].split(".")[0]||0,k=20>c?(e[0]*Math.pow(10,e[1])).toFixed(c):0,e[1]=0)):c=2;h=(Math.abs(e[1]?e[0]:k)+Math.pow(10,-Math.max(c,w)-1)).toFixed(c);w=String(a.pInt(h));r=3<w.length?w.length%3:0;p=a.pick(p,v.decimalPoint);t=a.pick(t,v.thousandsSep);k=(0>k?"-":"")+(r?w.substr(0,r)+t:"");k+=w.substr(r).replace(/(\d{3})(?=\d)/g,"$1"+t);c&&(k+=p+h.slice(-c));
e[1]&&0!==+k&&(k+="e"+e[1]);return k};Math.easeInOutSine=function(a){return-.5*(Math.cos(Math.PI*a)-1)};a.getStyle=function(k,c,p){if("width"===c)return Math.max(0,Math.min(k.offsetWidth,k.scrollWidth,k.getBoundingClientRect&&"none"===a.getStyle(k,"transform",!1)?Math.floor(k.getBoundingClientRect().width):Infinity)-a.getStyle(k,"padding-left")-a.getStyle(k,"padding-right"));if("height"===c)return Math.max(0,Math.min(k.offsetHeight,k.scrollHeight)-a.getStyle(k,"padding-top")-a.getStyle(k,"padding-bottom"));
G.getComputedStyle||a.error(27,!0);if(k=G.getComputedStyle(k,void 0))k=k.getPropertyValue(c),a.pick(p,"opacity"!==c)&&(k=a.pInt(k));return k};a.inArray=function(a,c,p){return c.indexOf(a,p)};a.find=Array.prototype.find?function(a,c){return a.find(c)}:function(a,c){var k,t=a.length;for(k=0;k<t;k++)if(c(a[k],k))return a[k]};a.keys=Object.keys;a.offset=function(a){var c=F.documentElement;a=a.parentElement||a.parentNode?a.getBoundingClientRect():{top:0,left:0};return{top:a.top+(G.pageYOffset||c.scrollTop)-
(c.clientTop||0),left:a.left+(G.pageXOffset||c.scrollLeft)-(c.clientLeft||0)}};a.stop=function(k,c){for(var p=a.timers.length;p--;)a.timers[p].elem!==k||c&&c!==a.timers[p].prop||(a.timers[p].stopped=!0)};a.objectEach=function(a,c,p){for(var k in a)a.hasOwnProperty(k)&&c.call(p||a[k],a[k],k,a)};a.objectEach({map:"map",each:"forEach",grep:"filter",reduce:"reduce",some:"some"},function(k,c){a[c]=function(a){return Array.prototype[k].apply(a,[].slice.call(arguments,1))}});a.addEvent=function(k,c,p,t){var v,
w=k.addEventListener||a.addEventListenerPolyfill;v="function"===typeof k&&k.prototype?k.prototype.protoEvents=k.prototype.protoEvents||{}:k.hcEvents=k.hcEvents||{};a.Point&&k instanceof a.Point&&k.series&&k.series.chart&&(k.series.chart.runTrackerClick=!0);w&&w.call(k,c,p,!1);v[c]||(v[c]=[]);v[c].push(p);t&&a.isNumber(t.order)&&(p.order=t.order,v[c].sort(function(a,h){return a.order-h.order}));return function(){a.removeEvent(k,c,p)}};a.removeEvent=function(k,c,p){function t(h,e){var l=k.removeEventListener||
a.removeEventListenerPolyfill;l&&l.call(k,h,e,!1)}function v(h){var e,l;k.nodeName&&(c?(e={},e[c]=!0):e=h,a.objectEach(e,function(a,d){if(h[d])for(l=h[d].length;l--;)t(d,h[d][l])}))}var w,r;["protoEvents","hcEvents"].forEach(function(a){var e=k[a];e&&(c?(w=e[c]||[],p?(r=w.indexOf(p),-1<r&&(w.splice(r,1),e[c]=w),t(c,p)):(v(e),e[c]=[])):(v(e),k[a]={}))})};a.fireEvent=function(k,c,p,t){var v,w,r,h,e;p=p||{};F.createEvent&&(k.dispatchEvent||k.fireEvent)?(v=F.createEvent("Events"),v.initEvent(c,!0,!0),
a.extend(v,p),k.dispatchEvent?k.dispatchEvent(v):k.fireEvent(c,v)):["protoEvents","hcEvents"].forEach(function(l){if(k[l])for(w=k[l][c]||[],r=w.length,p.target||a.extend(p,{preventDefault:function(){p.defaultPrevented=!0},target:k,type:c}),h=0;h<r;h++)(e=w[h])&&!1===e.call(k,p)&&p.preventDefault()});t&&!p.defaultPrevented&&t.call(k,p)};a.animate=function(k,c,p){var t,v="",w,r,h;a.isObject(p)||(h=arguments,p={duration:h[2],easing:h[3],complete:h[4]});a.isNumber(p.duration)||(p.duration=400);p.easing=
"function"===typeof p.easing?p.easing:Math[p.easing]||Math.easeInOutSine;p.curAnim=a.merge(c);a.objectEach(c,function(e,h){a.stop(k,h);r=new a.Fx(k,p,h);w=null;"d"===h?(r.paths=r.initPath(k,k.d,c.d),r.toD=c.d,t=0,w=1):k.attr?t=k.attr(h):(t=parseFloat(a.getStyle(k,h))||0,"opacity"!==h&&(v="px"));w||(w=e);w&&w.match&&w.match("px")&&(w=w.replace(/px/g,""));r.run(t,w,v)})};a.seriesType=function(k,c,p,t,v){var w=a.getOptions(),r=a.seriesTypes;w.plotOptions[k]=a.merge(w.plotOptions[c],p);r[k]=a.extendClass(r[c]||
function(){},t);r[k].prototype.type=k;v&&(r[k].prototype.pointClass=a.extendClass(a.Point,v));return r[k]};a.uniqueKey=function(){var a=Math.random().toString(36).substring(2,9),c=0;return function(){return"highcharts-"+a+"-"+c++}}();a.isFunction=function(a){return"function"===typeof a};G.jQuery&&(G.jQuery.fn.highcharts=function(){var k=[].slice.call(arguments);if(this[0])return k[0]?(new (a[a.isString(k[0])?k.shift():"Chart"])(this[0],k[0],k[1]),this):y[a.attr(this[0],"data-highcharts-chart")]})})(I);
(function(a){var y=a.isNumber,F=a.merge,G=a.pInt;a.Color=function(k){if(!(this instanceof a.Color))return new a.Color(k);this.init(k)};a.Color.prototype={parsers:[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(a){return[G(a[1]),G(a[2]),G(a[3]),parseFloat(a[4],10)]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(a){return[G(a[1]),G(a[2]),G(a[3]),1]}}],names:{white:"#ffffff",black:"#000000"},
init:function(k){var c,p,t,v;if((this.input=k=this.names[k&&k.toLowerCase?k.toLowerCase():""]||k)&&k.stops)this.stops=k.stops.map(function(c){return new a.Color(c[1])});else if(k&&k.charAt&&"#"===k.charAt()&&(c=k.length,k=parseInt(k.substr(1),16),7===c?p=[(k&16711680)>>16,(k&65280)>>8,k&255,1]:4===c&&(p=[(k&3840)>>4|(k&3840)>>8,(k&240)>>4|k&240,(k&15)<<4|k&15,1])),!p)for(t=this.parsers.length;t--&&!p;)v=this.parsers[t],(c=v.regex.exec(k))&&(p=v.parse(c));this.rgba=p||[]},get:function(a){var c=this.input,
k=this.rgba,t;this.stops?(t=F(c),t.stops=[].concat(t.stops),this.stops.forEach(function(c,k){t.stops[k]=[t.stops[k][0],c.get(a)]})):t=k&&y(k[0])?"rgb"===a||!a&&1===k[3]?"rgb("+k[0]+","+k[1]+","+k[2]+")":"a"===a?k[3]:"rgba("+k.join(",")+")":c;return t},brighten:function(a){var c,k=this.rgba;if(this.stops)this.stops.forEach(function(c){c.brighten(a)});else if(y(a)&&0!==a)for(c=0;3>c;c++)k[c]+=G(255*a),0>k[c]&&(k[c]=0),255<k[c]&&(k[c]=255);return this},setOpacity:function(a){this.rgba[3]=a;return this},
tweenTo:function(a,c){var k=this.rgba,t=a.rgba;t.length&&k&&k.length?(a=1!==t[3]||1!==k[3],c=(a?"rgba(":"rgb(")+Math.round(t[0]+(k[0]-t[0])*(1-c))+","+Math.round(t[1]+(k[1]-t[1])*(1-c))+","+Math.round(t[2]+(k[2]-t[2])*(1-c))+(a?","+(t[3]+(k[3]-t[3])*(1-c)):"")+")"):c=a.input||"none";return c}};a.color=function(k){return new a.Color(k)}})(I);(function(a){var y,F,G=a.addEvent,k=a.animate,c=a.attr,p=a.charts,t=a.color,v=a.css,w=a.createElement,r=a.defined,h=a.deg2rad,e=a.destroyObjectProperties,l=a.doc,
n=a.extend,d=a.erase,g=a.hasTouch,b=a.isArray,x=a.isFirefox,u=a.isMS,H=a.isObject,E=a.isString,B=a.isWebKit,m=a.merge,z=a.noop,D=a.objectEach,A=a.pick,f=a.pInt,q=a.removeEvent,L=a.splat,K=a.stop,T=a.svg,J=a.SVG_NS,M=a.symbolSizes,R=a.win;y=a.SVGElement=function(){return this};n(y.prototype,{opacity:1,SVG_NS:J,textProps:"direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline cursor".split(" "),init:function(f,q){this.element="span"===
q?w(q):l.createElementNS(this.SVG_NS,q);this.renderer=f;a.fireEvent(this,"afterInit")},animate:function(f,q,d){var C=a.animObject(A(q,this.renderer.globalAnimation,!0));A(l.hidden,l.msHidden,l.webkitHidden,!1)&&(C.duration=0);0!==C.duration?(d&&(C.complete=d),k(this,f,C)):(this.attr(f,null,d),a.objectEach(f,function(a,f){C.step&&C.step.call(this,a,{prop:f,pos:1})},this));return this},complexColor:function(f,q,d){var C=this.renderer,g,e,n,h,J,z,l,P,x,c,u,K=[],L;a.fireEvent(this.renderer,"complexColor",
{args:arguments},function(){f.radialGradient?e="radialGradient":f.linearGradient&&(e="linearGradient");e&&(n=f[e],J=C.gradients,l=f.stops,c=d.radialReference,b(n)&&(f[e]=n={x1:n[0],y1:n[1],x2:n[2],y2:n[3],gradientUnits:"userSpaceOnUse"}),"radialGradient"===e&&c&&!r(n.gradientUnits)&&(h=n,n=m(n,C.getRadialAttr(c,h),{gradientUnits:"userSpaceOnUse"})),D(n,function(a,f){"id"!==f&&K.push(f,a)}),D(l,function(a){K.push(a)}),K=K.join(","),J[K]?u=J[K].attr("id"):(n.id=u=a.uniqueKey(),J[K]=z=C.createElement(e).attr(n).add(C.defs),
z.radAttr=h,z.stops=[],l.forEach(function(f){0===f[1].indexOf("rgba")?(g=a.color(f[1]),P=g.get("rgb"),x=g.get("a")):(P=f[1],x=1);f=C.createElement("stop").attr({offset:f[0],"stop-color":P,"stop-opacity":x}).add(z);z.stops.push(f)})),L="url("+C.url+"#"+u+")",d.setAttribute(q,L),d.gradient=K,f.toString=function(){return L})})},applyTextOutline:function(f){var C=this.element,q,b,g,e,m;-1!==f.indexOf("contrast")&&(f=f.replace(/contrast/g,this.renderer.getContrast(C.style.fill)));f=f.split(" ");b=f[f.length-
1];if((g=f[0])&&"none"!==g&&a.svg){this.fakeTS=!0;f=[].slice.call(C.getElementsByTagName("tspan"));this.ySetter=this.xSetter;g=g.replace(/(^[\d\.]+)(.*?)$/g,function(a,f,C){return 2*f+C});for(m=f.length;m--;)q=f[m],"highcharts-text-outline"===q.getAttribute("class")&&d(f,C.removeChild(q));e=C.firstChild;f.forEach(function(a,f){0===f&&(a.setAttribute("x",C.getAttribute("x")),f=C.getAttribute("y"),a.setAttribute("y",f||0),null===f&&C.setAttribute("y",0));a=a.cloneNode(1);c(a,{"class":"highcharts-text-outline",
fill:b,stroke:b,"stroke-width":g,"stroke-linejoin":"round"});C.insertBefore(a,e)})}},symbolCustomAttribs:"x y width height r start end innerR anchorX anchorY rounded".split(" "),attr:function(f,q,d,b){var C,g=this.element,e,m=this,n,h,J=this.symbolCustomAttribs;"string"===typeof f&&void 0!==q&&(C=f,f={},f[C]=q);"string"===typeof f?m=(this[f+"Getter"]||this._defaultGetter).call(this,f,g):(D(f,function(C,q){n=!1;b||K(this,q);this.symbolName&&-1!==a.inArray(q,J)&&(e||(this.symbolAttr(f),e=!0),n=!0);
!this.rotation||"x"!==q&&"y"!==q||(this.doTransform=!0);n||(h=this[q+"Setter"]||this._defaultSetter,h.call(this,C,q,g),!this.styledMode&&this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(q)&&this.updateShadows(q,C,h))},this),this.afterSetters());d&&d.call(this);return m},afterSetters:function(){this.doTransform&&(this.updateTransform(),this.doTransform=!1)},updateShadows:function(a,f,q){for(var C=this.shadows,d=C.length;d--;)q.call(C[d],"height"===a?Math.max(f-(C[d].cutHeight||
0),0):"d"===a?this.d:f,a,C[d])},addClass:function(a,f){var C=this.attr("class")||"";-1===C.indexOf(a)&&(f||(a=(C+(C?" ":"")+a).replace("  "," ")),this.attr("class",a));return this},hasClass:function(a){return-1!==(this.attr("class")||"").split(" ").indexOf(a)},removeClass:function(a){return this.attr("class",(this.attr("class")||"").replace(a,""))},symbolAttr:function(a){var f=this;"x y r start end width height innerR anchorX anchorY".split(" ").forEach(function(C){f[C]=A(a[C],f[C])});f.attr({d:f.renderer.symbols[f.symbolName](f.x,
f.y,f.width,f.height,f)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":"none")},crisp:function(a,f){var C;f=f||a.strokeWidth||0;C=Math.round(f)%2/2;a.x=Math.floor(a.x||this.x||0)+C;a.y=Math.floor(a.y||this.y||0)+C;a.width=Math.floor((a.width||this.width||0)-2*C);a.height=Math.floor((a.height||this.height||0)-2*C);r(a.strokeWidth)&&(a.strokeWidth=f);return a},css:function(a){var C=this.styles,q={},d=this.element,b,g="",e,m=!C,h=["textOutline","textOverflow",
"width"];a&&a.color&&(a.fill=a.color);C&&D(a,function(a,f){a!==C[f]&&(q[f]=a,m=!0)});m&&(C&&(a=n(C,q)),a&&(null===a.width||"auto"===a.width?delete this.textWidth:"text"===d.nodeName.toLowerCase()&&a.width&&(b=this.textWidth=f(a.width))),this.styles=a,b&&!T&&this.renderer.forExport&&delete a.width,d.namespaceURI===this.SVG_NS?(e=function(a,f){return"-"+f.toLowerCase()},D(a,function(a,f){-1===h.indexOf(f)&&(g+=f.replace(/([A-Z])/g,e)+":"+a+";")}),g&&c(d,"style",g)):v(d,a),this.added&&("text"===this.element.nodeName&&
this.renderer.buildText(this),a&&a.textOutline&&this.applyTextOutline(a.textOutline)));return this},getStyle:function(a){return R.getComputedStyle(this.element||this,"").getPropertyValue(a)},strokeWidth:function(){if(!this.renderer.styledMode)return this["stroke-width"]||0;var a=this.getStyle("stroke-width"),q;a.indexOf("px")===a.length-2?a=f(a):(q=l.createElementNS(J,"rect"),c(q,{width:a,"stroke-width":0}),this.element.parentNode.appendChild(q),a=q.getBBox().width,q.parentNode.removeChild(q));return a},
on:function(a,f){var C=this,q=C.element;g&&"click"===a?(q.ontouchstart=function(a){C.touchEventFired=Date.now();a.preventDefault();f.call(q,a)},q.onclick=function(a){(-1===R.navigator.userAgent.indexOf("Android")||1100<Date.now()-(C.touchEventFired||0))&&f.call(q,a)}):q["on"+a]=f;return this},setRadialReference:function(a){var f=this.renderer.gradients[this.element.gradient];this.element.radialReference=a;f&&f.radAttr&&f.animate(this.renderer.getRadialAttr(a,f.radAttr));return this},translate:function(a,
f){return this.attr({translateX:a,translateY:f})},invert:function(a){this.inverted=a;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,f=this.translateY||0,q=this.scaleX,d=this.scaleY,b=this.inverted,g=this.rotation,e=this.matrix,m=this.element;b&&(a+=this.width,f+=this.height);a=["translate("+a+","+f+")"];r(e)&&a.push("matrix("+e.join(",")+")");b?a.push("rotate(90) scale(-1,1)"):g&&a.push("rotate("+g+" "+A(this.rotationOriginX,m.getAttribute("x"),0)+" "+A(this.rotationOriginY,
m.getAttribute("y")||0)+")");(r(q)||r(d))&&a.push("scale("+A(q,1)+" "+A(d,1)+")");a.length&&m.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,f,q){var C,b,g,e,m={};b=this.renderer;g=b.alignedObjects;var n,h;if(a){if(this.alignOptions=a,this.alignByTranslate=f,!q||E(q))this.alignTo=C=q||"renderer",d(g,this),g.push(this),q=null}else a=this.alignOptions,f=this.alignByTranslate,C=this.alignTo;q=A(q,b[C],b);C=a.align;
b=a.verticalAlign;g=(q.x||0)+(a.x||0);e=(q.y||0)+(a.y||0);"right"===C?n=1:"center"===C&&(n=2);n&&(g+=(q.width-(a.width||0))/n);m[f?"translateX":"x"]=Math.round(g);"bottom"===b?h=1:"middle"===b&&(h=2);h&&(e+=(q.height-(a.height||0))/h);m[f?"translateY":"y"]=Math.round(e);this[this.placed?"animate":"attr"](m);this.placed=!0;this.alignAttr=m;return this},getBBox:function(a,f){var q,C=this.renderer,d,b=this.element,g=this.styles,e,m=this.textStr,J,z=C.cache,l=C.cacheKeys,x=b.namespaceURI===this.SVG_NS,
c;f=A(f,this.rotation);d=f*h;e=C.styledMode?b&&y.prototype.getStyle.call(b,"font-size"):g&&g.fontSize;r(m)&&(c=m.toString(),-1===c.indexOf("\x3c")&&(c=c.replace(/[0-9]/g,"0")),c+=["",f||0,e,this.textWidth,g&&g.textOverflow].join());c&&!a&&(q=z[c]);if(!q){if(x||C.forExport){try{(J=this.fakeTS&&function(a){[].forEach.call(b.querySelectorAll(".highcharts-text-outline"),function(f){f.style.display=a})})&&J("none"),q=b.getBBox?n({},b.getBBox()):{width:b.offsetWidth,height:b.offsetHeight},J&&J("")}catch(Y){}if(!q||
0>q.width)q={width:0,height:0}}else q=this.htmlGetBBox();C.isSVG&&(a=q.width,C=q.height,x&&(q.height=C={"11px,17":14,"13px,20":16}[g&&g.fontSize+","+Math.round(C)]||C),f&&(q.width=Math.abs(C*Math.sin(d))+Math.abs(a*Math.cos(d)),q.height=Math.abs(C*Math.cos(d))+Math.abs(a*Math.sin(d))));if(c&&0<q.height){for(;250<l.length;)delete z[l.shift()];z[c]||l.push(c);z[c]=q}}return q},show:function(a){return this.attr({visibility:a?"inherit":"visible"})},hide:function(){return this.attr({visibility:"hidden"})},
fadeOut:function(a){var f=this;f.animate({opacity:0},{duration:a||150,complete:function(){f.attr({y:-9999})}})},add:function(a){var f=this.renderer,q=this.element,C;a&&(this.parentGroup=a);this.parentInverted=a&&a.inverted;void 0!==this.textStr&&f.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)C=this.zIndexSetter();C||(a?a.element:f.box).appendChild(q);if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var f=a.parentNode;f&&f.removeChild(a)},destroy:function(){var a=
this,f=a.element||{},q=a.renderer,b=q.isSVG&&"SPAN"===f.nodeName&&a.parentGroup,g=f.ownerSVGElement,e=a.clipPath;f.onclick=f.onmouseout=f.onmouseover=f.onmousemove=f.point=null;K(a);e&&g&&([].forEach.call(g.querySelectorAll("[clip-path],[CLIP-PATH]"),function(a){var f=a.getAttribute("clip-path"),q=e.element.id;(-1<f.indexOf("(#"+q+")")||-1<f.indexOf('("#'+q+'")'))&&a.removeAttribute("clip-path")}),a.clipPath=e.destroy());if(a.stops){for(g=0;g<a.stops.length;g++)a.stops[g]=a.stops[g].destroy();a.stops=
null}a.safeRemoveChild(f);for(q.styledMode||a.destroyShadows();b&&b.div&&0===b.div.childNodes.length;)f=b.parentGroup,a.safeRemoveChild(b.div),delete b.div,b=f;a.alignTo&&d(q.alignedObjects,a);D(a,function(f,q){delete a[q]});return null},shadow:function(a,f,q){var d=[],C,b,g=this.element,e,m,n,h;if(!a)this.destroyShadows();else if(!this.shadows){m=A(a.width,3);n=(a.opacity||.15)/m;h=this.parentInverted?"(-1,-1)":"("+A(a.offsetX,1)+", "+A(a.offsetY,1)+")";for(C=1;C<=m;C++)b=g.cloneNode(0),e=2*m+1-
2*C,c(b,{stroke:a.color||"#000000","stroke-opacity":n*C,"stroke-width":e,transform:"translate"+h,fill:"none"}),b.setAttribute("class",(b.getAttribute("class")||"")+" highcharts-shadow"),q&&(c(b,"height",Math.max(c(b,"height")-e,0)),b.cutHeight=e),f?f.element.appendChild(b):g.parentNode&&g.parentNode.insertBefore(b,g),d.push(b);this.shadows=d}return this},destroyShadows:function(){(this.shadows||[]).forEach(function(a){this.safeRemoveChild(a)},this);this.shadows=void 0},xGetter:function(a){"circle"===
this.element.nodeName&&("x"===a?a="cx":"y"===a&&(a="cy"));return this._defaultGetter(a)},_defaultGetter:function(a){a=A(this[a+"Value"],this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,f,q){a&&a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");this[f]!==a&&(q.setAttribute(f,a),this[f]=a)},dashstyleSetter:function(a){var q,b=this["stroke-width"];"inherit"===b&&(b=1);if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot",
"3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(q=a.length;q--;)a[q]=f(a[q])*b;a=a.join(",").replace(/NaN/g,"none");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){var f={left:"start",center:"middle",right:"end"};f[a]&&(this.alignValue=a,this.element.setAttribute("text-anchor",f[a]))},opacitySetter:function(a,f,
q){this[f]=a;q.setAttribute(f,a)},titleSetter:function(a){var f=this.element.getElementsByTagName("title")[0];f||(f=l.createElementNS(this.SVG_NS,"title"),this.element.appendChild(f));f.firstChild&&f.removeChild(f.firstChild);f.appendChild(l.createTextNode(String(A(a),"").replace(/<[^>]*>/g,"").replace(/&lt;/g,"\x3c").replace(/&gt;/g,"\x3e")))},textSetter:function(a){a!==this.textStr&&(delete this.bBox,this.textStr=a,this.added&&this.renderer.buildText(this))},fillSetter:function(a,f,q){"string"===
typeof a?q.setAttribute(f,a):a&&this.complexColor(a,f,q)},visibilitySetter:function(a,f,q){"inherit"===a?q.removeAttribute(f):this[f]!==a&&q.setAttribute(f,a);this[f]=a},zIndexSetter:function(a,q){var b=this.renderer,d=this.parentGroup,g=(d||b).element||b.box,e,m=this.element,C,n,b=g===b.box;e=this.added;var h;r(a)?(m.setAttribute("data-z-index",a),a=+a,this[q]===a&&(e=!1)):r(this[q])&&m.removeAttribute("data-z-index");this[q]=a;if(e){(a=this.zIndex)&&d&&(d.handleZ=!0);q=g.childNodes;for(h=q.length-
1;0<=h&&!C;h--)if(d=q[h],e=d.getAttribute("data-z-index"),n=!r(e),d!==m)if(0>a&&n&&!b&&!h)g.insertBefore(m,q[h]),C=!0;else if(f(e)<=a||n&&(!r(a)||0<=a))g.insertBefore(m,q[h+1]||null),C=!0;C||(g.insertBefore(m,q[b?3:0]||null),C=!0)}return C},_defaultSetter:function(a,f,q){q.setAttribute(f,a)}});y.prototype.yGetter=y.prototype.xGetter;y.prototype.translateXSetter=y.prototype.translateYSetter=y.prototype.rotationSetter=y.prototype.verticalAlignSetter=y.prototype.rotationOriginXSetter=y.prototype.rotationOriginYSetter=
y.prototype.scaleXSetter=y.prototype.scaleYSetter=y.prototype.matrixSetter=function(a,f){this[f]=a;this.doTransform=!0};y.prototype["stroke-widthSetter"]=y.prototype.strokeSetter=function(a,f,q){this[f]=a;this.stroke&&this["stroke-width"]?(y.prototype.fillSetter.call(this,this.stroke,"stroke",q),q.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0):"stroke-width"===f&&0===a&&this.hasStroke&&(q.removeAttribute("stroke"),this.hasStroke=!1)};F=a.SVGRenderer=function(){this.init.apply(this,
arguments)};n(F.prototype,{Element:y,SVG_NS:J,init:function(a,f,q,b,d,g,e){var m;m=this.createElement("svg").attr({version:"1.1","class":"highcharts-root"});e||m.css(this.getStyle(b));b=m.element;a.appendChild(b);c(a,"dir","ltr");-1===a.innerHTML.indexOf("xmlns")&&c(b,"xmlns",this.SVG_NS);this.isSVG=!0;this.box=b;this.boxWrapper=m;this.alignedObjects=[];this.url=(x||B)&&l.getElementsByTagName("base").length?R.location.href.split("#")[0].replace(/<[^>]*>/g,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,
"%20"):"";this.createElement("desc").add().element.appendChild(l.createTextNode("Created with Highcharts 7.0.3"));this.defs=this.createElement("defs").add();this.allowHTML=g;this.forExport=d;this.styledMode=e;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(f,q,!1);var n;x&&a.getBoundingClientRect&&(f=function(){v(a,{left:0,top:0});n=a.getBoundingClientRect();v(a,{left:Math.ceil(n.left)-n.left+"px",top:Math.ceil(n.top)-n.top+"px"})},f(),this.unSubPixelFix=G(R,"resize",
f))},definition:function(a){function f(a,b){var d;L(a).forEach(function(a){var g=q.createElement(a.tagName),e={};D(a,function(a,f){"tagName"!==f&&"children"!==f&&"textContent"!==f&&(e[f]=a)});g.attr(e);g.add(b||q.defs);a.textContent&&g.element.appendChild(l.createTextNode(a.textContent));f(a.children||[],g);d=g});return d}var q=this;return f(a)},getStyle:function(a){return this.style=n({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},setStyle:function(a){this.boxWrapper.css(this.getStyle(a))},
isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();e(this.gradients||{});this.gradients=null;a&&(this.defs=a.destroy());this.unSubPixelFix&&this.unSubPixelFix();return this.alignedObjects=null},createElement:function(a){var f=new this.Element;f.init(this,a);return f},draw:z,getRadialAttr:function(a,f){return{cx:a[0]-a[2]/2+f.cx*a[2],cy:a[1]-a[2]/2+f.cy*a[2],r:f.r*a[2]}},truncate:function(a,f,q,b,d,
g,e){var m=this,n=a.rotation,h,C=b?1:0,J=(q||b).length,z=J,c=[],r=function(a){f.firstChild&&f.removeChild(f.firstChild);a&&f.appendChild(l.createTextNode(a))},x=function(g,n){n=n||g;if(void 0===c[n])if(f.getSubStringLength)try{c[n]=d+f.getSubStringLength(0,b?n+1:n)}catch(Z){}else m.getSpanWidth&&(r(e(q||b,g)),c[n]=d+m.getSpanWidth(a,f));return c[n]},u,D;a.rotation=0;u=x(f.textContent.length);if(D=d+u>g){for(;C<=J;)z=Math.ceil((C+J)/2),b&&(h=e(b,z)),u=x(z,h&&h.length-1),C===J?C=J+1:u>g?J=z-1:C=z;0===
J?r(""):q&&J===q.length-1||r(h||e(q||b,z))}b&&b.splice(0,z);a.actualWidth=u;a.rotation=n;return D},escapes:{"\x26":"\x26amp;","\x3c":"\x26lt;","\x3e":"\x26gt;","'":"\x26#39;",'"':"\x26quot;"},buildText:function(a){var q=a.element,b=this,d=b.forExport,g=A(a.textStr,"").toString(),e=-1!==g.indexOf("\x3c"),m=q.childNodes,n,h=c(q,"x"),C=a.styles,z=a.textWidth,r=C&&C.lineHeight,x=C&&C.textOutline,u=C&&"ellipsis"===C.textOverflow,K=C&&"nowrap"===C.whiteSpace,L=C&&C.fontSize,B,M,k=m.length,C=z&&!a.added&&
this.box,H=function(a){var g;b.styledMode||(g=/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:L||b.style.fontSize||12);return r?f(r):b.fontMetrics(g,a.getAttribute("style")?a:q).h},E=function(a,f){D(b.escapes,function(q,b){f&&-1!==f.indexOf(q)||(a=a.toString().replace(new RegExp(q,"g"),b))});return a},w=function(a,f){var q;q=a.indexOf("\x3c");a=a.substring(q,a.indexOf("\x3e")-q);q=a.indexOf(f+"\x3d");if(-1!==q&&(q=q+f.length+1,f=a.charAt(q),'"'===f||"'"===f))return a=a.substring(q+1),a.substring(0,
a.indexOf(f))};B=[g,u,K,r,x,L,z].join();if(B!==a.textCache){for(a.textCache=B;k--;)q.removeChild(m[k]);e||x||u||z||-1!==g.indexOf(" ")?(C&&C.appendChild(q),e?(g=b.styledMode?g.replace(/<(b|strong)>/g,'\x3cspan class\x3d"highcharts-strong"\x3e').replace(/<(i|em)>/g,'\x3cspan class\x3d"highcharts-emphasized"\x3e'):g.replace(/<(b|strong)>/g,'\x3cspan style\x3d"font-weight:bold"\x3e').replace(/<(i|em)>/g,'\x3cspan style\x3d"font-style:italic"\x3e'),g=g.replace(/<a/g,"\x3cspan").replace(/<\/(b|strong|i|em|a)>/g,
"\x3c/span\x3e").split(/<br.*?>/g)):g=[g],g=g.filter(function(a){return""!==a}),g.forEach(function(f,g){var e,m=0,C=0;f=f.replace(/^\s+|\s+$/g,"").replace(/<span/g,"|||\x3cspan").replace(/<\/span>/g,"\x3c/span\x3e|||");e=f.split("|||");e.forEach(function(f){if(""!==f||1===e.length){var r={},x=l.createElementNS(b.SVG_NS,"tspan"),D,A;(D=w(f,"class"))&&c(x,"class",D);if(D=w(f,"style"))D=D.replace(/(;| |^)color([ :])/,"$1fill$2"),c(x,"style",D);(A=w(f,"href"))&&!d&&(c(x,"onclick",'location.href\x3d"'+
A+'"'),c(x,"class","highcharts-anchor"),b.styledMode||v(x,{cursor:"pointer"}));f=E(f.replace(/<[a-zA-Z\/](.|\n)*?>/g,"")||" ");if(" "!==f){x.appendChild(l.createTextNode(f));m?r.dx=0:g&&null!==h&&(r.x=h);c(x,r);q.appendChild(x);!m&&M&&(!T&&d&&v(x,{display:"block"}),c(x,"dy",H(x)));if(z){var B=f.replace(/([^\^])-/g,"$1- ").split(" "),r=!K&&(1<e.length||g||1<B.length);A=0;var k=H(x);if(u)n=b.truncate(a,x,f,void 0,0,Math.max(0,z-parseInt(L||12,10)),function(a,f){return a.substring(0,f)+"\u2026"});else if(r)for(;B.length;)B.length&&
!K&&0<A&&(x=l.createElementNS(J,"tspan"),c(x,{dy:k,x:h}),D&&c(x,"style",D),x.appendChild(l.createTextNode(B.join(" ").replace(/- /g,"-"))),q.appendChild(x)),b.truncate(a,x,null,B,0===A?C:0,z,function(a,f){return B.slice(0,f).join(" ").replace(/- /g,"-")}),C=a.actualWidth,A++}m++}}});M=M||q.childNodes.length}),u&&n&&a.attr("title",E(a.textStr,["\x26lt;","\x26gt;"])),C&&C.removeChild(q),x&&a.applyTextOutline&&a.applyTextOutline(x)):q.appendChild(l.createTextNode(E(g)))}},getContrast:function(a){a=t(a).rgba;
a[0]*=1;a[1]*=1.2;a[2]*=.5;return 459<a[0]+a[1]+a[2]?"#000000":"#FFFFFF"},button:function(a,f,q,b,g,d,e,h,z){var C=this.label(a,f,q,z,null,null,null,null,"button"),J=0,x=this.styledMode;C.attr(m({padding:8,r:2},g));if(!x){var l,r,c,D;g=m({fill:"#f7f7f7",stroke:"#cccccc","stroke-width":1,style:{color:"#333333",cursor:"pointer",fontWeight:"normal"}},g);l=g.style;delete g.style;d=m(g,{fill:"#e6e6e6"},d);r=d.style;delete d.style;e=m(g,{fill:"#e6ebf5",style:{color:"#000000",fontWeight:"bold"}},e);c=e.style;
delete e.style;h=m(g,{style:{color:"#cccccc"}},h);D=h.style;delete h.style}G(C.element,u?"mouseover":"mouseenter",function(){3!==J&&C.setState(1)});G(C.element,u?"mouseout":"mouseleave",function(){3!==J&&C.setState(J)});C.setState=function(a){1!==a&&(C.state=J=a);C.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-"+["normal","hover","pressed","disabled"][a||0]);x||C.attr([g,d,e,h][a||0]).css([l,r,c,D][a||0])};x||C.attr(g).css(n({cursor:"default"},l));return C.on("click",
function(a){3!==J&&b.call(C,a)})},crispLine:function(a,f){a[1]===a[4]&&(a[1]=a[4]=Math.round(a[1])-f%2/2);a[2]===a[5]&&(a[2]=a[5]=Math.round(a[2])+f%2/2);return a},path:function(a){var f=this.styledMode?{}:{fill:"none"};b(a)?f.d=a:H(a)&&n(f,a);return this.createElement("path").attr(f)},circle:function(a,f,q){a=H(a)?a:void 0===a?{}:{x:a,y:f,r:q};f=this.createElement("circle");f.xSetter=f.ySetter=function(a,f,q){q.setAttribute("c"+f,a)};return f.attr(a)},arc:function(a,f,q,b,g,d){H(a)?(b=a,f=b.y,q=
b.r,a=b.x):b={innerR:b,start:g,end:d};a=this.symbol("arc",a,f,q,q,b);a.r=q;return a},rect:function(a,f,q,b,g,d){g=H(a)?a.r:g;var e=this.createElement("rect");a=H(a)?a:void 0===a?{}:{x:a,y:f,width:Math.max(q,0),height:Math.max(b,0)};this.styledMode||(void 0!==d&&(a.strokeWidth=d,a=e.crisp(a)),a.fill="none");g&&(a.r=g);e.rSetter=function(a,f,q){c(q,{rx:a,ry:a})};return e.attr(a)},setSize:function(a,f,q){var b=this.alignedObjects,g=b.length;this.width=a;this.height=f;for(this.boxWrapper.animate({width:a,
height:f},{step:function(){this.attr({viewBox:"0 0 "+this.attr("width")+" "+this.attr("height")})},duration:A(q,!0)?void 0:0});g--;)b[g].align()},g:function(a){var f=this.createElement("g");return a?f.attr({"class":"highcharts-"+a}):f},image:function(a,f,q,b,g,d){var e={preserveAspectRatio:"none"},m,h=function(a,f){a.setAttributeNS?a.setAttributeNS("http://www.w3.org/1999/xlink","href",f):a.setAttribute("hc-svg-href",f)},J=function(f){h(m.element,a);d.call(m,f)};1<arguments.length&&n(e,{x:f,y:q,width:b,
height:g});m=this.createElement("image").attr(e);d?(h(m.element,"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw\x3d\x3d"),e=new R.Image,G(e,"load",J),e.src=a,e.complete&&J({})):h(m.element,a);return m},symbol:function(a,f,q,b,g,d){var e=this,m,h=/^url\((.*?)\)$/,J=h.test(a),z=!J&&(this.symbols[a]?a:"circle"),x=z&&this.symbols[z],c=r(f)&&x&&x.call(this.symbols,Math.round(f),Math.round(q),b,g,d),C,u;x?(m=this.path(c),e.styledMode||m.attr("fill","none"),n(m,{symbolName:z,x:f,
y:q,width:b,height:g}),d&&n(m,d)):J&&(C=a.match(h)[1],m=this.image(C),m.imgwidth=A(M[C]&&M[C].width,d&&d.width),m.imgheight=A(M[C]&&M[C].height,d&&d.height),u=function(){m.attr({width:m.width,height:m.height})},["width","height"].forEach(function(a){m[a+"Setter"]=function(a,f){var q={},b=this["img"+f],g="width"===f?"translateX":"translateY";this[f]=a;r(b)&&(this.element&&this.element.setAttribute(f,b),this.alignByTranslate||(q[g]=((this[f]||0)-b)/2,this.attr(q)))}}),r(f)&&m.attr({x:f,y:q}),m.isImg=
!0,r(m.imgwidth)&&r(m.imgheight)?u():(m.attr({width:0,height:0}),w("img",{onload:function(){var a=p[e.chartIndex];0===this.width&&(v(this,{position:"absolute",top:"-999em"}),l.body.appendChild(this));M[C]={width:this.width,height:this.height};m.imgwidth=this.width;m.imgheight=this.height;m.element&&u();this.parentNode&&this.parentNode.removeChild(this);e.imgCount--;if(!e.imgCount&&a&&a.onload)a.onload()},src:C}),this.imgCount++));return m},symbols:{circle:function(a,f,q,b){return this.arc(a+q/2,f+
b/2,q/2,b/2,{start:0,end:2*Math.PI,open:!1})},square:function(a,f,q,b){return["M",a,f,"L",a+q,f,a+q,f+b,a,f+b,"Z"]},triangle:function(a,f,q,b){return["M",a+q/2,f,"L",a+q,f+b,a,f+b,"Z"]},"triangle-down":function(a,f,q,b){return["M",a,f,"L",a+q,f,a+q/2,f+b,"Z"]},diamond:function(a,f,q,b){return["M",a+q/2,f,"L",a+q,f+b/2,a+q/2,f+b,a,f+b/2,"Z"]},arc:function(a,f,q,b,g){var d=g.start,e=g.r||q,m=g.r||b||q,n=g.end-.001;q=g.innerR;b=A(g.open,.001>Math.abs(g.end-g.start-2*Math.PI));var h=Math.cos(d),J=Math.sin(d),
z=Math.cos(n),n=Math.sin(n);g=.001>g.end-d-Math.PI?0:1;e=["M",a+e*h,f+m*J,"A",e,m,0,g,1,a+e*z,f+m*n];r(q)&&e.push(b?"M":"L",a+q*z,f+q*n,"A",q,q,0,g,0,a+q*h,f+q*J);e.push(b?"":"Z");return e},callout:function(a,f,q,b,g){var d=Math.min(g&&g.r||0,q,b),e=d+6,m=g&&g.anchorX;g=g&&g.anchorY;var n;n=["M",a+d,f,"L",a+q-d,f,"C",a+q,f,a+q,f,a+q,f+d,"L",a+q,f+b-d,"C",a+q,f+b,a+q,f+b,a+q-d,f+b,"L",a+d,f+b,"C",a,f+b,a,f+b,a,f+b-d,"L",a,f+d,"C",a,f,a,f,a+d,f];m&&m>q?g>f+e&&g<f+b-e?n.splice(13,3,"L",a+q,g-6,a+q+6,
g,a+q,g+6,a+q,f+b-d):n.splice(13,3,"L",a+q,b/2,m,g,a+q,b/2,a+q,f+b-d):m&&0>m?g>f+e&&g<f+b-e?n.splice(33,3,"L",a,g+6,a-6,g,a,g-6,a,f+d):n.splice(33,3,"L",a,b/2,m,g,a,b/2,a,f+d):g&&g>b&&m>a+e&&m<a+q-e?n.splice(23,3,"L",m+6,f+b,m,f+b+6,m-6,f+b,a+d,f+b):g&&0>g&&m>a+e&&m<a+q-e&&n.splice(3,3,"L",m-6,f,m,f-6,m+6,f,q-d,f);return n}},clipRect:function(f,q,b,g){var d=a.uniqueKey(),e=this.createElement("clipPath").attr({id:d}).add(this.defs);f=this.rect(f,q,b,g,0).add(e);f.id=d;f.clipPath=e;f.count=0;return f},
text:function(a,f,q,b){var g={};if(b&&(this.allowHTML||!this.forExport))return this.html(a,f,q);g.x=Math.round(f||0);q&&(g.y=Math.round(q));r(a)&&(g.text=a);a=this.createElement("text").attr(g);b||(a.xSetter=function(a,f,q){var b=q.getElementsByTagName("tspan"),g,d=q.getAttribute(f),e;for(e=0;e<b.length;e++)g=b[e],g.getAttribute(f)===d&&g.setAttribute(f,a);q.setAttribute(f,a)});return a},fontMetrics:function(a,q){a=!this.styledMode&&/px/.test(a)||!R.getComputedStyle?a||q&&q.style&&q.style.fontSize||
this.style&&this.style.fontSize:q&&y.prototype.getStyle.call(q,"font-size");a=/px/.test(a)?f(a):12;q=24>a?a+3:Math.round(1.2*a);return{h:q,b:Math.round(.8*q),f:a}},rotCorr:function(a,f,q){var b=a;f&&q&&(b=Math.max(b*Math.cos(f*h),4));return{x:-a/3*Math.sin(f*h),y:b}},label:function(f,b,g,d,e,h,J,z,x){var l=this,c=l.styledMode,u=l.g("button"!==x&&"label"),D=u.text=l.text("",0,0,J).attr({zIndex:1}),K,L,C=0,A=3,B=0,M,k,E,H,T,w={},p,t,R=/^url\((.*?)\)$/.test(d),v=c||R,P=function(){return c?K.strokeWidth()%
2/2:(p?parseInt(p,10):0)%2/2},U,O,S;x&&u.addClass("highcharts-"+x);U=function(){var a=D.element.style,f={};L=(void 0===M||void 0===k||T)&&r(D.textStr)&&D.getBBox();u.width=(M||L.width||0)+2*A+B;u.height=(k||L.height||0)+2*A;t=A+Math.min(l.fontMetrics(a&&a.fontSize,D).b,L?L.height:Infinity);v&&(K||(u.box=K=l.symbols[d]||R?l.symbol(d):l.rect(),K.addClass(("button"===x?"":"highcharts-label-box")+(x?" highcharts-"+x+"-box":"")),K.add(u),a=P(),f.x=a,f.y=(z?-t:0)+a),f.width=Math.round(u.width),f.height=
Math.round(u.height),K.attr(n(f,w)),w={})};O=function(){var a=B+A,f;f=z?0:t;r(M)&&L&&("center"===T||"right"===T)&&(a+={center:.5,right:1}[T]*(M-L.width));if(a!==D.x||f!==D.y)D.attr("x",a),D.hasBoxWidthChanged&&(L=D.getBBox(!0),U()),void 0!==f&&D.attr("y",f);D.x=a;D.y=f};S=function(a,f){K?K.attr(a,f):w[a]=f};u.onAdd=function(){D.add(u);u.attr({text:f||0===f?f:"",x:b,y:g});K&&r(e)&&u.attr({anchorX:e,anchorY:h})};u.widthSetter=function(f){M=a.isNumber(f)?f:null};u.heightSetter=function(a){k=a};u["text-alignSetter"]=
function(a){T=a};u.paddingSetter=function(a){r(a)&&a!==A&&(A=u.padding=a,O())};u.paddingLeftSetter=function(a){r(a)&&a!==B&&(B=a,O())};u.alignSetter=function(a){a={left:0,center:.5,right:1}[a];a!==C&&(C=a,L&&u.attr({x:E}))};u.textSetter=function(a){void 0!==a&&D.textSetter(a);U();O()};u["stroke-widthSetter"]=function(a,f){a&&(v=!0);p=this["stroke-width"]=a;S(f,a)};c?u.rSetter=function(a,f){S(f,a)}:u.strokeSetter=u.fillSetter=u.rSetter=function(a,f){"r"!==f&&("fill"===f&&a&&(v=!0),u[f]=a);S(f,a)};
u.anchorXSetter=function(a,f){e=u.anchorX=a;S(f,Math.round(a)-P()-E)};u.anchorYSetter=function(a,f){h=u.anchorY=a;S(f,a-H)};u.xSetter=function(a){u.x=a;C&&(a-=C*((M||L.width)+2*A),u["forceAnimate:x"]=!0);E=Math.round(a);u.attr("translateX",E)};u.ySetter=function(a){H=u.y=Math.round(a);u.attr("translateY",H)};var G=u.css;J={css:function(a){if(a){var f={};a=m(a);u.textProps.forEach(function(q){void 0!==a[q]&&(f[q]=a[q],delete a[q])});D.css(f);"width"in f&&U();"fontSize"in f&&(U(),O())}return G.call(u,
a)},getBBox:function(){return{width:L.width+2*A,height:L.height+2*A,x:L.x-A,y:L.y-A}},destroy:function(){q(u.element,"mouseenter");q(u.element,"mouseleave");D&&(D=D.destroy());K&&(K=K.destroy());y.prototype.destroy.call(u);u=l=U=O=S=null}};c||(J.shadow=function(a){a&&(U(),K&&K.shadow(a));return u});return n(u,J)}});a.Renderer=F})(I);(function(a){var y=a.attr,F=a.createElement,G=a.css,k=a.defined,c=a.extend,p=a.isFirefox,t=a.isMS,v=a.isWebKit,w=a.pick,r=a.pInt,h=a.SVGElement,e=a.SVGRenderer,l=a.win;
c(h.prototype,{htmlCss:function(a){var d="SPAN"===this.element.tagName&&a&&"width"in a,g=w(d&&a.width,void 0),b;d&&(delete a.width,this.textWidth=g,b=!0);a&&"ellipsis"===a.textOverflow&&(a.whiteSpace="nowrap",a.overflow="hidden");this.styles=c(this.styles,a);G(this.element,a);b&&this.htmlUpdateTransform();return this},htmlGetBBox:function(){var a=this.element;return{x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,
d=this.element,g=this.translateX||0,b=this.translateY||0,e=this.x||0,h=this.y||0,l=this.textAlign||"left",c={left:0,center:.5,right:1}[l],B=this.styles,m=B&&B.whiteSpace;G(d,{marginLeft:g,marginTop:b});!a.styledMode&&this.shadows&&this.shadows.forEach(function(a){G(a,{marginLeft:g+1,marginTop:b+1})});this.inverted&&[].forEach.call(d.childNodes,function(f){a.invertChild(f,d)});if("SPAN"===d.tagName){var B=this.rotation,z=this.textWidth&&r(this.textWidth),D=[B,l,d.innerHTML,this.textWidth,this.textAlign].join(),
A;(A=z!==this.oldTextWidth)&&!(A=z>this.oldTextWidth)&&((A=this.textPxLength)||(G(d,{width:"",whiteSpace:m||"nowrap"}),A=d.offsetWidth),A=A>z);A&&(/[ \-]/.test(d.textContent||d.innerText)||"ellipsis"===d.style.textOverflow)?(G(d,{width:z+"px",display:"block",whiteSpace:m||"normal"}),this.oldTextWidth=z,this.hasBoxWidthChanged=!0):this.hasBoxWidthChanged=!1;D!==this.cTT&&(m=a.fontMetrics(d.style.fontSize,d).b,!k(B)||B===(this.oldRotation||0)&&l===this.oldAlign||this.setSpanRotation(B,c,m),this.getSpanCorrection(!k(B)&&
this.textPxLength||d.offsetWidth,m,c,B,l));G(d,{left:e+(this.xCorr||0)+"px",top:h+(this.yCorr||0)+"px"});this.cTT=D;this.oldRotation=B;this.oldAlign=l}}else this.alignOnAdd=!0},setSpanRotation:function(a,d,g){var b={},e=this.renderer.getTransformKey();b[e]=b.transform="rotate("+a+"deg)";b[e+(p?"Origin":"-origin")]=b.transformOrigin=100*d+"% "+g+"px";G(this.element,b)},getSpanCorrection:function(a,d,g){this.xCorr=-a*g;this.yCorr=-d}});c(e.prototype,{getTransformKey:function(){return t&&!/Edge/.test(l.navigator.userAgent)?
"-ms-transform":v?"-webkit-transform":p?"MozTransform":l.opera?"-o-transform":""},html:function(e,d,g){var b=this.createElement("span"),n=b.element,u=b.renderer,l=u.isSVG,r=function(a,b){["opacity","visibility"].forEach(function(g){a[g+"Setter"]=function(a,f,q){h.prototype[g+"Setter"].call(this,a,f,q);b[f]=a}});a.addedSetters=!0},B=a.charts[u.chartIndex],B=B&&B.styledMode;b.textSetter=function(a){a!==n.innerHTML&&delete this.bBox;this.textStr=a;n.innerHTML=w(a,"");b.doTransform=!0};l&&r(b,b.element.style);
b.xSetter=b.ySetter=b.alignSetter=b.rotationSetter=function(a,g){"align"===g&&(g="textAlign");b[g]=a;b.doTransform=!0};b.afterSetters=function(){this.doTransform&&(this.htmlUpdateTransform(),this.doTransform=!1)};b.attr({text:e,x:Math.round(d),y:Math.round(g)}).css({position:"absolute"});B||b.css({fontFamily:this.style.fontFamily,fontSize:this.style.fontSize});n.style.whiteSpace="nowrap";b.css=b.htmlCss;l&&(b.add=function(a){var g,d=u.box.parentNode,e=[];if(this.parentGroup=a){if(g=a.div,!g){for(;a;)e.push(a),
a=a.parentGroup;e.reverse().forEach(function(a){function f(f,q){a[q]=f;"translateX"===q?m.left=f+"px":m.top=f+"px";a.doTransform=!0}var m,h=y(a.element,"class");h&&(h={className:h});g=a.div=a.div||F("div",h,{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px",display:a.display,opacity:a.opacity,pointerEvents:a.styles&&a.styles.pointerEvents},g||d);m=g.style;c(a,{classSetter:function(a){return function(f){this.element.setAttribute("class",f);a.className=f}}(g),on:function(){e[0].div&&
b.on.apply({element:e[0].div},arguments);return a},translateXSetter:f,translateYSetter:f});a.addedSetters||r(a,m)})}}else g=d;g.appendChild(n);b.added=!0;b.alignOnAdd&&b.htmlUpdateTransform();return b});return b}})})(I);(function(a){var y=a.defined,F=a.extend,G=a.merge,k=a.pick,c=a.timeUnits,p=a.win;a.Time=function(a){this.update(a,!1)};a.Time.prototype={defaultOptions:{},update:function(a){var c=k(a&&a.useUTC,!0),w=this;this.options=a=G(!0,this.options||{},a);this.Date=a.Date||p.Date||Date;this.timezoneOffset=
(this.useUTC=c)&&a.timezoneOffset;this.getTimezoneOffset=this.timezoneOffsetFunction();(this.variableTimezone=!(c&&!a.getTimezoneOffset&&!a.timezone))||this.timezoneOffset?(this.get=function(a,h){var e=h.getTime(),l=e-w.getTimezoneOffset(h);h.setTime(l);a=h["getUTC"+a]();h.setTime(e);return a},this.set=function(a,h,e){var l;if("Milliseconds"===a||"Seconds"===a||"Minutes"===a&&0===h.getTimezoneOffset()%60)h["set"+a](e);else l=w.getTimezoneOffset(h),l=h.getTime()-l,h.setTime(l),h["setUTC"+a](e),a=w.getTimezoneOffset(h),
l=h.getTime()+a,h.setTime(l)}):c?(this.get=function(a,h){return h["getUTC"+a]()},this.set=function(a,h,e){return h["setUTC"+a](e)}):(this.get=function(a,h){return h["get"+a]()},this.set=function(a,h,e){return h["set"+a](e)})},makeTime:function(c,p,w,r,h,e){var l,n,d;this.useUTC?(l=this.Date.UTC.apply(0,arguments),n=this.getTimezoneOffset(l),l+=n,d=this.getTimezoneOffset(l),n!==d?l+=d-n:n-36E5!==this.getTimezoneOffset(l-36E5)||a.isSafari||(l-=36E5)):l=(new this.Date(c,p,k(w,1),k(r,0),k(h,0),k(e,0))).getTime();
return l},timezoneOffsetFunction:function(){var c=this,k=this.options,w=p.moment;if(!this.useUTC)return function(a){return 6E4*(new Date(a)).getTimezoneOffset()};if(k.timezone){if(w)return function(a){return 6E4*-w.tz(a,k.timezone).utcOffset()};a.error(25)}return this.useUTC&&k.getTimezoneOffset?function(a){return 6E4*k.getTimezoneOffset(a)}:function(){return 6E4*(c.timezoneOffset||0)}},dateFormat:function(c,k,w){if(!a.defined(k)||isNaN(k))return a.defaultOptions.lang.invalidDate||"";c=a.pick(c,"%Y-%m-%d %H:%M:%S");
var r=this,h=new this.Date(k),e=this.get("Hours",h),l=this.get("Day",h),n=this.get("Date",h),d=this.get("Month",h),g=this.get("FullYear",h),b=a.defaultOptions.lang,x=b.weekdays,u=b.shortWeekdays,H=a.pad,h=a.extend({a:u?u[l]:x[l].substr(0,3),A:x[l],d:H(n),e:H(n,2," "),w:l,b:b.shortMonths[d],B:b.months[d],m:H(d+1),o:d+1,y:g.toString().substr(2,2),Y:g,H:H(e),k:e,I:H(e%12||12),l:e%12||12,M:H(r.get("Minutes",h)),p:12>e?"AM":"PM",P:12>e?"am":"pm",S:H(h.getSeconds()),L:H(Math.floor(k%1E3),3)},a.dateFormats);
a.objectEach(h,function(a,b){for(;-1!==c.indexOf("%"+b);)c=c.replace("%"+b,"function"===typeof a?a.call(r,k):a)});return w?c.substr(0,1).toUpperCase()+c.substr(1):c},resolveDTLFormat:function(c){return a.isObject(c,!0)?c:(c=a.splat(c),{main:c[0],from:c[1],to:c[2]})},getTimeTicks:function(a,p,w,r){var h=this,e=[],l,n={},d;l=new h.Date(p);var g=a.unitRange,b=a.count||1,x;r=k(r,1);if(y(p)){h.set("Milliseconds",l,g>=c.second?0:b*Math.floor(h.get("Milliseconds",l)/b));g>=c.second&&h.set("Seconds",l,g>=
c.minute?0:b*Math.floor(h.get("Seconds",l)/b));g>=c.minute&&h.set("Minutes",l,g>=c.hour?0:b*Math.floor(h.get("Minutes",l)/b));g>=c.hour&&h.set("Hours",l,g>=c.day?0:b*Math.floor(h.get("Hours",l)/b));g>=c.day&&h.set("Date",l,g>=c.month?1:Math.max(1,b*Math.floor(h.get("Date",l)/b)));g>=c.month&&(h.set("Month",l,g>=c.year?0:b*Math.floor(h.get("Month",l)/b)),d=h.get("FullYear",l));g>=c.year&&h.set("FullYear",l,d-d%b);g===c.week&&(d=h.get("Day",l),h.set("Date",l,h.get("Date",l)-d+r+(d<r?-7:0)));d=h.get("FullYear",
l);r=h.get("Month",l);var u=h.get("Date",l),H=h.get("Hours",l);p=l.getTime();h.variableTimezone&&(x=w-p>4*c.month||h.getTimezoneOffset(p)!==h.getTimezoneOffset(w));p=l.getTime();for(l=1;p<w;)e.push(p),p=g===c.year?h.makeTime(d+l*b,0):g===c.month?h.makeTime(d,r+l*b):!x||g!==c.day&&g!==c.week?x&&g===c.hour&&1<b?h.makeTime(d,r,u,H+l*b):p+g*b:h.makeTime(d,r,u+l*b*(g===c.day?1:7)),l++;e.push(p);g<=c.hour&&1E4>e.length&&e.forEach(function(a){0===a%18E5&&"000000000"===h.dateFormat("%H%M%S%L",a)&&(n[a]="day")})}e.info=
F(a,{higherRanks:n,totalRange:g*b});return e}}})(I);(function(a){var y=a.color,F=a.merge;a.defaultOptions={colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{},time:a.Time.prototype.defaultOptions,chart:{styledMode:!1,borderRadius:0,colorCount:10,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],resetZoomButton:{theme:{zIndex:6},position:{align:"right",x:-10,y:10}},width:null,height:null,borderColor:"#335cad",backgroundColor:"#ffffff",plotBorderColor:"#cccccc"},title:{text:"Chart title",align:"center",
margin:15,widthAdjust:-44},subtitle:{text:"",align:"center",widthAdjust:-44},plotOptions:{},labels:{style:{position:"absolute",color:"#333333"}},legend:{enabled:!0,align:"center",alignColumns:!0,layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#999999",borderRadius:0,navigation:{activeColor:"#003399",inactiveColor:"#cccccc"},itemStyle:{color:"#333333",cursor:"pointer",fontSize:"12px",fontWeight:"bold",textOverflow:"ellipsis"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#cccccc"},
shadow:!1,itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},squareSymbol:!0,symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"#ffffff",opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,animation:a.svg,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",
day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",padding:8,snap:a.isTouchDevice?25:10,headerFormat:'\x3cspan style\x3d"font-size: 10px"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e',pointFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e',backgroundColor:y("#f7f7f7").setOpacity(.85).get(),borderWidth:1,shadow:!0,style:{color:"#333333",cursor:"default",fontSize:"12px",pointerEvents:"none",
whiteSpace:"nowrap"}},credits:{enabled:!0,href:"https://www.highcharts.com?credits",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#999999",fontSize:"9px"},text:"Highcharts.com"}};a.setOptions=function(y){a.defaultOptions=F(!0,a.defaultOptions,y);a.time.update(F(a.defaultOptions.global,a.defaultOptions.time),!1);return a.defaultOptions};a.getOptions=function(){return a.defaultOptions};a.defaultPlotOptions=a.defaultOptions.plotOptions;a.time=new a.Time(F(a.defaultOptions.global,
a.defaultOptions.time));a.dateFormat=function(y,k,c){return a.time.dateFormat(y,k,c)}})(I);(function(a){var y=a.correctFloat,F=a.defined,G=a.destroyObjectProperties,k=a.fireEvent,c=a.isNumber,p=a.merge,t=a.pick,v=a.deg2rad;a.Tick=function(a,c,h,e,l){this.axis=a;this.pos=c;this.type=h||"";this.isNewLabel=this.isNew=!0;this.parameters=l||{};this.tickmarkOffset=this.parameters.tickmarkOffset;this.options=this.parameters.options;h||e||this.addLabel()};a.Tick.prototype={addLabel:function(){var c=this,
r=c.axis,h=r.options,e=r.chart,l=r.categories,n=r.names,d=c.pos,g=t(c.options&&c.options.labels,h.labels),b=r.tickPositions,x=d===b[0],u=d===b[b.length-1],l=this.parameters.category||(l?t(l[d],n[d],d):d),k=c.label,b=b.info,E,B,m,z;r.isDatetimeAxis&&b&&(B=e.time.resolveDTLFormat(h.dateTimeLabelFormats[!h.grid&&b.higherRanks[d]||b.unitName]),E=B.main);c.isFirst=x;c.isLast=u;c.formatCtx={axis:r,chart:e,isFirst:x,isLast:u,dateTimeLabelFormat:E,tickPositionInfo:b,value:r.isLog?y(r.lin2log(l)):l,pos:d};
h=r.labelFormatter.call(c.formatCtx,this.formatCtx);if(z=B&&B.list)c.shortenLabel=function(){for(m=0;m<z.length;m++)if(k.attr({text:r.labelFormatter.call(a.extend(c.formatCtx,{dateTimeLabelFormat:z[m]}))}),k.getBBox().width<r.getSlotWidth(c)-2*t(g.padding,5))return;k.attr({text:""})};if(F(k))k&&k.textStr!==h&&(!k.textWidth||g.style&&g.style.width||k.styles.width||k.css({width:null}),k.attr({text:h}));else{if(c.label=k=F(h)&&g.enabled?e.renderer.text(h,0,0,g.useHTML).add(r.labelGroup):null)e.styledMode||
k.css(p(g.style)),k.textPxLength=k.getBBox().width;c.rotation=0}},getLabelSize:function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0},handleOverflow:function(a){var c=this.axis,h=c.options.labels,e=a.x,l=c.chart.chartWidth,n=c.chart.spacing,d=t(c.labelLeft,Math.min(c.pos,n[3])),n=t(c.labelRight,Math.max(c.isRadial?0:c.pos+c.len,l-n[1])),g=this.label,b=this.rotation,x={left:0,center:.5,right:1}[c.labelAlign||g.attr("align")],u=g.getBBox().width,k=c.getSlotWidth(this),
E=k,B=1,m,z={};if(b||"justify"!==t(h.overflow,"justify"))0>b&&e-x*u<d?m=Math.round(e/Math.cos(b*v)-d):0<b&&e+x*u>n&&(m=Math.round((l-e)/Math.cos(b*v)));else if(l=e+(1-x)*u,e-x*u<d?E=a.x+E*(1-x)-d:l>n&&(E=n-a.x+E*x,B=-1),E=Math.min(k,E),E<k&&"center"===c.labelAlign&&(a.x+=B*(k-E-x*(k-Math.min(u,E)))),u>E||c.autoRotation&&(g.styles||{}).width)m=E;m&&(this.shortenLabel?this.shortenLabel():(z.width=Math.floor(m),(h.style||{}).textOverflow||(z.textOverflow="ellipsis"),g.css(z)))},getPosition:function(c,
r,h,e){var l=this.axis,n=l.chart,d=e&&n.oldChartHeight||n.chartHeight;c={x:c?a.correctFloat(l.translate(r+h,null,null,e)+l.transB):l.left+l.offset+(l.opposite?(e&&n.oldChartWidth||n.chartWidth)-l.right-l.left:0),y:c?d-l.bottom+l.offset-(l.opposite?l.height:0):a.correctFloat(d-l.translate(r+h,null,null,e)-l.transB)};k(this,"afterGetPosition",{pos:c});return c},getLabelPosition:function(a,c,h,e,l,n,d,g){var b=this.axis,x=b.transA,u=b.reversed,r=b.staggerLines,E=b.tickRotCorr||{x:0,y:0},B=l.y,m=e||b.reserveSpaceDefault?
0:-b.labelOffset*("center"===b.labelAlign?.5:1),z={};F(B)||(B=0===b.side?h.rotation?-8:-h.getBBox().height:2===b.side?E.y+8:Math.cos(h.rotation*v)*(E.y-h.getBBox(!1,0).height/2));a=a+l.x+m+E.x-(n&&e?n*x*(u?-1:1):0);c=c+B-(n&&!e?n*x*(u?1:-1):0);r&&(h=d/(g||1)%r,b.opposite&&(h=r-h-1),c+=b.labelOffset/r*h);z.x=a;z.y=Math.round(c);k(this,"afterGetLabelPosition",{pos:z,tickmarkOffset:n,index:d});return z},getMarkPath:function(a,c,h,e,l,n){return n.crispLine(["M",a,c,"L",a+(l?0:-h),c+(l?h:0)],e)},renderGridLine:function(a,
c,h){var e=this.axis,l=e.options,n=this.gridLine,d={},g=this.pos,b=this.type,x=t(this.tickmarkOffset,e.tickmarkOffset),u=e.chart.renderer,r=b?b+"Grid":"grid",k=l[r+"LineWidth"],B=l[r+"LineColor"],l=l[r+"LineDashStyle"];n||(e.chart.styledMode||(d.stroke=B,d["stroke-width"]=k,l&&(d.dashstyle=l)),b||(d.zIndex=1),a&&(c=0),this.gridLine=n=u.path().attr(d).addClass("highcharts-"+(b?b+"-":"")+"grid-line").add(e.gridGroup));if(n&&(h=e.getPlotLinePath(g+x,n.strokeWidth()*h,a,"pass")))n[a||this.isNew?"attr":
"animate"]({d:h,opacity:c})},renderMark:function(a,c,h){var e=this.axis,l=e.options,n=e.chart.renderer,d=this.type,g=d?d+"Tick":"tick",b=e.tickSize(g),x=this.mark,u=!x,r=a.x;a=a.y;var k=t(l[g+"Width"],!d&&e.isXAxis?1:0),l=l[g+"Color"];b&&(e.opposite&&(b[0]=-b[0]),u&&(this.mark=x=n.path().addClass("highcharts-"+(d?d+"-":"")+"tick").add(e.axisGroup),e.chart.styledMode||x.attr({stroke:l,"stroke-width":k})),x[u?"attr":"animate"]({d:this.getMarkPath(r,a,b[0],x.strokeWidth()*h,e.horiz,n),opacity:c}))},
renderLabel:function(a,r,h,e){var l=this.axis,n=l.horiz,d=l.options,g=this.label,b=d.labels,x=b.step,l=t(this.tickmarkOffset,l.tickmarkOffset),u=!0,k=a.x;a=a.y;g&&c(k)&&(g.xy=a=this.getLabelPosition(k,a,g,n,b,l,e,x),this.isFirst&&!this.isLast&&!t(d.showFirstLabel,1)||this.isLast&&!this.isFirst&&!t(d.showLastLabel,1)?u=!1:!n||b.step||b.rotation||r||0===h||this.handleOverflow(a),x&&e%x&&(u=!1),u&&c(a.y)?(a.opacity=h,g[this.isNewLabel?"attr":"animate"](a),this.isNewLabel=!1):(g.attr("y",-9999),this.isNewLabel=
!0))},render:function(c,r,h){var e=this.axis,l=e.horiz,n=this.pos,d=t(this.tickmarkOffset,e.tickmarkOffset),n=this.getPosition(l,n,d,r),d=n.x,g=n.y,e=l&&d===e.pos+e.len||!l&&g===e.pos?-1:1;h=t(h,1);this.isActive=!0;this.renderGridLine(r,h,e);this.renderMark(n,h,e);this.renderLabel(n,r,h,c);this.isNew=!1;a.fireEvent(this,"afterRender")},destroy:function(){G(this,this.axis)}}})(I);var X=function(a){var y=a.addEvent,F=a.animObject,G=a.arrayMax,k=a.arrayMin,c=a.color,p=a.correctFloat,t=a.defaultOptions,
v=a.defined,w=a.deg2rad,r=a.destroyObjectProperties,h=a.extend,e=a.fireEvent,l=a.format,n=a.getMagnitude,d=a.isArray,g=a.isNumber,b=a.isString,x=a.merge,u=a.normalizeTickInterval,H=a.objectEach,E=a.pick,B=a.removeEvent,m=a.splat,z=a.syncTimeout,D=a.Tick,A=function(){this.init.apply(this,arguments)};a.extend(A.prototype,{defaultOptions:{dateTimeLabelFormats:{millisecond:{main:"%H:%M:%S.%L",range:!1},second:{main:"%H:%M:%S",range:!1},minute:{main:"%H:%M",range:!1},hour:{main:"%H:%M",range:!1},day:{main:"%e. %b"},
week:{main:"%e. %b"},month:{main:"%b '%y"},year:{main:"%Y"}},endOnTick:!1,labels:{enabled:!0,indentation:10,x:0,style:{color:"#666666",cursor:"default",fontSize:"11px"}},maxPadding:.01,minorTickLength:2,minorTickPosition:"outside",minPadding:.01,startOfWeek:1,startOnTick:!1,tickLength:10,tickPixelInterval:100,tickmarkPlacement:"between",tickPosition:"outside",title:{align:"middle",style:{color:"#666666"}},type:"linear",minorGridLineColor:"#f2f2f2",minorGridLineWidth:1,minorTickColor:"#999999",lineColor:"#ccd6eb",
lineWidth:1,gridLineColor:"#e6e6e6",tickColor:"#ccd6eb"},defaultYAxisOptions:{endOnTick:!0,maxPadding:.05,minPadding:.05,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{allowOverlap:!1,enabled:!1,formatter:function(){return a.numberFormat(this.total,-1)},style:{color:"#000000",fontSize:"11px",fontWeight:"bold",textOutline:"1px contrast"}},gridLineWidth:1,lineWidth:0},defaultLeftAxisOptions:{labels:{x:-15},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15},
title:{rotation:90}},defaultBottomAxisOptions:{labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}},defaultTopAxisOptions:{labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}},init:function(a,q){var f=q.isX,b=this;b.chart=a;b.horiz=a.inverted&&!b.isZAxis?!f:f;b.isXAxis=f;b.coll=b.coll||(f?"xAxis":"yAxis");e(this,"init",{userOptions:q});b.opposite=q.opposite;b.side=q.side||(b.horiz?b.opposite?0:2:b.opposite?1:3);b.setOptions(q);var g=this.options,d=g.type;b.labelFormatter=g.labels.formatter||
b.defaultLabelFormatter;b.userOptions=q;b.minPixelPadding=0;b.reversed=g.reversed;b.visible=!1!==g.visible;b.zoomEnabled=!1!==g.zoomEnabled;b.hasNames="category"===d||!0===g.categories;b.categories=g.categories||b.hasNames;b.names||(b.names=[],b.names.keys={});b.plotLinesAndBandsGroups={};b.isLog="logarithmic"===d;b.isDatetimeAxis="datetime"===d;b.positiveValuesOnly=b.isLog&&!b.allowNegativeLog;b.isLinked=v(g.linkedTo);b.ticks={};b.labelEdge=[];b.minorTicks={};b.plotLinesAndBands=[];b.alternateBands=
{};b.len=0;b.minRange=b.userMinRange=g.minRange||g.maxZoom;b.range=g.range;b.offset=g.offset||0;b.stacks={};b.oldStacks={};b.stacksTouched=0;b.max=null;b.min=null;b.crosshair=E(g.crosshair,m(a.options.tooltip.crosshairs)[f?0:1],!1);q=b.options.events;-1===a.axes.indexOf(b)&&(f?a.axes.splice(a.xAxis.length,0,b):a.axes.push(b),a[b.coll].push(b));b.series=b.series||[];a.inverted&&!b.isZAxis&&f&&void 0===b.reversed&&(b.reversed=!0);H(q,function(a,f){y(b,f,a)});b.lin2log=g.linearToLogConverter||b.lin2log;
b.isLog&&(b.val2lin=b.log2lin,b.lin2val=b.lin2log);e(this,"afterInit")},setOptions:function(a){this.options=x(this.defaultOptions,"yAxis"===this.coll&&this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],x(t[this.coll],a));e(this,"afterSetOptions",{userOptions:a})},defaultLabelFormatter:function(){var f=this.axis,q=this.value,b=f.chart.time,g=f.categories,d=this.dateTimeLabelFormat,e=t.lang,m=e.numericSymbols,
e=e.numericSymbolMagnitude||1E3,h=m&&m.length,n,c=f.options.labels.format,f=f.isLog?Math.abs(q):f.tickInterval;if(c)n=l(c,this,b);else if(g)n=q;else if(d)n=b.dateFormat(d,q);else if(h&&1E3<=f)for(;h--&&void 0===n;)b=Math.pow(e,h+1),f>=b&&0===10*q%b&&null!==m[h]&&0!==q&&(n=a.numberFormat(q/b,-1)+m[h]);void 0===n&&(n=1E4<=Math.abs(q)?a.numberFormat(q,-1):a.numberFormat(q,-1,void 0,""));return n},getSeriesExtremes:function(){var a=this,q=a.chart;e(this,"getSeriesExtremes",null,function(){a.hasVisibleSeries=
!1;a.dataMin=a.dataMax=a.threshold=null;a.softThreshold=!a.isXAxis;a.buildStacks&&a.buildStacks();a.series.forEach(function(f){if(f.visible||!q.options.chart.ignoreHiddenSeries){var b=f.options,d=b.threshold,e;a.hasVisibleSeries=!0;a.positiveValuesOnly&&0>=d&&(d=null);if(a.isXAxis)b=f.xData,b.length&&(f=k(b),e=G(b),g(f)||f instanceof Date||(b=b.filter(g),f=k(b),e=G(b)),b.length&&(a.dataMin=Math.min(E(a.dataMin,b[0],f),f),a.dataMax=Math.max(E(a.dataMax,b[0],e),e)));else if(f.getExtremes(),e=f.dataMax,
f=f.dataMin,v(f)&&v(e)&&(a.dataMin=Math.min(E(a.dataMin,f),f),a.dataMax=Math.max(E(a.dataMax,e),e)),v(d)&&(a.threshold=d),!b.softThreshold||a.positiveValuesOnly)a.softThreshold=!1}})});e(this,"afterGetSeriesExtremes")},translate:function(a,q,b,d,e,m){var f=this.linkedParent||this,h=1,n=0,c=d?f.oldTransA:f.transA;d=d?f.oldMin:f.min;var u=f.minPixelPadding;e=(f.isOrdinal||f.isBroken||f.isLog&&e)&&f.lin2val;c||(c=f.transA);b&&(h*=-1,n=f.len);f.reversed&&(h*=-1,n-=h*(f.sector||f.len));q?(a=(a*h+n-u)/
c+d,e&&(a=f.lin2val(a))):(e&&(a=f.val2lin(a)),a=g(d)?h*(a-d)*c+n+h*u+(g(m)?c*m:0):void 0);return a},toPixels:function(a,q){return this.translate(a,!1,!this.horiz,null,!0)+(q?0:this.pos)},toValue:function(a,q){return this.translate(a-(q?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,q,b,d,m){var f=this,h=f.chart,n=f.left,c=f.top,u,l,z,x,D=b&&h.oldChartHeight||h.chartHeight,r=b&&h.oldChartWidth||h.chartWidth,k,L=f.transB,A,B=function(a,f,q){if("pass"!==d&&a<f||a>q)d?a=Math.min(Math.max(f,
a),q):k=!0;return a};A={value:a,lineWidth:q,old:b,force:d,translatedValue:m};e(this,"getPlotLinePath",A,function(e){m=E(m,f.translate(a,null,null,b));m=Math.min(Math.max(-1E5,m),1E5);u=z=Math.round(m+L);l=x=Math.round(D-m-L);g(m)?f.horiz?(l=c,x=D-f.bottom,u=z=B(u,n,n+f.width)):(u=n,z=r-f.right,l=x=B(l,c,c+f.height)):(k=!0,d=!1);e.path=k&&!d?null:h.renderer.crispLine(["M",u,l,"L",z,x],q||1)});return A.path},getLinearTickPositions:function(a,q,b){var f,g=p(Math.floor(q/a)*a);b=p(Math.ceil(b/a)*a);var d=
[],e;p(g+a)===g&&(e=20);if(this.single)return[q];for(q=g;q<=b;){d.push(q);q=p(q+a,e);if(q===f)break;f=q}return d},getMinorTickInterval:function(){var a=this.options;return!0===a.minorTicks?E(a.minorTickInterval,"auto"):!1===a.minorTicks?null:a.minorTickInterval},getMinorTickPositions:function(){var a=this,q=a.options,b=a.tickPositions,g=a.minorTickInterval,d=[],e=a.pointRangePadding||0,m=a.min-e,e=a.max+e,h=e-m;if(h&&h/g<a.len/3)if(a.isLog)this.paddedTicks.forEach(function(f,q,b){q&&d.push.apply(d,
a.getLogTickPositions(g,b[q-1],b[q],!0))});else if(a.isDatetimeAxis&&"auto"===this.getMinorTickInterval())d=d.concat(a.getTimeTicks(a.normalizeTimeTickInterval(g),m,e,q.startOfWeek));else for(q=m+(b[0]-m)%g;q<=e&&q!==d[0];q+=g)d.push(q);0!==d.length&&a.trimTicks(d);return d},adjustForMinRange:function(){var a=this.options,q=this.min,b=this.max,g,d,e,m,h,n,c,u;this.isXAxis&&void 0===this.minRange&&!this.isLog&&(v(a.min)||v(a.max)?this.minRange=null:(this.series.forEach(function(a){n=a.xData;for(m=
c=a.xIncrement?1:n.length-1;0<m;m--)if(h=n[m]-n[m-1],void 0===e||h<e)e=h}),this.minRange=Math.min(5*e,this.dataMax-this.dataMin)));b-q<this.minRange&&(d=this.dataMax-this.dataMin>=this.minRange,u=this.minRange,g=(u-b+q)/2,g=[q-g,E(a.min,q-g)],d&&(g[2]=this.isLog?this.log2lin(this.dataMin):this.dataMin),q=G(g),b=[q+u,E(a.max,q+u)],d&&(b[2]=this.isLog?this.log2lin(this.dataMax):this.dataMax),b=k(b),b-q<u&&(g[0]=b-u,g[1]=E(a.min,b-u),q=G(g)));this.min=q;this.max=b},getClosest:function(){var a;this.categories?
a=1:this.series.forEach(function(f){var q=f.closestPointRange,b=f.visible||!f.chart.options.chart.ignoreHiddenSeries;!f.noSharedTooltip&&v(q)&&b&&(a=v(a)?Math.min(a,q):q)});return a},nameToX:function(a){var f=d(this.categories),b=f?this.categories:this.names,g=a.options.x,e;a.series.requireSorting=!1;v(g)||(g=!1===this.options.uniqueNames?a.series.autoIncrement():f?b.indexOf(a.name):E(b.keys[a.name],-1));-1===g?f||(e=b.length):e=g;void 0!==e&&(this.names[e]=a.name,this.names.keys[a.name]=e);return e},
updateNames:function(){var a=this,q=this.names;0<q.length&&(Object.keys(q.keys).forEach(function(a){delete q.keys[a]}),q.length=0,this.minRange=this.userMinRange,(this.series||[]).forEach(function(f){f.xIncrement=null;if(!f.points||f.isDirtyData)a.max=Math.max(a.max,f.xData.length-1),f.processData(),f.generatePoints();f.data.forEach(function(q,b){var g;q&&q.options&&void 0!==q.name&&(g=a.nameToX(q),void 0!==g&&g!==q.x&&(q.x=g,f.xData[b]=g))})}))},setAxisTranslation:function(a){var f=this,g=f.max-
f.min,d=f.axisPointRange||0,m,h=0,n=0,c=f.linkedParent,u=!!f.categories,l=f.transA,z=f.isXAxis;if(z||u||d)m=f.getClosest(),c?(h=c.minPointOffset,n=c.pointRangePadding):f.series.forEach(function(a){var q=u?1:z?E(a.options.pointRange,m,0):f.axisPointRange||0;a=a.options.pointPlacement;d=Math.max(d,q);f.single||(h=Math.max(h,z&&b(a)?0:q/2),n=Math.max(n,z&&"on"===a?0:q))}),c=f.ordinalSlope&&m?f.ordinalSlope/m:1,f.minPointOffset=h*=c,f.pointRangePadding=n*=c,f.pointRange=Math.min(d,g),z&&(f.closestPointRange=
m);a&&(f.oldTransA=l);f.translationSlope=f.transA=l=f.staticScale||f.len/(g+n||1);f.transB=f.horiz?f.left:f.bottom;f.minPixelPadding=l*h;e(this,"afterSetAxisTranslation")},minFromRange:function(){return this.max-this.range},setTickInterval:function(f){var b=this,d=b.chart,m=b.options,h=b.isLog,c=b.isDatetimeAxis,l=b.isXAxis,z=b.isLinked,x=m.maxPadding,D=m.minPadding,r,k=m.tickInterval,A=m.tickPixelInterval,B=b.categories,H=g(b.threshold)?b.threshold:null,w=b.softThreshold,t,y,G;c||B||z||this.getTickAmount();
y=E(b.userMin,m.min);G=E(b.userMax,m.max);z?(b.linkedParent=d[b.coll][m.linkedTo],r=b.linkedParent.getExtremes(),b.min=E(r.min,r.dataMin),b.max=E(r.max,r.dataMax),m.type!==b.linkedParent.options.type&&a.error(11,1,d)):(!w&&v(H)&&(b.dataMin>=H?(r=H,D=0):b.dataMax<=H&&(t=H,x=0)),b.min=E(y,r,b.dataMin),b.max=E(G,t,b.dataMax));h&&(b.positiveValuesOnly&&!f&&0>=Math.min(b.min,E(b.dataMin,b.min))&&a.error(10,1,d),b.min=p(b.log2lin(b.min),15),b.max=p(b.log2lin(b.max),15));b.range&&v(b.max)&&(b.userMin=b.min=
y=Math.max(b.dataMin,b.minFromRange()),b.userMax=G=b.max,b.range=null);e(b,"foundExtremes");b.beforePadding&&b.beforePadding();b.adjustForMinRange();!(B||b.axisPointRange||b.usePercentage||z)&&v(b.min)&&v(b.max)&&(d=b.max-b.min)&&(!v(y)&&D&&(b.min-=d*D),!v(G)&&x&&(b.max+=d*x));g(m.softMin)&&!g(b.userMin)&&(b.min=Math.min(b.min,m.softMin));g(m.softMax)&&!g(b.userMax)&&(b.max=Math.max(b.max,m.softMax));g(m.floor)&&(b.min=Math.min(Math.max(b.min,m.floor),Number.MAX_VALUE));g(m.ceiling)&&(b.max=Math.max(Math.min(b.max,
m.ceiling),E(b.userMax,-Number.MAX_VALUE)));w&&v(b.dataMin)&&(H=H||0,!v(y)&&b.min<H&&b.dataMin>=H?b.min=H:!v(G)&&b.max>H&&b.dataMax<=H&&(b.max=H));b.tickInterval=b.min===b.max||void 0===b.min||void 0===b.max?1:z&&!k&&A===b.linkedParent.options.tickPixelInterval?k=b.linkedParent.tickInterval:E(k,this.tickAmount?(b.max-b.min)/Math.max(this.tickAmount-1,1):void 0,B?1:(b.max-b.min)*A/Math.max(b.len,A));l&&!f&&b.series.forEach(function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);
b.beforeSetTickPositions&&b.beforeSetTickPositions();b.postProcessTickInterval&&(b.tickInterval=b.postProcessTickInterval(b.tickInterval));b.pointRange&&!k&&(b.tickInterval=Math.max(b.pointRange,b.tickInterval));f=E(m.minTickInterval,b.isDatetimeAxis&&b.closestPointRange);!k&&b.tickInterval<f&&(b.tickInterval=f);c||h||k||(b.tickInterval=u(b.tickInterval,null,n(b.tickInterval),E(m.allowDecimals,!(.5<b.tickInterval&&5>b.tickInterval&&1E3<b.max&&9999>b.max)),!!this.tickAmount));this.tickAmount||(b.tickInterval=
b.unsquish());this.setTickPositions()},setTickPositions:function(){var f=this.options,b,g=f.tickPositions;b=this.getMinorTickInterval();var d=f.tickPositioner,m=f.startOnTick,h=f.endOnTick;this.tickmarkOffset=this.categories&&"between"===f.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===b&&this.tickInterval?this.tickInterval/5:b;this.single=this.min===this.max&&v(this.min)&&!this.tickAmount&&(parseInt(this.min,10)===this.min||!1!==f.allowDecimals);this.tickPositions=
b=g&&g.slice();!b&&(!this.ordinalPositions&&(this.max-this.min)/this.tickInterval>Math.max(2*this.len,200)?(b=[this.min,this.max],a.error(19,!1,this.chart)):b=this.isDatetimeAxis?this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,f.units),this.min,this.max,f.startOfWeek,this.ordinalPositions,this.closestPointRange,!0):this.isLog?this.getLogTickPositions(this.tickInterval,this.min,this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max),b.length>this.len&&(b=[b[0],
b.pop()],b[0]===b[1]&&(b.length=1)),this.tickPositions=b,d&&(d=d.apply(this,[this.min,this.max])))&&(this.tickPositions=b=d);this.paddedTicks=b.slice(0);this.trimTicks(b,m,h);this.isLinked||(this.single&&2>b.length&&(this.min-=.5,this.max+=.5),g||d||this.adjustTickAmount());e(this,"afterSetTickPositions")},trimTicks:function(a,b,g){var f=a[0],d=a[a.length-1],q=this.minPointOffset||0;e(this,"trimTicks");if(!this.isLinked){if(b&&-Infinity!==f)this.min=f;else for(;this.min-q>a[0];)a.shift();if(g)this.max=
d;else for(;this.max+q<a[a.length-1];)a.pop();0===a.length&&v(f)&&!this.options.tickPositions&&a.push((d+f)/2)}},alignToOthers:function(){var a={},b,g=this.options;!1===this.chart.options.chart.alignTicks||!1===g.alignTicks||!1===g.startOnTick||!1===g.endOnTick||this.isLog||this.chart[this.coll].forEach(function(f){var g=f.options,g=[f.horiz?g.left:g.top,g.width,g.height,g.pane].join();f.series.length&&(a[g]?b=!0:a[g]=1)});return b},getTickAmount:function(){var a=this.options,b=a.tickAmount,g=a.tickPixelInterval;
!v(a.tickInterval)&&this.len<g&&!this.isRadial&&!this.isLog&&a.startOnTick&&a.endOnTick&&(b=2);!b&&this.alignToOthers()&&(b=Math.ceil(this.len/g)+1);4>b&&(this.finalTickAmt=b,b=5);this.tickAmount=b},adjustTickAmount:function(){var a=this.options,b=this.tickInterval,g=this.tickPositions,d=this.tickAmount,e=this.finalTickAmt,m=g&&g.length,h=E(this.threshold,this.softThreshold?0:null),n;if(this.hasData()){if(m<d){for(n=this.min;g.length<d;)g.length%2||n===h?g.push(p(g[g.length-1]+b)):g.unshift(p(g[0]-
b));this.transA*=(m-1)/(d-1);this.min=a.startOnTick?g[0]:Math.min(this.min,g[0]);this.max=a.endOnTick?g[g.length-1]:Math.max(this.max,g[g.length-1])}else m>d&&(this.tickInterval*=2,this.setTickPositions());if(v(e)){for(b=a=g.length;b--;)(3===e&&1===b%2||2>=e&&0<b&&b<a-1)&&g.splice(b,1);this.finalTickAmt=void 0}}},setScale:function(){var a=this.series.some(function(a){return a.isDirtyData||a.isDirty||a.xAxis.isDirty}),b;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();
(b=this.len!==this.oldAxisLength)||a||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax||this.alignToOthers()?(this.resetStacks&&this.resetStacks(),this.forceRedraw=!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,this.isDirty||(this.isDirty=b||this.min!==this.oldMin||this.max!==this.oldMax)):this.cleanStacks&&this.cleanStacks();e(this,"afterSetScale")},setExtremes:function(a,b,g,d,m){var f=this,
q=f.chart;g=E(g,!0);f.series.forEach(function(a){delete a.kdTree});m=h(m,{min:a,max:b});e(f,"setExtremes",m,function(){f.userMin=a;f.userMax=b;f.eventArgs=m;g&&q.redraw(d)})},zoom:function(a,b){var f=this.dataMin,g=this.dataMax,d=this.options,q=Math.min(f,E(d.min,f)),m=Math.max(g,E(d.max,g));a={newMin:a,newMax:b};e(this,"zoom",a,function(a){var b=a.newMin,d=a.newMax;if(b!==this.min||d!==this.max)this.allowZoomOutside||(v(f)&&(b<q&&(b=q),b>m&&(b=m)),v(g)&&(d<q&&(d=q),d>m&&(d=m))),this.displayBtn=void 0!==
b||void 0!==d,this.setExtremes(b,d,!1,void 0,{trigger:"zoom"});a.zoomed=!0});return a.zoomed},setAxisSize:function(){var f=this.chart,b=this.options,g=b.offsets||[0,0,0,0],d=this.horiz,e=this.width=Math.round(a.relativeLength(E(b.width,f.plotWidth-g[3]+g[1]),f.plotWidth)),m=this.height=Math.round(a.relativeLength(E(b.height,f.plotHeight-g[0]+g[2]),f.plotHeight)),h=this.top=Math.round(a.relativeLength(E(b.top,f.plotTop+g[0]),f.plotHeight,f.plotTop)),b=this.left=Math.round(a.relativeLength(E(b.left,
f.plotLeft+g[3]),f.plotWidth,f.plotLeft));this.bottom=f.chartHeight-m-h;this.right=f.chartWidth-e-b;this.len=Math.max(d?e:m,0);this.pos=d?b:h},getExtremes:function(){var a=this.isLog;return{min:a?p(this.lin2log(this.min)):this.min,max:a?p(this.lin2log(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var f=this.isLog,b=f?this.lin2log(this.min):this.min,f=f?this.lin2log(this.max):this.max;null===a||-Infinity===a?a=b:Infinity===
a?a=f:b>a?a=b:f<a&&(a=f);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){var f=(E(a,0)-90*this.side+720)%360;a={align:"center"};e(this,"autoLabelAlign",a,function(a){15<f&&165>f?a.align="right":195<f&&345>f&&(a.align="left")});return a.align},tickSize:function(a){var f=this.options,b=f[a+"Length"],g=E(f[a+"Width"],"tick"===a&&this.isXAxis?1:0),d;g&&b&&("inside"===f[a+"Position"]&&(b=-b),d=[b,g]);a={tickSize:d};e(this,"afterTickSize",a);return a.tickSize},labelMetrics:function(){var a=
this.tickPositions&&this.tickPositions[0]||0;return this.chart.renderer.fontMetrics(this.options.labels.style&&this.options.labels.style.fontSize,this.ticks[a]&&this.ticks[a].label)},unsquish:function(){var a=this.options.labels,b=this.horiz,g=this.tickInterval,d=g,e=this.len/(((this.categories?1:0)+this.max-this.min)/g),m,h=a.rotation,n=this.labelMetrics(),c,u=Number.MAX_VALUE,z,l=this.max-this.min,x=function(a){var f=a/(e||1),f=1<f?Math.ceil(f):1;f*g>l&&Infinity!==a&&Infinity!==e&&(f=Math.ceil(l/
g));return p(f*g)};b?(z=!a.staggerLines&&!a.step&&(v(h)?[h]:e<E(a.autoRotationLimit,80)&&a.autoRotation))&&z.forEach(function(a){var f;if(a===h||a&&-90<=a&&90>=a)c=x(Math.abs(n.h/Math.sin(w*a))),f=c+Math.abs(a/360),f<u&&(u=f,m=a,d=c)}):a.step||(d=x(n.h));this.autoRotation=z;this.labelRotation=E(m,h);return d},getSlotWidth:function(a){var f=this.chart,b=this.horiz,g=this.options.labels,d=Math.max(this.tickPositions.length-(this.categories?0:1),1),e=f.margin[3];return a&&a.slotWidth||b&&2>(g.step||
0)&&!g.rotation&&(this.staggerLines||1)*this.len/d||!b&&(g.style&&parseInt(g.style.width,10)||e&&e-f.spacing[3]||.33*f.chartWidth)},renderUnsquish:function(){var a=this.chart,g=a.renderer,d=this.tickPositions,e=this.ticks,m=this.options.labels,h=m&&m.style||{},n=this.horiz,c=this.getSlotWidth(),u=Math.max(1,Math.round(c-2*(m.padding||5))),z={},l=this.labelMetrics(),x=m.style&&m.style.textOverflow,D,r,k=0,A;b(m.rotation)||(z.rotation=m.rotation||0);d.forEach(function(a){(a=e[a])&&a.label&&a.label.textPxLength>
k&&(k=a.label.textPxLength)});this.maxLabelLength=k;if(this.autoRotation)k>u&&k>l.h?z.rotation=this.labelRotation:this.labelRotation=0;else if(c&&(D=u,!x))for(r="clip",u=d.length;!n&&u--;)if(A=d[u],A=e[A].label)A.styles&&"ellipsis"===A.styles.textOverflow?A.css({textOverflow:"clip"}):A.textPxLength>c&&A.css({width:c+"px"}),A.getBBox().height>this.len/d.length-(l.h-l.f)&&(A.specificTextOverflow="ellipsis");z.rotation&&(D=k>.5*a.chartHeight?.33*a.chartHeight:k,x||(r="ellipsis"));if(this.labelAlign=
m.align||this.autoLabelAlign(this.labelRotation))z.align=this.labelAlign;d.forEach(function(a){var f=(a=e[a])&&a.label,b=h.width,g={};f&&(f.attr(z),a.shortenLabel?a.shortenLabel():D&&!b&&"nowrap"!==h.whiteSpace&&(D<f.textPxLength||"SPAN"===f.element.tagName)?(g.width=D,x||(g.textOverflow=f.specificTextOverflow||r),f.css(g)):f.styles&&f.styles.width&&!g.width&&!b&&f.css({width:null}),delete f.specificTextOverflow,a.rotation=z.rotation)},this);this.tickRotCorr=g.rotCorr(l.b,this.labelRotation||0,0!==
this.side)},hasData:function(){return this.hasVisibleSeries||v(this.min)&&v(this.max)&&this.tickPositions&&0<this.tickPositions.length},addTitle:function(a){var f=this.chart.renderer,b=this.horiz,g=this.opposite,d=this.options.title,e,m=this.chart.styledMode;this.axisTitle||((e=d.textAlign)||(e=(b?{low:"left",middle:"center",high:"right"}:{low:g?"right":"left",middle:"center",high:g?"left":"right"})[d.align]),this.axisTitle=f.text(d.text,0,0,d.useHTML).attr({zIndex:7,rotation:d.rotation||0,align:e}).addClass("highcharts-axis-title"),
m||this.axisTitle.css(x(d.style)),this.axisTitle.add(this.axisGroup),this.axisTitle.isNew=!0);m||d.style.width||this.isRadial||this.axisTitle.css({width:this.len});this.axisTitle[a?"show":"hide"](!0)},generateTick:function(a){var f=this.ticks;f[a]?f[a].addLabel():f[a]=new D(this,a)},getOffset:function(){var a=this,b=a.chart,g=b.renderer,d=a.options,m=a.tickPositions,h=a.ticks,n=a.horiz,c=a.side,u=b.inverted&&!a.isZAxis?[1,0,3,2][c]:c,z,l,x=0,D,r=0,k=d.title,A=d.labels,B=0,p=b.axisOffset,b=b.clipOffset,
w=[-1,1,1,-1][c],t=d.className,y=a.axisParent;z=a.hasData();a.showAxis=l=z||E(d.showEmpty,!0);a.staggerLines=a.horiz&&A.staggerLines;a.axisGroup||(a.gridGroup=g.g("grid").attr({zIndex:d.gridZIndex||1}).addClass("highcharts-"+this.coll.toLowerCase()+"-grid "+(t||"")).add(y),a.axisGroup=g.g("axis").attr({zIndex:d.zIndex||2}).addClass("highcharts-"+this.coll.toLowerCase()+" "+(t||"")).add(y),a.labelGroup=g.g("axis-labels").attr({zIndex:A.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+"-labels "+
(t||"")).add(y));z||a.isLinked?(m.forEach(function(b,f){a.generateTick(b,f)}),a.renderUnsquish(),a.reserveSpaceDefault=0===c||2===c||{1:"left",3:"right"}[c]===a.labelAlign,E(A.reserveSpace,"center"===a.labelAlign?!0:null,a.reserveSpaceDefault)&&m.forEach(function(a){B=Math.max(h[a].getLabelSize(),B)}),a.staggerLines&&(B*=a.staggerLines),a.labelOffset=B*(a.opposite?-1:1)):H(h,function(a,b){a.destroy();delete h[b]});k&&k.text&&!1!==k.enabled&&(a.addTitle(l),l&&!1!==k.reserveSpace&&(a.titleOffset=x=
a.axisTitle.getBBox()[n?"height":"width"],D=k.offset,r=v(D)?0:E(k.margin,n?5:10)));a.renderLine();a.offset=w*E(d.offset,p[c]?p[c]+(d.margin||0):0);a.tickRotCorr=a.tickRotCorr||{x:0,y:0};g=0===c?-a.labelMetrics().h:2===c?a.tickRotCorr.y:0;r=Math.abs(B)+r;B&&(r=r-g+w*(n?E(A.y,a.tickRotCorr.y+8*w):A.x));a.axisTitleMargin=E(D,r);a.getMaxLabelDimensions&&(a.maxLabelDimensions=a.getMaxLabelDimensions(h,m));n=this.tickSize("tick");p[c]=Math.max(p[c],a.axisTitleMargin+x+w*a.offset,r,z&&m.length&&n?n[0]+w*
a.offset:0);d=d.offset?0:2*Math.floor(a.axisLine.strokeWidth()/2);b[u]=Math.max(b[u],d);e(this,"afterGetOffset")},getLinePath:function(a){var b=this.chart,f=this.opposite,g=this.offset,d=this.horiz,e=this.left+(f?this.width:0)+g,g=b.chartHeight-this.bottom-(f?this.height:0)+g;f&&(a*=-1);return b.renderer.crispLine(["M",d?this.left:e,d?g:this.top,"L",d?b.chartWidth-this.right:e,d?g:b.chartHeight-this.bottom],a)},renderLine:function(){this.axisLine||(this.axisLine=this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),
this.chart.styledMode||this.axisLine.attr({stroke:this.options.lineColor,"stroke-width":this.options.lineWidth,zIndex:7}))},getTitlePosition:function(){var a=this.horiz,b=this.left,g=this.top,d=this.len,m=this.options.title,h=a?b:g,n=this.opposite,c=this.offset,u=m.x||0,z=m.y||0,l=this.axisTitle,x=this.chart.renderer.fontMetrics(m.style&&m.style.fontSize,l),l=Math.max(l.getBBox(null,0).height-x.h-1,0),d={low:h+(a?0:d),middle:h+d/2,high:h+(a?d:0)}[m.align],b=(a?g+this.height:b)+(a?1:-1)*(n?-1:1)*this.axisTitleMargin+
[-l,l,x.f,-l][this.side],a={x:a?d+u:b+(n?this.width:0)+c+u,y:a?b+z-(n?this.height:0)+c:d+z};e(this,"afterGetTitlePosition",{titlePosition:a});return a},renderMinorTick:function(a){var b=this.chart.hasRendered&&g(this.oldMin),f=this.minorTicks;f[a]||(f[a]=new D(this,a,"minor"));b&&f[a].isNew&&f[a].render(null,!0);f[a].render(null,!1,1)},renderTick:function(a,b){var f=this.isLinked,d=this.ticks,e=this.chart.hasRendered&&g(this.oldMin);if(!f||a>=this.min&&a<=this.max)d[a]||(d[a]=new D(this,a)),e&&d[a].isNew&&
d[a].render(b,!0,-1),d[a].render(b)},render:function(){var b=this,d=b.chart,m=b.options,h=b.isLog,n=b.isLinked,c=b.tickPositions,u=b.axisTitle,l=b.ticks,x=b.minorTicks,r=b.alternateBands,k=m.stackLabels,A=m.alternateGridColor,B=b.tickmarkOffset,E=b.axisLine,p=b.showAxis,w=F(d.renderer.globalAnimation),t,v;b.labelEdge.length=0;b.overlap=!1;[l,x,r].forEach(function(a){H(a,function(a){a.isActive=!1})});if(b.hasData()||n)b.minorTickInterval&&!b.categories&&b.getMinorTickPositions().forEach(function(a){b.renderMinorTick(a)}),
c.length&&(c.forEach(function(a,f){b.renderTick(a,f)}),B&&(0===b.min||b.single)&&(l[-1]||(l[-1]=new D(b,-1,null,!0)),l[-1].render(-1))),A&&c.forEach(function(f,g){v=void 0!==c[g+1]?c[g+1]+B:b.max-B;0===g%2&&f<b.max&&v<=b.max+(d.polar?-B:B)&&(r[f]||(r[f]=new a.PlotLineOrBand(b)),t=f+B,r[f].options={from:h?b.lin2log(t):t,to:h?b.lin2log(v):v,color:A},r[f].render(),r[f].isActive=!0)}),b._addedPlotLB||((m.plotLines||[]).concat(m.plotBands||[]).forEach(function(a){b.addPlotBandOrLine(a)}),b._addedPlotLB=
!0);[l,x,r].forEach(function(a){var b,f=[],g=w.duration;H(a,function(a,b){a.isActive||(a.render(b,!1,0),a.isActive=!1,f.push(b))});z(function(){for(b=f.length;b--;)a[f[b]]&&!a[f[b]].isActive&&(a[f[b]].destroy(),delete a[f[b]])},a!==r&&d.hasRendered&&g?g:0)});E&&(E[E.isPlaced?"animate":"attr"]({d:this.getLinePath(E.strokeWidth())}),E.isPlaced=!0,E[p?"show":"hide"](!0));u&&p&&(m=b.getTitlePosition(),g(m.y)?(u[u.isNew?"attr":"animate"](m),u.isNew=!1):(u.attr("y",-9999),u.isNew=!0));k&&k.enabled&&b.renderStackTotals();
b.isDirty=!1;e(this,"afterRender")},redraw:function(){this.visible&&(this.render(),this.plotLinesAndBands.forEach(function(a){a.render()}));this.series.forEach(function(a){a.isDirty=!0})},keepProps:"extKey hcEvents names series userMax userMin".split(" "),destroy:function(a){var b=this,f=b.stacks,g=b.plotLinesAndBands,d;e(this,"destroy",{keepEvents:a});a||B(b);H(f,function(a,b){r(a);f[b]=null});[b.ticks,b.minorTicks,b.alternateBands].forEach(function(a){r(a)});if(g)for(a=g.length;a--;)g[a].destroy();
"stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" ").forEach(function(a){b[a]&&(b[a]=b[a].destroy())});for(d in b.plotLinesAndBandsGroups)b.plotLinesAndBandsGroups[d]=b.plotLinesAndBandsGroups[d].destroy();H(b,function(a,f){-1===b.keepProps.indexOf(f)&&delete b[f]})},drawCrosshair:function(a,b){var f,g=this.crosshair,d=E(g.snap,!0),m,h=this.cross;e(this,"drawCrosshair",{e:a,point:b});a||(a=this.cross&&this.cross.e);if(this.crosshair&&!1!==(v(b)||!d)){d?v(b)&&
(m=E(b.crosshairPos,this.isXAxis?b.plotX:this.len-b.plotY)):m=a&&(this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos);v(m)&&(f=this.getPlotLinePath(b&&(this.isXAxis?b.x:E(b.stackY,b.y)),null,null,null,m)||null);if(!v(f)){this.hideCrosshair();return}d=this.categories&&!this.isRadial;h||(this.cross=h=this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-"+(d?"category ":"thin ")+g.className).attr({zIndex:E(g.zIndex,2)}).add(),this.chart.styledMode||(h.attr({stroke:g.color||
(d?c("#ccd6eb").setOpacity(.25).get():"#cccccc"),"stroke-width":E(g.width,1)}).css({"pointer-events":"none"}),g.dashStyle&&h.attr({dashstyle:g.dashStyle})));h.show().attr({d:f});d&&!g.width&&h.attr({"stroke-width":this.transA});this.cross.e=a}else this.hideCrosshair();e(this,"afterDrawCrosshair",{e:a,point:b})},hideCrosshair:function(){this.cross&&this.cross.hide();e(this,"afterHideCrosshair")}});return a.Axis=A}(I);(function(a){var y=a.Axis,F=a.getMagnitude,G=a.normalizeTickInterval,k=a.timeUnits;
y.prototype.getTimeTicks=function(){return this.chart.time.getTimeTicks.apply(this.chart.time,arguments)};y.prototype.normalizeTimeTickInterval=function(a,p){var c=p||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]];p=c[c.length-1];var v=k[p[0]],w=p[1],r;for(r=0;r<c.length&&!(p=c[r],v=k[p[0]],w=p[1],c[r+1]&&a<=(v*w[w.length-1]+k[c[r+1][0]])/2);r++);v===
k.year&&a<5*v&&(w=[1,2,5]);a=G(a/v,w,"year"===p[0]?Math.max(F(a/v),1):1);return{unitRange:v,count:a,unitName:p[0]}}})(I);(function(a){var y=a.Axis,F=a.getMagnitude,G=a.normalizeTickInterval,k=a.pick;y.prototype.getLogTickPositions=function(a,p,t,v){var c=this.options,r=this.len,h=[];v||(this._minorAutoInterval=null);if(.5<=a)a=Math.round(a),h=this.getLinearTickPositions(a,p,t);else if(.08<=a)for(var r=Math.floor(p),e,l,n,d,g,c=.3<a?[1,2,4]:.15<a?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];r<t+1&&!g;r++)for(l=
c.length,e=0;e<l&&!g;e++)n=this.log2lin(this.lin2log(r)*c[e]),n>p&&(!v||d<=t)&&void 0!==d&&h.push(d),d>t&&(g=!0),d=n;else p=this.lin2log(p),t=this.lin2log(t),a=v?this.getMinorTickInterval():c.tickInterval,a=k("auto"===a?null:a,this._minorAutoInterval,c.tickPixelInterval/(v?5:1)*(t-p)/((v?r/this.tickPositions.length:r)||1)),a=G(a,null,F(a)),h=this.getLinearTickPositions(a,p,t).map(this.log2lin),v||(this._minorAutoInterval=a/5);v||(this.tickInterval=a);return h};y.prototype.log2lin=function(a){return Math.log(a)/
Math.LN10};y.prototype.lin2log=function(a){return Math.pow(10,a)}})(I);(function(a,y){var F=a.arrayMax,G=a.arrayMin,k=a.defined,c=a.destroyObjectProperties,p=a.erase,t=a.merge,v=a.pick;a.PlotLineOrBand=function(a,c){this.axis=a;c&&(this.options=c,this.id=c.id)};a.PlotLineOrBand.prototype={render:function(){a.fireEvent(this,"render");var c=this,r=c.axis,h=r.horiz,e=c.options,l=e.label,n=c.label,d=e.to,g=e.from,b=e.value,x=k(g)&&k(d),u=k(b),p=c.svgElem,E=!p,B=[],m=e.color,z=v(e.zIndex,0),D=e.events,
B={"class":"highcharts-plot-"+(x?"band ":"line ")+(e.className||"")},A={},f=r.chart.renderer,q=x?"bands":"lines";r.isLog&&(g=r.log2lin(g),d=r.log2lin(d),b=r.log2lin(b));r.chart.styledMode||(u?(B.stroke=m,B["stroke-width"]=e.width,e.dashStyle&&(B.dashstyle=e.dashStyle)):x&&(m&&(B.fill=m),e.borderWidth&&(B.stroke=e.borderColor,B["stroke-width"]=e.borderWidth)));A.zIndex=z;q+="-"+z;(m=r.plotLinesAndBandsGroups[q])||(r.plotLinesAndBandsGroups[q]=m=f.g("plot-"+q).attr(A).add());E&&(c.svgElem=p=f.path().attr(B).add(m));
if(u)B=r.getPlotLinePath(b,p.strokeWidth());else if(x)B=r.getPlotBandPath(g,d,e);else return;E&&B&&B.length?(p.attr({d:B}),D&&a.objectEach(D,function(a,b){p.on(b,function(a){D[b].apply(c,[a])})})):p&&(B?(p.show(),p.animate({d:B})):(p.hide(),n&&(c.label=n=n.destroy())));l&&k(l.text)&&B&&B.length&&0<r.width&&0<r.height&&!B.isFlat?(l=t({align:h&&x&&"center",x:h?!x&&4:10,verticalAlign:!h&&x&&"middle",y:h?x?16:10:x?6:-4,rotation:h&&!x&&90},l),this.renderLabel(l,B,x,z)):n&&n.hide();return c},renderLabel:function(a,
c,h,e){var l=this.label,n=this.axis.chart.renderer;l||(l={align:a.textAlign||a.align,rotation:a.rotation,"class":"highcharts-plot-"+(h?"band":"line")+"-label "+(a.className||"")},l.zIndex=e,this.label=l=n.text(a.text,0,0,a.useHTML).attr(l).add(),this.axis.chart.styledMode||l.css(a.style));e=c.xBounds||[c[1],c[4],h?c[6]:c[1]];c=c.yBounds||[c[2],c[5],h?c[7]:c[2]];h=G(e);n=G(c);l.align(a,!1,{x:h,y:n,width:F(e)-h,height:F(c)-n});l.show()},destroy:function(){p(this.axis.plotLinesAndBands,this);delete this.axis;
c(this)}};a.extend(y.prototype,{getPlotBandPath:function(a,c){var h=this.getPlotLinePath(c,null,null,!0),e=this.getPlotLinePath(a,null,null,!0),l=[],n=this.horiz,d=1,g;a=a<this.min&&c<this.min||a>this.max&&c>this.max;if(e&&h)for(a&&(g=e.toString()===h.toString(),d=0),a=0;a<e.length;a+=6)n&&h[a+1]===e[a+1]?(h[a+1]+=d,h[a+4]+=d):n||h[a+2]!==e[a+2]||(h[a+2]+=d,h[a+5]+=d),l.push("M",e[a+1],e[a+2],"L",e[a+4],e[a+5],h[a+4],h[a+5],h[a+1],h[a+2],"z"),l.isFlat=g;return l},addPlotBand:function(a){return this.addPlotBandOrLine(a,
"plotBands")},addPlotLine:function(a){return this.addPlotBandOrLine(a,"plotLines")},addPlotBandOrLine:function(c,r){var h=(new a.PlotLineOrBand(this,c)).render(),e=this.userOptions;h&&(r&&(e[r]=e[r]||[],e[r].push(c)),this.plotLinesAndBands.push(h));return h},removePlotBandOrLine:function(a){for(var c=this.plotLinesAndBands,h=this.options,e=this.userOptions,l=c.length;l--;)c[l].id===a&&c[l].destroy();[h.plotLines||[],e.plotLines||[],h.plotBands||[],e.plotBands||[]].forEach(function(e){for(l=e.length;l--;)e[l].id===
a&&p(e,e[l])})},removePlotBand:function(a){this.removePlotBandOrLine(a)},removePlotLine:function(a){this.removePlotBandOrLine(a)}})})(I,X);(function(a){var y=a.doc,F=a.extend,G=a.format,k=a.isNumber,c=a.merge,p=a.pick,t=a.splat,v=a.syncTimeout,w=a.timeUnits;a.Tooltip=function(){this.init.apply(this,arguments)};a.Tooltip.prototype={init:function(a,h){this.chart=a;this.options=h;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.split=h.split&&!a.inverted;this.shared=h.shared||this.split;this.outside=
h.outside&&!this.split},cleanSplit:function(a){this.chart.series.forEach(function(h){var e=h&&h.tt;e&&(!e.isActive||a?h.tt=e.destroy():e.isActive=!1)})},applyFilter:function(){var a=this.chart;a.renderer.definition({tagName:"filter",id:"drop-shadow-"+a.index,opacity:.5,children:[{tagName:"feGaussianBlur","in":"SourceAlpha",stdDeviation:1},{tagName:"feOffset",dx:1,dy:1},{tagName:"feComponentTransfer",children:[{tagName:"feFuncA",type:"linear",slope:.3}]},{tagName:"feMerge",children:[{tagName:"feMergeNode"},
{tagName:"feMergeNode","in":"SourceGraphic"}]}]});a.renderer.definition({tagName:"style",textContent:".highcharts-tooltip-"+a.index+"{filter:url(#drop-shadow-"+a.index+")}"})},getLabel:function(){var c=this,h=this.chart.renderer,e=this.chart.styledMode,l=this.options,n,d;this.label||(this.outside&&(this.container=n=a.doc.createElement("div"),n.className="highcharts-tooltip-container",a.css(n,{position:"absolute",top:"1px",pointerEvents:l.style&&l.style.pointerEvents}),a.doc.body.appendChild(n),this.renderer=
h=new a.Renderer(n,0,0)),this.split?this.label=h.g("tooltip"):(this.label=h.label("",0,0,l.shape||"callout",null,null,l.useHTML,null,"tooltip").attr({padding:l.padding,r:l.borderRadius}),e||this.label.attr({fill:l.backgroundColor,"stroke-width":l.borderWidth}).css(l.style).shadow(l.shadow)),e&&(this.applyFilter(),this.label.addClass("highcharts-tooltip-"+this.chart.index)),this.outside&&(d={x:this.label.xSetter,y:this.label.ySetter},this.label.xSetter=function(a,b){d[b].call(this.label,c.distance);
n.style.left=a+"px"},this.label.ySetter=function(a,b){d[b].call(this.label,c.distance);n.style.top=a+"px"}),this.label.attr({zIndex:8}).add());return this.label},update:function(a){this.destroy();c(!0,this.chart.options.tooltip.userOptions,a);this.init(this.chart,c(!0,this.options,a))},destroy:function(){this.label&&(this.label=this.label.destroy());this.split&&this.tt&&(this.cleanSplit(this.chart,!0),this.tt=this.tt.destroy());this.renderer&&(this.renderer=this.renderer.destroy(),a.discardElement(this.container));
a.clearTimeout(this.hideTimer);a.clearTimeout(this.tooltipTimeout)},move:function(c,h,e,l){var n=this,d=n.now,g=!1!==n.options.animation&&!n.isHidden&&(1<Math.abs(c-d.x)||1<Math.abs(h-d.y)),b=n.followPointer||1<n.len;F(d,{x:g?(2*d.x+c)/3:c,y:g?(d.y+h)/2:h,anchorX:b?void 0:g?(2*d.anchorX+e)/3:e,anchorY:b?void 0:g?(d.anchorY+l)/2:l});n.getLabel().attr(d);g&&(a.clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){n&&n.move(c,h,e,l)},32))},hide:function(c){var h=this;a.clearTimeout(this.hideTimer);
c=p(c,this.options.hideDelay,500);this.isHidden||(this.hideTimer=v(function(){h.getLabel()[c?"fadeOut":"hide"]();h.isHidden=!0},c))},getAnchor:function(a,c){var e=this.chart,h=e.pointer,n=e.inverted,d=e.plotTop,g=e.plotLeft,b=0,x=0,u,k;a=t(a);this.followPointer&&c?(void 0===c.chartX&&(c=h.normalize(c)),a=[c.chartX-e.plotLeft,c.chartY-d]):a[0].tooltipPos?a=a[0].tooltipPos:(a.forEach(function(a){u=a.series.yAxis;k=a.series.xAxis;b+=a.plotX+(!n&&k?k.left-g:0);x+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+
(!n&&u?u.top-d:0)}),b/=a.length,x/=a.length,a=[n?e.plotWidth-x:b,this.shared&&!n&&1<a.length&&c?c.chartY-d:n?e.plotHeight-b:x]);return a.map(Math.round)},getPosition:function(a,c,e){var h=this.chart,n=this.distance,d={},g=h.inverted&&e.h||0,b,x=this.outside,u=x?y.documentElement.clientWidth-2*n:h.chartWidth,k=x?Math.max(y.body.scrollHeight,y.documentElement.scrollHeight,y.body.offsetHeight,y.documentElement.offsetHeight,y.documentElement.clientHeight):h.chartHeight,r=h.pointer.chartPosition,B=["y",
k,c,(x?r.top-n:0)+e.plotY+h.plotTop,x?0:h.plotTop,x?k:h.plotTop+h.plotHeight],m=["x",u,a,(x?r.left-n:0)+e.plotX+h.plotLeft,x?0:h.plotLeft,x?u:h.plotLeft+h.plotWidth],z=!this.followPointer&&p(e.ttBelow,!h.inverted===!!e.negative),D=function(a,b,f,e,m,c){var h=f<e-n,q=e+n+f<b,u=e-n-f;e+=n;if(z&&q)d[a]=e;else if(!z&&h)d[a]=u;else if(h)d[a]=Math.min(c-f,0>u-g?u:u-g);else if(q)d[a]=Math.max(m,e+g+f>b?e:e+g);else return!1},A=function(a,b,f,g){var e;g<n||g>b-n?e=!1:d[a]=g<f/2?1:g>b-f/2?b-f-2:g-f/2;return e},
f=function(a){var f=B;B=m;m=f;b=a},q=function(){!1!==D.apply(0,B)?!1!==A.apply(0,m)||b||(f(!0),q()):b?d.x=d.y=0:(f(!0),q())};(h.inverted||1<this.len)&&f();q();return d},defaultFormatter:function(a){var c=this.points||t(this),e;e=[a.tooltipFooterHeaderFormatter(c[0])];e=e.concat(a.bodyFormatter(c));e.push(a.tooltipFooterHeaderFormatter(c[0],!0));return e},refresh:function(c,h){var e,l=this.options,n,d=c,g,b={},x=[];e=l.formatter||this.defaultFormatter;var b=this.shared,u,k=this.chart.styledMode;l.enabled&&
(a.clearTimeout(this.hideTimer),this.followPointer=t(d)[0].series.tooltipOptions.followPointer,g=this.getAnchor(d,h),h=g[0],n=g[1],!b||d.series&&d.series.noSharedTooltip?b=d.getLabelConfig():(d.forEach(function(a){a.setState("hover");x.push(a.getLabelConfig())}),b={x:d[0].category,y:d[0].y},b.points=x,d=d[0]),this.len=x.length,b=e.call(b,this),u=d.series,this.distance=p(u.tooltipOptions.distance,16),!1===b?this.hide():(e=this.getLabel(),this.isHidden&&e.attr({opacity:1}).show(),this.split?this.renderSplit(b,
t(c)):(l.style.width&&!k||e.css({width:this.chart.spacingBox.width}),e.attr({text:b&&b.join?b.join(""):b}),e.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-"+p(d.colorIndex,u.colorIndex)),k||e.attr({stroke:l.borderColor||d.color||u.color||"#666666"}),this.updatePosition({plotX:h,plotY:n,negative:d.negative,ttBelow:d.ttBelow,h:g[2]||0})),this.isHidden=!1))},renderSplit:function(c,h){var e=this,l=[],n=this.chart,d=n.renderer,g=!0,b=this.options,x=0,u,k=this.getLabel(),r=n.plotTop;
a.isString(c)&&(c=[!1,c]);c.slice(0,h.length+1).forEach(function(a,m){if(!1!==a&&""!==a){m=h[m-1]||{isHeader:!0,plotX:h[0].plotX,plotY:n.plotHeight};var c=m.series||e,D=c.tt,A=m.series||{},f="highcharts-color-"+p(m.colorIndex,A.colorIndex,"none");D||(D={padding:b.padding,r:b.borderRadius},n.styledMode||(D.fill=b.backgroundColor,D.stroke=b.borderColor||m.color||A.color||"#333333",D["stroke-width"]=b.borderWidth),c.tt=D=d.label(null,null,null,(m.isHeader?b.headerShape:b.shape)||"callout",null,null,
b.useHTML).addClass("highcharts-tooltip-box "+f).attr(D).add(k));D.isActive=!0;D.attr({text:a});n.styledMode||D.css(b.style).shadow(b.shadow);a=D.getBBox();A=a.width+D.strokeWidth();m.isHeader?(x=a.height,n.xAxis[0].opposite&&(u=!0,r-=x),A=Math.max(0,Math.min(m.plotX+n.plotLeft-A/2,n.chartWidth+(n.scrollablePixels?n.scrollablePixels-n.marginRight:0)-A))):A=m.plotX+n.plotLeft-p(b.distance,16)-A;0>A&&(g=!1);a=(m.series&&m.series.yAxis&&m.series.yAxis.pos)+(m.plotY||0);a-=r;m.isHeader&&(a=u?-x:n.plotHeight+
x);l.push({target:a,rank:m.isHeader?1:0,size:c.tt.getBBox().height+1,point:m,x:A,tt:D})}});this.cleanSplit();b.positioner&&l.forEach(function(a){var g=b.positioner.call(e,a.tt.getBBox().width,a.size,a.point);a.x=g.x;a.align=0;a.target=g.y;a.rank=p(g.rank,a.rank)});a.distribute(l,n.plotHeight+x);l.forEach(function(a){var d=a.point,c=d.series;a.tt.attr({visibility:void 0===a.pos?"hidden":"inherit",x:g||d.isHeader||b.positioner?a.x:d.plotX+n.plotLeft+e.distance,y:a.pos+r,anchorX:d.isHeader?d.plotX+n.plotLeft:
d.plotX+c.xAxis.pos,anchorY:d.isHeader?n.plotTop+n.plotHeight/2:d.plotY+c.yAxis.pos})})},updatePosition:function(a){var c=this.chart,e=this.getLabel(),l=(this.options.positioner||this.getPosition).call(this,e.width,e.height,a),n=a.plotX+c.plotLeft;a=a.plotY+c.plotTop;var d;this.outside&&(d=(this.options.borderWidth||0)+2*this.distance,this.renderer.setSize(e.width+d,e.height+d,!1),n+=c.pointer.chartPosition.left-l.x,a+=c.pointer.chartPosition.top-l.y);this.move(Math.round(l.x),Math.round(l.y||0),
n,a)},getDateFormat:function(a,c,e,l){var h=this.chart.time,d=h.dateFormat("%m-%d %H:%M:%S.%L",c),g,b,x={millisecond:15,second:12,minute:9,hour:6,day:3},u="millisecond";for(b in w){if(a===w.week&&+h.dateFormat("%w",c)===e&&"00:00:00.000"===d.substr(6)){b="week";break}if(w[b]>a){b=u;break}if(x[b]&&d.substr(x[b])!=="01-01 00:00:00.000".substr(x[b]))break;"week"!==b&&(u=b)}b&&(g=h.resolveDTLFormat(l[b]).main);return g},getXDateFormat:function(a,c,e){c=c.dateTimeLabelFormats;var h=e&&e.closestPointRange;
return(h?this.getDateFormat(h,a.x,e.options.startOfWeek,c):c.day)||c.year},tooltipFooterHeaderFormatter:function(c,h){var e=h?"footer":"header",l=c.series,n=l.tooltipOptions,d=n.xDateFormat,g=l.xAxis,b=g&&"datetime"===g.options.type&&k(c.key),x=n[e+"Format"];h={isFooter:h,labelConfig:c};a.fireEvent(this,"headerFormatter",h,function(a){b&&!d&&(d=this.getXDateFormat(c,n,g));b&&d&&(c.point&&c.point.tooltipDateKeys||["key"]).forEach(function(a){x=x.replace("{point."+a+"}","{point."+a+":"+d+"}")});l.chart.styledMode&&
(x=this.styledModeFormat(x));a.text=G(x,{point:c,series:l},this.chart.time)});return h.text},bodyFormatter:function(a){return a.map(function(a){var e=a.series.tooltipOptions;return(e[(a.point.formatPrefix||"point")+"Formatter"]||a.point.tooltipFormatter).call(a.point,e[(a.point.formatPrefix||"point")+"Format"]||"")})},styledModeFormat:function(a){return a.replace('style\x3d"font-size: 10px"','class\x3d"highcharts-header"').replace(/style="color:{(point|series)\.color}"/g,'class\x3d"highcharts-color-{$1.colorIndex}"')}}})(I);
(function(a){var y=a.addEvent,F=a.attr,G=a.charts,k=a.color,c=a.css,p=a.defined,t=a.extend,v=a.find,w=a.fireEvent,r=a.isNumber,h=a.isObject,e=a.offset,l=a.pick,n=a.splat,d=a.Tooltip;a.Pointer=function(a,b){this.init(a,b)};a.Pointer.prototype={init:function(a,b){this.options=b;this.chart=a;this.runChartClick=b.chart.events&&!!b.chart.events.click;this.pinchDown=[];this.lastValidTouch={};d&&(a.tooltip=new d(a,b.tooltip),this.followTouchMove=l(b.tooltip.followTouchMove,!0));this.setDOMEvents()},zoomOption:function(a){var b=
this.chart,g=b.options.chart,d=g.zoomType||"",b=b.inverted;/touch/.test(a.type)&&(d=l(g.pinchType,d));this.zoomX=a=/x/.test(d);this.zoomY=d=/y/.test(d);this.zoomHor=a&&!b||d&&b;this.zoomVert=d&&!b||a&&b;this.hasZoom=a||d},normalize:function(a,b){var g;g=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:a;b||(this.chartPosition=b=e(this.chart.container));return t(a,{chartX:Math.round(g.pageX-b.left),chartY:Math.round(g.pageY-b.top)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};
this.chart.axes.forEach(function(g){b[g.isXAxis?"xAxis":"yAxis"].push({axis:g,value:g.toValue(a[g.horiz?"chartX":"chartY"])})});return b},findNearestKDPoint:function(a,b,d){var g;a.forEach(function(a){var e=!(a.noSharedTooltip&&b)&&0>a.options.findNearestPointBy.indexOf("y");a=a.searchPoint(d,e);if((e=h(a,!0))&&!(e=!h(g,!0)))var e=g.distX-a.distX,c=g.dist-a.dist,m=(a.series.group&&a.series.group.zIndex)-(g.series.group&&g.series.group.zIndex),e=0<(0!==e&&b?e:0!==c?c:0!==m?m:g.series.index>a.series.index?
-1:1);e&&(g=a)});return g},getPointFromEvent:function(a){a=a.target;for(var b;a&&!b;)b=a.point,a=a.parentNode;return b},getChartCoordinatesFromPoint:function(a,b){var g=a.series,d=g.xAxis,g=g.yAxis,e=l(a.clientX,a.plotX),c=a.shapeArgs;if(d&&g)return b?{chartX:d.len+d.pos-e,chartY:g.len+g.pos-a.plotY}:{chartX:e+d.pos,chartY:a.plotY+g.pos};if(c&&c.x&&c.y)return{chartX:c.x,chartY:c.y}},getHoverData:function(a,b,d,e,c,n){var g,m=[];e=!(!e||!a);var z=b&&!b.stickyTracking?[b]:d.filter(function(a){return a.visible&&
!(!c&&a.directTouch)&&l(a.options.enableMouseTracking,!0)&&a.stickyTracking});b=(g=e?a:this.findNearestKDPoint(z,c,n))&&g.series;g&&(c&&!b.noSharedTooltip?(z=d.filter(function(a){return a.visible&&!(!c&&a.directTouch)&&l(a.options.enableMouseTracking,!0)&&!a.noSharedTooltip}),z.forEach(function(a){var b=v(a.points,function(a){return a.x===g.x&&!a.isNull});h(b)&&(a.chart.isBoosting&&(b=a.getPoint(b)),m.push(b))})):m.push(g));return{hoverPoint:g,hoverSeries:b,hoverPoints:m}},runPointActions:function(g,
b){var d=this.chart,e=d.tooltip&&d.tooltip.options.enabled?d.tooltip:void 0,c=e?e.shared:!1,h=b||d.hoverPoint,n=h&&h.series||d.hoverSeries,n=this.getHoverData(h,n,d.series,"touchmove"!==g.type&&(!!b||n&&n.directTouch&&this.isDirectTouch),c,g),m,h=n.hoverPoint;m=n.hoverPoints;b=(n=n.hoverSeries)&&n.tooltipOptions.followPointer;c=c&&n&&!n.noSharedTooltip;if(h&&(h!==d.hoverPoint||e&&e.isHidden)){(d.hoverPoints||[]).forEach(function(a){-1===m.indexOf(a)&&a.setState()});(m||[]).forEach(function(a){a.setState("hover")});
if(d.hoverSeries!==n)n.onMouseOver();d.hoverPoint&&d.hoverPoint.firePointEvent("mouseOut");if(!h.series)return;h.firePointEvent("mouseOver");d.hoverPoints=m;d.hoverPoint=h;e&&e.refresh(c?m:h,g)}else b&&e&&!e.isHidden&&(h=e.getAnchor([{}],g),e.updatePosition({plotX:h[0],plotY:h[1]}));this.unDocMouseMove||(this.unDocMouseMove=y(d.container.ownerDocument,"mousemove",function(b){var g=G[a.hoverChartIndex];if(g)g.pointer.onDocumentMouseMove(b)}));d.axes.forEach(function(b){var d=l(b.crosshair.snap,!0),
e=d?a.find(m,function(a){return a.series[b.coll]===b}):void 0;e||!d?b.drawCrosshair(g,e):b.hideCrosshair()})},reset:function(a,b){var g=this.chart,d=g.hoverSeries,e=g.hoverPoint,c=g.hoverPoints,h=g.tooltip,m=h&&h.shared?c:e;a&&m&&n(m).forEach(function(b){b.series.isCartesian&&void 0===b.plotX&&(a=!1)});if(a)h&&m&&n(m).length&&(h.refresh(m),h.shared&&c?c.forEach(function(a){a.setState(a.state,!0);a.series.isCartesian&&(a.series.xAxis.crosshair&&a.series.xAxis.drawCrosshair(null,a),a.series.yAxis.crosshair&&
a.series.yAxis.drawCrosshair(null,a))}):e&&(e.setState(e.state,!0),g.axes.forEach(function(a){a.crosshair&&a.drawCrosshair(null,e)})));else{if(e)e.onMouseOut();c&&c.forEach(function(a){a.setState()});if(d)d.onMouseOut();h&&h.hide(b);this.unDocMouseMove&&(this.unDocMouseMove=this.unDocMouseMove());g.axes.forEach(function(a){a.hideCrosshair()});this.hoverX=g.hoverPoints=g.hoverPoint=null}},scaleGroups:function(a,b){var g=this.chart,d;g.series.forEach(function(e){d=a||e.getPlotBox();e.xAxis&&e.xAxis.zoomEnabled&&
e.group&&(e.group.attr(d),e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(b?g.clipRect:null)),e.dataLabelsGroup&&e.dataLabelsGroup.attr(d))});g.clipRect.attr(b||g.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,g=b.options.chart,d=a.chartX,e=a.chartY,c=this.zoomHor,h=this.zoomVert,m=b.plotLeft,n=b.plotTop,l=b.plotWidth,A=b.plotHeight,f,q=this.selectionMarker,
r=this.mouseDownX,p=this.mouseDownY,t=g.panKey&&a[g.panKey+"Key"];q&&q.touch||(d<m?d=m:d>m+l&&(d=m+l),e<n?e=n:e>n+A&&(e=n+A),this.hasDragged=Math.sqrt(Math.pow(r-d,2)+Math.pow(p-e,2)),10<this.hasDragged&&(f=b.isInsidePlot(r-m,p-n),b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&f&&!t&&!q&&(this.selectionMarker=q=b.renderer.rect(m,n,c?1:l,h?1:A,0).attr({"class":"highcharts-selection-marker",zIndex:7}).add(),b.styledMode||q.attr({fill:g.selectionMarkerFill||k("#335cad").setOpacity(.25).get()})),q&&
c&&(d-=r,q.attr({width:Math.abs(d),x:(0<d?0:d)+r})),q&&h&&(d=e-p,q.attr({height:Math.abs(d),y:(0<d?0:d)+p})),f&&!q&&g.panning&&b.pan(a,g.panning)))},drop:function(a){var b=this,d=this.chart,g=this.hasPinched;if(this.selectionMarker){var e={originalEvent:a,xAxis:[],yAxis:[]},h=this.selectionMarker,n=h.attr?h.attr("x"):h.x,m=h.attr?h.attr("y"):h.y,l=h.attr?h.attr("width"):h.width,D=h.attr?h.attr("height"):h.height,k;if(this.hasDragged||g)d.axes.forEach(function(f){if(f.zoomEnabled&&p(f.min)&&(g||b[{xAxis:"zoomX",
yAxis:"zoomY"}[f.coll]])){var d=f.horiz,c="touchend"===a.type?f.minPixelPadding:0,h=f.toValue((d?n:m)+c),d=f.toValue((d?n+l:m+D)-c);e[f.coll].push({axis:f,min:Math.min(h,d),max:Math.max(h,d)});k=!0}}),k&&w(d,"selection",e,function(a){d.zoom(t(a,g?{animation:!1}:null))});r(d.index)&&(this.selectionMarker=this.selectionMarker.destroy());g&&this.scaleGroups()}d&&r(d.index)&&(c(d.container,{cursor:d._cursor}),d.cancelClick=10<this.hasDragged,d.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=
[])},onContainerMouseDown:function(a){a=this.normalize(a);2!==a.button&&(this.zoomOption(a),a.preventDefault&&a.preventDefault(),this.dragStart(a))},onDocumentMouseUp:function(d){G[a.hoverChartIndex]&&G[a.hoverChartIndex].pointer.drop(d)},onDocumentMouseMove:function(a){var b=this.chart,d=this.chartPosition;a=this.normalize(a,d);!d||this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)||this.reset()},onContainerMouseLeave:function(d){var b=G[a.hoverChartIndex];
b&&(d.relatedTarget||d.toElement)&&(b.pointer.reset(),b.pointer.chartPosition=null)},onContainerMouseMove:function(d){var b=this.chart;p(a.hoverChartIndex)&&G[a.hoverChartIndex]&&G[a.hoverChartIndex].mouseIsDown||(a.hoverChartIndex=b.index);d=this.normalize(d);d.preventDefault||(d.returnValue=!1);"mousedown"===b.mouseIsDown&&this.drag(d);!this.inClass(d.target,"highcharts-tracker")&&!b.isInsidePlot(d.chartX-b.plotLeft,d.chartY-b.plotTop)||b.openMenu||this.runPointActions(d)},inClass:function(a,b){for(var d;a;){if(d=
F(a,"class")){if(-1!==d.indexOf(b))return!0;if(-1!==d.indexOf("highcharts-container"))return!1}a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries;a=a.relatedTarget||a.toElement;this.isDirectTouch=!1;if(!(!b||!a||b.stickyTracking||this.inClass(a,"highcharts-tooltip")||this.inClass(a,"highcharts-series-"+b.index)&&this.inClass(a,"highcharts-tracker")))b.onMouseOut()},onContainerClick:function(a){var b=this.chart,d=b.hoverPoint,g=b.plotLeft,e=b.plotTop;a=this.normalize(a);b.cancelClick||
(d&&this.inClass(a.target,"highcharts-tracker")?(w(d.series,"click",t(a,{point:d})),b.hoverPoint&&d.firePointEvent("click",a)):(t(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-g,a.chartY-e)&&w(b,"click",a)))},setDOMEvents:function(){var d=this,b=d.chart.container,e=b.ownerDocument;b.onmousedown=function(a){d.onContainerMouseDown(a)};b.onmousemove=function(a){d.onContainerMouseMove(a)};b.onclick=function(a){d.onContainerClick(a)};this.unbindContainerMouseLeave=y(b,"mouseleave",d.onContainerMouseLeave);
a.unbindDocumentMouseUp||(a.unbindDocumentMouseUp=y(e,"mouseup",d.onDocumentMouseUp));a.hasTouch&&(b.ontouchstart=function(a){d.onContainerTouchStart(a)},b.ontouchmove=function(a){d.onContainerTouchMove(a)},a.unbindDocumentTouchEnd||(a.unbindDocumentTouchEnd=y(e,"touchend",d.onDocumentTouchEnd)))},destroy:function(){var d=this;d.unDocMouseMove&&d.unDocMouseMove();this.unbindContainerMouseLeave();a.chartCount||(a.unbindDocumentMouseUp&&(a.unbindDocumentMouseUp=a.unbindDocumentMouseUp()),a.unbindDocumentTouchEnd&&
(a.unbindDocumentTouchEnd=a.unbindDocumentTouchEnd()));clearInterval(d.tooltipTimeout);a.objectEach(d,function(a,g){d[g]=null})}}})(I);(function(a){var y=a.charts,F=a.extend,G=a.noop,k=a.pick;F(a.Pointer.prototype,{pinchTranslate:function(a,k,t,v,w,r){this.zoomHor&&this.pinchTranslateDirection(!0,a,k,t,v,w,r);this.zoomVert&&this.pinchTranslateDirection(!1,a,k,t,v,w,r)},pinchTranslateDirection:function(a,k,t,v,w,r,h,e){var c=this.chart,n=a?"x":"y",d=a?"X":"Y",g="chart"+d,b=a?"width":"height",x=c["plot"+
(a?"Left":"Top")],u,p,E=e||1,B=c.inverted,m=c.bounds[a?"h":"v"],z=1===k.length,D=k[0][g],A=t[0][g],f=!z&&k[1][g],q=!z&&t[1][g],L;t=function(){!z&&20<Math.abs(D-f)&&(E=e||Math.abs(A-q)/Math.abs(D-f));p=(x-A)/E+D;u=c["plot"+(a?"Width":"Height")]/E};t();k=p;k<m.min?(k=m.min,L=!0):k+u>m.max&&(k=m.max-u,L=!0);L?(A-=.8*(A-h[n][0]),z||(q-=.8*(q-h[n][1])),t()):h[n]=[A,q];B||(r[n]=p-x,r[b]=u);r=B?1/E:E;w[b]=u;w[n]=k;v[B?a?"scaleY":"scaleX":"scale"+d]=E;v["translate"+d]=r*x+(A-r*D)},pinch:function(a){var c=
this,t=c.chart,v=c.pinchDown,w=a.touches,r=w.length,h=c.lastValidTouch,e=c.hasZoom,l=c.selectionMarker,n={},d=1===r&&(c.inClass(a.target,"highcharts-tracker")&&t.runTrackerClick||c.runChartClick),g={};1<r&&(c.initiated=!0);e&&c.initiated&&!d&&a.preventDefault();[].map.call(w,function(a){return c.normalize(a)});"touchstart"===a.type?([].forEach.call(w,function(a,d){v[d]={chartX:a.chartX,chartY:a.chartY}}),h.x=[v[0].chartX,v[1]&&v[1].chartX],h.y=[v[0].chartY,v[1]&&v[1].chartY],t.axes.forEach(function(a){if(a.zoomEnabled){var b=
t.bounds[a.horiz?"h":"v"],d=a.minPixelPadding,g=a.toPixels(k(a.options.min,a.dataMin)),e=a.toPixels(k(a.options.max,a.dataMax)),c=Math.max(g,e);b.min=Math.min(a.pos,Math.min(g,e)-d);b.max=Math.max(a.pos+a.len,c+d)}}),c.res=!0):c.followTouchMove&&1===r?this.runPointActions(c.normalize(a)):v.length&&(l||(c.selectionMarker=l=F({destroy:G,touch:!0},t.plotBox)),c.pinchTranslate(v,w,n,l,g,h),c.hasPinched=e,c.scaleGroups(n,g),c.res&&(c.res=!1,this.reset(!1,0)))},touch:function(c,p){var t=this.chart,v,w;
if(t.index!==a.hoverChartIndex)this.onContainerMouseLeave({relatedTarget:!0});a.hoverChartIndex=t.index;1===c.touches.length?(c=this.normalize(c),(w=t.isInsidePlot(c.chartX-t.plotLeft,c.chartY-t.plotTop))&&!t.openMenu?(p&&this.runPointActions(c),"touchmove"===c.type&&(p=this.pinchDown,v=p[0]?4<=Math.sqrt(Math.pow(p[0].chartX-c.chartX,2)+Math.pow(p[0].chartY-c.chartY,2)):!1),k(v,!0)&&this.pinch(c)):p&&this.reset()):2===c.touches.length&&this.pinch(c)},onContainerTouchStart:function(a){this.zoomOption(a);
this.touch(a,!0)},onContainerTouchMove:function(a){this.touch(a)},onDocumentTouchEnd:function(c){y[a.hoverChartIndex]&&y[a.hoverChartIndex].pointer.drop(c)}})})(I);(function(a){var y=a.addEvent,F=a.charts,G=a.css,k=a.doc,c=a.extend,p=a.noop,t=a.Pointer,v=a.removeEvent,w=a.win,r=a.wrap;if(!a.hasTouch&&(w.PointerEvent||w.MSPointerEvent)){var h={},e=!!w.PointerEvent,l=function(){var d=[];d.item=function(a){return this[a]};a.objectEach(h,function(a){d.push({pageX:a.pageX,pageY:a.pageY,target:a.target})});
return d},n=function(d,g,b,e){"touch"!==d.pointerType&&d.pointerType!==d.MSPOINTER_TYPE_TOUCH||!F[a.hoverChartIndex]||(e(d),e=F[a.hoverChartIndex].pointer,e[g]({type:b,target:d.currentTarget,preventDefault:p,touches:l()}))};c(t.prototype,{onContainerPointerDown:function(a){n(a,"onContainerTouchStart","touchstart",function(a){h[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){n(a,"onContainerTouchMove","touchmove",function(a){h[a.pointerId]={pageX:a.pageX,
pageY:a.pageY};h[a.pointerId].target||(h[a.pointerId].target=a.currentTarget)})},onDocumentPointerUp:function(a){n(a,"onDocumentTouchEnd","touchend",function(a){delete h[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,e?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,e?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(k,e?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});r(t.prototype,"init",function(a,g,b){a.call(this,g,b);this.hasZoom&&
G(g.container,{"-ms-touch-action":"none","touch-action":"none"})});r(t.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(y)});r(t.prototype,"destroy",function(a){this.batchMSEvents(v);a.call(this)})}})(I);(function(a){var y=a.addEvent,F=a.css,G=a.discardElement,k=a.defined,c=a.fireEvent,p=a.isFirefox,t=a.marginNames,v=a.merge,w=a.pick,r=a.setAnimation,h=a.stableSort,e=a.win,l=a.wrap;a.Legend=function(a,d){this.init(a,d)};a.Legend.prototype=
{init:function(a,d){this.chart=a;this.setOptions(d);d.enabled&&(this.render(),y(this.chart,"endResize",function(){this.legend.positionCheckboxes()}),this.proximate?this.unchartrender=y(this.chart,"render",function(){this.legend.proximatePositions();this.legend.positionItems()}):this.unchartrender&&this.unchartrender())},setOptions:function(a){var d=w(a.padding,8);this.options=a;this.chart.styledMode||(this.itemStyle=a.itemStyle,this.itemHiddenStyle=v(this.itemStyle,a.itemHiddenStyle));this.itemMarginTop=
a.itemMarginTop||0;this.padding=d;this.initialItemY=d-5;this.symbolWidth=w(a.symbolWidth,16);this.pages=[];this.proximate="proximate"===a.layout&&!this.chart.inverted},update:function(a,d){var g=this.chart;this.setOptions(v(!0,this.options,a));this.destroy();g.isDirtyLegend=g.isDirtyBox=!0;w(d,!0)&&g.redraw();c(this,"afterUpdate")},colorizeItem:function(a,d){a.legendGroup[d?"removeClass":"addClass"]("highcharts-legend-item-hidden");if(!this.chart.styledMode){var g=this.options,b=a.legendItem,e=a.legendLine,
h=a.legendSymbol,n=this.itemHiddenStyle.color,g=d?g.itemStyle.color:n,l=d?a.color||n:n,k=a.options&&a.options.marker,m={fill:l};b&&b.css({fill:g,color:g});e&&e.attr({stroke:l});h&&(k&&h.isMarker&&(m=a.pointAttribs(),d||(m.stroke=m.fill=n)),h.attr(m))}c(this,"afterColorizeItem",{item:a,visible:d})},positionItems:function(){this.allItems.forEach(this.positionItem,this);this.chart.isResizing||this.positionCheckboxes()},positionItem:function(a){var d=this.options,e=d.symbolPadding,d=!d.rtl,b=a._legendItemPos,
c=b[0],b=b[1],h=a.checkbox;if((a=a.legendGroup)&&a.element)a[k(a.translateY)?"animate":"attr"]({translateX:d?c:this.legendWidth-c-2*e-4,translateY:b});h&&(h.x=c,h.y=b)},destroyItem:function(a){var d=a.checkbox;["legendItem","legendLine","legendSymbol","legendGroup"].forEach(function(d){a[d]&&(a[d]=a[d].destroy())});d&&G(a.checkbox)},destroy:function(){function a(a){this[a]&&(this[a]=this[a].destroy())}this.getAllItems().forEach(function(d){["legendItem","legendGroup"].forEach(a,d)});"clipRect up down pager nav box title group".split(" ").forEach(a,
this);this.display=null},positionCheckboxes:function(){var a=this.group&&this.group.alignAttr,d,e=this.clipHeight||this.legendHeight,b=this.titleHeight;a&&(d=a.translateY,this.allItems.forEach(function(g){var c=g.checkbox,h;c&&(h=d+b+c.y+(this.scrollOffset||0)+3,F(c,{left:a.translateX+g.checkboxOffset+c.x-20+"px",top:h+"px",display:this.proximate||h>d-6&&h<d+e-6?"":"none"}))},this))},renderTitle:function(){var a=this.options,d=this.padding,e=a.title,b=0;e.text&&(this.title||(this.title=this.chart.renderer.label(e.text,
d-3,d-4,null,null,null,a.useHTML,null,"legend-title").attr({zIndex:1}),this.chart.styledMode||this.title.css(e.style),this.title.add(this.group)),e.width||this.title.css({width:this.maxLegendWidth+"px"}),a=this.title.getBBox(),b=a.height,this.offsetWidth=a.width,this.contentGroup.attr({translateY:b}));this.titleHeight=b},setText:function(e){var d=this.options;e.legendItem.attr({text:d.labelFormat?a.format(d.labelFormat,e,this.chart.time):d.labelFormatter.call(e)})},renderItem:function(a){var d=this.chart,
e=d.renderer,b=this.options,c=this.symbolWidth,h=b.symbolPadding,n=this.itemStyle,l=this.itemHiddenStyle,k="horizontal"===b.layout?w(b.itemDistance,20):0,m=!b.rtl,z=a.legendItem,D=!a.series,A=!D&&a.series.drawLegendSymbol?a.series:a,f=A.options,f=this.createCheckboxForItem&&f&&f.showCheckbox,k=c+h+k+(f?20:0),q=b.useHTML,r=a.options.className;z||(a.legendGroup=e.g("legend-item").addClass("highcharts-"+A.type+"-series highcharts-color-"+a.colorIndex+(r?" "+r:"")+(D?" highcharts-series-"+a.index:"")).attr({zIndex:1}).add(this.scrollGroup),
a.legendItem=z=e.text("",m?c+h:-h,this.baseline||0,q),d.styledMode||z.css(v(a.visible?n:l)),z.attr({align:m?"left":"right",zIndex:2}).add(a.legendGroup),this.baseline||(this.fontMetrics=e.fontMetrics(d.styledMode?12:n.fontSize,z),this.baseline=this.fontMetrics.f+3+this.itemMarginTop,z.attr("y",this.baseline)),this.symbolHeight=b.symbolHeight||this.fontMetrics.f,A.drawLegendSymbol(this,a),this.setItemEvents&&this.setItemEvents(a,z,q),f&&this.createCheckboxForItem(a));this.colorizeItem(a,a.visible);
!d.styledMode&&n.width||z.css({width:(b.itemWidth||this.widthOption||d.spacingBox.width)-k});this.setText(a);d=z.getBBox();a.itemWidth=a.checkboxOffset=b.itemWidth||a.legendItemWidth||d.width+k;this.maxItemWidth=Math.max(this.maxItemWidth,a.itemWidth);this.totalItemWidth+=a.itemWidth;this.itemHeight=a.itemHeight=Math.round(a.legendItemHeight||d.height||this.symbolHeight)},layoutItem:function(a){var d=this.options,e=this.padding,b="horizontal"===d.layout,c=a.itemHeight,h=d.itemMarginBottom||0,n=this.itemMarginTop,
l=b?w(d.itemDistance,20):0,k=this.maxLegendWidth,d=d.alignColumns&&this.totalItemWidth>k?this.maxItemWidth:a.itemWidth;b&&this.itemX-e+d>k&&(this.itemX=e,this.itemY+=n+this.lastLineHeight+h,this.lastLineHeight=0);this.lastItemY=n+this.itemY+h;this.lastLineHeight=Math.max(c,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];b?this.itemX+=d:(this.itemY+=n+c+h,this.lastLineHeight=c);this.offsetWidth=this.widthOption||Math.max((b?this.itemX-e-(a.checkbox?0:l):d)+e,this.offsetWidth)},getAllItems:function(){var a=
[];this.chart.series.forEach(function(d){var e=d&&d.options;d&&w(e.showInLegend,k(e.linkedTo)?!1:void 0,!0)&&(a=a.concat(d.legendItems||("point"===e.legendType?d.data:d)))});c(this,"afterGetAllItems",{allItems:a});return a},getAlignment:function(){var a=this.options;return this.proximate?a.align.charAt(0)+"tv":a.floating?"":a.align.charAt(0)+a.verticalAlign.charAt(0)+a.layout.charAt(0)},adjustMargins:function(a,d){var e=this.chart,b=this.options,c=this.getAlignment(),h=void 0!==e.options.title.margin?
e.titleOffset+e.options.title.margin:0;c&&[/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/].forEach(function(g,n){g.test(c)&&!k(a[n])&&(e[t[n]]=Math.max(e[t[n]],e.legend[(n+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][n]*b[n%2?"x":"y"]+w(b.margin,12)+d[n]+(0===n&&(0===e.titleOffset?0:h))))})},proximatePositions:function(){var e=this.chart,d=[],g="left"===this.options.align;this.allItems.forEach(function(b){var c,h;c=g;b.xAxis&&b.points&&(b.xAxis.options.reversed&&(c=!c),c=a.find(c?b.points:
b.points.slice(0).reverse(),function(b){return a.isNumber(b.plotY)}),h=b.legendGroup.getBBox().height,d.push({target:b.visible?(c?c.plotY:b.xAxis.height)-.3*h:e.plotHeight,size:h,item:b}))},this);a.distribute(d,e.plotHeight);d.forEach(function(a){a.item._legendItemPos[1]=e.plotTop-e.spacing[0]+a.pos})},render:function(){var e=this.chart,d=e.renderer,g=this.group,b,l,k,r=this.box,p=this.options,B=this.padding;this.itemX=B;this.itemY=this.initialItemY;this.lastItemY=this.offsetWidth=0;this.widthOption=
a.relativeLength(p.width,e.spacingBox.width-B);b=e.spacingBox.width-2*B-p.x;-1<["rm","lm"].indexOf(this.getAlignment().substring(0,2))&&(b/=2);this.maxLegendWidth=this.widthOption||b;g||(this.group=g=d.g("legend").attr({zIndex:7}).add(),this.contentGroup=d.g().attr({zIndex:1}).add(g),this.scrollGroup=d.g().add(this.contentGroup));this.renderTitle();b=this.getAllItems();h(b,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});p.reversed&&b.reverse();this.allItems=
b;this.display=l=!!b.length;this.itemHeight=this.totalItemWidth=this.maxItemWidth=this.lastLineHeight=0;b.forEach(this.renderItem,this);b.forEach(this.layoutItem,this);b=(this.widthOption||this.offsetWidth)+B;k=this.lastItemY+this.lastLineHeight+this.titleHeight;k=this.handleOverflow(k);k+=B;r||(this.box=r=d.rect().addClass("highcharts-legend-box").attr({r:p.borderRadius}).add(g),r.isNew=!0);e.styledMode||r.attr({stroke:p.borderColor,"stroke-width":p.borderWidth||0,fill:p.backgroundColor||"none"}).shadow(p.shadow);
0<b&&0<k&&(r[r.isNew?"attr":"animate"](r.crisp.call({},{x:0,y:0,width:b,height:k},r.strokeWidth())),r.isNew=!1);r[l?"show":"hide"]();e.styledMode&&"none"===g.getStyle("display")&&(b=k=0);this.legendWidth=b;this.legendHeight=k;l&&(d=e.spacingBox,/(lth|ct|rth)/.test(this.getAlignment())&&(r=d.y+e.titleOffset,d=v(d,{y:0<e.titleOffset?r+=e.options.title.margin:r})),g.align(v(p,{width:b,height:k,verticalAlign:this.proximate?"top":p.verticalAlign}),!0,d));this.proximate||this.positionItems();c(this,"afterRender")},
handleOverflow:function(a){var d=this,e=this.chart,b=e.renderer,c=this.options,h=c.y,n=this.padding,h=e.spacingBox.height+("top"===c.verticalAlign?-h:h)-n,l=c.maxHeight,k,m=this.clipRect,z=c.navigation,D=w(z.animation,!0),r=z.arrowSize||12,f=this.nav,q=this.pages,p,t=this.allItems,v=function(a){"number"===typeof a?m.attr({height:a}):m&&(d.clipRect=m.destroy(),d.contentGroup.clip());d.contentGroup.div&&(d.contentGroup.div.style.clip=a?"rect("+n+"px,9999px,"+(n+a)+"px,0)":"auto")};"horizontal"!==c.layout||
"middle"===c.verticalAlign||c.floating||(h/=2);l&&(h=Math.min(h,l));q.length=0;a>h&&!1!==z.enabled?(this.clipHeight=k=Math.max(h-20-this.titleHeight-n,0),this.currentPage=w(this.currentPage,1),this.fullHeight=a,t.forEach(function(a,b){var f=a._legendItemPos[1],d=Math.round(a.legendItem.getBBox().height),e=q.length;if(!e||f-q[e-1]>k&&(p||f)!==q[e-1])q.push(p||f),e++;a.pageIx=e-1;p&&(t[b-1].pageIx=e-1);b===t.length-1&&f+d-q[e-1]>k&&f!==p&&(q.push(f),a.pageIx=e);f!==p&&(p=f)}),m||(m=d.clipRect=b.clipRect(0,
n,9999,0),d.contentGroup.clip(m)),v(k),f||(this.nav=f=b.g().attr({zIndex:1}).add(this.group),this.up=b.symbol("triangle",0,0,r,r).on("click",function(){d.scroll(-1,D)}).add(f),this.pager=b.text("",15,10).addClass("highcharts-legend-navigation"),e.styledMode||this.pager.css(z.style),this.pager.add(f),this.down=b.symbol("triangle-down",0,0,r,r).on("click",function(){d.scroll(1,D)}).add(f)),d.scroll(0),a=h):f&&(v(),this.nav=f.destroy(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0);return a},
scroll:function(a,d){var e=this.pages,b=e.length;a=this.currentPage+a;var c=this.clipHeight,h=this.options.navigation,l=this.pager,n=this.padding;a>b&&(a=b);0<a&&(void 0!==d&&r(d,this.chart),this.nav.attr({translateX:n,translateY:c+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({"class":1===a?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"}),l.attr({text:a+"/"+b}),this.down.attr({x:18+this.pager.getBBox().width,"class":a===b?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"}),
this.chart.styledMode||(this.up.attr({fill:1===a?h.inactiveColor:h.activeColor}).css({cursor:1===a?"default":"pointer"}),this.down.attr({fill:a===b?h.inactiveColor:h.activeColor}).css({cursor:a===b?"default":"pointer"})),this.scrollOffset=-e[a-1]+this.initialItemY,this.scrollGroup.animate({translateY:this.scrollOffset}),this.currentPage=a,this.positionCheckboxes())}};a.LegendSymbolMixin={drawRectangle:function(a,d){var e=a.symbolHeight,b=a.options.squareSymbol;d.legendSymbol=this.chart.renderer.rect(b?
(a.symbolWidth-e)/2:0,a.baseline-e+1,b?e:a.symbolWidth,e,w(a.options.symbolRadius,e/2)).addClass("highcharts-point").attr({zIndex:3}).add(d.legendGroup)},drawLineMarker:function(a){var d=this.options,e=d.marker,b=a.symbolWidth,c=a.symbolHeight,h=c/2,l=this.chart.renderer,n=this.legendGroup;a=a.baseline-Math.round(.3*a.fontMetrics.b);var k={};this.chart.styledMode||(k={"stroke-width":d.lineWidth||0},d.dashStyle&&(k.dashstyle=d.dashStyle));this.legendLine=l.path(["M",0,a,"L",b,a]).addClass("highcharts-graph").attr(k).add(n);
e&&!1!==e.enabled&&b&&(d=Math.min(w(e.radius,h),h),0===this.symbol.indexOf("url")&&(e=v(e,{width:c,height:c}),d=0),this.legendSymbol=e=l.symbol(this.symbol,b/2-d,a-d,2*d,2*d,e).addClass("highcharts-point").add(n),e.isMarker=!0)}};(/Trident\/7\.0/.test(e.navigator&&e.navigator.userAgent)||p)&&l(a.Legend.prototype,"positionItem",function(a,d){var e=this,b=function(){d._legendItemPos&&a.call(e,d)};b();e.bubbleLegend||setTimeout(b)})})(I);(function(a){var y=a.addEvent,F=a.animate,G=a.animObject,k=a.attr,
c=a.doc,p=a.Axis,t=a.createElement,v=a.defaultOptions,w=a.discardElement,r=a.charts,h=a.css,e=a.defined,l=a.extend,n=a.find,d=a.fireEvent,g=a.isNumber,b=a.isObject,x=a.isString,u=a.Legend,H=a.marginNames,E=a.merge,B=a.objectEach,m=a.Pointer,z=a.pick,D=a.pInt,A=a.removeEvent,f=a.seriesTypes,q=a.splat,L=a.syncTimeout,K=a.win,T=a.Chart=function(){this.getArgs.apply(this,arguments)};a.chart=function(a,b,f){return new T(a,b,f)};l(T.prototype,{callbacks:[],getArgs:function(){var a=[].slice.call(arguments);
if(x(a[0])||a[0].nodeName)this.renderTo=a.shift();this.init(a[0],a[1])},init:function(b,f){var e,g,c=b.series,m=b.plotOptions||{};d(this,"init",{args:arguments},function(){b.series=null;e=E(v,b);for(g in e.plotOptions)e.plotOptions[g].tooltip=m[g]&&E(m[g].tooltip)||void 0;e.tooltip.userOptions=b.chart&&b.chart.forExport&&b.tooltip.userOptions||b.tooltip;e.series=b.series=c;this.userOptions=b;var h=e.chart,q=h.events;this.margin=[];this.spacing=[];this.bounds={h:{},v:{}};this.labelCollectors=[];this.callback=
f;this.isResizing=0;this.options=e;this.axes=[];this.series=[];this.time=b.time&&Object.keys(b.time).length?new a.Time(b.time):a.time;this.styledMode=h.styledMode;this.hasCartesianSeries=h.showAxes;var l=this;l.index=r.length;r.push(l);a.chartCount++;q&&B(q,function(a,b){y(l,b,a)});l.xAxis=[];l.yAxis=[];l.pointCount=l.colorCounter=l.symbolCounter=0;d(l,"afterInit");l.firstRender()})},initSeries:function(b){var d=this.options.chart;(d=f[b.type||d.type||d.defaultSeriesType])||a.error(17,!0,this);d=
new d;d.init(this,b);return d},orderSeries:function(a){var b=this.series;for(a=a||0;a<b.length;a++)b[a]&&(b[a].index=a,b[a].name=b[a].getName())},isInsidePlot:function(a,b,f){var d=f?b:a;a=f?a:b;return 0<=d&&d<=this.plotWidth&&0<=a&&a<=this.plotHeight},redraw:function(b){d(this,"beforeRedraw");var f=this.axes,e=this.series,g=this.pointer,c=this.legend,m=this.userOptions.legend,h=this.isDirtyLegend,q,n,z=this.hasCartesianSeries,k=this.isDirtyBox,D,u=this.renderer,r=u.isHidden(),A=[];this.setResponsive&&
this.setResponsive(!1);a.setAnimation(b,this);r&&this.temporaryDisplay();this.layOutTitles();for(b=e.length;b--;)if(D=e[b],D.options.stacking&&(q=!0,D.isDirty)){n=!0;break}if(n)for(b=e.length;b--;)D=e[b],D.options.stacking&&(D.isDirty=!0);e.forEach(function(a){a.isDirty&&("point"===a.options.legendType?(a.updateTotals&&a.updateTotals(),h=!0):m&&(m.labelFormatter||m.labelFormat)&&(h=!0));a.isDirtyData&&d(a,"updatedData")});h&&c&&c.options.enabled&&(c.render(),this.isDirtyLegend=!1);q&&this.getStacks();
z&&f.forEach(function(a){a.updateNames();a.setScale()});this.getMargins();z&&(f.forEach(function(a){a.isDirty&&(k=!0)}),f.forEach(function(a){var b=a.min+","+a.max;a.extKey!==b&&(a.extKey=b,A.push(function(){d(a,"afterSetExtremes",l(a.eventArgs,a.getExtremes()));delete a.eventArgs}));(k||q)&&a.redraw()}));k&&this.drawChartBox();d(this,"predraw");e.forEach(function(a){(k||a.isDirty)&&a.visible&&a.redraw();a.isDirtyData=!1});g&&g.reset(!0);u.draw();d(this,"redraw");d(this,"render");r&&this.temporaryDisplay(!0);
A.forEach(function(a){a.call()})},get:function(a){function b(b){return b.id===a||b.options&&b.options.id===a}var f,d=this.series,e;f=n(this.axes,b)||n(this.series,b);for(e=0;!f&&e<d.length;e++)f=n(d[e].points||[],b);return f},getAxes:function(){var a=this,b=this.options,f=b.xAxis=q(b.xAxis||{}),b=b.yAxis=q(b.yAxis||{});d(this,"getAxes");f.forEach(function(a,b){a.index=b;a.isX=!0});b.forEach(function(a,b){a.index=b});f.concat(b).forEach(function(b){new p(a,b)});d(this,"afterGetAxes")},getSelectedPoints:function(){var a=
[];this.series.forEach(function(b){a=a.concat((b[b.hasGroupedData?"points":"data"]||[]).filter(function(a){return a.selected}))});return a},getSelectedSeries:function(){return this.series.filter(function(a){return a.selected})},setTitle:function(a,b,f){var d=this,e=d.options,g=d.styledMode,c;c=e.title=E(!g&&{style:{color:"#333333",fontSize:e.isStock?"16px":"18px"}},e.title,a);e=e.subtitle=E(!g&&{style:{color:"#666666"}},e.subtitle,b);[["title",a,c],["subtitle",b,e]].forEach(function(a,b){var f=a[0],
e=d[f],c=a[1];a=a[2];e&&c&&(d[f]=e=e.destroy());a&&!e&&(d[f]=d.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":"highcharts-"+f,zIndex:a.zIndex||4}).add(),d[f].update=function(a){d.setTitle(!b&&a,b&&a)},g||d[f].css(a.style))});d.layOutTitles(f)},layOutTitles:function(a){var b=0,f,d=this.renderer,e=this.spacingBox;["title","subtitle"].forEach(function(a){var f=this[a],g=this.options[a];a="title"===a?-3:g.verticalAlign?0:b+2;var c;f&&(this.styledMode||(c=g.style.fontSize),c=d.fontMetrics(c,
f).b,f.css({width:(g.width||e.width+g.widthAdjust)+"px"}).align(l({y:a+c},g),!1,"spacingBox"),g.floating||g.verticalAlign||(b=Math.ceil(b+f.getBBox(g.useHTML).height)))},this);f=this.titleOffset!==b;this.titleOffset=b;!this.isDirtyBox&&f&&(this.isDirtyBox=this.isDirtyLegend=f,this.hasRendered&&z(a,!0)&&this.isDirtyBox&&this.redraw())},getChartSize:function(){var b=this.options.chart,f=b.width,b=b.height,d=this.renderTo;e(f)||(this.containerWidth=a.getStyle(d,"width"));e(b)||(this.containerHeight=
a.getStyle(d,"height"));this.chartWidth=Math.max(0,f||this.containerWidth||600);this.chartHeight=Math.max(0,a.relativeLength(b,this.chartWidth)||(1<this.containerHeight?this.containerHeight:400))},temporaryDisplay:function(b){var f=this.renderTo;if(b)for(;f&&f.style;)f.hcOrigStyle&&(a.css(f,f.hcOrigStyle),delete f.hcOrigStyle),f.hcOrigDetached&&(c.body.removeChild(f),f.hcOrigDetached=!1),f=f.parentNode;else for(;f&&f.style;){c.body.contains(f)||f.parentNode||(f.hcOrigDetached=!0,c.body.appendChild(f));
if("none"===a.getStyle(f,"display",!1)||f.hcOricDetached)f.hcOrigStyle={display:f.style.display,height:f.style.height,overflow:f.style.overflow},b={display:"block",overflow:"hidden"},f!==this.renderTo&&(b.height=0),a.css(f,b),f.offsetWidth||f.style.setProperty("display","block","important");f=f.parentNode;if(f===c.body)break}},setClassName:function(a){this.container.className="highcharts-container "+(a||"")},getContainer:function(){var b,f=this.options,e=f.chart,m,q;b=this.renderTo;var n=a.uniqueKey(),
z,u;b||(this.renderTo=b=e.renderTo);x(b)&&(this.renderTo=b=c.getElementById(b));b||a.error(13,!0,this);m=D(k(b,"data-highcharts-chart"));g(m)&&r[m]&&r[m].hasRendered&&r[m].destroy();k(b,"data-highcharts-chart",this.index);b.innerHTML="";e.skipClone||b.offsetWidth||this.temporaryDisplay();this.getChartSize();m=this.chartWidth;q=this.chartHeight;h(b,{overflow:"hidden"});this.styledMode||(z=l({position:"relative",overflow:"hidden",width:m+"px",height:q+"px",textAlign:"left",lineHeight:"normal",zIndex:0,
"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},e.style));this.container=b=t("div",{id:n},z,b);this._cursor=b.style.cursor;this.renderer=new (a[e.renderer]||a.Renderer)(b,m,q,null,e.forExport,f.exporting&&f.exporting.allowHTML,this.styledMode);this.setClassName(e.className);if(this.styledMode)for(u in f.defs)this.renderer.definition(f.defs[u]);else this.renderer.setStyle(e.style);this.renderer.chartIndex=this.index;d(this,"afterGetContainer")},getMargins:function(a){var b=this.spacing,f=this.margin,
g=this.titleOffset;this.resetMargins();g&&!e(f[0])&&(this.plotTop=Math.max(this.plotTop,g+this.options.title.margin+b[0]));this.legend&&this.legend.display&&this.legend.adjustMargins(f,b);d(this,"getMargins");a||this.getAxisMargins()},getAxisMargins:function(){var a=this,b=a.axisOffset=[0,0,0,0],f=a.margin;a.hasCartesianSeries&&a.axes.forEach(function(a){a.visible&&a.getOffset()});H.forEach(function(d,g){e(f[g])||(a[d]+=b[g])});a.setChartSize()},reflow:function(b){var f=this,d=f.options.chart,g=f.renderTo,
m=e(d.width)&&e(d.height),h=d.width||a.getStyle(g,"width"),d=d.height||a.getStyle(g,"height"),g=b?b.target:K;if(!m&&!f.isPrinting&&h&&d&&(g===K||g===c)){if(h!==f.containerWidth||d!==f.containerHeight)a.clearTimeout(f.reflowTimeout),f.reflowTimeout=L(function(){f.container&&f.setSize(void 0,void 0,!1)},b?100:0);f.containerWidth=h;f.containerHeight=d}},setReflow:function(a){var b=this;!1===a||this.unbindReflow?!1===a&&this.unbindReflow&&(this.unbindReflow=this.unbindReflow()):(this.unbindReflow=y(K,
"resize",function(a){b.reflow(a)}),y(this,"destroy",this.unbindReflow))},setSize:function(b,f,e){var g=this,c=g.renderer,m;g.isResizing+=1;a.setAnimation(e,g);g.oldChartHeight=g.chartHeight;g.oldChartWidth=g.chartWidth;void 0!==b&&(g.options.chart.width=b);void 0!==f&&(g.options.chart.height=f);g.getChartSize();g.styledMode||(m=c.globalAnimation,(m?F:h)(g.container,{width:g.chartWidth+"px",height:g.chartHeight+"px"},m));g.setChartSize(!0);c.setSize(g.chartWidth,g.chartHeight,e);g.axes.forEach(function(a){a.isDirty=
!0;a.setScale()});g.isDirtyLegend=!0;g.isDirtyBox=!0;g.layOutTitles();g.getMargins();g.redraw(e);g.oldChartHeight=null;d(g,"resize");L(function(){g&&d(g,"endResize",null,function(){--g.isResizing})},G(m).duration)},setChartSize:function(a){var b=this.inverted,f=this.renderer,e=this.chartWidth,g=this.chartHeight,c=this.options.chart,m=this.spacing,h=this.clipOffset,q,l,n,z;this.plotLeft=q=Math.round(this.plotLeft);this.plotTop=l=Math.round(this.plotTop);this.plotWidth=n=Math.max(0,Math.round(e-q-this.marginRight));
this.plotHeight=z=Math.max(0,Math.round(g-l-this.marginBottom));this.plotSizeX=b?z:n;this.plotSizeY=b?n:z;this.plotBorderWidth=c.plotBorderWidth||0;this.spacingBox=f.spacingBox={x:m[3],y:m[0],width:e-m[3]-m[1],height:g-m[0]-m[2]};this.plotBox=f.plotBox={x:q,y:l,width:n,height:z};e=2*Math.floor(this.plotBorderWidth/2);b=Math.ceil(Math.max(e,h[3])/2);f=Math.ceil(Math.max(e,h[0])/2);this.clipBox={x:b,y:f,width:Math.floor(this.plotSizeX-Math.max(e,h[1])/2-b),height:Math.max(0,Math.floor(this.plotSizeY-
Math.max(e,h[2])/2-f))};a||this.axes.forEach(function(a){a.setAxisSize();a.setAxisTranslation()});d(this,"afterSetChartSize",{skipAxes:a})},resetMargins:function(){d(this,"resetMargins");var a=this,f=a.options.chart;["margin","spacing"].forEach(function(d){var e=f[d],g=b(e)?e:[e,e,e,e];["Top","Right","Bottom","Left"].forEach(function(b,e){a[d][e]=z(f[d+b],g[e])})});H.forEach(function(b,f){a[b]=z(a.margin[f],a.spacing[f])});a.axisOffset=[0,0,0,0];a.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=
this.options.chart,b=this.renderer,f=this.chartWidth,e=this.chartHeight,g=this.chartBackground,c=this.plotBackground,m=this.plotBorder,h,q=this.styledMode,l=this.plotBGImage,n=a.backgroundColor,z=a.plotBackgroundColor,k=a.plotBackgroundImage,D,u=this.plotLeft,r=this.plotTop,A=this.plotWidth,x=this.plotHeight,p=this.plotBox,B=this.clipRect,t=this.clipBox,v="animate";g||(this.chartBackground=g=b.rect().addClass("highcharts-background").add(),v="attr");if(q)h=D=g.strokeWidth();else{h=a.borderWidth||
0;D=h+(a.shadow?8:0);n={fill:n||"none"};if(h||g["stroke-width"])n.stroke=a.borderColor,n["stroke-width"]=h;g.attr(n).shadow(a.shadow)}g[v]({x:D/2,y:D/2,width:f-D-h%2,height:e-D-h%2,r:a.borderRadius});v="animate";c||(v="attr",this.plotBackground=c=b.rect().addClass("highcharts-plot-background").add());c[v](p);q||(c.attr({fill:z||"none"}).shadow(a.plotShadow),k&&(l?l.animate(p):this.plotBGImage=b.image(k,u,r,A,x).add()));B?B.animate({width:t.width,height:t.height}):this.clipRect=b.clipRect(t);v="animate";
m||(v="attr",this.plotBorder=m=b.rect().addClass("highcharts-plot-border").attr({zIndex:1}).add());q||m.attr({stroke:a.plotBorderColor,"stroke-width":a.plotBorderWidth||0,fill:"none"});m[v](m.crisp({x:u,y:r,width:A,height:x},-m.strokeWidth()));this.isDirtyBox=!1;d(this,"afterDrawChartBox")},propFromSeries:function(){var a=this,b=a.options.chart,d,e=a.options.series,g,c;["inverted","angular","polar"].forEach(function(m){d=f[b.type||b.defaultSeriesType];c=b[m]||d&&d.prototype[m];for(g=e&&e.length;!c&&
g--;)(d=f[e[g].type])&&d.prototype[m]&&(c=!0);a[m]=c})},linkSeries:function(){var a=this,b=a.series;b.forEach(function(a){a.linkedSeries.length=0});b.forEach(function(b){var f=b.options.linkedTo;x(f)&&(f=":previous"===f?a.series[b.index-1]:a.get(f))&&f.linkedParent!==b&&(f.linkedSeries.push(b),b.linkedParent=f,b.visible=z(b.options.visible,f.options.visible,b.visible))});d(this,"afterLinkSeries")},renderSeries:function(){this.series.forEach(function(a){a.translate();a.render()})},renderLabels:function(){var a=
this,b=a.options.labels;b.items&&b.items.forEach(function(f){var d=l(b.style,f.style),e=D(d.left)+a.plotLeft,g=D(d.top)+a.plotTop+12;delete d.left;delete d.top;a.renderer.text(f.html,e,g).attr({zIndex:2}).css(d).add()})},render:function(){var a=this.axes,b=this.renderer,f=this.options,d=0,e,g,c;this.setTitle();this.legend=new u(this,f.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();f=this.plotWidth;a.some(function(a){if(a.horiz&&a.visible&&a.options.labels.enabled&&
a.series.length)return d=21,!0});e=this.plotHeight=Math.max(this.plotHeight-d,0);a.forEach(function(a){a.setScale()});this.getAxisMargins();g=1.1<f/this.plotWidth;c=1.05<e/this.plotHeight;if(g||c)a.forEach(function(a){(a.horiz&&g||!a.horiz&&c)&&a.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries&&a.forEach(function(a){a.visible&&a.render()});this.seriesGroup||(this.seriesGroup=b.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.addCredits();
this.setResponsive&&this.setResponsive();this.hasRendered=!0},addCredits:function(a){var b=this;a=E(!0,this.options.credits,a);a.enabled&&!this.credits&&(this.credits=this.renderer.text(a.text+(this.mapCredits||""),0,0).addClass("highcharts-credits").on("click",function(){a.href&&(K.location.href=a.href)}).attr({align:a.position.align,zIndex:8}),b.styledMode||this.credits.css(a.style),this.credits.add().align(a.position),this.credits.update=function(a){b.credits=b.credits.destroy();b.addCredits(a)})},
destroy:function(){var b=this,f=b.axes,e=b.series,g=b.container,c,m=g&&g.parentNode;d(b,"destroy");b.renderer.forExport?a.erase(r,b):r[b.index]=void 0;a.chartCount--;b.renderTo.removeAttribute("data-highcharts-chart");A(b);for(c=f.length;c--;)f[c]=f[c].destroy();this.scroller&&this.scroller.destroy&&this.scroller.destroy();for(c=e.length;c--;)e[c]=e[c].destroy();"title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" ").forEach(function(a){var f=
b[a];f&&f.destroy&&(b[a]=f.destroy())});g&&(g.innerHTML="",A(g),m&&w(g));B(b,function(a,f){delete b[f]})},firstRender:function(){var b=this,f=b.options;if(!b.isReadyToRender||b.isReadyToRender()){b.getContainer();b.resetMargins();b.setChartSize();b.propFromSeries();b.getAxes();(a.isArray(f.series)?f.series:[]).forEach(function(a){b.initSeries(a)});b.linkSeries();d(b,"beforeRender");m&&(b.pointer=new m(b,f));b.render();if(!b.renderer.imgCount&&b.onload)b.onload();b.temporaryDisplay(!0)}},onload:function(){[this.callback].concat(this.callbacks).forEach(function(a){a&&
void 0!==this.index&&a.apply(this,[this])},this);d(this,"load");d(this,"render");e(this.index)&&this.setReflow(this.options.chart.reflow);this.onload=null}})})(I);(function(a){var y=a.addEvent,F=a.Chart;y(F,"afterSetChartSize",function(y){var k=this.options.chart.scrollablePlotArea;(k=k&&k.minWidth)&&!this.renderer.forExport&&(this.scrollablePixels=k=Math.max(0,k-this.chartWidth))&&(this.plotWidth+=k,this.clipBox.width+=k,y.skipAxes||this.axes.forEach(function(c){1===c.side?c.getPlotLinePath=function(){var k=
this.right,t;this.right=k-c.chart.scrollablePixels;t=a.Axis.prototype.getPlotLinePath.apply(this,arguments);this.right=k;return t}:(c.setAxisSize(),c.setAxisTranslation())}))});y(F,"render",function(){this.scrollablePixels?(this.setUpScrolling&&this.setUpScrolling(),this.applyFixed()):this.fixedDiv&&this.applyFixed()});F.prototype.setUpScrolling=function(){this.scrollingContainer=a.createElement("div",{className:"highcharts-scrolling"},{overflowX:"auto",WebkitOverflowScrolling:"touch"},this.renderTo);
this.innerContainer=a.createElement("div",{className:"highcharts-inner-container"},null,this.scrollingContainer);this.innerContainer.appendChild(this.container);this.setUpScrolling=null};F.prototype.applyFixed=function(){var y=this.container,k,c,p=!this.fixedDiv;p&&(this.fixedDiv=a.createElement("div",{className:"highcharts-fixed"},{position:"absolute",overflow:"hidden",pointerEvents:"none",zIndex:2},null,!0),this.renderTo.insertBefore(this.fixedDiv,this.renderTo.firstChild),this.renderTo.style.overflow=
"visible",this.fixedRenderer=k=new a.Renderer(this.fixedDiv,0,0),this.scrollableMask=k.path().attr({fill:a.color(this.options.chart.backgroundColor||"#fff").setOpacity(.85).get(),zIndex:-1}).addClass("highcharts-scrollable-mask").add(),[this.inverted?".highcharts-xaxis":".highcharts-yaxis",this.inverted?".highcharts-xaxis-labels":".highcharts-yaxis-labels",".highcharts-contextbutton",".highcharts-credits",".highcharts-legend",".highcharts-subtitle",".highcharts-title",".highcharts-legend-checkbox"].forEach(function(a){[].forEach.call(y.querySelectorAll(a),
function(a){(a.namespaceURI===k.SVG_NS?k.box:k.box.parentNode).appendChild(a);a.style.pointerEvents="auto"})}));this.fixedRenderer.setSize(this.chartWidth,this.chartHeight);c=this.chartWidth+this.scrollablePixels;a.stop(this.container);this.container.style.width=c+"px";this.renderer.boxWrapper.attr({width:c,height:this.chartHeight,viewBox:[0,0,c,this.chartHeight].join(" ")});this.chartBackground.attr({width:c});p&&(c=this.options.chart.scrollablePlotArea,c.scrollPositionX&&(this.scrollingContainer.scrollLeft=
this.scrollablePixels*c.scrollPositionX));p=this.axisOffset;c=this.plotTop-p[0]-1;var p=this.plotTop+this.plotHeight+p[2],t=this.plotLeft+this.plotWidth-this.scrollablePixels;this.scrollableMask.attr({d:this.scrollablePixels?["M",0,c,"L",this.plotLeft-1,c,"L",this.plotLeft-1,p,"L",0,p,"Z","M",t,c,"L",this.chartWidth,c,"L",this.chartWidth,p,"L",t,p,"Z"]:["M",0,0]})}})(I);(function(a){var y,F=a.extend,G=a.erase,k=a.fireEvent,c=a.format,p=a.isArray,t=a.isNumber,v=a.pick,w=a.uniqueKey,r=a.defined,h=a.removeEvent;
a.Point=y=function(){};a.Point.prototype={init:function(a,c,h){var d;d=a.chart.options.chart.colorCount;var e=a.chart.styledMode;this.series=a;e||(this.color=a.color);this.applyOptions(c,h);this.id=r(this.id)?this.id:w();a.options.colorByPoint?(e||(d=a.options.colors||a.chart.options.colors,this.color=this.color||d[a.colorCounter],d=d.length),c=a.colorCounter,a.colorCounter++,a.colorCounter===d&&(a.colorCounter=0)):c=a.colorIndex;this.colorIndex=v(this.colorIndex,c);a.chart.pointCount++;k(this,"afterInit");
return this},applyOptions:function(a,c){var e=this.series,d=e.options.pointValKey||e.pointValKey;a=y.prototype.optionsToObject.call(this,a);F(this,a);this.options=this.options?F(this.options,a):a;a.group&&delete this.group;a.dataLabels&&delete this.dataLabels;d&&(this.y=this[d]);this.isNull=v(this.isValid&&!this.isValid(),null===this.x||!t(this.y,!0));this.selected&&(this.state="select");"name"in this&&void 0===c&&e.xAxis&&e.xAxis.hasNames&&(this.x=e.xAxis.nameToX(this));void 0===this.x&&e&&(this.x=
void 0===c?e.autoIncrement(this):c);return this},setNestedProperty:function(e,c,h){h.split(".").reduce(function(d,e,b,h){d[e]=h.length-1===b?c:a.isObject(d[e],!0)?d[e]:{};return d[e]},e);return e},optionsToObject:function(e){var c={},h=this.series,d=h.options.keys,g=d||h.pointArrayMap||["y"],b=g.length,k=0,u=0;if(t(e)||null===e)c[g[0]]=e;else if(p(e))for(!d&&e.length>b&&(h=typeof e[0],"string"===h?c.name=e[0]:"number"===h&&(c.x=e[0]),k++);u<b;)d&&void 0===e[k]||(0<g[u].indexOf(".")?a.Point.prototype.setNestedProperty(c,
e[k],g[u]):c[g[u]]=e[k]),k++,u++;else"object"===typeof e&&(c=e,e.dataLabels&&(h._hasPointLabels=!0),e.marker&&(h._hasPointMarkers=!0));return c},getClassName:function(){return"highcharts-point"+(this.selected?" highcharts-point-select":"")+(this.negative?" highcharts-negative":"")+(this.isNull?" highcharts-null-point":"")+(void 0!==this.colorIndex?" highcharts-color-"+this.colorIndex:"")+(this.options.className?" "+this.options.className:"")+(this.zone&&this.zone.className?" "+this.zone.className.replace("highcharts-negative",
""):"")},getZone:function(){var a=this.series,c=a.zones,a=a.zoneAxis||"y",h=0,d;for(d=c[h];this[a]>=d.value;)d=c[++h];this.nonZonedColor||(this.nonZonedColor=this.color);this.color=d&&d.color&&!this.options.color?d.color:this.nonZonedColor;return d},destroy:function(){var a=this.series.chart,c=a.hoverPoints,n;a.pointCount--;c&&(this.setState(),G(c,this),c.length||(a.hoverPoints=null));if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel||this.dataLabels)h(this),this.destroyElements();
this.legendItem&&a.legend.destroyItem(this);for(n in this)this[n]=null},destroyElements:function(){for(var a=["graphic","dataLabel","dataLabelUpper","connector","shadowGroup"],c,h=6;h--;)c=a[h],this[c]&&(this[c]=this[c].destroy());this.dataLabels&&(this.dataLabels.forEach(function(a){a.element&&a.destroy()}),delete this.dataLabels);this.connectors&&(this.connectors.forEach(function(a){a.element&&a.destroy()}),delete this.connectors)},getLabelConfig:function(){return{x:this.category,y:this.y,color:this.color,
colorIndex:this.colorIndex,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var e=this.series,h=e.tooltipOptions,d=v(h.valueDecimals,""),g=h.valuePrefix||"",b=h.valueSuffix||"";e.chart.styledMode&&(a=e.chart.tooltip.styledModeFormat(a));(e.pointArrayMap||["y"]).forEach(function(e){e="{point."+e;if(g||b)a=a.replace(RegExp(e+"}","g"),g+e+"}"+b);a=a.replace(RegExp(e+"}","g"),e+":,."+d+"f}")});return c(a,
{point:this,series:this.series},e.chart.time)},firePointEvent:function(a,c,h){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents();"click"===a&&e.allowPointSelect&&(h=function(a){d.select&&d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});k(this,a,c,h)},visible:!0}})(I);(function(a){var y=a.addEvent,F=a.animObject,G=a.arrayMax,k=a.arrayMin,c=a.correctFloat,p=a.defaultOptions,t=a.defaultPlotOptions,v=a.defined,w=a.erase,r=a.extend,
h=a.fireEvent,e=a.isArray,l=a.isNumber,n=a.isString,d=a.merge,g=a.objectEach,b=a.pick,x=a.removeEvent,u=a.splat,H=a.SVGElement,E=a.syncTimeout,B=a.win;a.Series=a.seriesType("line",null,{lineWidth:2,allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},marker:{lineWidth:0,lineColor:"#ffffff",enabledThreshold:2,radius:4,states:{normal:{animation:!0},hover:{animation:{duration:50},enabled:!0,radiusPlus:2,lineWidthPlus:1},select:{fillColor:"#cccccc",lineColor:"#000000",lineWidth:2}}},
point:{events:{}},dataLabels:{align:"center",formatter:function(){return null===this.y?"":a.numberFormat(this.y,-1)},style:{fontSize:"11px",fontWeight:"bold",color:"contrast",textOutline:"1px contrast"},verticalAlign:"bottom",x:0,y:0,padding:5},cropThreshold:300,pointRange:0,softThreshold:!0,states:{normal:{animation:!0},hover:{animation:{duration:50},lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{animation:{duration:0}}},stickyTracking:!0,turboThreshold:1E3,findNearestPointBy:"x"},
{isCartesian:!0,pointClass:a.Point,sorted:!0,requireSorting:!0,directTouch:!1,axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],coll:"series",cropShoulder:1,init:function(a,d){h(this,"init",{options:d});var e=this,c,f=a.series,m;e.chart=a;e.options=d=e.setOptions(d);e.linkedSeries=[];e.bindAxes();r(e,{name:d.name,state:"",visible:!1!==d.visible,selected:!0===d.selected});c=d.events;g(c,function(a,b){e.hcEvents&&e.hcEvents[b]&&-1!==e.hcEvents[b].indexOf(a)||y(e,b,a)});if(c&&c.click||
d.point&&d.point.events&&d.point.events.click||d.allowPointSelect)a.runTrackerClick=!0;e.getColor();e.getSymbol();e.parallelArrays.forEach(function(a){e[a+"Data"]=[]});e.setData(d.data,!1);e.isCartesian&&(a.hasCartesianSeries=!0);f.length&&(m=f[f.length-1]);e._i=b(m&&m._i,-1)+1;a.orderSeries(this.insert(f));h(this,"afterInit")},insert:function(a){var d=this.options.index,e;if(l(d)){for(e=a.length;e--;)if(d>=b(a[e].options.index,a[e]._i)){a.splice(e+1,0,this);break}-1===e&&a.unshift(this);e+=1}else a.push(this);
return b(e,a.length-1)},bindAxes:function(){var b=this,d=b.options,e=b.chart,g;h(this,"bindAxes",null,function(){(b.axisTypes||[]).forEach(function(f){e[f].forEach(function(a){g=a.options;if(d[f]===g.index||void 0!==d[f]&&d[f]===g.id||void 0===d[f]&&0===g.index)b.insert(a.series),b[f]=a,a.isDirty=!0});b[f]||b.optionalAxis===f||a.error(18,!0,e)})})},updateParallelArrays:function(a,b){var d=a.series,e=arguments,f=l(b)?function(f){var e="y"===f&&d.toYData?d.toYData(a):a[f];d[f+"Data"][b]=e}:function(a){Array.prototype[b].apply(d[a+
"Data"],Array.prototype.slice.call(e,2))};d.parallelArrays.forEach(f)},autoIncrement:function(){var a=this.options,d=this.xIncrement,e,g=a.pointIntervalUnit,f=this.chart.time,d=b(d,a.pointStart,0);this.pointInterval=e=b(this.pointInterval,a.pointInterval,1);g&&(a=new f.Date(d),"day"===g?f.set("Date",a,f.get("Date",a)+e):"month"===g?f.set("Month",a,f.get("Month",a)+e):"year"===g&&f.set("FullYear",a,f.get("FullYear",a)+e),e=a.getTime()-d);this.xIncrement=d+e;return d},setOptions:function(a){var e=this.chart,
g=e.options,c=g.plotOptions,f=(e.userOptions||{}).plotOptions||{},m=c[this.type],l=d(a);a=e.styledMode;h(this,"setOptions",{userOptions:l});this.userOptions=l;e=d(m,c.series,l);this.tooltipOptions=d(p.tooltip,p.plotOptions.series&&p.plotOptions.series.tooltip,p.plotOptions[this.type].tooltip,g.tooltip.userOptions,c.series&&c.series.tooltip,c[this.type].tooltip,l.tooltip);this.stickyTracking=b(l.stickyTracking,f[this.type]&&f[this.type].stickyTracking,f.series&&f.series.stickyTracking,this.tooltipOptions.shared&&
!this.noSharedTooltip?!0:e.stickyTracking);null===m.marker&&delete e.marker;this.zoneAxis=e.zoneAxis;g=this.zones=(e.zones||[]).slice();!e.negativeColor&&!e.negativeFillColor||e.zones||(c={value:e[this.zoneAxis+"Threshold"]||e.threshold||0,className:"highcharts-negative"},a||(c.color=e.negativeColor,c.fillColor=e.negativeFillColor),g.push(c));g.length&&v(g[g.length-1].value)&&g.push(a?{}:{color:this.color,fillColor:this.fillColor});h(this,"afterSetOptions",{options:e});return e},getName:function(){return b(this.options.name,
"Series "+(this.index+1))},getCyclic:function(a,d,e){var g,f=this.chart,c=this.userOptions,h=a+"Index",m=a+"Counter",l=e?e.length:b(f.options.chart[a+"Count"],f[a+"Count"]);d||(g=b(c[h],c["_"+h]),v(g)||(f.series.length||(f[m]=0),c["_"+h]=g=f[m]%l,f[m]+=1),e&&(d=e[g]));void 0!==g&&(this[h]=g);this[a]=d},getColor:function(){this.chart.styledMode?this.getCyclic("color"):this.options.colorByPoint?this.options.color=null:this.getCyclic("color",this.options.color||t[this.type].color,this.chart.options.colors)},
getSymbol:function(){this.getCyclic("symbol",this.options.marker.symbol,this.chart.options.symbols)},drawLegendSymbol:a.LegendSymbolMixin.drawLineMarker,updateData:function(b){var d=this.options,e=this.points,g=[],f,c,h,m=this.requireSorting;this.xIncrement=null;b.forEach(function(b){var c,q,k;c=a.defined(b)&&this.pointClass.prototype.optionsToObject.call({series:this},b)||{};k=c.x;if((c=c.id)||l(k))c&&(q=(q=this.chart.get(c))&&q.index),void 0===q&&l(k)&&(q=this.xData.indexOf(k,h)),-1!==q&&void 0!==
q&&this.cropped&&(q=q>=this.cropStart?q-this.cropStart:q),-1===q||void 0===q||e[q]&&e[q].touched?g.push(b):b!==d.data[q]?(e[q].update(b,!1,null,!1),e[q].touched=!0,m&&(h=q+1)):e[q]&&(e[q].touched=!0),f=!0},this);if(f)for(b=e.length;b--;)c=e[b],c.touched||c.remove(!1),c.touched=!1;else if(b.length===e.length)b.forEach(function(a,b){e[b].update&&a!==d.data[b]&&e[b].update(a,!1,null,!1)});else return!1;g.forEach(function(a){this.addPoint(a,!1)},this);return!0},setData:function(d,g,c,h){var f=this,m=
f.points,k=m&&m.length||0,z,u=f.options,r=f.chart,D=null,x=f.xAxis,A=u.turboThreshold,p=this.xData,B=this.yData,t=(z=f.pointArrayMap)&&z.length,v=u.keys,E=0,w=1,H;d=d||[];z=d.length;g=b(g,!0);!1!==h&&z&&k&&!f.cropped&&!f.hasGroupedData&&f.visible&&!f.isSeriesBoosting&&(H=this.updateData(d));if(!H){f.xIncrement=null;f.colorCounter=0;this.parallelArrays.forEach(function(a){f[a+"Data"].length=0});if(A&&z>A){for(c=0;null===D&&c<z;)D=d[c],c++;if(l(D))for(c=0;c<z;c++)p[c]=this.autoIncrement(),B[c]=d[c];
else if(e(D))if(t)for(c=0;c<z;c++)D=d[c],p[c]=D[0],B[c]=D.slice(1,t+1);else for(v&&(E=v.indexOf("x"),w=v.indexOf("y"),E=0<=E?E:0,w=0<=w?w:1),c=0;c<z;c++)D=d[c],p[c]=D[E],B[c]=D[w];else a.error(12,!1,r)}else for(c=0;c<z;c++)void 0!==d[c]&&(D={series:f},f.pointClass.prototype.applyOptions.apply(D,[d[c]]),f.updateParallelArrays(D,c));B&&n(B[0])&&a.error(14,!0,r);f.data=[];f.options.data=f.userOptions.data=d;for(c=k;c--;)m[c]&&m[c].destroy&&m[c].destroy();x&&(x.minRange=x.userMinRange);f.isDirty=r.isDirtyBox=
!0;f.isDirtyData=!!m;c=!1}"point"===u.legendType&&(this.processData(),this.generatePoints());g&&r.redraw(c)},processData:function(b){var d=this.xData,e=this.yData,c=d.length,f;f=0;var g,h,m=this.xAxis,l,k=this.options;l=k.cropThreshold;var n=this.getExtremesFromAll||k.getExtremesFromAll,u=this.isCartesian,k=m&&m.val2lin,r=m&&m.isLog,x=this.requireSorting,p,B;if(u&&!this.isDirty&&!m.isDirty&&!this.yAxis.isDirty&&!b)return!1;m&&(b=m.getExtremes(),p=b.min,B=b.max);u&&this.sorted&&!n&&(!l||c>l||this.forceCrop)&&
(d[c-1]<p||d[0]>B?(d=[],e=[]):this.yData&&(d[0]<p||d[c-1]>B)&&(f=this.cropData(this.xData,this.yData,p,B),d=f.xData,e=f.yData,f=f.start,g=!0));for(l=d.length||1;--l;)c=r?k(d[l])-k(d[l-1]):d[l]-d[l-1],0<c&&(void 0===h||c<h)?h=c:0>c&&x&&(a.error(15,!1,this.chart),x=!1);this.cropped=g;this.cropStart=f;this.processedXData=d;this.processedYData=e;this.closestPointRange=h},cropData:function(a,d,e,c,f){var g=a.length,h=0,m=g,l;f=b(f,this.cropShoulder);for(l=0;l<g;l++)if(a[l]>=e){h=Math.max(0,l-f);break}for(e=
l;e<g;e++)if(a[e]>c){m=e+f;break}return{xData:a.slice(h,m),yData:d.slice(h,m),start:h,end:m}},generatePoints:function(){var a=this.options,b=a.data,d=this.data,e,f=this.processedXData,c=this.processedYData,g=this.pointClass,l=f.length,k=this.cropStart||0,n,x=this.hasGroupedData,a=a.keys,p,B=[],t;d||x||(d=[],d.length=b.length,d=this.data=d);a&&x&&(this.options.keys=!1);for(t=0;t<l;t++)n=k+t,x?(p=(new g).init(this,[f[t]].concat(u(c[t]))),p.dataGroup=this.groupMap[t],p.dataGroup.options&&(p.options=
p.dataGroup.options,r(p,p.dataGroup.options),delete p.dataLabels)):(p=d[n])||void 0===b[n]||(d[n]=p=(new g).init(this,b[n],f[t])),p&&(p.index=n,B[t]=p);this.options.keys=a;if(d&&(l!==(e=d.length)||x))for(t=0;t<e;t++)t!==k||x||(t+=l),d[t]&&(d[t].destroyElements(),d[t].plotX=void 0);this.data=d;this.points=B;h(this,"afterGeneratePoints")},getExtremes:function(a){var b=this.yAxis,d=this.processedXData,c,f=[],g=0;c=this.xAxis.getExtremes();var m=c.min,n=c.max,u,r,x=this.requireSorting?this.cropShoulder:
0,p,B;a=a||this.stackedYData||this.processedYData||[];c=a.length;for(B=0;B<c;B++)if(r=d[B],p=a[B],u=(l(p,!0)||e(p))&&(!b.positiveValuesOnly||p.length||0<p),r=this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||(d[B+x]||r)>=m&&(d[B-x]||r)<=n,u&&r)if(u=p.length)for(;u--;)"number"===typeof p[u]&&(f[g++]=p[u]);else f[g++]=p;this.dataMin=k(f);this.dataMax=G(f);h(this,"afterGetExtremes")},translate:function(){this.processedXData||this.processData();this.generatePoints();var a=this.options,
d=a.stacking,e=this.xAxis,g=e.categories,f=this.yAxis,q=this.points,k=q.length,n=!!this.modifyValue,u,r=this.pointPlacementToXValue(),x=l(r),p=a.threshold,B=a.startFromThreshold?p:0,t,E,w,H,y=this.zoneAxis||"y",G=Number.MAX_VALUE;for(u=0;u<k;u++){var F=q[u],I=F.x,Q=F.y;E=F.low;var N=d&&f.stacks[(this.negStacks&&Q<(B?0:p)?"-":"")+this.stackKey],V;f.positiveValuesOnly&&null!==Q&&0>=Q&&(F.isNull=!0);F.plotX=t=c(Math.min(Math.max(-1E5,e.translate(I,0,0,0,1,r,"flags"===this.type)),1E5));d&&this.visible&&
!F.isNull&&N&&N[I]&&(H=this.getStackIndicator(H,I,this.index),V=N[I],Q=V.points[H.key],E=Q[0],Q=Q[1],E===B&&H.key===N[I].base&&(E=b(l(p)&&p,f.min)),f.positiveValuesOnly&&0>=E&&(E=null),F.total=F.stackTotal=V.total,F.percentage=V.total&&F.y/V.total*100,F.stackY=Q,V.setOffset(this.pointXOffset||0,this.barW||0));F.yBottom=v(E)?Math.min(Math.max(-1E5,f.translate(E,0,1,0,1)),1E5):null;n&&(Q=this.modifyValue(Q,F));F.plotY=E="number"===typeof Q&&Infinity!==Q?Math.min(Math.max(-1E5,f.translate(Q,0,1,0,1)),
1E5):void 0;F.isInside=void 0!==E&&0<=E&&E<=f.len&&0<=t&&t<=e.len;F.clientX=x?c(e.translate(I,0,0,0,1,r)):t;F.negative=F[y]<(a[y+"Threshold"]||p||0);F.category=g&&void 0!==g[F.x]?g[F.x]:F.x;F.isNull||(void 0!==w&&(G=Math.min(G,Math.abs(t-w))),w=t);F.zone=this.zones.length&&F.getZone()}this.closestPointRangePx=G;h(this,"afterTranslate")},getValidPoints:function(a,b,d){var e=this.chart;return(a||this.points||[]).filter(function(a){return b&&!e.isInsidePlot(a.plotX,a.plotY,e.inverted)?!1:d||!a.isNull})},
setClip:function(a){var b=this.chart,d=this.options,e=b.renderer,f=b.inverted,c=this.clipBox,g=c||b.clipBox,h=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,g.height,d.xAxis,d.yAxis].join(),m=b[h],l=b[h+"m"];m||(a&&(g.width=0,f&&(g.x=b.plotSizeX),b[h+"m"]=l=e.clipRect(f?b.plotSizeX+99:-99,f?-b.plotLeft:-b.plotTop,99,f?b.chartWidth:b.chartHeight)),b[h]=m=e.clipRect(g),m.count={length:0});a&&!m.count[this.index]&&(m.count[this.index]=!0,m.count.length+=1);!1!==d.clip&&(this.group.clip(a||
c?m:b.clipRect),this.markerGroup.clip(l),this.sharedClipKey=h);a||(m.count[this.index]&&(delete m.count[this.index],--m.count.length),0===m.count.length&&h&&b[h]&&(c||(b[h]=b[h].destroy()),b[h+"m"]&&(b[h+"m"]=b[h+"m"].destroy())))},animate:function(a){var b=this.chart,d=F(this.options.animation),e;a?this.setClip(d):(e=this.sharedClipKey,(a=b[e])&&a.animate({width:b.plotSizeX,x:0},d),b[e+"m"]&&b[e+"m"].animate({width:b.plotSizeX+99,x:0},d),this.animate=null)},afterAnimate:function(){this.setClip();
h(this,"afterAnimate");this.finishedAnimating=!0},drawPoints:function(){var a=this.points,d=this.chart,e,c,f,g,h=this.options.marker,l,k,n,u=this[this.specialGroup]||this.markerGroup;e=this.xAxis;var r,x=b(h.enabled,!e||e.isRadial?!0:null,this.closestPointRangePx>=h.enabledThreshold*h.radius);if(!1!==h.enabled||this._hasPointMarkers)for(e=0;e<a.length;e++)c=a[e],g=c.graphic,l=c.marker||{},k=!!c.marker,f=x&&void 0===l.enabled||l.enabled,n=!1!==c.isInside,f&&!c.isNull?(f=b(l.symbol,this.symbol),r=this.markerAttribs(c,
c.selected&&"select"),g?g[n?"show":"hide"](!0).animate(r):n&&(0<r.width||c.hasImage)&&(c.graphic=g=d.renderer.symbol(f,r.x,r.y,r.width,r.height,k?l:h).add(u)),g&&!d.styledMode&&g.attr(this.pointAttribs(c,c.selected&&"select")),g&&g.addClass(c.getClassName(),!0)):g&&(c.graphic=g.destroy())},markerAttribs:function(a,d){var e=this.options.marker,c=a.marker||{},f=c.symbol||e.symbol,g=b(c.radius,e.radius);d&&(e=e.states[d],d=c.states&&c.states[d],g=b(d&&d.radius,e&&e.radius,g+(e&&e.radiusPlus||0)));a.hasImage=
f&&0===f.indexOf("url");a.hasImage&&(g=0);a={x:Math.floor(a.plotX)-g,y:a.plotY-g};g&&(a.width=a.height=2*g);return a},pointAttribs:function(a,d){var e=this.options.marker,c=a&&a.options,f=c&&c.marker||{},g=this.color,h=c&&c.color,m=a&&a.color,c=b(f.lineWidth,e.lineWidth);a=a&&a.zone&&a.zone.color;g=h||a||m||g;a=f.fillColor||e.fillColor||g;g=f.lineColor||e.lineColor||g;d&&(e=e.states[d],d=f.states&&f.states[d]||{},c=b(d.lineWidth,e.lineWidth,c+b(d.lineWidthPlus,e.lineWidthPlus,0)),a=d.fillColor||e.fillColor||
a,g=d.lineColor||e.lineColor||g);return{stroke:g,"stroke-width":c,fill:a}},destroy:function(b){var d=this,e=d.chart,c=/AppleWebKit\/533/.test(B.navigator.userAgent),f,m,l=d.data||[],k,n;h(d,"destroy");b||x(d);(d.axisTypes||[]).forEach(function(a){(n=d[a])&&n.series&&(w(n.series,d),n.isDirty=n.forceRedraw=!0)});d.legendItem&&d.chart.legend.destroyItem(d);for(m=l.length;m--;)(k=l[m])&&k.destroy&&k.destroy();d.points=null;a.clearTimeout(d.animationTimeout);g(d,function(a,b){a instanceof H&&!a.survive&&
(f=c&&"group"===b?"hide":"destroy",a[f]())});e.hoverSeries===d&&(e.hoverSeries=null);w(e.series,d);e.orderSeries();g(d,function(a,f){b&&"hcEvents"===f||delete d[f]})},getGraphPath:function(a,b,d){var e=this,f=e.options,c=f.step,g,h=[],m=[],l;a=a||e.points;(g=a.reversed)&&a.reverse();(c={right:1,center:2}[c]||c&&3)&&g&&(c=4-c);!f.connectNulls||b||d||(a=this.getValidPoints(a));a.forEach(function(g,q){var k=g.plotX,n=g.plotY,u=a[q-1];(g.leftCliff||u&&u.rightCliff)&&!d&&(l=!0);g.isNull&&!v(b)&&0<q?l=
!f.connectNulls:g.isNull&&!b?l=!0:(0===q||l?q=["M",g.plotX,g.plotY]:e.getPointSpline?q=e.getPointSpline(a,g,q):c?(q=1===c?["L",u.plotX,n]:2===c?["L",(u.plotX+k)/2,u.plotY,"L",(u.plotX+k)/2,n]:["L",k,u.plotY],q.push("L",k,n)):q=["L",k,n],m.push(g.x),c&&(m.push(g.x),2===c&&m.push(g.x)),h.push.apply(h,q),l=!1)});h.xMap=m;return e.graphPath=h},drawGraph:function(){var a=this,b=this.options,d=(this.gappedPath||this.getGraphPath).call(this),e=this.chart.styledMode,f=[["graph","highcharts-graph"]];e||f[0].push(b.lineColor||
this.color,b.dashStyle);f=a.getZonesGraphs(f);f.forEach(function(f,c){var g=f[0],h=a[g];h?(h.endX=a.preventGraphAnimation?null:d.xMap,h.animate({d:d})):d.length&&(a[g]=a.chart.renderer.path(d).addClass(f[1]).attr({zIndex:1}).add(a.group),e||(h={stroke:f[2],"stroke-width":b.lineWidth,fill:a.fillGraph&&a.color||"none"},f[3]?h.dashstyle=f[3]:"square"!==b.linecap&&(h["stroke-linecap"]=h["stroke-linejoin"]="round"),h=a[g].attr(h).shadow(2>c&&b.shadow)));h&&(h.startX=d.xMap,h.isArea=d.isArea)})},getZonesGraphs:function(a){this.zones.forEach(function(b,
d){d=["zone-graph-"+d,"highcharts-graph highcharts-zone-graph-"+d+" "+(b.className||"")];this.chart.styledMode||d.push(b.color||this.color,b.dashStyle||this.options.dashStyle);a.push(d)},this);return a},applyZones:function(){var a=this,d=this.chart,e=d.renderer,c=this.zones,f,g,h=this.clips||[],l,k=this.graph,n=this.area,u=Math.max(d.chartWidth,d.chartHeight),r=this[(this.zoneAxis||"y")+"Axis"],x,p,B=d.inverted,t,v,E,w,H=!1;c.length&&(k||n)&&r&&void 0!==r.min&&(p=r.reversed,t=r.horiz,k&&!this.showLine&&
k.hide(),n&&n.hide(),x=r.getExtremes(),c.forEach(function(c,m){f=p?t?d.plotWidth:0:t?0:r.toPixels(x.min)||0;f=Math.min(Math.max(b(g,f),0),u);g=Math.min(Math.max(Math.round(r.toPixels(b(c.value,x.max),!0)||0),0),u);H&&(f=g=r.toPixels(x.max));v=Math.abs(f-g);E=Math.min(f,g);w=Math.max(f,g);r.isXAxis?(l={x:B?w:E,y:0,width:v,height:u},t||(l.x=d.plotHeight-l.x)):(l={x:0,y:B?w:E,width:u,height:v},t&&(l.y=d.plotWidth-l.y));B&&e.isVML&&(l=r.isXAxis?{x:0,y:p?E:w,height:l.width,width:d.chartWidth}:{x:l.y-d.plotLeft-
d.spacingBox.x,y:0,width:l.height,height:d.chartHeight});h[m]?h[m].animate(l):(h[m]=e.clipRect(l),k&&a["zone-graph-"+m].clip(h[m]),n&&a["zone-area-"+m].clip(h[m]));H=c.value>x.max;a.resetZones&&0===g&&(g=void 0)}),this.clips=h)},invertGroups:function(a){function b(){["group","markerGroup"].forEach(function(b){d[b]&&(e.renderer.isVML&&d[b].attr({width:d.yAxis.len,height:d.xAxis.len}),d[b].width=d.yAxis.len,d[b].height=d.xAxis.len,d[b].invert(a))})}var d=this,e=d.chart,f;d.xAxis&&(f=y(e,"resize",b),
y(d,"destroy",f),b(a),d.invertGroups=b)},plotGroup:function(a,b,d,e,f){var c=this[a],g=!c;g&&(this[a]=c=this.chart.renderer.g().attr({zIndex:e||.1}).add(f));c.addClass("highcharts-"+b+" highcharts-series-"+this.index+" highcharts-"+this.type+"-series "+(v(this.colorIndex)?"highcharts-color-"+this.colorIndex+" ":"")+(this.options.className||"")+(c.hasClass("highcharts-tracker")?" highcharts-tracker":""),!0);c.attr({visibility:d})[g?"attr":"animate"](this.getPlotBox());return c},getPlotBox:function(){var a=
this.chart,b=this.xAxis,d=this.yAxis;a.inverted&&(b=d,d=this.xAxis);return{translateX:b?b.left:a.plotLeft,translateY:d?d.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,d,e=a.options,f=!!a.animate&&b.renderer.isSVG&&F(e.animation).duration,c=a.visible?"inherit":"hidden",g=e.zIndex,l=a.hasRendered,k=b.seriesGroup,n=b.inverted;h(this,"render");d=a.plotGroup("group","series",c,g,k);a.markerGroup=a.plotGroup("markerGroup","markers",c,g,k);f&&a.animate(!0);d.inverted=a.isCartesian?
n:!1;a.drawGraph&&(a.drawGraph(),a.applyZones());a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&!1!==a.options.enableMouseTracking&&a.drawTracker();a.invertGroups(n);!1===e.clip||a.sharedClipKey||l||d.clip(b.clipRect);f&&a.animate();l||(a.animationTimeout=E(function(){a.afterAnimate()},f));a.isDirty=!1;a.hasRendered=!0;h(a,"afterRender")},redraw:function(){var a=this.chart,d=this.isDirty||this.isDirtyData,e=this.group,c=this.xAxis,f=this.yAxis;e&&(a.inverted&&e.attr({width:a.plotWidth,
height:a.plotHeight}),e.animate({translateX:b(c&&c.left,a.plotLeft),translateY:b(f&&f.top,a.plotTop)}));this.translate();this.render();d&&delete this.kdTree},kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var d=this.xAxis,e=this.yAxis,f=this.chart.inverted;return this.searchKDTree({clientX:f?d.len-a.chartY+d.pos:a.chartX-d.pos,plotY:f?e.len-a.chartX+e.pos:a.chartY-e.pos},b,a)},buildKDTree:function(a){function b(a,e,c){var f,g;if(g=a&&a.length)return f=d.kdAxisArray[e%c],a.sort(function(a,
b){return a[f]-b[f]}),g=Math.floor(g/2),{point:a[g],left:b(a.slice(0,g),e+1,c),right:b(a.slice(g+1),e+1,c)}}this.buildingKdTree=!0;var d=this,e=-1<d.options.findNearestPointBy.indexOf("y")?2:1;delete d.kdTree;E(function(){d.kdTree=b(d.getValidPoints(null,!d.directTouch),e,e);d.buildingKdTree=!1},d.options.kdNow||a&&"touchstart"===a.type?0:1)},searchKDTree:function(a,b,d){function e(a,b,d,m){var l=b.point,k=f.kdAxisArray[d%m],q,n,u=l;n=v(a[c])&&v(l[c])?Math.pow(a[c]-l[c],2):null;q=v(a[g])&&v(l[g])?
Math.pow(a[g]-l[g],2):null;q=(n||0)+(q||0);l.dist=v(q)?Math.sqrt(q):Number.MAX_VALUE;l.distX=v(n)?Math.sqrt(n):Number.MAX_VALUE;k=a[k]-l[k];q=0>k?"left":"right";n=0>k?"right":"left";b[q]&&(q=e(a,b[q],d+1,m),u=q[h]<u[h]?q:l);b[n]&&Math.sqrt(k*k)<u[h]&&(a=e(a,b[n],d+1,m),u=a[h]<u[h]?a:u);return u}var f=this,c=this.kdAxisArray[0],g=this.kdAxisArray[1],h=b?"distX":"dist";b=-1<f.options.findNearestPointBy.indexOf("y")?2:1;this.kdTree||this.buildingKdTree||this.buildKDTree(d);if(this.kdTree)return e(a,
this.kdTree,b,b)},pointPlacementToXValue:function(){var a=this.options.pointPlacement;"between"===a&&(a=.5);l(a)&&(a*=b(this.options.pointRange||this.xAxis.pointRange));return a}})})(I);(function(a){var y=a.Axis,F=a.Chart,G=a.correctFloat,k=a.defined,c=a.destroyObjectProperties,p=a.format,t=a.objectEach,v=a.pick,w=a.Series;a.StackItem=function(a,c,e,l,k){var d=a.chart.inverted;this.axis=a;this.isNegative=e;this.options=c;this.x=l;this.total=null;this.points={};this.stack=k;this.rightCliff=this.leftCliff=
0;this.alignOptions={align:c.align||(d?e?"left":"right":"center"),verticalAlign:c.verticalAlign||(d?"middle":e?"bottom":"top"),y:v(c.y,d?4:e?14:-6),x:v(c.x,d?e?-6:6:0)};this.textAlign=c.textAlign||(d?e?"right":"left":"center")};a.StackItem.prototype={destroy:function(){c(this,this.axis)},render:function(a){var c=this.axis.chart,e=this.options,l=e.format,l=l?p(l,this,c.time):e.formatter.call(this);this.label?this.label.attr({text:l,visibility:"hidden"}):this.label=c.renderer.text(l,null,null,e.useHTML).css(e.style).attr({align:this.textAlign,
rotation:e.rotation,visibility:"hidden"}).add(a);this.label.labelrank=c.plotHeight},setOffset:function(a,c){var e=this.axis,h=e.chart,n=e.translate(e.usePercentage?100:this.total,0,0,0,1),d=e.translate(0),d=k(n)&&Math.abs(n-d);a=h.xAxis[0].translate(this.x)+a;e=k(n)&&this.getStackBox(h,this,a,n,c,d,e);(c=this.label)&&e&&(c.align(this.alignOptions,null,e),e=c.alignAttr,c[!1===this.options.crop||h.isInsidePlot(e.x,e.y)?"show":"hide"](!0))},getStackBox:function(a,c,e,l,k,d,g){var b=c.axis.reversed,h=
a.inverted;a=g.height+g.pos-(h?a.plotLeft:a.plotTop);c=c.isNegative&&!b||!c.isNegative&&b;return{x:h?c?l:l-d:e,y:h?a-e-k:c?a-l-d:a-l,width:h?d:k,height:h?k:d}}};F.prototype.getStacks=function(){var a=this;a.yAxis.forEach(function(a){a.stacks&&a.hasVisibleSeries&&(a.oldStacks=a.stacks)});a.series.forEach(function(c){!c.options.stacking||!0!==c.visible&&!1!==a.options.chart.ignoreHiddenSeries||(c.stackKey=c.type+v(c.options.stack,""))})};y.prototype.buildStacks=function(){var a=this.series,c=v(this.options.reversedStacks,
!0),e=a.length,l;if(!this.isXAxis){this.usePercentage=!1;for(l=e;l--;)a[c?l:e-l-1].setStackedPoints();for(l=0;l<e;l++)a[l].modifyStacks()}};y.prototype.renderStackTotals=function(){var a=this.chart,c=a.renderer,e=this.stacks,l=this.stackTotalGroup;l||(this.stackTotalGroup=l=c.g("stack-labels").attr({visibility:"visible",zIndex:6}).add());l.translate(a.plotLeft,a.plotTop);t(e,function(a){t(a,function(a){a.render(l)})})};y.prototype.resetStacks=function(){var a=this,c=a.stacks;a.isXAxis||t(c,function(e){t(e,
function(c,h){c.touched<a.stacksTouched?(c.destroy(),delete e[h]):(c.total=null,c.cumulative=null)})})};y.prototype.cleanStacks=function(){var a;this.isXAxis||(this.oldStacks&&(a=this.stacks=this.oldStacks),t(a,function(a){t(a,function(a){a.cumulative=a.total})}))};w.prototype.setStackedPoints=function(){if(this.options.stacking&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var c=this.processedXData,h=this.processedYData,e=[],l=h.length,n=this.options,d=n.threshold,g=v(n.startFromThreshold&&
d,0),b=n.stack,n=n.stacking,x=this.stackKey,u="-"+x,p=this.negStacks,t=this.yAxis,B=t.stacks,m=t.oldStacks,z,D,A,f,q,w,y;t.stacksTouched+=1;for(q=0;q<l;q++)w=c[q],y=h[q],z=this.getStackIndicator(z,w,this.index),f=z.key,A=(D=p&&y<(g?0:d))?u:x,B[A]||(B[A]={}),B[A][w]||(m[A]&&m[A][w]?(B[A][w]=m[A][w],B[A][w].total=null):B[A][w]=new a.StackItem(t,t.options.stackLabels,D,w,b)),A=B[A][w],null!==y?(A.points[f]=A.points[this.index]=[v(A.cumulative,g)],k(A.cumulative)||(A.base=f),A.touched=t.stacksTouched,
0<z.index&&!1===this.singleStacks&&(A.points[f][0]=A.points[this.index+","+w+",0"][0])):A.points[f]=A.points[this.index]=null,"percent"===n?(D=D?x:u,p&&B[D]&&B[D][w]?(D=B[D][w],A.total=D.total=Math.max(D.total,A.total)+Math.abs(y)||0):A.total=G(A.total+(Math.abs(y)||0))):A.total=G(A.total+(y||0)),A.cumulative=v(A.cumulative,g)+(y||0),null!==y&&(A.points[f].push(A.cumulative),e[q]=A.cumulative);"percent"===n&&(t.usePercentage=!0);this.stackedYData=e;t.oldStacks={}}};w.prototype.modifyStacks=function(){var a=
this,c=a.stackKey,e=a.yAxis.stacks,l=a.processedXData,k,d=a.options.stacking;a[d+"Stacker"]&&[c,"-"+c].forEach(function(c){for(var b=l.length,g,h;b--;)if(g=l[b],k=a.getStackIndicator(k,g,a.index,c),h=(g=e[c]&&e[c][g])&&g.points[k.key])a[d+"Stacker"](h,g,b)})};w.prototype.percentStacker=function(a,c,e){c=c.total?100/c.total:0;a[0]=G(a[0]*c);a[1]=G(a[1]*c);this.stackedYData[e]=a[1]};w.prototype.getStackIndicator=function(a,c,e,l){!k(a)||a.x!==c||l&&a.key!==l?a={x:c,index:0,key:l}:a.index++;a.key=[e,
c,a.index].join();return a}})(I);(function(a){var y=a.addEvent,F=a.animate,G=a.Axis,k=a.Chart,c=a.createElement,p=a.css,t=a.defined,v=a.erase,w=a.extend,r=a.fireEvent,h=a.isNumber,e=a.isObject,l=a.isArray,n=a.merge,d=a.objectEach,g=a.pick,b=a.Point,x=a.Series,u=a.seriesTypes,H=a.setAnimation,E=a.splat;a.cleanRecursively=function(b,c){var g={};d(b,function(d,h){if(e(b[h],!0)&&c[h])d=a.cleanRecursively(b[h],c[h]),Object.keys(d).length&&(g[h]=d);else if(e(b[h])||b[h]!==c[h])g[h]=b[h]});return g};w(k.prototype,
{addSeries:function(a,b,d){var e,c=this;a&&(b=g(b,!0),r(c,"addSeries",{options:a},function(){e=c.initSeries(a);c.isDirtyLegend=!0;c.linkSeries();r(c,"afterAddSeries");b&&c.redraw(d)}));return e},addAxis:function(a,b,d,e){var c=b?"xAxis":"yAxis",f=this.options;a=n(a,{index:this[c].length,isX:b});b=new G(this,a);f[c]=E(f[c]||{});f[c].push(a);g(d,!0)&&this.redraw(e);return b},showLoading:function(a){var b=this,d=b.options,e=b.loadingDiv,g=d.loading,f=function(){e&&p(e,{left:b.plotLeft+"px",top:b.plotTop+
"px",width:b.plotWidth+"px",height:b.plotHeight+"px"})};e||(b.loadingDiv=e=c("div",{className:"highcharts-loading highcharts-loading-hidden"},null,b.container),b.loadingSpan=c("span",{className:"highcharts-loading-inner"},null,e),y(b,"redraw",f));e.className="highcharts-loading";b.loadingSpan.innerHTML=a||d.lang.loading;b.styledMode||(p(e,w(g.style,{zIndex:10})),p(b.loadingSpan,g.labelStyle),b.loadingShown||(p(e,{opacity:0,display:""}),F(e,{opacity:g.style.opacity||.5},{duration:g.showDuration||0})));
b.loadingShown=!0;f()},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&(b.className="highcharts-loading highcharts-loading-hidden",this.styledMode||F(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){p(b,{display:"none"})}}));this.loadingShown=!1},propsRequireDirtyBox:"backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
propsRequireUpdateSeries:"chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),collectionsWithUpdate:"xAxis yAxis zAxis series colorAxis pane".split(" "),update:function(b,e,c,l){var m=this,f={credits:"addCredits",title:"setTitle",subtitle:"setSubtitle"},k,u,p,x=[];r(m,"update",{options:b});b.isResponsiveOptions||m.setResponsive(!1,!0);b=a.cleanRecursively(b,m.options);if(k=b.chart){n(!0,m.options.chart,k);"className"in k&&m.setClassName(k.className);
"reflow"in k&&m.setReflow(k.reflow);if("inverted"in k||"polar"in k||"type"in k)m.propFromSeries(),u=!0;"alignTicks"in k&&(u=!0);d(k,function(a,b){-1!==m.propsRequireUpdateSeries.indexOf("chart."+b)&&(p=!0);-1!==m.propsRequireDirtyBox.indexOf(b)&&(m.isDirtyBox=!0)});!m.styledMode&&"style"in k&&m.renderer.setStyle(k.style)}!m.styledMode&&b.colors&&(this.options.colors=b.colors);b.plotOptions&&n(!0,this.options.plotOptions,b.plotOptions);d(b,function(a,b){if(m[b]&&"function"===typeof m[b].update)m[b].update(a,
!1);else if("function"===typeof m[f[b]])m[f[b]](a);"chart"!==b&&-1!==m.propsRequireUpdateSeries.indexOf(b)&&(p=!0)});this.collectionsWithUpdate.forEach(function(a){var d;b[a]&&("series"===a&&(d=[],m[a].forEach(function(a,b){a.options.isInternal||d.push(g(a.options.index,b))})),E(b[a]).forEach(function(b,f){(f=t(b.id)&&m.get(b.id)||m[a][d?d[f]:f])&&f.coll===a&&(f.update(b,!1),c&&(f.touched=!0));if(!f&&c)if("series"===a)m.addSeries(b,!1).touched=!0;else if("xAxis"===a||"yAxis"===a)m.addAxis(b,"xAxis"===
a,!1).touched=!0}),c&&m[a].forEach(function(a){a.touched||a.options.isInternal?delete a.touched:x.push(a)}))});x.forEach(function(a){a.remove&&a.remove(!1)});u&&m.axes.forEach(function(a){a.update({},!1)});p&&m.series.forEach(function(a){a.update({},!1)});b.loading&&n(!0,m.options.loading,b.loading);u=k&&k.width;k=k&&k.height;h(u)&&u!==m.chartWidth||h(k)&&k!==m.chartHeight?m.setSize(u,k,l):g(e,!0)&&m.redraw(l);r(m,"afterUpdate",{options:b})},setSubtitle:function(a){this.setTitle(void 0,a)}});w(b.prototype,
{update:function(a,b,d,c){function h(){f.applyOptions(a);null===f.y&&l&&(f.graphic=l.destroy());e(a,!0)&&(l&&l.element&&a&&a.marker&&void 0!==a.marker.symbol&&(f.graphic=l.destroy()),a&&a.dataLabels&&f.dataLabel&&(f.dataLabel=f.dataLabel.destroy()),f.connector&&(f.connector=f.connector.destroy()));k=f.index;m.updateParallelArrays(f,k);u.data[k]=e(u.data[k],!0)||e(a,!0)?f.options:g(a,u.data[k]);m.isDirty=m.isDirtyData=!0;!m.fixedBox&&m.hasCartesianSeries&&(n.isDirtyBox=!0);"point"===u.legendType&&
(n.isDirtyLegend=!0);b&&n.redraw(d)}var f=this,m=f.series,l=f.graphic,k,n=m.chart,u=m.options;b=g(b,!0);!1===c?h():f.firePointEvent("update",{options:a},h)},remove:function(a,b){this.series.removePoint(this.series.data.indexOf(this),a,b)}});w(x.prototype,{addPoint:function(a,b,d,e){var c=this.options,f=this.data,h=this.chart,m=this.xAxis,m=m&&m.hasNames&&m.names,l=c.data,k,n,u=this.xData,p,r;b=g(b,!0);k={series:this};this.pointClass.prototype.applyOptions.apply(k,[a]);r=k.x;p=u.length;if(this.requireSorting&&
r<u[p-1])for(n=!0;p&&u[p-1]>r;)p--;this.updateParallelArrays(k,"splice",p,0,0);this.updateParallelArrays(k,p);m&&k.name&&(m[r]=k.name);l.splice(p,0,a);n&&(this.data.splice(p,0,null),this.processData());"point"===c.legendType&&this.generatePoints();d&&(f[0]&&f[0].remove?f[0].remove(!1):(f.shift(),this.updateParallelArrays(k,"shift"),l.shift()));this.isDirtyData=this.isDirty=!0;b&&h.redraw(e)},removePoint:function(a,b,d){var e=this,c=e.data,f=c[a],h=e.points,m=e.chart,l=function(){h&&h.length===c.length&&
h.splice(a,1);c.splice(a,1);e.options.data.splice(a,1);e.updateParallelArrays(f||{series:e},"splice",a,1);f&&f.destroy();e.isDirty=!0;e.isDirtyData=!0;b&&m.redraw()};H(d,m);b=g(b,!0);f?f.firePointEvent("remove",null,l):l()},remove:function(a,b,d,e){function c(){f.destroy(e);f.remove=null;h.isDirtyLegend=h.isDirtyBox=!0;h.linkSeries();g(a,!0)&&h.redraw(b)}var f=this,h=f.chart;!1!==d?r(f,"remove",null,c):c()},update:function(b,d){b=a.cleanRecursively(b,this.userOptions);var e=this,c=e.chart,h=e.userOptions,
f=e.initialType||e.type,m=b.type||h.type||c.options.chart.type,l=u[f].prototype,k,p=["group","markerGroup","dataLabelsGroup"],x=["navigatorSeries","baseSeries"],t=e.finishedAnimating&&{animation:!1},v=["data","name","turboThreshold"],B=Object.keys(b),E=0<B.length;B.forEach(function(a){-1===v.indexOf(a)&&(E=!1)});if(E)b.data&&this.setData(b.data,!1),b.name&&this.setName(b.name,!1);else{x=p.concat(x);x.forEach(function(a){x[a]=e[a];delete e[a]});b=n(h,t,{index:e.index,pointStart:g(h.pointStart,e.xData[0])},
{data:e.options.data},b);e.remove(!1,null,!1,!0);for(k in l)e[k]=void 0;u[m||f]?w(e,u[m||f].prototype):a.error(17,!0,c);x.forEach(function(a){e[a]=x[a]});e.init(c,b);b.zIndex!==h.zIndex&&p.forEach(function(a){e[a]&&e[a].attr({zIndex:b.zIndex})});e.initialType=f;c.linkSeries()}r(this,"afterUpdate");g(d,!0)&&c.redraw(E?void 0:!1)},setName:function(a){this.name=this.options.name=this.userOptions.name=a;this.chart.isDirtyLegend=!0}});w(G.prototype,{update:function(a,b){var e=this.chart,c=a&&a.events||
{};a=n(this.userOptions,a);e.options[this.coll].indexOf&&(e.options[this.coll][e.options[this.coll].indexOf(this.userOptions)]=a);d(e.options[this.coll].events,function(a,b){"undefined"===typeof c[b]&&(c[b]=void 0)});this.destroy(!0);this.init(e,w(a,{events:c}));e.isDirtyBox=!0;g(b,!0)&&e.redraw()},remove:function(a){for(var b=this.chart,d=this.coll,e=this.series,c=e.length;c--;)e[c]&&e[c].remove(!1);v(b.axes,this);v(b[d],this);l(b.options[d])?b.options[d].splice(this.options.index,1):delete b.options[d];
b[d].forEach(function(a,b){a.options.index=a.userOptions.index=b});this.destroy();b.isDirtyBox=!0;g(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}})})(I);(function(a){var y=a.color,F=a.pick,G=a.Series,k=a.seriesType;k("area","line",{softThreshold:!1,threshold:0},{singleStacks:!1,getStackPoints:function(c){var k=[],t=[],v=this.xAxis,w=this.yAxis,r=w.stacks[this.stackKey],h={},e=this.index,l=w.series,n=l.length,d,g=F(w.options.reversedStacks,
!0)?1:-1,b;c=c||this.points;if(this.options.stacking){for(b=0;b<c.length;b++)c[b].leftNull=c[b].rightNull=null,h[c[b].x]=c[b];a.objectEach(r,function(a,b){null!==a.total&&t.push(b)});t.sort(function(a,b){return a-b});d=l.map(function(a){return a.visible});t.forEach(function(a,c){var l=0,u,p;if(h[a]&&!h[a].isNull)k.push(h[a]),[-1,1].forEach(function(l){var k=1===l?"rightNull":"leftNull",m=0,x=r[t[c+l]];if(x)for(b=e;0<=b&&b<n;)u=x.points[b],u||(b===e?h[a][k]=!0:d[b]&&(p=r[a].points[b])&&(m-=p[1]-p[0])),
b+=g;h[a][1===l?"rightCliff":"leftCliff"]=m});else{for(b=e;0<=b&&b<n;){if(u=r[a].points[b]){l=u[1];break}b+=g}l=w.translate(l,0,1,0,1);k.push({isNull:!0,plotX:v.translate(a,0,0,0,1),x:a,plotY:l,yBottom:l})}})}return k},getGraphPath:function(a){var c=G.prototype.getGraphPath,k=this.options,v=k.stacking,w=this.yAxis,r,h,e=[],l=[],n=this.index,d,g=w.stacks[this.stackKey],b=k.threshold,x=w.getThreshold(k.threshold),u,k=k.connectNulls||"percent"===v,H=function(c,h,k){var m=a[c];c=v&&g[m.x].points[n];var u=
m[k+"Null"]||0;k=m[k+"Cliff"]||0;var p,f,m=!0;k||u?(p=(u?c[0]:c[1])+k,f=c[0]+k,m=!!u):!v&&a[h]&&a[h].isNull&&(p=f=b);void 0!==p&&(l.push({plotX:d,plotY:null===p?x:w.getThreshold(p),isNull:m,isCliff:!0}),e.push({plotX:d,plotY:null===f?x:w.getThreshold(f),doCurve:!1}))};a=a||this.points;v&&(a=this.getStackPoints(a));for(r=0;r<a.length;r++)if(h=a[r].isNull,d=F(a[r].rectPlotX,a[r].plotX),u=F(a[r].yBottom,x),!h||k)k||H(r,r-1,"left"),h&&!v&&k||(l.push(a[r]),e.push({x:r,plotX:d,plotY:u})),k||H(r,r+1,"right");
r=c.call(this,l,!0,!0);e.reversed=!0;h=c.call(this,e,!0,!0);h.length&&(h[0]="L");h=r.concat(h);c=c.call(this,l,!1,k);h.xMap=r.xMap;this.areaPath=h;return c},drawGraph:function(){this.areaPath=[];G.prototype.drawGraph.apply(this);var a=this,k=this.areaPath,t=this.options,v=[["area","highcharts-area",this.color,t.fillColor]];this.zones.forEach(function(c,k){v.push(["zone-area-"+k,"highcharts-area highcharts-zone-area-"+k+" "+c.className,c.color||a.color,c.fillColor||t.fillColor])});v.forEach(function(c){var p=
c[0],h=a[p];h?(h.endX=a.preventGraphAnimation?null:k.xMap,h.animate({d:k})):(h={zIndex:0},a.chart.styledMode||(h.fill=F(c[3],y(c[2]).setOpacity(F(t.fillOpacity,.75)).get())),h=a[p]=a.chart.renderer.path(k).addClass(c[1]).attr(h).add(a.group),h.isArea=!0);h.startX=k.xMap;h.shiftUnit=t.step?2:1})},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle})})(I);(function(a){var y=a.pick;a=a.seriesType;a("spline","line",{},{getPointSpline:function(a,G,k){var c=G.plotX,p=G.plotY,t=a[k-1];k=a[k+1];var v,w,r,
h;if(t&&!t.isNull&&!1!==t.doCurve&&!G.isCliff&&k&&!k.isNull&&!1!==k.doCurve&&!G.isCliff){a=t.plotY;r=k.plotX;k=k.plotY;var e=0;v=(1.5*c+t.plotX)/2.5;w=(1.5*p+a)/2.5;r=(1.5*c+r)/2.5;h=(1.5*p+k)/2.5;r!==v&&(e=(h-w)*(r-c)/(r-v)+p-h);w+=e;h+=e;w>a&&w>p?(w=Math.max(a,p),h=2*p-w):w<a&&w<p&&(w=Math.min(a,p),h=2*p-w);h>k&&h>p?(h=Math.max(k,p),w=2*p-h):h<k&&h<p&&(h=Math.min(k,p),w=2*p-h);G.rightContX=r;G.rightContY=h}G=["C",y(t.rightContX,t.plotX),y(t.rightContY,t.plotY),y(v,c),y(w,p),c,p];t.rightContX=t.rightContY=
null;return G}})})(I);(function(a){var y=a.seriesTypes.area.prototype,F=a.seriesType;F("areaspline","spline",a.defaultPlotOptions.area,{getStackPoints:y.getStackPoints,getGraphPath:y.getGraphPath,drawGraph:y.drawGraph,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle})})(I);(function(a){var y=a.animObject,F=a.color,G=a.extend,k=a.defined,c=a.isNumber,p=a.merge,t=a.pick,v=a.Series,w=a.seriesType,r=a.svg;w("column","line",{borderRadius:0,crisp:!0,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,
cropThreshold:50,pointRange:null,states:{hover:{halo:!1,brightness:.1},select:{color:"#cccccc",borderColor:"#000000"}},dataLabels:{align:null,verticalAlign:null,y:null},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0,borderColor:"#ffffff"},{cropShoulder:0,directTouch:!0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){v.prototype.init.apply(this,arguments);var a=this,e=a.chart;e.hasRendered&&e.series.forEach(function(e){e.type===a.type&&
(e.isDirty=!0)})},getColumnMetrics:function(){var a=this,e=a.options,c=a.xAxis,k=a.yAxis,d=c.options.reversedStacks,d=c.reversed&&!d||!c.reversed&&d,g,b={},p=0;!1===e.grouping?p=1:a.chart.series.forEach(function(d){var e=d.options,c=d.yAxis,h;d.type!==a.type||!d.visible&&a.chart.options.chart.ignoreHiddenSeries||k.len!==c.len||k.pos!==c.pos||(e.stacking?(g=d.stackKey,void 0===b[g]&&(b[g]=p++),h=b[g]):!1!==e.grouping&&(h=p++),d.columnIndex=h)});var u=Math.min(Math.abs(c.transA)*(c.ordinalSlope||e.pointRange||
c.closestPointRange||c.tickInterval||1),c.len),r=u*e.groupPadding,v=(u-2*r)/(p||1),e=Math.min(e.maxPointWidth||c.len,t(e.pointWidth,v*(1-2*e.pointPadding)));a.columnMetrics={width:e,offset:(v-e)/2+(r+((a.columnIndex||0)+(d?1:0))*v-u/2)*(d?-1:1)};return a.columnMetrics},crispCol:function(a,e,c,k){var d=this.chart,g=this.borderWidth,b=-(g%2?.5:0),g=g%2?.5:1;d.inverted&&d.renderer.isVML&&(g+=1);this.options.crisp&&(c=Math.round(a+c)+b,a=Math.round(a)+b,c-=a);k=Math.round(e+k)+g;b=.5>=Math.abs(e)&&.5<
k;e=Math.round(e)+g;k-=e;b&&k&&(--e,k+=1);return{x:a,y:e,width:c,height:k}},translate:function(){var a=this,e=a.chart,c=a.options,n=a.dense=2>a.closestPointRange*a.xAxis.transA,n=a.borderWidth=t(c.borderWidth,n?0:1),d=a.yAxis,g=c.threshold,b=a.translatedThreshold=d.getThreshold(g),p=t(c.minPointLength,5),u=a.getColumnMetrics(),r=u.width,E=a.barW=Math.max(r,1+2*n),B=a.pointXOffset=u.offset;e.inverted&&(b-=.5);c.pointPadding&&(E=Math.ceil(E));v.prototype.translate.apply(a);a.points.forEach(function(c){var h=
t(c.yBottom,b),l=999+Math.abs(h),m=r,l=Math.min(Math.max(-l,c.plotY),d.len+l),f=c.plotX+B,n=E,u=Math.min(l,h),x,v=Math.max(l,h)-u;p&&Math.abs(v)<p&&(v=p,x=!d.reversed&&!c.negative||d.reversed&&c.negative,c.y===g&&a.dataMax<=g&&d.min<g&&(x=!x),u=Math.abs(u-b)>p?h-p:b-(x?p:0));k(c.options.pointWidth)&&(m=n=Math.ceil(c.options.pointWidth),f-=Math.round((m-r)/2));c.barX=f;c.pointWidth=m;c.tooltipPos=e.inverted?[d.len+d.pos-e.plotLeft-l,a.xAxis.len-f-n/2,v]:[f+n/2,l+d.pos-e.plotTop,v];c.shapeType=c.shapeType||
"rect";c.shapeArgs=a.crispCol.apply(a,c.isNull?[f,b,n,0]:[f,u,n,v])})},getSymbol:a.noop,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,drawGraph:function(){this.group[this.dense?"addClass":"removeClass"]("highcharts-dense-data")},pointAttribs:function(a,e){var c=this.options,h,d=this.pointAttrToOptions||{};h=d.stroke||"borderColor";var g=d["stroke-width"]||"borderWidth",b=a&&a.color||this.color,k=a&&a[h]||c[h]||this.color||b,u=a&&a[g]||c[g]||this[g]||0,d=c.dashStyle;a&&this.zones.length&&(b=a.getZone(),
b=a.options.color||b&&b.color||this.color);e&&(a=p(c.states[e],a.options.states&&a.options.states[e]||{}),e=a.brightness,b=a.color||void 0!==e&&F(b).brighten(a.brightness).get()||b,k=a[h]||k,u=a[g]||u,d=a.dashStyle||d);h={fill:b,stroke:k,"stroke-width":u};d&&(h.dashstyle=d);return h},drawPoints:function(){var a=this,e=this.chart,k=a.options,n=e.renderer,d=k.animationLimit||250,g;a.points.forEach(function(b){var h=b.graphic,l=h&&e.pointCount<d?"animate":"attr";if(c(b.plotY)&&null!==b.y){g=b.shapeArgs;
if(h)h[l](p(g));else b.graphic=h=n[b.shapeType](g).add(b.group||a.group);k.borderRadius&&h.attr({r:k.borderRadius});e.styledMode||h[l](a.pointAttribs(b,b.selected&&"select")).shadow(k.shadow,null,k.stacking&&!k.borderRadius);h.addClass(b.getClassName(),!0)}else h&&(b.graphic=h.destroy())})},animate:function(a){var e=this,c=this.yAxis,h=e.options,d=this.chart.inverted,g={},b=d?"translateX":"translateY",k;r&&(a?(g.scaleY=.001,a=Math.min(c.pos+c.len,Math.max(c.pos,c.toPixels(h.threshold))),d?g.translateX=
a-c.len:g.translateY=a,e.clipBox&&e.setClip(),e.group.attr(g)):(k=e.group.attr(b),e.group.animate({scaleY:1},G(y(e.options.animation),{step:function(a,d){g[b]=k+d.pos*(c.pos-k);e.group.attr(g)}})),e.animate=null))},remove:function(){var a=this,e=a.chart;e.hasRendered&&e.series.forEach(function(e){e.type===a.type&&(e.isDirty=!0)});v.prototype.remove.apply(a,arguments)}})})(I);(function(a){a=a.seriesType;a("bar","column",null,{inverted:!0})})(I);(function(a){var y=a.Series,F=a.seriesType;F("scatter",
"line",{lineWidth:0,findNearestPointBy:"xy",jitter:{x:0,y:0},marker:{enabled:!0},tooltip:{headerFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cspan style\x3d"font-size: 10px"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e',pointFormat:"x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e"}},{sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1,drawGraph:function(){this.options.lineWidth&&
y.prototype.drawGraph.call(this)},applyJitter:function(){var a=this,k=this.options.jitter,c=this.points.length;k&&this.points.forEach(function(p,t){["x","y"].forEach(function(v,w){var r,h="plot"+v.toUpperCase(),e,l;k[v]&&!p.isNull&&(r=a[v+"Axis"],l=k[v]*r.transA,r&&!r.isLog&&(e=Math.max(0,p[h]-l),r=Math.min(r.len,p[h]+l),w=1E4*Math.sin(t+w*c),p[h]=e+(r-e)*(w-Math.floor(w)),"x"===v&&(p.clientX=p.plotX)))})})}});a.addEvent(y,"afterTranslate",function(){this.applyJitter&&this.applyJitter()})})(I);(function(a){var y=
a.deg2rad,F=a.isNumber,G=a.pick,k=a.relativeLength;a.CenteredSeriesMixin={getCenter:function(){var a=this.options,p=this.chart,t=2*(a.slicedOffset||0),v=p.plotWidth-2*t,p=p.plotHeight-2*t,w=a.center,w=[G(w[0],"50%"),G(w[1],"50%"),a.size||"100%",a.innerSize||0],r=Math.min(v,p),h,e;for(h=0;4>h;++h)e=w[h],a=2>h||2===h&&/%$/.test(e),w[h]=k(e,[v,p,r,w[2]][h])+(a?t:0);w[3]>w[2]&&(w[3]=w[2]);return w},getStartAndEndRadians:function(a,k){a=F(a)?a:0;k=F(k)&&k>a&&360>k-a?k:a+360;return{start:y*(a+-90),end:y*
(k+-90)}}}})(I);(function(a){var y=a.addEvent,F=a.CenteredSeriesMixin,G=a.defined,k=a.extend,c=F.getStartAndEndRadians,p=a.noop,t=a.pick,v=a.Point,w=a.Series,r=a.seriesType,h=a.setAnimation;r("pie","line",{center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{allowOverlap:!0,connectorPadding:5,distance:30,enabled:!0,formatter:function(){return this.point.isNull?void 0:this.point.name},softConnector:!0,x:0,connectorShape:"fixedOffset",crookDistance:"70%"},ignoreHiddenPoint:!0,legendType:"point",marker:null,
size:null,showInLegend:!1,slicedOffset:10,stickyTracking:!1,tooltip:{followPointer:!0},borderColor:"#ffffff",borderWidth:1,states:{hover:{brightness:.1}}},{isCartesian:!1,requireSorting:!1,directTouch:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttribs:a.seriesTypes.column.prototype.pointAttribs,animate:function(a){var e=this,c=e.points,d=e.startAngleRad;a||(c.forEach(function(a){var b=a.graphic,c=a.shapeArgs;b&&(b.attr({r:a.startR||e.center[3]/2,start:d,end:d}),
b.animate({r:c.r,start:c.start,end:c.end},e.options.animation))}),e.animate=null)},updateTotals:function(){var a,c=0,h=this.points,d=h.length,g,b=this.options.ignoreHiddenPoint;for(a=0;a<d;a++)g=h[a],c+=b&&!g.visible?0:g.isNull?0:g.y;this.total=c;for(a=0;a<d;a++)g=h[a],g.percentage=0<c&&(g.visible||!b)?g.y/c*100:0,g.total=c},generatePoints:function(){w.prototype.generatePoints.call(this);this.updateTotals()},getX:function(a,c,h){var d=this.center,e=this.radii?this.radii[h.index]:d[2]/2;return d[0]+
(c?-1:1)*Math.cos(Math.asin(Math.max(Math.min((a-d[1])/(e+h.labelDistance),1),-1)))*(e+h.labelDistance)+(0<h.labelDistance?(c?-1:1)*this.options.dataLabels.padding:0)},translate:function(a){this.generatePoints();var e=0,h=this.options,d=h.slicedOffset,g=d+(h.borderWidth||0),b,k,u=c(h.startAngle,h.endAngle),p=this.startAngleRad=u.start,u=(this.endAngleRad=u.end)-p,r=this.points,v,m,z=h.dataLabels.distance,h=h.ignoreHiddenPoint,w,A=r.length,f;a||(this.center=a=this.getCenter());for(w=0;w<A;w++){f=r[w];
f.labelDistance=t(f.options.dataLabels&&f.options.dataLabels.distance,z);this.maxLabelDistance=Math.max(this.maxLabelDistance||0,f.labelDistance);b=p+e*u;if(!h||f.visible)e+=f.percentage/100;k=p+e*u;f.shapeType="arc";f.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:Math.round(1E3*b)/1E3,end:Math.round(1E3*k)/1E3};k=(k+b)/2;k>1.5*Math.PI?k-=2*Math.PI:k<-Math.PI/2&&(k+=2*Math.PI);f.slicedTranslation={translateX:Math.round(Math.cos(k)*d),translateY:Math.round(Math.sin(k)*d)};v=Math.cos(k)*a[2]/
2;m=Math.sin(k)*a[2]/2;f.tooltipPos=[a[0]+.7*v,a[1]+.7*m];f.half=k<-Math.PI/2||k>Math.PI/2?1:0;f.angle=k;b=Math.min(g,f.labelDistance/5);f.labelPosition={natural:{x:a[0]+v+Math.cos(k)*f.labelDistance,y:a[1]+m+Math.sin(k)*f.labelDistance},"final":{},alignment:0>f.labelDistance?"center":f.half?"right":"left",connectorPosition:{breakAt:{x:a[0]+v+Math.cos(k)*b,y:a[1]+m+Math.sin(k)*b},touchingSliceAt:{x:a[0]+v,y:a[1]+m}}}}},drawGraph:null,drawPoints:function(){var a=this,c=a.chart,h=c.renderer,d,g,b,p,
u=a.options.shadow;!u||a.shadowGroup||c.styledMode||(a.shadowGroup=h.g("shadow").add(a.group));a.points.forEach(function(e){g=e.graphic;if(e.isNull)g&&(e.graphic=g.destroy());else{p=e.shapeArgs;d=e.getTranslate();if(!c.styledMode){var l=e.shadowGroup;u&&!l&&(l=e.shadowGroup=h.g("shadow").add(a.shadowGroup));l&&l.attr(d);b=a.pointAttribs(e,e.selected&&"select")}g?(g.setRadialReference(a.center),c.styledMode||g.attr(b),g.animate(k(p,d))):(e.graphic=g=h[e.shapeType](p).setRadialReference(a.center).attr(d).add(a.group),
c.styledMode||g.attr(b).attr({"stroke-linejoin":"round"}).shadow(u,l));g.attr({visibility:e.visible?"inherit":"hidden"});g.addClass(e.getClassName())}})},searchPoint:p,sortByAngle:function(a,c){a.sort(function(a,d){return void 0!==a.angle&&(d.angle-a.angle)*c})},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,getCenter:F.getCenter,getSymbol:p},{init:function(){v.prototype.init.apply(this,arguments);var a=this,c;a.name=t(a.name,"Slice");c=function(e){a.slice("select"===e.type)};y(a,"select",c);
y(a,"unselect",c);return a},isValid:function(){return a.isNumber(this.y,!0)&&0<=this.y},setVisible:function(a,c){var e=this,d=e.series,g=d.chart,b=d.options.ignoreHiddenPoint;c=t(c,b);a!==e.visible&&(e.visible=e.options.visible=a=void 0===a?!e.visible:a,d.options.data[d.data.indexOf(e)]=e.options,["graphic","dataLabel","connector","shadowGroup"].forEach(function(b){if(e[b])e[b][a?"show":"hide"](!0)}),e.legendItem&&g.legend.colorizeItem(e,a),a||"hover"!==e.state||e.setState(""),b&&(d.isDirty=!0),c&&
g.redraw())},slice:function(a,c,k){var d=this.series;h(k,d.chart);t(c,!0);this.sliced=this.options.sliced=G(a)?a:!this.sliced;d.options.data[d.data.indexOf(this)]=this.options;this.graphic.animate(this.getTranslate());this.shadowGroup&&this.shadowGroup.animate(this.getTranslate())},getTranslate:function(){return this.sliced?this.slicedTranslation:{translateX:0,translateY:0}},haloPath:function(a){var e=this.shapeArgs;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(e.x,e.y,
e.r+a,e.r+a,{innerR:this.shapeArgs.r-1,start:e.start,end:e.end})},connectorShapes:{fixedOffset:function(a,c,h){var d=c.breakAt;c=c.touchingSliceAt;return["M",a.x,a.y].concat(h.softConnector?["C",a.x+("left"===a.alignment?-5:5),a.y,2*d.x-c.x,2*d.y-c.y,d.x,d.y]:["L",d.x,d.y]).concat(["L",c.x,c.y])},straight:function(a,c){c=c.touchingSliceAt;return["M",a.x,a.y,"L",c.x,c.y]},crookedLine:function(e,c,h){c=c.touchingSliceAt;var d=this.series,g=d.center[0],b=d.chart.plotWidth,k=d.chart.plotLeft,d=e.alignment,
l=this.shapeArgs.r;h=a.relativeLength(h.crookDistance,1);h="left"===d?g+l+(b+k-g-l)*(1-h):k+(g-l)*h;g=["L",h,e.y];if("left"===d?h>e.x||h<c.x:h<e.x||h>c.x)g=[];return["M",e.x,e.y].concat(g).concat(["L",c.x,c.y])}},getConnectorPath:function(){var a=this.labelPosition,c=this.series.options.dataLabels,h=c.connectorShape,d=this.connectorShapes;d[h]&&(h=d[h]);return h.call(this,{x:a.final.x,y:a.final.y,alignment:a.alignment},a.connectorPosition,c)}})})(I);(function(a){var y=a.addEvent,F=a.arrayMax,G=a.defined,
k=a.extend,c=a.format,p=a.merge,t=a.noop,v=a.pick,w=a.relativeLength,r=a.Series,h=a.seriesTypes,e=a.stableSort,l=a.isArray,n=a.splat;a.distribute=function(d,c,b){function g(a,b){return a.target-b.target}var h,k=!0,l=d,n=[],m;m=0;var p=l.reducedLen||c;for(h=d.length;h--;)m+=d[h].size;if(m>p){e(d,function(a,b){return(b.rank||0)-(a.rank||0)});for(m=h=0;m<=p;)m+=d[h].size,h++;n=d.splice(h-1,d.length)}e(d,g);for(d=d.map(function(a){return{size:a.size,targets:[a.target],align:v(a.align,.5)}});k;){for(h=
d.length;h--;)k=d[h],m=(Math.min.apply(0,k.targets)+Math.max.apply(0,k.targets))/2,k.pos=Math.min(Math.max(0,m-k.size*k.align),c-k.size);h=d.length;for(k=!1;h--;)0<h&&d[h-1].pos+d[h-1].size>d[h].pos&&(d[h-1].size+=d[h].size,d[h-1].targets=d[h-1].targets.concat(d[h].targets),d[h-1].align=.5,d[h-1].pos+d[h-1].size>c&&(d[h-1].pos=c-d[h-1].size),d.splice(h,1),k=!0)}l.push.apply(l,n);h=0;d.some(function(d){var e=0;if(d.targets.some(function(){l[h].pos=d.pos+e;if(Math.abs(l[h].pos-l[h].target)>b)return l.slice(0,
h+1).forEach(function(a){delete a.pos}),l.reducedLen=(l.reducedLen||c)-.1*c,l.reducedLen>.1*c&&a.distribute(l,c,b),!0;e+=l[h].size;h++}))return!0});e(l,g)};r.prototype.drawDataLabels=function(){function d(a,b){var d=b.filter;return d?(b=d.operator,a=a[d.property],d=d.value,"\x3e"===b&&a>d||"\x3c"===b&&a<d||"\x3e\x3d"===b&&a>=d||"\x3c\x3d"===b&&a<=d||"\x3d\x3d"===b&&a==d||"\x3d\x3d\x3d"===b&&a===d?!0:!1):!0}function e(a,b){var d=[],c;if(l(a)&&!l(b))d=a.map(function(a){return p(a,b)});else if(l(b)&&
!l(a))d=b.map(function(b){return p(a,b)});else if(l(a)||l(b))for(c=Math.max(a.length,b.length);c--;)d[c]=p(a[c],b[c]);else d=p(a,b);return d}var b=this,h=b.chart,k=b.options,r=k.dataLabels,t=b.points,w,m=b.hasRendered||0,z,D=v(r.defer,!!k.animation),A=h.renderer,r=e(e(h.options.plotOptions&&h.options.plotOptions.series&&h.options.plotOptions.series.dataLabels,h.options.plotOptions&&h.options.plotOptions[b.type]&&h.options.plotOptions[b.type].dataLabels),r);a.fireEvent(this,"drawDataLabels");if(l(r)||
r.enabled||b._hasPointLabels)z=b.plotGroup("dataLabelsGroup","data-labels",D&&!m?"hidden":"visible",r.zIndex||6),D&&(z.attr({opacity:+m}),m||y(b,"afterAnimate",function(){b.visible&&z.show(!0);z[k.animation?"animate":"attr"]({opacity:1},{duration:200})})),t.forEach(function(f){w=n(e(r,f.dlOptions||f.options&&f.options.dataLabels));w.forEach(function(e,g){var m=e.enabled&&!f.isNull&&d(f,e),l,n,q,u,p=f.dataLabels?f.dataLabels[g]:f.dataLabel,r=f.connectors?f.connectors[g]:f.connector,t=!p;m&&(l=f.getLabelConfig(),
n=e[f.formatPrefix+"Format"]||e.format,l=G(n)?c(n,l,h.time):(e[f.formatPrefix+"Formatter"]||e.formatter).call(l,e),n=e.style,q=e.rotation,h.styledMode||(n.color=v(e.color,n.color,b.color,"#000000"),"contrast"===n.color&&(f.contrastColor=A.getContrast(f.color||b.color),n.color=e.inside||0>v(e.distance,f.labelDistance)||k.stacking?f.contrastColor:"#000000"),k.cursor&&(n.cursor=k.cursor)),u={r:e.borderRadius||0,rotation:q,padding:e.padding,zIndex:1},h.styledMode||(u.fill=e.backgroundColor,u.stroke=e.borderColor,
u["stroke-width"]=e.borderWidth),a.objectEach(u,function(a,b){void 0===a&&delete u[b]}));!p||m&&G(l)?m&&G(l)&&(p?u.text=l:(f.dataLabels=f.dataLabels||[],p=f.dataLabels[g]=q?A.text(l,0,-9999).addClass("highcharts-data-label"):A.label(l,0,-9999,e.shape,null,null,e.useHTML,null,"data-label"),g||(f.dataLabel=p),p.addClass(" highcharts-data-label-color-"+f.colorIndex+" "+(e.className||"")+(e.useHTML?" highcharts-tracker":""))),p.options=e,p.attr(u),h.styledMode||p.css(n).shadow(e.shadow),p.added||p.add(z),
b.alignDataLabel(f,p,e,null,t)):(f.dataLabel=f.dataLabel&&f.dataLabel.destroy(),f.dataLabels&&(1===f.dataLabels.length?delete f.dataLabels:delete f.dataLabels[g]),g||delete f.dataLabel,r&&(f.connector=f.connector.destroy(),f.connectors&&(1===f.connectors.length?delete f.connectors:delete f.connectors[g])))})});a.fireEvent(this,"afterDrawDataLabels")};r.prototype.alignDataLabel=function(a,e,b,c,h){var d=this.chart,g=this.isCartesian&&d.inverted,l=v(a.dlBox&&a.dlBox.centerX,a.plotX,-9999),m=v(a.plotY,
-9999),n=e.getBBox(),u,p=b.rotation,f=b.align,q=this.visible&&(a.series.forceDL||d.isInsidePlot(l,Math.round(m),g)||c&&d.isInsidePlot(l,g?c.x+1:c.y+c.height-1,g)),r="justify"===v(b.overflow,"justify");if(q&&(u=d.renderer.fontMetrics(d.styledMode?void 0:b.style.fontSize,e).b,c=k({x:g?this.yAxis.len-m:l,y:Math.round(g?this.xAxis.len-l:m),width:0,height:0},c),k(b,{width:n.width,height:n.height}),p?(r=!1,l=d.renderer.rotCorr(u,p),l={x:c.x+b.x+c.width/2+l.x,y:c.y+b.y+{top:0,middle:.5,bottom:1}[b.verticalAlign]*
c.height},e[h?"attr":"animate"](l).attr({align:f}),m=(p+720)%360,m=180<m&&360>m,"left"===f?l.y-=m?n.height:0:"center"===f?(l.x-=n.width/2,l.y-=n.height/2):"right"===f&&(l.x-=n.width,l.y-=m?0:n.height),e.placed=!0,e.alignAttr=l):(e.align(b,null,c),l=e.alignAttr),r&&0<=c.height?a.isLabelJustified=this.justifyDataLabel(e,b,l,n,c,h):v(b.crop,!0)&&(q=d.isInsidePlot(l.x,l.y)&&d.isInsidePlot(l.x+n.width,l.y+n.height)),b.shape&&!p))e[h?"attr":"animate"]({anchorX:g?d.plotWidth-a.plotY:a.plotX,anchorY:g?d.plotHeight-
a.plotX:a.plotY});q||(e.attr({y:-9999}),e.placed=!1)};r.prototype.justifyDataLabel=function(a,e,b,c,h,k){var d=this.chart,g=e.align,m=e.verticalAlign,l,n,u=a.box?0:a.padding||0;l=b.x+u;0>l&&("right"===g?e.align="left":e.x=-l,n=!0);l=b.x+c.width-u;l>d.plotWidth&&("left"===g?e.align="right":e.x=d.plotWidth-l,n=!0);l=b.y+u;0>l&&("bottom"===m?e.verticalAlign="top":e.y=-l,n=!0);l=b.y+c.height-u;l>d.plotHeight&&("top"===m?e.verticalAlign="bottom":e.y=d.plotHeight-l,n=!0);n&&(a.placed=!k,a.align(e,null,
h));return n};h.pie&&(h.pie.prototype.dataLabelPositioners={radialDistributionY:function(a){return a.top+a.distributeBox.pos},radialDistributionX:function(a,e,b,c){return a.getX(b<e.top+2||b>e.bottom-2?c:b,e.half,e)},justify:function(a,e,b){return b[0]+(a.half?-1:1)*(e+a.labelDistance)},alignToPlotEdges:function(a,e,b,c){a=a.getBBox().width;return e?a+c:b-a-c},alignToConnectors:function(a,e,b,c){var d=0,g;a.forEach(function(a){g=a.dataLabel.getBBox().width;g>d&&(d=g)});return e?d+c:b-d-c}},h.pie.prototype.drawDataLabels=
function(){var d=this,e=d.data,b,c=d.chart,h=d.options.dataLabels,k=h.connectorPadding,l=v(h.connectorWidth,1),n=c.plotWidth,m=c.plotHeight,p=c.plotLeft,t=Math.round(c.chartWidth/3),w,f=d.center,q=f[2]/2,y=f[1],K,I,J,M,R=[[],[]],C,P,N,S,O=[0,0,0,0],W=d.dataLabelPositioners;d.visible&&(h.enabled||d._hasPointLabels)&&(e.forEach(function(a){a.dataLabel&&a.visible&&a.dataLabel.shortened&&(a.dataLabel.attr({width:"auto"}).css({width:"auto",textOverflow:"clip"}),a.dataLabel.shortened=!1)}),r.prototype.drawDataLabels.apply(d),
e.forEach(function(a){a.dataLabel&&(a.visible?(R[a.half].push(a),a.dataLabel._pos=null,!G(h.style.width)&&!G(a.options.dataLabels&&a.options.dataLabels.style&&a.options.dataLabels.style.width)&&a.dataLabel.getBBox().width>t&&(a.dataLabel.css({width:.7*t}),a.dataLabel.shortened=!0)):(a.dataLabel=a.dataLabel.destroy(),a.dataLabels&&1===a.dataLabels.length&&delete a.dataLabels))}),R.forEach(function(e,g){var l,u,r=e.length,t=[],x;if(r)for(d.sortByAngle(e,g-.5),0<d.maxLabelDistance&&(l=Math.max(0,y-q-
d.maxLabelDistance),u=Math.min(y+q+d.maxLabelDistance,c.plotHeight),e.forEach(function(a){0<a.labelDistance&&a.dataLabel&&(a.top=Math.max(0,y-q-a.labelDistance),a.bottom=Math.min(y+q+a.labelDistance,c.plotHeight),x=a.dataLabel.getBBox().height||21,a.distributeBox={target:a.labelPosition.natural.y-a.top+x/2,size:x,rank:a.y},t.push(a.distributeBox))}),l=u+x-l,a.distribute(t,l,l/5)),S=0;S<r;S++){b=e[S];J=b.labelPosition;K=b.dataLabel;N=!1===b.visible?"hidden":"inherit";P=l=J.natural.y;t&&G(b.distributeBox)&&
(void 0===b.distributeBox.pos?N="hidden":(M=b.distributeBox.size,P=W.radialDistributionY(b)));delete b.positionIndex;if(h.justify)C=W.justify(b,q,f);else switch(h.alignTo){case "connectors":C=W.alignToConnectors(e,g,n,p);break;case "plotEdges":C=W.alignToPlotEdges(K,g,n,p);break;default:C=W.radialDistributionX(d,b,P,l)}K._attr={visibility:N,align:J.alignment};K._pos={x:C+h.x+({left:k,right:-k}[J.alignment]||0),y:P+h.y-10};J.final.x=C;J.final.y=P;v(h.crop,!0)&&(I=K.getBBox().width,l=null,C-I<k&&1===
g?(l=Math.round(I-C+k),O[3]=Math.max(l,O[3])):C+I>n-k&&0===g&&(l=Math.round(C+I-n+k),O[1]=Math.max(l,O[1])),0>P-M/2?O[0]=Math.max(Math.round(-P+M/2),O[0]):P+M/2>m&&(O[2]=Math.max(Math.round(P+M/2-m),O[2])),K.sideOverflow=l)}}),0===F(O)||this.verifyDataLabelOverflow(O))&&(this.placeDataLabels(),l&&this.points.forEach(function(a){var b;w=a.connector;if((K=a.dataLabel)&&K._pos&&a.visible&&0<a.labelDistance){N=K._attr.visibility;if(b=!w)a.connector=w=c.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-"+
a.colorIndex+(a.className?" "+a.className:"")).add(d.dataLabelsGroup),c.styledMode||w.attr({"stroke-width":l,stroke:h.connectorColor||a.color||"#666666"});w[b?"attr":"animate"]({d:a.getConnectorPath()});w.attr("visibility",N)}else w&&(a.connector=w.destroy())}))},h.pie.prototype.placeDataLabels=function(){this.points.forEach(function(a){var d=a.dataLabel;d&&a.visible&&((a=d._pos)?(d.sideOverflow&&(d._attr.width=d.getBBox().width-d.sideOverflow,d.css({width:d._attr.width+"px",textOverflow:(this.options.dataLabels.style||
{}).textOverflow||"ellipsis"}),d.shortened=!0),d.attr(d._attr),d[d.moved?"animate":"attr"](a),d.moved=!0):d&&d.attr({y:-9999}))},this)},h.pie.prototype.alignDataLabel=t,h.pie.prototype.verifyDataLabelOverflow=function(a){var d=this.center,b=this.options,e=b.center,c=b.minSize||80,h,k=null!==b.size;k||(null!==e[0]?h=Math.max(d[2]-Math.max(a[1],a[3]),c):(h=Math.max(d[2]-a[1]-a[3],c),d[0]+=(a[3]-a[1])/2),null!==e[1]?h=Math.max(Math.min(h,d[2]-Math.max(a[0],a[2])),c):(h=Math.max(Math.min(h,d[2]-a[0]-
a[2]),c),d[1]+=(a[0]-a[2])/2),h<d[2]?(d[2]=h,d[3]=Math.min(w(b.innerSize||0,h),h),this.translate(d),this.drawDataLabels&&this.drawDataLabels()):k=!0);return k});h.column&&(h.column.prototype.alignDataLabel=function(a,e,b,c,h){var d=this.chart.inverted,g=a.series,k=a.dlBox||a.shapeArgs,l=v(a.below,a.plotY>v(this.translatedThreshold,g.yAxis.len)),n=v(b.inside,!!this.options.stacking);k&&(c=p(k),0>c.y&&(c.height+=c.y,c.y=0),k=c.y+c.height-g.yAxis.len,0<k&&(c.height-=k),d&&(c={x:g.yAxis.len-c.y-c.height,
y:g.xAxis.len-c.x-c.width,width:c.height,height:c.width}),n||(d?(c.x+=l?0:c.width,c.width=0):(c.y+=l?c.height:0,c.height=0)));b.align=v(b.align,!d||n?"center":l?"right":"left");b.verticalAlign=v(b.verticalAlign,d||n?"middle":l?"top":"bottom");r.prototype.alignDataLabel.call(this,a,e,b,c,h);a.isLabelJustified&&a.contrastColor&&e.css({color:a.contrastColor})})})(I);(function(a){var y=a.Chart,F=a.isArray,G=a.objectEach,k=a.pick,c=a.addEvent,p=a.fireEvent;c(y,"render",function(){var a=[];(this.labelCollectors||
[]).forEach(function(c){a=a.concat(c())});(this.yAxis||[]).forEach(function(c){c.options.stackLabels&&!c.options.stackLabels.allowOverlap&&G(c.stacks,function(c){G(c,function(c){a.push(c.label)})})});(this.series||[]).forEach(function(c){var p=c.options.dataLabels;c.visible&&(!1!==p.enabled||c._hasPointLabels)&&c.points.forEach(function(c){c.visible&&(F(c.dataLabels)?c.dataLabels:c.dataLabel?[c.dataLabel]:[]).forEach(function(h){var e=h.options;h.labelrank=k(e.labelrank,c.labelrank,c.shapeArgs&&c.shapeArgs.height);
e.allowOverlap||a.push(h)})})});this.hideOverlappingLabels(a)});y.prototype.hideOverlappingLabels=function(a){var c=this,k=a.length,r=c.renderer,h,e,l,n,d,g,b=function(a,b,c,d,e,g,h,k){return!(e>a+c||e+h<a||g>b+d||g+k<b)};l=function(a){var b,c,d,e=a.box?0:a.padding||0;d=0;if(a&&(!a.alignAttr||a.placed))return b=a.alignAttr||{x:a.attr("x"),y:a.attr("y")},c=a.parentGroup,a.width||(d=a.getBBox(),a.width=d.width,a.height=d.height,d=r.fontMetrics(null,a.element).h),{x:b.x+(c.translateX||0)+e,y:b.y+(c.translateY||
0)+e-d,width:a.width-2*e,height:a.height-2*e}};for(e=0;e<k;e++)if(h=a[e])h.oldOpacity=h.opacity,h.newOpacity=1,h.absoluteBox=l(h);a.sort(function(a,b){return(b.labelrank||0)-(a.labelrank||0)});for(e=0;e<k;e++)for(g=(l=a[e])&&l.absoluteBox,h=e+1;h<k;++h)if(d=(n=a[h])&&n.absoluteBox,g&&d&&l!==n&&0!==l.newOpacity&&0!==n.newOpacity&&(d=b(g.x,g.y,g.width,g.height,d.x,d.y,d.width,d.height)))(l.labelrank<n.labelrank?l:n).newOpacity=0;a.forEach(function(a){var b,d;a&&(d=a.newOpacity,a.oldOpacity!==d&&(a.alignAttr&&
a.placed?(d?a.show(!0):b=function(){a.hide()},a.alignAttr.opacity=d,a[a.isOld?"animate":"attr"](a.alignAttr,null,b),p(c,"afterHideOverlappingLabels")):a.attr({opacity:d})),a.isOld=!0)})}})(I);(function(a){var y=a.addEvent,F=a.Chart,G=a.createElement,k=a.css,c=a.defaultOptions,p=a.defaultPlotOptions,t=a.extend,v=a.fireEvent,w=a.hasTouch,r=a.isObject,h=a.Legend,e=a.merge,l=a.pick,n=a.Point,d=a.Series,g=a.seriesTypes,b=a.svg,x;x=a.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,c=b.pointer,
d=function(a){var b=c.getPointFromEvent(a);void 0!==b&&(c.isDirectTouch=!0,b.onMouseOver(a))};a.points.forEach(function(a){a.graphic&&(a.graphic.element.point=a);a.dataLabel&&(a.dataLabel.div?a.dataLabel.div.point=a:a.dataLabel.element.point=a)});a._hasTracking||(a.trackerGroups.forEach(function(e){if(a[e]){a[e].addClass("highcharts-tracker").on("mouseover",d).on("mouseout",function(a){c.onTrackerMouseOut(a)});if(w)a[e].on("touchstart",d);!b.styledMode&&a.options.cursor&&a[e].css(k).css({cursor:a.options.cursor})}}),
a._hasTracking=!0);v(this,"afterDrawTracker")},drawTrackerGraph:function(){var a=this,c=a.options,d=c.trackByArea,e=[].concat(d?a.areaPath:a.graphPath),g=e.length,h=a.chart,k=h.pointer,l=h.renderer,f=h.options.tooltip.snap,n=a.tracker,p,r=function(){if(h.hoverSeries!==a)a.onMouseOver()},t="rgba(192,192,192,"+(b?.0001:.002)+")";if(g&&!d)for(p=g+1;p--;)"M"===e[p]&&e.splice(p+1,0,e[p+1]-f,e[p+2],"L"),(p&&"M"===e[p]||p===g)&&e.splice(p,0,"L",e[p-2]+f,e[p-1]);n?n.attr({d:e}):a.graph&&(a.tracker=l.path(e).attr({visibility:a.visible?
"visible":"hidden",zIndex:2}).addClass(d?"highcharts-tracker-area":"highcharts-tracker-line").add(a.group),h.styledMode||a.tracker.attr({"stroke-linejoin":"round",stroke:t,fill:d?t:"none","stroke-width":a.graph.strokeWidth()+(d?0:2*f)}),[a.tracker,a.markerGroup].forEach(function(a){a.addClass("highcharts-tracker").on("mouseover",r).on("mouseout",function(a){k.onTrackerMouseOut(a)});c.cursor&&!h.styledMode&&a.css({cursor:c.cursor});if(w)a.on("touchstart",r)}));v(this,"afterDrawTracker")}};g.column&&
(g.column.prototype.drawTracker=x.drawTrackerPoint);g.pie&&(g.pie.prototype.drawTracker=x.drawTrackerPoint);g.scatter&&(g.scatter.prototype.drawTracker=x.drawTrackerPoint);t(h.prototype,{setItemEvents:function(a,b,c){var d=this,g=d.chart.renderer.boxWrapper,h="highcharts-legend-"+(a instanceof n?"point":"series")+"-active",k=d.chart.styledMode;(c?b:a.legendGroup).on("mouseover",function(){a.setState("hover");g.addClass(h);k||b.css(d.options.itemHoverStyle)}).on("mouseout",function(){d.styledMode||
b.css(e(a.visible?d.itemStyle:d.itemHiddenStyle));g.removeClass(h);a.setState()}).on("click",function(b){var c=function(){a.setVisible&&a.setVisible()};g.removeClass(h);b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):v(a,"legendItemClick",b,c)})},createCheckboxForItem:function(a){a.checkbox=G("input",{type:"checkbox",className:"highcharts-legend-checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);y(a.checkbox,"click",
function(b){v(a.series||a,"checkboxClick",{checked:b.target.checked,item:a},function(){a.select()})})}});t(F.prototype,{showResetZoom:function(){function a(){b.zoomOut()}var b=this,d=c.lang,e=b.options.chart.resetZoomButton,g=e.theme,h=g.states,k="chart"===e.relativeTo?null:"plotBox";v(this,"beforeShowResetZoom",null,function(){b.resetZoomButton=b.renderer.button(d.resetZoom,null,null,a,g,h&&h.hover).attr({align:e.position.align,title:d.resetZoomTitle}).addClass("highcharts-reset-zoom").add().align(e.position,
!1,k)})},zoomOut:function(){v(this,"selection",{resetSelection:!0},this.zoom)},zoom:function(a){var b,c=this.pointer,d=!1,e;!a||a.resetSelection?(this.axes.forEach(function(a){b=a.zoom()}),c.initiated=!1):a.xAxis.concat(a.yAxis).forEach(function(a){var e=a.axis;c[e.isXAxis?"zoomX":"zoomY"]&&(b=e.zoom(a.min,a.max),e.displayBtn&&(d=!0))});e=this.resetZoomButton;d&&!e?this.showResetZoom():!d&&r(e)&&(this.resetZoomButton=e.destroy());b&&this.redraw(l(this.options.chart.animation,a&&a.animation,100>this.pointCount))},
pan:function(a,b){var c=this,d=c.hoverPoints,e;v(this,"pan",{originalEvent:a},function(){d&&d.forEach(function(a){a.setState()});("xy"===b?[1,0]:[1]).forEach(function(b){b=c[b?"xAxis":"yAxis"][0];var d=b.horiz,g=a[d?"chartX":"chartY"],d=d?"mouseDownX":"mouseDownY",f=c[d],h=(b.pointRange||0)/2,k=b.reversed&&!c.inverted||!b.reversed&&c.inverted?-1:1,l=b.getExtremes(),m=b.toValue(f-g,!0)+h*k,k=b.toValue(f+b.len-g,!0)-h*k,n=k<m,f=n?k:m,m=n?m:k,k=Math.min(l.dataMin,h?l.min:b.toValue(b.toPixels(l.min)-
b.minPixelPadding)),h=Math.max(l.dataMax,h?l.max:b.toValue(b.toPixels(l.max)+b.minPixelPadding)),n=k-f;0<n&&(m+=n,f=k);n=m-h;0<n&&(m=h,f-=n);b.series.length&&f!==l.min&&m!==l.max&&(b.setExtremes(f,m,!1,!1,{trigger:"pan"}),e=!0);c[d]=g});e&&c.redraw(!1);k(c.container,{cursor:"move"})})}});t(n.prototype,{select:function(a,b){var c=this,d=c.series,e=d.chart;a=l(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;d.options.data[d.data.indexOf(c)]=
c.options;c.setState(a&&"select");b||e.getSelectedPoints().forEach(function(a){a.selected&&a!==c&&(a.selected=a.options.selected=!1,d.options.data[d.data.indexOf(a)]=a.options,a.setState(""),a.firePointEvent("unselect"))})})},onMouseOver:function(a){var b=this.series.chart,c=b.pointer;a=a?c.normalize(a):c.getChartCoordinatesFromPoint(this,b.inverted);c.runPointActions(a,this)},onMouseOut:function(){var a=this.series.chart;this.firePointEvent("mouseOut");(a.hoverPoints||[]).forEach(function(a){a.setState()});
a.hoverPoints=a.hoverPoint=null},importEvents:function(){if(!this.hasImportedEvents){var b=this,c=e(b.series.options.point,b.options).events;b.events=c;a.objectEach(c,function(a,c){y(b,c,a)});this.hasImportedEvents=!0}},setState:function(a,b){var c=Math.floor(this.plotX),d=this.plotY,e=this.series,g=e.options.states[a||"normal"]||{},h=p[e.type].marker&&e.options.marker,k=h&&!1===h.enabled,f=h&&h.states&&h.states[a||"normal"]||{},n=!1===f.enabled,r=e.stateMarkerGraphic,u=this.marker||{},w=e.chart,
x=e.halo,y,F=h&&e.markerAttribs;a=a||"";if(!(a===this.state&&!b||this.selected&&"select"!==a||!1===g.enabled||a&&(n||k&&!1===f.enabled)||a&&u.states&&u.states[a]&&!1===u.states[a].enabled)){F&&(y=e.markerAttribs(this,a));if(this.graphic)this.state&&this.graphic.removeClass("highcharts-point-"+this.state),a&&this.graphic.addClass("highcharts-point-"+a),w.styledMode||this.graphic.animate(e.pointAttribs(this,a),l(w.options.chart.animation,g.animation)),y&&this.graphic.animate(y,l(w.options.chart.animation,
f.animation,h.animation)),r&&r.hide();else{if(a&&f){h=u.symbol||e.symbol;r&&r.currentSymbol!==h&&(r=r.destroy());if(r)r[b?"animate":"attr"]({x:y.x,y:y.y});else h&&(e.stateMarkerGraphic=r=w.renderer.symbol(h,y.x,y.y,y.width,y.height).add(e.markerGroup),r.currentSymbol=h);!w.styledMode&&r&&r.attr(e.pointAttribs(this,a))}r&&(r[a&&w.isInsidePlot(c,d,w.inverted)?"show":"hide"](),r.element.point=this)}(c=g.halo)&&c.size?(x||(e.halo=x=w.renderer.path().add((this.graphic||r).parentGroup)),x.show()[b?"animate":
"attr"]({d:this.haloPath(c.size)}),x.attr({"class":"highcharts-halo highcharts-color-"+l(this.colorIndex,e.colorIndex)+(this.className?" "+this.className:""),zIndex:-1}),x.point=this,w.styledMode||x.attr(t({fill:this.color||e.color,"fill-opacity":c.opacity},c.attributes))):x&&x.point&&x.point.haloPath&&x.animate({d:x.point.haloPath(0)},null,x.hide);this.state=a;v(this,"afterSetState")}},haloPath:function(a){return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX)-a,this.plotY-a,2*a,
2*a)}});t(d.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&v(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;b.hoverSeries=null;if(d)d.onMouseOut();this&&a.events.mouseOut&&v(this,"mouseOut");!c||this.stickyTracking||c.shared&&!this.noSharedTooltip||c.hide();this.setState()},setState:function(a){var b=this,c=b.options,d=b.graph,
e=c.states,g=c.lineWidth,c=0;a=a||"";if(b.state!==a&&([b.group,b.markerGroup,b.dataLabelsGroup].forEach(function(c){c&&(b.state&&c.removeClass("highcharts-series-"+b.state),a&&c.addClass("highcharts-series-"+a))}),b.state=a,!(b.chart.styledMode||e[a]&&!1===e[a].enabled)&&(a&&(g=e[a].lineWidth||g+(e[a].lineWidthPlus||0)),d&&!d.dashstyle)))for(g={"stroke-width":g},d.animate(g,l(e[a||"normal"]&&e[a||"normal"].animation,b.chart.options.chart.animation));b["zone-graph-"+c];)b["zone-graph-"+c].attr(g),
c+=1},setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,g,h=d.options.chart.ignoreHiddenSeries,k=c.visible;g=(c.visible=a=c.options.visible=c.userOptions.visible=void 0===a?!k:a)?"show":"hide";["group","dataLabelsGroup","markerGroup","tracker","tt"].forEach(function(a){if(c[a])c[a][g]()});if(d.hoverSeries===c||(d.hoverPoint&&d.hoverPoint.series)===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&d.series.forEach(function(a){a.options.stacking&&a.visible&&
(a.isDirty=!0)});c.linkedSeries.forEach(function(b){b.setVisible(a,!1)});h&&(d.isDirtyBox=!0);v(c,g);!1!==b&&d.redraw()},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=this.options.selected=void 0===a?!this.selected:a;this.checkbox&&(this.checkbox.checked=a);v(this,a?"select":"unselect")},drawTracker:x.drawTrackerGraph})})(I);(function(a){var y=a.Chart,F=a.isArray,G=a.isObject,k=a.pick,c=a.splat;y.prototype.setResponsive=function(c,k){var p=
this.options.responsive,t=[],r=this.currentResponsive;!k&&p&&p.rules&&p.rules.forEach(function(h){void 0===h._id&&(h._id=a.uniqueKey());this.matchResponsiveRule(h,t,c)},this);k=a.merge.apply(0,t.map(function(c){return a.find(p.rules,function(a){return a._id===c}).chartOptions}));k.isResponsiveOptions=!0;t=t.toString()||void 0;t!==(r&&r.ruleIds)&&(r&&this.update(r.undoOptions,c),t?(r=this.currentOptions(k),r.isResponsiveOptions=!0,this.currentResponsive={ruleIds:t,mergedOptions:k,undoOptions:r},this.update(k,
c)):this.currentResponsive=void 0)};y.prototype.matchResponsiveRule=function(a,c){var p=a.condition;(p.callback||function(){return this.chartWidth<=k(p.maxWidth,Number.MAX_VALUE)&&this.chartHeight<=k(p.maxHeight,Number.MAX_VALUE)&&this.chartWidth>=k(p.minWidth,0)&&this.chartHeight>=k(p.minHeight,0)}).call(this)&&c.push(a._id)};y.prototype.currentOptions=function(k){function p(k,r,h,e){var l;a.objectEach(k,function(a,d){if(!e&&-1<["series","xAxis","yAxis"].indexOf(d))for(a=c(a),h[d]=[],l=0;l<a.length;l++)r[d][l]&&
(h[d][l]={},p(a[l],r[d][l],h[d][l],e+1));else G(a)?(h[d]=F(a)?[]:{},p(a,r[d]||{},h[d],e+1)):h[d]=r[d]||null})}var v={};p(k,this.options,v,0);return v}})(I);return I});
/*
 Highcharts JS v2.1.4 (2011-03-02)
 Exporting module

 (c) 2010 Torstein H?nsi

 License: www.highcharts.com/license
*/

(function() {
    var k = Highcharts,
        y = k.Chart,
        C = k.addEvent,
        r = k.createElement,
        z = k.discardElement,
        u = k.css,
        w = k.merge,
        s = k.each,
        p = k.extend,
        D = Math.max,
        q = document,
        E = window,
        A = "ontouchstart" in q.documentElement,
        B = k.setOptions({
            lang: {
                downloadPNG: "Download PNG image",
                downloadJPEG: "Download JPEG image",
                downloadPDF: "Download PDF document",
                downloadSVG: "Download SVG vector image",
                exportButtonTitle: "Export to raster or vector image",
                printButtonTitle: "Print the chart"
            }
        });
    B.navigation = {
        menuStyle: {
            border: "1px solid #A0A0A0",
            background: "#FFFFFF"
        },
        menuItemStyle: {
            padding: "0 5px",
            background: "none",
            color: "#303030",
            fontSize: A ? "14px" : "11px"
        },
        menuItemHoverStyle: {
            background: "#4572A5",
            color: "#FFFFFF"
        },
        buttonOptions: {
            align: "right",
            backgroundColor: {
                linearGradient: [0, 0, 0, 20],
                stops: [[0.4, "#F7F7F7"], [0.6, "#E3E3E3"]]
            },
            borderColor: "#B0B0B0",
            borderRadius: 3,
            borderWidth: 1,
            height: 20,
            hoverBorderColor: "#909090",
            hoverSymbolFill: "#81A7CF",
            hoverSymbolStroke: "#4572A5",
            symbolFill: "#E0E0E0",
            symbolStroke: "#A0A0A0",
            symbolX: 11.5,
            symbolY: 10.5,
            verticalAlign: "top",
            width: 24,
            y: 10
        }
    };
    B.exporting = {
        type: "image/png",
        url: "http://export.highcharts.com/",
        width: 800,
        buttons: {
            exportButton: {
                symbol: "exportIcon",
                x: -10,
                symbolFill: "#A8BF77",
                hoverSymbolFill: "#768F3E",
                _titleKey: "exportButtonTitle",
                menuItems: [{
                    textKey: "downloadPNG",
                    onclick: function() {
                        this.exportChart()
                    }
                }, {
                    textKey: "downloadJPEG",
                    onclick: function() {
                        this.exportChart({
                            type: "image/jpeg"
                        })
                    }
                }, {
                    textKey: "downloadPDF",
                    onclick: function() {
                        this.exportChart({
                            type: "application/pdf"
                        })
                    }
                }, {
                    textKey: "downloadSVG",
                    onclick: function() {
                        this.exportChart({
                            type: "image/svg+xml"
                        })
                    }
                }]
            },
            printButton: {
                symbol: "printIcon",
                x: -36,
                symbolFill: "#B5C9DF",
                hoverSymbolFill: "#779ABF",
                _titleKey: "printButtonTitle",
                onclick: function() {
                    this.print()
                }
            }
        }
    };
    p(y.prototype, {
        getSVG: function(b) {
            var c = this,
                a,
                f,
                d,
                i,
                e,
                h,
                j = w(c.options, b);
            if (!q.createElementNS)
                q.createElementNS = function(l, g) {
                    var n = q.createElement(g);
                    n.getBBox = function() {
                        return c.renderer.Element.prototype.getBBox.apply({
                            element: n
                        })
                    };
                    return n
                };
            a = r("div", null, {
                position: "absolute",
                top: "-9999em",
                width: c.chartWidth + "px",
                height: c.chartHeight + "px"
            }, q.body);
            p(j.chart, {
                renderTo: a,
                forExport: true
            });
            j.exporting.enabled = false;
            j.chart.plotBackgroundImage = null;
            j.series = [];
            s(c.series, function(l) {
                d = l.options;
                d.animation = false;
                d.showCheckbox = false;
                if (d && d.marker && /^url\(/.test(d.marker.symbol))
                    d.marker.symbol = "circle";
                d.data = [];
                s(l.data, function(g) {
                    i = g.config;
                    e = {
                        x: g.x,
                        y: g.y,
                        name: g.name
                    };
                    typeof i == "object" && g.config && i.constructor != Array && p(e, i);
                    d.data.push(e);
                    (h = g.config && g.config.marker) && /^url\(/.test(h.symbol) && delete h.symbol
                });
                j.series.push(d)
            });
            b = new Highcharts.Chart(j);
            f = b.container.innerHTML;
            j = null;
            b.destroy();
            z(a);
            f = f.replace(/zIndex="[^"]+"/g, "").replace(/isShadow="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery[0-9]+="[^"]+"/g, "").replace(/isTracker="[^"]+"/g, "").replace(/url\([^#]+#/g, "url(#").replace(/id=([^" >]+)/g, 'id="$1"').replace(/class=([^" ]+)/g, 'class="$1"').replace(/ transform /g, " ").replace(/:(path|rect)/g, "$1").replace(/style="([^"]+)"/g, function(l) {
                return l.toLowerCase()
            });
            f = f.replace(/(url\(#highcharts-[0-9]+)&quot;/g, "$1").replace(/&quot;/g,
            "'");
            if (f.match(/ xmlns="/g).length == 2)
                f = f.replace(/xmlns="[^"]+"/, "");
            return f
        },
        exportChart: function(b, c) {
            var a,
                f = this.getSVG(c);
            b = w(this.options.exporting, b);
            a = r("form", {
                method: "post",
                action: b.url
            }, {
                display: "none"
            }, q.body);
            s(["filename", "type", "width", "svg"], function(d) {
                r("input", {
                    type: "hidden",
                    name: d,
                    value: {
                        filename: b.filename || "chart",
                        type: b.type,
                        width: b.width,
                        svg: f
                    }[d]
                }, null, a)
            });
            a.submit();
            z(a)
        },
        print: function() {
            var b = this,
                c = b.container,
                a = [],
                f = c.parentNode,
                d = q.body,
                i = d.childNodes;
            if (!b.isPrinting) {
                b.isPrinting =
                true;
                s(i, function(e, h) {
                    if (e.nodeType == 1) {
                        a[h] = e.style.display;
                        e.style.display = "none"
                    }
                });
                d.appendChild(c);
                E.print();
                setTimeout(function() {
                    f.appendChild(c);
                    s(i, function(e, h) {
                        if (e.nodeType == 1)
                            e.style.display = a[h]
                    });
                    b.isPrinting = false
                }, 1E3)
            }
        },
        contextMenu: function(b, c, a, f, d, i) {
            var e = this,
                h = e.options.navigation,
                j = h.menuItemStyle,
                l = e.chartWidth,
                g = e.chartHeight,
                n = "cache-" + b,
                m = e[n],
                o = D(d, i),
                t,
                x;
            if (!m) {
                e[n] = m = r("div", {
                    className: "highcharts-" + b
                }, {
                    position: "absolute",
                    zIndex: 1E3,
                    padding: o + "px"
                }, e.container);
                t =
                r("div", null, p({
                    MozBoxShadow: "3px 3px 10px #888",
                    WebkitBoxShadow: "3px 3px 10px #888",
                    boxShadow: "3px 3px 10px #888"
                }, h.menuStyle), m);
                x = function() {
                    u(m, {
                        display: "none"
                    })
                };
                C(m, "mouseleave", x);
                s(c, function(v) {
                    if (v)
                        r("div", {
                            onmouseover: function() {
                                u(this, h.menuItemHoverStyle)
                            },
                            onmouseout: function() {
                                u(this, j)
                            },
                            innerHTML: v.text || k.getOptions().lang[v.textKey]
                        }, p({
                            cursor: "pointer"
                        }, j), t)[A ? "ontouchstart" : "onclick"] = function() {
                            x();
                            v.onclick.apply(e, arguments)
                        }
                });
                e.exportMenuWidth = m.offsetWidth;
                e.exportMenuHeight =
                m.offsetHeight
            }
            b = {
                display: "block"
            };
            if (a + e.exportMenuWidth > l)
                b.right = l - a - d - o + "px";
            else
                b.left = a - o + "px";
            if (f + i + e.exportMenuHeight > g)
                b.bottom = g - f - o + "px";
            else
                b.top = f + i - o + "px";
            u(m, b)
        },
        addButton: function(b) {
            function c() {
                g.attr(o);
                l.attr(m)
            }
            var a = this,
                f = a.renderer,
                d = w(a.options.navigation.buttonOptions, b),
                i = d.onclick,
                e = d.menuItems,
                h = d.width,
                j = d.height,
                l,
                g,
                n;
            b = d.borderWidth;
            var m = {
                    stroke: d.borderColor
                },
                o = {
                    stroke: d.symbolStroke,
                    fill: d.symbolFill
                };
            if (d.enabled !== false) {
                l = f.rect(0, 0, h, j, d.borderRadius, b).align(d,
                true).attr(p({
                    fill: d.backgroundColor,
                    "stroke-width": b,
                    zIndex: 19
                }, m)).add();
                n = f.rect(0, 0, h, j, 0).align(d).attr({
                    fill: "rgba(255, 255, 255, 0.001)",
                    title: k.getOptions().lang[d._titleKey],
                    zIndex: 21
                }).css({
                    cursor: "pointer"
                }).on("mouseover", function() {
                    g.attr({
                        stroke: d.hoverSymbolStroke,
                        fill: d.hoverSymbolFill
                    });
                    l.attr({
                        stroke: d.hoverBorderColor
                    })
                }).on("mouseout", c).on("click", c).add();
                if (e)
                    i = function() {
                        c();
                        var t = n.getBBox();
                        a.contextMenu("export-menu", e, t.x, t.y, h, j)
                    };
                n.on("click", function() {
                    i.apply(a, arguments)
                });
                g = f.symbol(d.symbol, d.symbolX, d.symbolY, (d.symbolSize || 12) / 2).align(d, true).attr(p(o, {
                    "stroke-width": d.symbolStrokeWidth || 1,
                    zIndex: 20
                })).add()
            }
        }
    });
    k.Renderer.prototype.symbols.exportIcon = function(b, c, a) {
        return ["M", b - a, c + a, "L", b + a, c + a, b + a, c + a * 0.5, b - a, c + a * 0.5, "Z", "M", b, c + a * 0.5, "L", b - a * 0.5, c - a / 3, b - a / 6, c - a / 3, b - a / 6, c - a, b + a / 6, c - a, b + a / 6, c - a / 3, b + a * 0.5, c - a / 3, "Z"]
    };
    k.Renderer.prototype.symbols.printIcon = function(b, c, a) {
        return ["M", b - a, c + a * 0.5, "L", b + a, c + a * 0.5, b + a, c - a / 3, b - a, c - a / 3, "Z", "M", b - a * 0.5, c - a / 3, "L", b - a *
        0.5, c - a, b + a * 0.5, c - a, b + a * 0.5, c - a / 3, "Z", "M", b - a * 0.5, c + a * 0.5, "L", b - a * 0.75, c + a, b + a * 0.75, c + a, b + a * 0.5, c + a * 0.5, "Z"]
    };
    y.prototype.callbacks.push(function(b) {
        var c,
            a = b.options.exporting,
            f = a.buttons;
        if (a.enabled !== false)
            for (c in f)
                b.addButton(f[c])
    })
})();

// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults



















// Moved these here so we don't have to specify a path for the charts based
// on hostname. See "show.html.erb" and vendor/assets/javascripts path. 20190321
//
// NOTE: these changes require compilation!



;
