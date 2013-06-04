/*
 * jsPlumb 1.2.1-RC1
 * 
 * Provides a way to visually connect elements on an HTML page.
 * 
 * Several enhancements are planned for 1.2.1:
 * 
 * - speed enhancements for dragging/animation (fewer element positioning lookups etc)
 * 
 * - the ability to label connectors.  each connector type will have to tell us the right place
 *   for a label to go.
 * 
 * - the ability to interact with connectors/endpoints using the mouse
 * 
 * - the log function should hook up to the console of whichever browser it is in. or library. 
 * 
 * - reinstate the context node to put all our canvases in
 * 
 * - possibly support multiple jsplumb instances on the same page.  this would not be too hard;
 *   it would just need to stop being a singleton. 07/05/10: this is done now.
 *   
 * - support for devices with touch events. 
 * 
 * http://morrisonpitt.com/jsPlumb/demo.html
 * http://code.google.com/p/jsPlumb
 * 
 */ 

(function() {
	
	/*
	 Class: jsPlumb 
	 
	 This is the main entry point to jsPlumb.  There are a bunch of static methods you can
	 use to connect/disconnect etc.  Some methods are also added to jQuery's "$.fn" object itself, but
	 in general jsPlumb is moving away from that model, preferring instead the static class
	 approach.  One of the reasons for this is that with no methods added to the jQuery $.fn object,
	 it will be easier to provide support for other libraries such as MooTools. 
	 */
   var jsPlumbInstance = function() {
	   
	   var _currentInstance = this;
	
	var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);
	
	var log = null;
	
	var repaintFunction = function() { jsPlumb.repaintEverything(); };
	var automaticRepaint = true;
    function repaintEverything() {
    	if (automaticRepaint)
    		repaintFunction();
    };
    var resizeTimer = null;        
	
	/**
	 * map of element id -> endpoint lists.  an element can have an arbitrary number of endpoints on it,
	 * and not all of them have to be connected to anything.
	 */
	var endpointsByElement = {};
	var connectionsByScope = {};
	var offsets = [];
	var floatingConnections = {};
	var draggableStates = {};
	var _draggableByDefault = true;
	var sizes = [];
	var DEFAULT_SCOPE = 'DEFAULT';
	
	var DEFAULT_NEW_CANVAS_SIZE = 1200; // only used for IE; a canvas needs a size before the init call to excanvas (for some reason. no idea why.)
	
	var traced = {};
	var _trace = function(category, event) {
		var e = traced[category];
		if (!e) {
			e = {};
			traced[category] = e;
		}
		event = event || 'DEFAULT';
		var ee = e[event];
		if (!ee) {
			ee = 0;
			e[event] = ee;
		}
		e[event]++;
	};
	
	var _clearAllTraces = function() {
		delete traced;
		traced = {};
	};
			
		var _clearTrace = function(category, event) {
			var c = traced[category];
			if (!c) return;
			if (event) {
				c[event] = 0;
			}
			else c['DEFAULT'] = 0;
		};
			
		var _getTrace = function(category) {
			return traced[category] || {'DEFAULT' : 0 };
		};
	
	
	var _findIndex = function( a, v, b, s ) {		
		var _eq = function(o1, o2) {
			if (o1 === o2) return true;
			else if (typeof o1 == 'object' && typeof o2 == 'object') {
				var same = true;
				for(var propertyName in o1) {				
					if(!_eq(o1[propertyName], o2[propertyName])) {
						same = false;
				        break;
				    }
				}
				for(var propertyName in o2) {				
					if(!_eq(o2[propertyName], o1[propertyName])) {
						same = false;
					   	break;
					}
				}
				return same;			
			}	
		};
		
		 for( var i = +b || 0, l = a.length; i < l; i++ ) {
			 if( _eq(a[i], v)) return i; 
		 }
		 return -1;
	};
	
	/**
     * helper method to add an item to a list, creating the list if it does not yet exist.
     */
    var _addToList = function(map, key, value) {
		var l = map[key];
		if (l == null) {
			l = [];
			map[key] = l; 
		}
		l.push(value);
		return l;
	};
	
    /**
     * Handles the dragging of an element.  
     * @param element jQuery element
     * @param ui UI object from current library's event system
     */
    var _draw = function(element, ui) {
    	var id = _getAttribute(element, "id");
    	var endpoints = endpointsByElement[id];
    	if (endpoints) {
    		var timestamp = '' + (new Date().getTime());
    		_trace('draw');
    		_updateOffset(id, ui);
    		var myOffset = offsets[id];
			var myWH = sizes[id];			
	    	// loop through endpoints for this element
	    	for (var i = 0; i < endpoints.length; i++) {
	    		var e = endpoints[i];	    		
	    		var anchorLoc = e.anchor.compute([myOffset.left, myOffset.top], myWH, e);
	            e.paint(anchorLoc);
	            var l = e.connections;
		    	for (var j = 0; j < l.length; j++)
		    		l[j].paint(id, ui, false, timestamp);  // ...and paint them.
	    	}
    	}
    };
    
    /**
	 * helper function: the second argument is a function taking two args - the first is an id
	 * ui element from the current library (or list of them), and the second is the function
	 * to run.
	 */
	var _elementProxy = function(element, fn) {
		var retVal = null;
		// TODO this might be jquery specific. in fact it probably is.
		if (typeof element == 'object' && element.length) {
			retVal = [];
    		for (var i = 0; i < element.length; i++) {
    			var el = _getElementObject(element[i]);
    	    	var id = _getAttribute(el, "id");
    			retVal.push(fn(el, id));  // append return values to what we will return
    		}
    	}
    	else {
	    	var el = _getElementObject(element);
	    	var id = _getAttribute(el, "id");
	    	retVal = fn(el, id);
    	}
		
		return retVal;
	};
	
	var _log = function(msg) {
	    //if (console) console.log(msg);	
	    };
	
	var _logFnCall = function(fn, args) {
	    /*if (console) {
	    	var c = args.callee.caller.toString();
	    	var i = c.indexOf("{");
	    	var msg = fn + ' : ' + c.substring(0, i);
	    	console.log(msg);
	    }*/
	};
	
	var cached = {};
	var __getElementObject = function(el) {
		
		if (typeof(el)=='string') {
			var e = cached[el];
			if (!e) {
				e = jsPlumb.CurrentLibrary.getElementObject(el);
				cached[el] = e;
			}
			return e;
		}
		else {					
			return jsPlumb.CurrentLibrary.getElementObject(el);
		}
	};
		
	
	/**
	 * gets the named attribute from the given element (id or element object)
	 */
	var _getAttribute = function(el, attName) {
		var ele = __getElementObject(el);
		return jsPlumb.CurrentLibrary.getAttribute(ele, attName);
	};
	
	var _setAttribute = function(el, attName, attValue) {
		var ele = __getElementObject(el);
		jsPlumb.CurrentLibrary.setAttribute(ele, attName, attValue);
	};
	
	var _addClass = function(el, clazz) {
		var ele = __getElementObject(el);
		jsPlumb.CurrentLibrary.addClass(ele, clazz);
	};
	
	var _getElementObject = function(elId) {
		return __getElementObject(elId);
	};
	
	var _getOffset = function(el) {
		var ele = __getElementObject(el);
		return jsPlumb.CurrentLibrary.getOffset(ele);
	};
	
	var _getSize = function(el) {
		var ele = __getElementObject(el);
		return jsPlumb.CurrentLibrary.getSize(ele);
	};							
	
	var _appendElement = function(canvas, parent) {
		if (!parent) document.body.appendChild(canvas);
		else jsPlumb.CurrentLibrary.appendElement(canvas, parent);		
	};
	
    /**
	 * gets an id for the given element, creating and setting one if necessary.
	 */
	var _getId = function(element) {
		var ele = _getElementObject(element);
		var id = _getAttribute(ele, "id");
		if (!id) {
			id = "_jsPlumb_" + new String((new Date()).getTime());
			_setAttribute(ele, "id", id);
		}
		return id;
	};
    
    /**
     * inits a draggable if it's not already initialised.
     * 
     * TODO: we need to hook in each library to this method.  they need to be given the opportunity to
     * wrap/insert lifecycle functions, because each library does different things.  for instance, jQuery
     * supports the notion of 'revert', which will clean up a dragged endpoint; MooTools does not.  jQuery
     * also supports 'opacity' and MooTools does not; jQuery supports z-index of the draggable; MooTools
     * does not. i could go on.  the point is...oh.  initDraggable can do this.  ok. 
     */
	var _initDraggableIfNecessary = function(element, isDraggable, dragOptions) {
    	// dragging
	    var draggable = isDraggable == null ? _draggableByDefault : isDraggable;
		if (draggable) {    		
			if (jsPlumb.CurrentLibrary.isDragSupported(element)) {
		    	var options = dragOptions || _currentInstance.Defaults.DragOptions || jsPlumb.Defaults.DragOptions;
		    	options = jsPlumb.extend({}, options);  // make a copy.
		    	var dragEvent = jsPlumb.CurrentLibrary.dragEvents['drag'];
	    		options[dragEvent] = _wrap(options[dragEvent], function() {
		    		var ui = jsPlumb.CurrentLibrary.getUIPosition(arguments);
		    		_draw(element, ui);	
		    		_addClass(element, "jsPlumb_dragged");
		    	});
	    		var draggable = draggableStates[_getId(element)];
	    		options.disabled = draggable == null ? false : !draggable;
	    		jsPlumb.CurrentLibrary.initDraggable(element, options);
			}
	    }
    };
    
        
    /**
     * helper to create a canvas.
     * @param clazz optional class name for the canvas.
     */
    var _newCanvas = function(clazz, parent) {
        var canvas = document.createElement("canvas");
        _appendElement(canvas, parent);
        canvas.style.position="absolute";
        if (clazz) { canvas.className=clazz; }
        _getId(canvas); // set an id.
        
        if (ie) {
        	// for IE we have to set a big canvas size. actually you can override this, too, if 1200 pixels
        	// is not big enough for the biggest connector/endpoint canvas you have at startup.
        	jsPlumb.sizeCanvas(canvas, 0, 0, DEFAULT_NEW_CANVAS_SIZE, DEFAULT_NEW_CANVAS_SIZE);
        	canvas = G_vmlCanvasManager.initElement(canvas);          
        }
        
        return canvas;
    };  
    /**
     * performs the given function operation on all the connections found for the given element
     * id; this means we find all the endpoints for the given element, and then for each endpoint
     * find the connectors connected to it. then we pass each connection in to the given
     * function.
     */
    var _operation = function(elId, func) {
    	var endpoints = endpointsByElement[elId];
    	if (endpoints && endpoints.length) {
	    	for (var i = 0; i < endpoints.length; i++) {
	    		for (var j = 0; j < endpoints[i].connections.length; j++) {
	    			var retVal = func(endpoints[i].connections[j]);
	    			// if the function passed in returns true, we exit.
	    			// most functions return false.
	    			if (retVal) return;
	    		}
	    	}
    	}
    };
    /**
     * perform an operation on all elements.
     */
    var _operationOnAll = function(func) {
    	for (var elId in endpointsByElement) {
    		_operation(elId, func);
    	}    	
    };
    /**
     * helper to remove an element from the DOM.
     */
    var _removeElement = function(element, parent) {
    	if (element != null) { 
    		if (!parent) {
	    		try { document.body.removeChild(element); }
	    		catch (e) { }
    		} else {
    			jsPlumb.CurrentLibrary.removeElement(element, parent);
    		}
    	}    	
    };
    /**
     * helper to remove a list of elements from the DOM.
     */
    var _removeElements = function(elements, parent) {
    	for (var i in elements)
    		_removeElement(elements[i], parent);
    };
	/**
     * helper method to remove an item from a list.
     */
    var _removeFromList = function(map, key, value) {
		var l = map[key];
		if (l != null) {
			var i = _findIndex(l, value);
			if (i >= 0) {
				delete( l[i] );
				l.splice( i, 1 );
				return true;
			}
		}		
		return false;
	};
	/**
     * Sets whether or not the given element(s) should be draggable, regardless of what a particular
     * plumb command may request.
     * 
     * @param element May be a string, a jQuery elements, or a list of strings/jquery elements.
     * @param draggable Whether or not the given element(s) should be draggable.
     */
	var _setDraggable = function(element, draggable) {    
    	var _helper = function(el, id) {
    		draggableStates[id] = draggable;
        	if (jsPlumb.CurrentLibrary.isDragSupported(el)) {
        		jsPlumb.CurrentLibrary.setDraggable(el, draggable);
        	}
    	};       
    	
    	return _elementProxy(element, _helper);
    };
	/**
	 * private method to do the business of hiding/showing.
	 * @param el either Id of the element in question or a jquery object for the element.
	 * @param state String specifying a value for the css 'display' property ('block' or 'none').
	 */
	var _setVisible = function(el, state) {
		var elId = _getAttribute(el, "id");
	    var f = function(jpc) {
	    	jpc.canvas.style.display = state;
	    };    	
    	_operation(elId, f);
    };        
    /**
     * toggles the draggable state of the given element(s).
     * @param el either an id, or a jquery object, or a list of ids/jquery objects.
     */
    var _toggleDraggable = function(el) {    	
    	var fn = function(el, elId) {
    		var state = draggableStates[elId] == null ? _draggableByDefault : draggableStates[elId];
	    	state = !state;
	    	draggableStates[elId] = state;
	    	jsPlumb.CurrentLibrary.setDraggable(el, state);
	    	return state;
    	};
    	return _elementProxy(el, fn);
    };
    /**
    * private method to do the business of toggling hiding/showing.
    * @param elId Id of the element in question
    */
	var _toggleVisible = function(elId) {
    	var f = function(jpc) {
    		var state = ('none' == jpc.canvas.style.display);
    		jpc.canvas.style.display = state ? "block" : "none";
    	};
    	
    	_operation(elId, f);
    	
    	//todo this should call _elementProxy, and pass in the _operation(elId, f) call as a function. cos _toggleDraggable does that.
    };
    /**
     * updates the offset and size for a given element, and stores the values.
     * if 'offset' is not null we use that (it would have been passed in from a drag call) because it's faster; but if it is null,
     * or if 'recalc' is true in order to force a recalculation, we use the offset, outerWidth and outerHeight methods to get
     * the current values.
     */
    var _updateOffset = function(elId, offset, recalc) {    	
		if (recalc || offset == null) {  // if forced repaint or no offset available, we recalculate.
    		// get the current size and offset, and store them
    		var s = _getElementObject(elId);
    		sizes[elId] = _getSize(s);
    		offsets[elId] = _getOffset(s);
		} else {			 
    		offsets[elId] = offset;
		}
	};
		
    /**
     * wraps one function with another, creating a placeholder for the wrapped function
     * if it was null.  this is used to wrap the various drag/drop event functions - to allow
     * jsPlumb to be notified of important lifecycle events without imposing itself on the user's
     * drap/drop functionality.
     * TODO: determine whether or not we should support an error handler concept, if one of the functions fails.
     */
    var _wrap = function(wrappedFunction, newFunction) {
    	wrappedFunction = wrappedFunction || function() { };
    	newFunction = newFunction || function() { };
    	return function() {
    		try { newFunction.apply(this, arguments); }
    		catch (e) { 
    			_log('jsPlumb function failed : ' + e);
    		}
    		try { wrappedFunction.apply(this, arguments); }
    		catch (e) { 
    			_log('wrapped function failed : ' + e);    			
    		}
    	};
    };
    
    /*
     Class: Anchor     
     Models a position relative to the origin of some element that an Endpoint can be located.     
     */
	/*
	 Function: Anchor
	 
       Constructor for the Anchor class	 
	  
	   Parameters:
	   	params - Anchor parameters. This should contain three values, and may optionally have an 'offsets' argument:
	  
	 	- x : the x location of the anchor as a fraction of the total width.
	    - y : the y location of the anchor as a fraction of the total height.
	    - orientation : an [x,y] array indicating the general direction a connection from the anchor should go in. for more info on this, see the documentation, or the docs in jquery-jsPlumb-defaults-XXX.js for the default Anchors.
	 	- offsets : an [x,y] array of fixed offsets that should be applied after the x,y position has been figured out.  may be null.
	 */	
	var Anchor = function(params) {
		var self = this;
		this.x = params.x || 0; this.y = params.y || 0; 
		var orientation = params.orientation || [0,0];
		var lastTimestamp = null;
		var lastReturnValue = null;
		this.offsets = params.offsets || [0,0];		
		//TODO: fix this properly.  since Anchors are often static, this timestamping business
		// does not work at all well.  the timestamp should be inside the Endpoint, because they
		// are _never_ static.  the method that Connection uses to find an anchor location should
		// be done through the Endpoint class, which can then deal with the timestamp.
		// and, in fact, we should find out whether or not we even get a speed enhancement from doing
		// this.
		this.compute = function(xy, wh, element) {
			_trace('anchor compute');			
			lastReturnValue = [ xy[0] + (self.x * wh[0]) + self.offsets[0], xy[1] + (self.y * wh[1]) + self.offsets[1]];
			var container = element? element.container : null;
			var containerAdjustment = {left:0, top:0 };
            if (container != null) {
            	var eo = _getElementObject(container);
            	var o = _getOffset(eo);
            	var sl = jsPlumb.CurrentLibrary.getScrollLeft(eo);
            	var st = jsPlumb.CurrentLibrary.getScrollTop(eo);
            	containerAdjustment.left = o.left - sl;
            	containerAdjustment.top = o.top - st;
            	lastReturnValue[0] = lastReturnValue[0] - containerAdjustment.left;
            	lastReturnValue[1] = lastReturnValue[1] - containerAdjustment.top;
            }
			return lastReturnValue;
		};
		
		this.getOrientation = function() { return orientation; };
		
		this.equals = function(anchor) {
			if (!anchor) return false;
			var ao = anchor.getOrientation();
			var o = this.getOrientation();
			return this.x == anchor.x && this.y == anchor.y && this.offsets[0] == anchor.offsets[0] && this.offsets[1] == anchor.offsets[1] && o[0] == ao[0] && o[1] == ao[1];
		};
	};
		 
	/**
	 * An Anchor that floats.  its orientation is computed dynamically from its position relative to the anchor it is floating relative to.
	 *  
	 */
	var FloatingAnchor = function(params) {
		
		// this is the anchor that this floating anchor is referenced to for purposes of calculating the orientation.
		var ref = params.reference;
		// the canvas this refers to.
		var refCanvas = params.referenceCanvas;
		var size = _getSize(_getElementObject(refCanvas));		
		
		// these are used to store the current relative position of our anchor wrt the reference anchor.  they only indicate
		// direction, so have a value of 1 or -1 (or, very rarely, 0).  these values are written by the compute method, and read
		// by the getOrientation method.
		var xDir = 0, yDir = 0; 
		// temporary member used to store an orientation when the floating anchor is hovering over another anchor.
		var orientation = null;
		
		this.compute = function(xy, wh, txy, twh) {
			// set these for the getOrientation method to use.
			xDir = 0;//xy[0] < txy[0] ? -1 : xy[0] == txy[0] ? 0 : 1;
			yDir = 0;//xy[1] < txy[1] ? -1 : xy[1] == txy[1] ? 0 : 1;
			return [xy[0] + (size[0] / 2), xy[1] + (size[1] / 2) ];  // return origin of the element.  we may wish to improve this so that any object can be the drag proxy.
		};
		
		this.getOrientation = function() {
			if (orientation) return orientation;
			else {
				var o = ref.getOrientation();
				// here we take into account the orientation of the other anchor: if it declares zero for some direction, we declare zero too.
				// this might not be the most awesome.  perhaps we can come up with a better way.  it's just so that the line we draw looks
				// like it makes sense.  maybe this wont make sense.
				return [Math.abs(o[0]) * xDir * -1, Math.abs(o[1]) * yDir * -1];
			}
		};
		
		/**
		 * notification the endpoint associated with this anchor is hovering over another anchor; 
		 * we want to assume that anchor's orientation for the duration of the hover. 
		 */
		this.over = function(anchor) {
			orientation = anchor.getOrientation();			
		};
		
		/**
		 * notification the endpoint associated with this anchor is no longer hovering 
		 * over another anchor; we should resume calculating orientation as we normally do.
		 */
		this.out = function() {
			orientation = null;
		};
	};
	
	// ************** connection
	// ****************************************
	/**
	* allowed params:
	* source:	source element (string or a jQuery element) (required)
	* target:	target element (string or a jQuery element) (required)
	* 
	* anchors: optional array of anchor placements. defaults to BottomCenter for source
	*          and TopCenter for target.
	*/
	var Connection = function(params) {

	// ************** get the source and target and register the connection. *******************
	    var self = this;
	    var id = new String('_jsplumb_c_' + (new Date()).getTime());
	    this.getId = function() { return id; };
	    this.container = params.container || _currentInstance.Defaults.Container;  // may be null; we will append to the body if so.
	    // get source and target as jQuery objects
	    this.source = _getElementObject(params.source);    
	    this.target = _getElementObject(params.target);
	    this.sourceId = _getAttribute(this.source, "id");	    
	    this.targetId = _getAttribute(this.target, "id");
	    this.endpointsOnTop = params.endpointsOnTop != null ? params.endpointsOnTop : true;	    
	    this.scope = params.scope;  // scope may have been passed in to the connect call.
	    						    // if it wasn't, we will pull it from the source endpoint,
	    							// after having initialised the endpoints.
	    
	    // init endpoints
	    this.endpoints = [];
	    this.endpointStyles = [];
	    var prepareEndpoint = function(existing, index, params, element) {
	    	if (existing) { 
	    		self.endpoints[index] = existing;
	    		existing.addConnection(self);
	    	}
		    else {
		    	if(!params.endpoints) params.endpoints = [null,null];
			    var ep = params.endpoints[index] || params.endpoint || _currentInstance.Defaults.Endpoints[index] || jsPlumb.Defaults.Endpoints[index] || _currentInstance.Defaults.Endpoint || jsPlumb.Defaults.Endpoint || new jsPlumb.Endpoints.Dot();
			    if (!params.endpointStyles) params.endpointStyles = [null,null];
			    var es = params.endpointStyles[index] || params.endpointStyle || _currentInstance.Defaults.EndpointStyles[index] || jsPlumb.Defaults.EndpointStyles[index] || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
			    var a = params.anchors  ? params.anchors[index] : _currentInstance.Defaults.Anchors[index] || jsPlumb.Defaults.Anchors[index] || _currentInstance.Defaults.Anchor || jsPlumb.Defaults.Anchor || jsPlumb.Anchors.BottomCenter;
			    var e = new Endpoint({style:es, endpoint:ep, connections:[self], anchor:a, source:element, container:self.container });
			    self.endpoints[index] = e;
			    return e;
		    }
	    };
	    
	    var eS = prepareEndpoint(params.sourceEndpoint, 0, params, self.source);
	    if (eS) _addToList(endpointsByElement, this.sourceId, eS);
	    var eT = prepareEndpoint(params.targetEndpoint, 1, params, self.target);
	    if (eT) _addToList(endpointsByElement, this.targetId, eT);
	    // if scope not set, set it to be the scope for the source endpoint.
	    if (!this.scope) this.scope = this.endpoints[0].scope;
	    
	    this.connector = this.endpoints[0].connector || this.endpoints[1].connector || params.connector || _currentInstance.Defaults.Connector || jsPlumb.Defaults.Connector || new jsPlumb.Connectors.Bezier();
	    this.paintStyle = this.endpoints[0].connectorStyle  || this.endpoints[1].connectorStyle || params.paintStyle || _currentInstance.Defaults.PaintStyle || jsPlumb.Defaults.PaintStyle;
	    	    	    	   
	    _updateOffset(this.sourceId);
	    _updateOffset(this.targetId);
	    
	    // paint the endpoints
	    var myOffset = offsets[this.sourceId], myWH = sizes[this.sourceId];		
    	var anchorLoc = this.endpoints[0].anchor.compute([myOffset.left, myOffset.top], myWH, this.endpoints[0]);
    	this.endpoints[0].paint(anchorLoc);    	
    	myOffset = offsets[this.targetId]; myWH = sizes[this.targetId];		
    	anchorLoc = this.endpoints[1].anchor.compute([myOffset.left, myOffset.top], myWH, this.endpoints[1]);
    	this.endpoints[1].paint(anchorLoc);

	// *************** create canvas on which the connection will be drawn ************
	    var canvas = _newCanvas(jsPlumb.connectorClass, self.container);
	    this.canvas = canvas;
	     
	    /**
	     * paints the connection.
	     * @param elId Id of the element that is in motion
	     * @param ui current library's event system ui object (present if we came from a drag to get here)
	     * @param recalc whether or not to recalculate element sizes. this is true if a repaint caused this to be painted.
	     */
	    this.paint = function(elId, ui, recalc, timestamp) {    	
	    	
	    	if (log) log.debug("Painting Connection; element in motion is " + elId + "; ui is [" + ui + "]; recalc is [" + recalc + "]");
	    	
	    	var fai = self.floatingAnchorIndex;
	    	// if the moving object is not the source we must transpose the two references.
	    	var swap = !(elId == this.sourceId);
	    	var tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId;
	    	var tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;
	    	var el = swap ? this.target : this.source;
	    	
	    	if (this.canvas.getContext) {    		    			    		    	
	    		//if (recalc) {
	    			_updateOffset(elId, ui, recalc);
	    			_updateOffset(tId);  // update the target if this is a forced repaint. otherwise, only the source has been moved.
	    		//}
	    		
	    		var myOffset = offsets[elId]; 
	    		var otherOffset = offsets[tId];
	    		var myWH = sizes[elId];
	            var otherWH = sizes[tId];
	            
	    		var ctx = canvas.getContext('2d');
	    		//TODO: why are these calculated again?  they were calculated in the _draw function.
	            var sAnchorP = this.endpoints[sIdx].anchor.compute([myOffset.left, myOffset.top], myWH, this.endpoints[sIdx]);
	            var sAnchorO = this.endpoints[sIdx].anchor.getOrientation();
	            var tAnchorP = this.endpoints[tIdx].anchor.compute([otherOffset.left, otherOffset.top], otherWH, this.endpoints[tIdx]);
	            var tAnchorO = this.endpoints[tIdx].anchor.getOrientation();	        
	            
	            var dim = this.connector.compute(sAnchorP, tAnchorP, this.endpoints[sIdx].anchor, this.endpoints[tIdx].anchor, this.paintStyle.lineWidth);
	            jsPlumb.sizeCanvas(canvas, dim[0], dim[1], dim[2], dim[3]);
	            jsPlumb.extend(ctx, this.paintStyle);
	                        
	            if (this.paintStyle.gradient && !ie) { 
		            var g = swap ? ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]) : ctx.createLinearGradient(dim[6], dim[7], dim[4], dim[5]);
		            for (var i = 0; i < this.paintStyle.gradient.stops.length; i++)
		            	g.addColorStop(this.paintStyle.gradient.stops[i][0],this.paintStyle.gradient.stops[i][1]);
		            ctx.strokeStyle = g;
	            }
	            	            
	            this.connector.paint(dim, ctx);	                            
	    	}
	    };
	    
	    //TODO: should this take a timestamp?  probably. it reduces the amount of time
	    // spent figuring out anchor locations.
	    this.repaint = function() {
	    	this.paint(this.sourceId, null, true);
	    };

	    _initDraggableIfNecessary(self.source, params.draggable, params.dragOptions);
	    _initDraggableIfNecessary(self.target, params.draggable, params.dragOptions);
	    	    
	    // resizing (using the jquery.ba-resize plugin). todo: decide whether to include or not.
	    if (this.source.resize) {
	    	this.source.resize(function(e) {
	    		jsPlumb.repaint(self.sourceId);
	    	});
	    }
	};
	
	/*
	 Class: Endpoint 	 
	 	Models an endpoint.  Can have one to N connections emanating from it (although how to handle that in the UI is 
	 	a very good question). also has a Canvas and paint style.	  	
	 */
	
	/* 
	 Function: Endpoint	 
	 	This is the Endpoint class constructor.	 
	 Parameters:	  
	  anchor			-	anchor for the endpoint, of type jsPlumb.Anchor. may be null. 
	  endpoint 		- 	endpoint object, of type jsPlumb.Endpoint. may be null.
	  style			-	endpoint style, a js object. may be null.
	  source			-	element the endpoint is attached to, of type jquery object.  Required.
	  canvas			-	canvas element to use. may be, and most often is, null.
	  connections  	-	optional list of connections to configure the endpoint with.
	  isSource			-	boolean. indicates the endpoint can act as a source of new connections. optional.
	  dragOptions		-	if isSource is set to true, you can supply arguments for the jquery draggable method.  optional.
	  connectionStyle	-	if isSource is set to true, this is the paint style for connections from this endpoint. optional.
	  connector		-	optional connector type to use.
	  isTarget			-	boolean. indicates the endpoint can act as a target of new connections. optional.
	  dropOptions		-	if isTarget is set to true, you can supply arguments for the jquery droppable method.  optional.
	  reattach			-	optional boolean that determines whether or not the connections reattach after they
	                       have been dragged off an endpoint and left floating.  defaults to false: connections
	                       dropped in this way will just be deleted.
	*/ 
	var Endpoint = function(params) {
		params = params || {};
		// make a copy. then we can use the wrapper function.
		jsPlumb.extend({}, params);
		var self = this;
	    var id = new String('_jsplumb_e_' + (new Date()).getTime());
	    this.getId = function() { return id; };
		self.anchor = params.anchor || jsPlumb.Anchors.TopCenter;
		var _endpoint = params.endpoint || new jsPlumb.Endpoints.Dot();
		var _style = params.style || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
		this.connectorStyle = params.connectorStyle;
		this.connector = params.connector;
		var _element = params.source;
		this.container = params.container || jsPlumb.Defaults.Container;
		var _elementId = _getAttribute(_element, "id");
		var _maxConnections = params.maxConnections || 1;                     // maximum number of connections this endpoint can be the source of.
		this.canvas = params.canvas || _newCanvas(jsPlumb.endpointClass, this.container);
		this.connections = params.connections || [];
		this.scope = params.scope || DEFAULT_SCOPE;
		var _reattach = params.reattach || false;
		var floatingEndpoint = null;
		var inPlaceCopy = null;
		this.addConnection = function(connection) {			
			self.connections.push(connection);
		};
		this.removeConnection = function(connection) {
			var idx = _findIndex(self.connections, connection);
			if (idx >= 0)
				self.connections.splice(idx, 1);
		};
		this.makeInPlaceCopy = function() {
			var e = new Endpoint({anchor:self.anchor, source:_element, style:_style, endpoint:_endpoint});
			return e;
		};
		/**
		* returns whether or not this endpoint is connected to the given endpoint.
		* @param endpoint  Endpoint to test.
		* @since 1.1.1
		*
		* todo: needs testing.  will this work if the endpoint passed in is the source?
		*/
		this.isConnectedTo = function(endpoint) {
			var found = false;
			if (endpoint) {
				for (var i = 0; i < self.connections.length; i++) {
			  		if (self.connections[i].endpoints[1] == endpoint) {
			  		 	found = true;
			  		 	break;
			  		}
				}		
			}
			return found;
		};
		
		this.isFloating = function() { return floatingEndpoint != null; };
		/**
		 * first pass at default ConnectorSelector: returns the first connection, if we have any.
		 * modified a little, 5/10/2010: now it only returns a connector if we have not got equal to or more than _maxConnector connectors
		 * attached.  otherwise it is assumed a new connector is ok.  but note with this setup we can't select any other connection than the first
		 * one.  what if this could return a list?  that implies everything should work with a list - dragging etc. could be nasty. could also
		 * be cool.
		 */
		var connectorSelector = function() {
			return self.connections.length == 0 || self.connections.length < _maxConnections ?  null : self.connections[0]; 
		};
		
		this.isFull = function() { return _maxConnections < 1 ? false : (self.connections.length >= _maxConnections); };
		
		/**
		 * a deep equals check.  everything must match, including the anchor, styles, everything.
		 * TODO: finish Endpoint.equals
		 */		
		this.equals = function(endpoint) {
			return this.anchor.equals(endpoint.anchor) &&
			true;
		};
		
		/**
		 * paints the Endpoint, recalculating offset and anchor positions if necessary.
		 */
		this.paint = function(anchorPoint, connectorPaintStyle, canvas) {
			
			if (log) log.debug("Painting Endpoint with elementId [" + _elementId + "]; anchorPoint is [" + anchorPoint + "]");
			
			if (anchorPoint == null) {
				// do we always want to force a repaint here?  i dont think so!
				var xy = offsets[_elementId];
				var wh = sizes[_elementId];
				if (xy == null || wh == null) {
					_updateOffset(_elementId);
					xy = offsets[_elementId];
					wh = sizes[_elementId];
				}
				anchorPoint = self.anchor.compute([xy.left, xy.top], wh, self);
			}
			_endpoint.paint(anchorPoint, self.anchor.getOrientation(), canvas || self.canvas, _style, connectorPaintStyle || _style);
		};
		
		
		// is this a connection source? we make it draggable and have the drag listener 
		// maintain a connection with a floating endpoint.
		if (params.isSource && jsPlumb.CurrentLibrary.isDragSupported(_element)) {
			
			var n = null, id = null, jpc = null, existingJpc = false, existingJpcParams = null;
			
			// first the question is, how many connections are on this endpoint?  if it's only one, then excellent.  otherwise we will either need a way
			// to select one connection from the list, or drag them all. if we had a pluggable 'ConnectorSelector' interface we could probably
			// provide a way for people to implement their own UI components to do the connector selection.  the question in that particular case would be how much
			// information the interface needs from jsPlumb at execution time. if, however, we leave out the connector selection, and drag them all,
			// that wouldn't be too hard to organise. perhaps that behaviour would be on a switch for the endpoint, or perhaps the ConnectorSelector
			// interface returns a List, with the default implementation just returning everything.  i think i like that.
			//
			// let's say for now that there is just one endpoint, cos we need to get this going before we can consider a list of them anyway.
			// the major difference between that case and the case of a new endpoint is actually quite small - it's a question of where the
			// Connection comes from.  for a new one, we create a new one. obviously.  otherwise we just get the jpc from the Endpoint
			// (remember we're only assuming one connection right now).  so all of the UI stuff we do to create the floating endpoint etc
			// will still be valid, but when we stop dragging, we'll have to do something different.  if we stop with a valid drop i think it will
			// be the same process.  but if we stop with an invalid drop we have to reset the Connection to how it was when we got it.
			var start = function() {
				
				inPlaceCopy = self.makeInPlaceCopy();
				inPlaceCopy.paint();
				
				n = document.createElement("div");
				var nE = _getElementObject(n);
				_appendElement(n); //
				// create and assign an id, and initialize the offset.
				//TODO can't this be replaced with a _getId call?
				var id = "" + new String(new Date().getTime());
				_setAttribute(nE, "id", id);
				_updateOffset(id);
				// store the id of the dragging div and the source element. the drop function
				// will pick these up.
				_setAttribute(_getElementObject(self.canvas), "dragId", id);
				_setAttribute(_getElementObject(self.canvas), "elId", _elementId);
				// create a floating anchor
				var floatingAnchor = new FloatingAnchor({reference:self.anchor, referenceCanvas:self.canvas});
				floatingEndpoint = new Endpoint({ style:{fillStyle:'rgba(0,0,0,0)'}, endpoint:_endpoint, anchor:floatingAnchor, source:nE });
				
				jpc = connectorSelector();
				if (jpc == null) {
					// create a connection. one end is this endpoint, the other is a floating endpoint.
					jpc = new Connection({
						sourceEndpoint:self, 
						targetEndpoint:floatingEndpoint,
						source:_getElementObject(_element),
						target:_getElementObject(n),
						anchors:[self.anchor, floatingAnchor],
						paintStyle : params.connectorStyle, // this can be null. Connection will use the default.
						connector: params.connector
					});
				} else {
					existingJpc = true;
					var anchorIdx = jpc.sourceId == _elementId ? 0 : 1;
					jpc.floatingAnchorIndex = anchorIdx;
					// probably we should remove the connection? and add it back if the user
					// does not drop it somewhere proper.
					self.removeConnection(jpc);
					if (anchorIdx == 0){
						existingJpcParams = [jpc.source, jpc.sourceId];
						jpc.source = _getElementObject(n);
						jpc.sourceId = id;						
					}else {
						existingJpcParams = [jpc.target, jpc.targetId];
						jpc.target = _getElementObject(n);
						jpc.targetId = id;
					}					
					
					jpc.suspendedEndpoint = jpc.endpoints[anchorIdx];
					jpc.endpoints[anchorIdx] = floatingEndpoint;
				}
				
				// register it.
				floatingConnections[id] = jpc;
				
				// todo unregister on stop
				floatingEndpoint.addConnection(jpc);
								
				// only register for the target endpoint; we will not be dragging the source at any time
				// before this connection is either discarded or made into a permanent connection.
				_addToList(endpointsByElement, id, floatingEndpoint);
				
			};			
			
			var dragOptions = params.dragOptions || { };
			
			var defaultOpts = jsPlumb.extend({}, jsPlumb.CurrentLibrary.defaultDragOptions);
			dragOptions = jsPlumb.extend(defaultOpts, dragOptions);
			dragOptions.scope = dragOptions.scope || self.scope; 
			var startEvent = jsPlumb.CurrentLibrary.dragEvents['start'];
			var stopEvent = jsPlumb.CurrentLibrary.dragEvents['stop'];
			var dragEvent = jsPlumb.CurrentLibrary.dragEvents['drag'];
			dragOptions[startEvent] = _wrap(dragOptions[startEvent], start);
			dragOptions[dragEvent] = _wrap(dragOptions[dragEvent], function() { 
				var _ui = jsPlumb.CurrentLibrary.getUIPosition(arguments);
				_draw(_getElementObject(n), _ui); 
			});
			dragOptions[stopEvent] = _wrap(dragOptions[stopEvent], 
				function() {					
					_removeFromList(endpointsByElement, id, floatingEndpoint);
					_removeElements([n, floatingEndpoint.canvas]); // TODO: clean up the connection canvas (if the user aborted)
					_removeElement(inPlaceCopy.canvas, _element); 
					var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
					if (jpc.endpoints[idx] == floatingEndpoint) {										
						// if the connection was an existing one:
						if (existingJpc && jpc.suspendedEndpoint) {
							if (_reattach) {
								jpc.floatingAnchorIndex = null;
								if (idx == 0) {
									jpc.source = existingJpcParams[0];
									jpc.sourceId = existingJpcParams[1];																	
								} else {
									jpc.target = existingJpcParams[0];
									jpc.targetId = existingJpcParams[1];
								}
								jpc.endpoints[idx] = jpc.suspendedEndpoint;
								jpc.suspendedEndpoint.addConnection(jpc);
								jsPlumb.repaint(existingJpcParams[1]);
							}
							else {
								jpc.endpoints[0].removeConnection(jpc);
								jpc.endpoints[1].removeConnection(jpc);
								_removeElement(jpc.canvas);
								_removeFromList(connectionsByScope, jpc.scope, jpc);
							}
						} else {							
							_removeElement(jpc.canvas);
							self.removeConnection(jpc);							
						}
					}
					jpc = null;
					delete floatingEndpoint;
					delete inPlaceCopy;
					self.paint();
				}			
			);		
							
			var i = _getElementObject(self.canvas);			
			jsPlumb.CurrentLibrary.initDraggable(i, dragOptions);
		};
		
		// connector target
		if (params.isTarget && jsPlumb.CurrentLibrary.isDropSupported(_element)) {
			var dropOptions = params.dropOptions || _currentInstance.Defaults.DropOptions || jsPlumb.Defaults.DropOptions;
			dropOptions = jsPlumb.extend({}, dropOptions);
			dropOptions.scope = dropOptions.scope || self.scope;
	    	var originalAnchor = null;
	    	var dropEvent = jsPlumb.CurrentLibrary.dragEvents['drop'];
			var overEvent = jsPlumb.CurrentLibrary.dragEvents['over'];
			var outEvent = jsPlumb.CurrentLibrary.dragEvents['out'];
	    	dropOptions[dropEvent]= _wrap(dropOptions[dropEvent], function() {
	    		var draggable = jsPlumb.CurrentLibrary.getDragObject(arguments);
	    		var id = _getAttribute(_getElementObject(draggable), "dragId");
	    		var elId = _getAttribute(_getElementObject(draggable),"elId");
	    		var jpc = floatingConnections[id];
	    		var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
	    		if (idx == 0) {
	    			jpc.source = _element;
		    		jpc.sourceId = _elementId;		    		
	    		} else {
		    		jpc.target = _element;
		    		jpc.targetId = _elementId;		    		
	    		}
	    		// remove this jpc from the current endpoint
	    		jpc.endpoints[idx].removeConnection(jpc);
	    		if (jpc.suspendedEndpoint)
	    			jpc.suspendedEndpoint.removeConnection(jpc);
	    		jpc.endpoints[idx] = self;
	    		self.addConnection(jpc);
	    		_addToList(connectionsByScope, jpc.scope, jpc);
	    		_initDraggableIfNecessary(_element, params.draggable, {});
	    		jsPlumb.repaint(elId);
	    		
	    		delete floatingConnections[id];	    			    	
			 });
	    	
	    	dropOptions[overEvent]= _wrap(dropOptions[overEvent], function() { 
				var draggable = jsPlumb.CurrentLibrary.getDragObject(arguments);
				var id = _getAttribute(_getElementObject(draggable),"dragId");
		    	var jpc = floatingConnections[id];
		    	var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;  
		    	jpc.endpoints[idx].anchor.over(self.anchor);		    	
			 });
			 
			 dropOptions[outEvent] = _wrap(dropOptions[outEvent], function() {
				var draggable = jsPlumb.CurrentLibrary.getDragObject(arguments);
				var id = _getAttribute(_getElementObject(draggable),"dragId");
		    	var jpc = floatingConnections[id];
		    	var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
		    	jpc.endpoints[idx].anchor.out();
			 });
			 		
			 jsPlumb.CurrentLibrary.initDroppable(_getElementObject(self.canvas), dropOptions);			
		}		
		
		return self;
	};
	    		
    	/*
    	 Property: Defaults    	 
    	 	These are the default settings for jsPlumb, that is what will be used if you do not supply specific pieces of information
    	 	to the various API calls.  A convenient way to implement your own look and feel can be to override these defaults by including a script
    	 	somewhere after the jsPlumb include, but before you make any calls to jsPlumb, for instance in this example we set the PaintStyle to be
    	 	a blue line of 27 pixels:    	     	
    	 	> jsPlumb.Defaults.PaintStyle = { lineWidth:27, strokeStyle:'blue' }    	     	 
    	 */
    	this.Defaults = {
    		Anchor : null,
    		Anchors : [ null, null ],
    		Connector : null,
    		Container : null,
    		DragOptions: { },
    		DropOptions: { },
    		Endpoint : null,
    		Endpoints : [ null, null ],
    		EndpointStyle : { fillStyle : null },
    		EndpointStyles : [ null, null ],
    		MaxConnections : null,
    		PaintStyle : { lineWidth : 10, strokeStyle : 'red' },
    		Scope : "_jsPlumb_DefaultScope"
    	};
    	
    	/*
    	 Property: connectorClass    	 
    	 	The CSS class to set on Connection canvas elements.  This value is a String and can have multiple classes; the entire String is appended as-is.
    	 */
		this.connectorClass = '_jsPlumb_connector';
		
		/*
   	 	Property: endpointClass   	 
   	 		The CSS class to set on Endpoint canvas elements.  This value is a String and can have multiple classes; the entire String is appended as-is.
		*/
		this.endpointClass = '_jsPlumb_endpoint';
		
		/*
		 Property: Anchors		 
		 	Default jsPlumb Anchors.  These are supplied in the file jsPlumb-defaults-x.x.x.js, which is merged in with the main jsPlumb script
		 	to form <library>.jsPlumb-all-x.x.x.js.  You can provide your own Anchors by supplying them in a script that is loaded after jsPlumb, for instance:		 
		 	> jsPlumb.Anchors.MyAnchor = { ....anchor code here.  see the documentation. }
		 */
	    this.Anchors = {};
	    
	    /*
		 Property: Connectors		 
		 	Default jsPlumb Connectors.  These are supplied in the file jsPlumb-defaults-x.x.x.js, which is merged in with the main jsPlumb script
		 	to form <library>.jsPlumb-all-x.x.x.js.  You can provide your own Connectors by supplying them in a script that is loaded after jsPlumb, for instance:		 
		 	> jsPlumb.Connectors.MyConnector = { ....connector code here.  see the documentation. }
		 */
	    this.Connectors = {};
	    
	    /*
		 Property: Endpoints		 
		 	Default jsPlumb Endpoints.  These are supplied in the file jsPlumb-defaults-x.x.x.js, which is merged in with the main jsPlumb script
		 	to form <library>.jsPlumb-all-x.x.x.js.  You can provide your own Endpoints by supplying them in a script that is loaded after jsPlumb, for instance:		 
		 	> jsPlumb.Endpoints.MyEndpoint = { ....endpoint code here.  see the documentation. }
		 */
	    this.Endpoints = {};	    
	      
	    /*
	      Function: addEndpoint	     
	      	Adds an Endpoint to a given element.	      
	      Parameters:
	        target - Element to add the endpoint to.  either an element id, or a selector representing some element.
	        params - Object containing Endpoint options (more info required)	        
	      Returns:	      
	       The newly created Endpoint.	       
	      See Also:	      
	       <addEndpoints>
	     */
	    this.addEndpoint = function(target, params) {
	    	params = jsPlumb.extend({}, params);
	    	var el = _getElementObject(target);
	    	var id = _getAttribute(el,"id");
	    	params.source = el; 
	    	_updateOffset(id);
	    	var e = new Endpoint(params);
	    	_addToList(endpointsByElement, id, e);
    		var myOffset = offsets[id];
    		var myWH = sizes[id];			
	    	var anchorLoc = e.anchor.compute([myOffset.left, myOffset.top], myWH, e);
	    	e.paint(anchorLoc);
	    	return e;
	    };
	    
	    /*
	      Function: addEndpoint	     
	      	Adds a list of Endpoints to a given element.	      
	      Parameters:	      
	        target - element to add the endpoint to.  either an element id, or a selector representing some element.
	        endpoints - List of objects containing Endpoint options. one Endpoint is created for each entry in this list.	        
	      Returns:	      
	        List of newly created Endpoints, one for each entry in the 'endpoints' argument.	       
	      See Also:	      
	       <addEndpoint>
	     */
	    this.addEndpoints = function(target, endpoints) {
	    	var results = [];
	    	for (var i = 0; i < endpoints.length; i++) {
	    		results.push(jsPlumb.addEndpoint(target, endpoints[i]));
	    	}
	    	return results;
	    };
	    
	    /*
	     Function: animate	     
	     	Wrapper around supporting library's animate function; injects a call to jsPlumb in the 'step' function (creating it if necessary).  
	     	This only supports the two-arg version of the animate call in jQuery - the one that takes an 'options' object as the second arg.
	     	MooTools has only one method - a two arg one.  Which is handy.	     
	     Parameters:	       
	       el - Element to animate.  Either an id, or a selector representing the element.
	       properties - The 'properties' argument you want passed to the standard jQuery animate call.
	       options - The 'options' argument you want passed to the standard jQuery animate call.	       
	     Returns:	     
	      void
	    */	      
	    this.animate = function(el, properties, options) {
	    	var ele = _getElementObject(el);
	    	var id = _getAttribute(el,"id");
	    	//TODO this is not agnostic yet.
	    	options = options || {};
	    	var stepFunction = jsPlumb.CurrentLibrary.dragEvents['step'];
	    	var completeFunction = jsPlumb.CurrentLibrary.dragEvents['complete'];
	    	options[stepFunction] = _wrap(options[stepFunction], function() 
	    	{
	    		_currentInstance.repaint(id); 
	    	});
	    	
	    	// you know, probably onComplete should repaint too. that will help keep up
	    	// with fast animations.
	    	options[completeFunction] = _wrap(options[completeFunction], function() 
	    	{
	    		_currentInstance.repaint(id); 
	    	});
	    	
	    	jsPlumb.CurrentLibrary.animate(ele, properties, options);    	
	    };
	    
	    /**
	     * clears the cache used to lookup elements by their id.  if you remove any elements
	     * from the DOM you should call this to ensure that if you add them back in jsPlumb does not
	     * have a stale handle.
	     */
	    this.clearCache = function() {
	    	delete cached;
	    	cached = {};	    		
	    };
	    
	    /*
	     Function: connect	     
	     	Establishes a connection between two elements.	     
	     Parameters:	     
	     	params - Object containing setup for the connection.  see documentation.	     
	     Returns:	     
	     	The newly created Connection.	     
	     */
	    this.connect = function(params) {
	    	if (params.sourceEndpoint && params.sourceEndpoint.isFull()) {
	    		_log("could not add connection; source endpoint is full");
	    		return;
	    	}
	    	
	    	if (params.targetEndpoint && params.targetEndpoint.isFull()) {
	    		_log("could not add connection; target endpoint is full");
	    		return;
	    	}
	    		
	    	var jpc = new Connection(params);    		
	    	// add to list of connections (by scope).
	    	_addToList(connectionsByScope, jpc.scope, jpc);
	    	
			// force a paint
			_draw(jpc.source);
			
			return jpc;    	
	    };           
	    
	    /**
	    * not implemented yet. params object will have sourceEndpoint and targetEndpoint members; these will be Endpoints.
	    connectEndpoints : function(params) {
	    	var jpc = Connection(params);
	    	
	    },*/
	    
	    /* 
	     Function: detach	      
	     	Removes a connection.	     
	     Parameters:	     
	    	sourceId - Id of the first element in the connection. A String.
	    	targetId - iI of the second element in the connection. A String.	    	
	     Returns:	    
	    	true if successful, false if not.
	    */
	    this.detach = function(sourceId, targetId) {
	    	var f = function(jpc) {
	    		if ((jpc.sourceId == sourceId && jpc.targetId == targetId) || (jpc.targetId == sourceId && jpc.sourceId == targetId)) {
	    			_removeElement(jpc.canvas, jpc.container);
					jpc.endpoints[0].removeConnection(jpc);
					jpc.endpoints[1].removeConnection(jpc);
					_removeFromList(connectionsByScope, jpc.scope, jpc);
		    		return true;
	    		}
	    		
	    	};    	
	    	
	    	// todo: how to cleanup the actual storage?  a third arg to _operation?
	    	_operation(sourceId, f);    	
	    };
	    
	    /*
	     Function: detachAll 	     
	     	Removes all an element's connections.	     	
	     Parameters:	     
	     	el - either the id of the element, or a selector for the element.	     	
	     Returns:	     
	     	void
	     */
	    this.detachAll = function(el) {    	
	    	var id = _getAttribute(el, "id");	    	
	    	var endpoints = endpointsByElement[id];
	    	if (endpoints && endpoints.length) {
		    	for (var i = 0; i < endpoints.length; i++) {
		    		var c = endpoints[i].connections.length;
		    		if (c > 0) {
		    			for (var j = 0; j < c; j++) {
		    				var jpc = endpoints[i].connections[0];
		    				_removeElement(jpc.canvas, jpc.container);
		    				jpc.endpoints[0].removeConnection(jpc);
		    				jpc.endpoints[1].removeConnection(jpc);
		    				_removeFromList(connectionsByScope, jpc.scope, jpc);
		    			}
		    		}
		    	}
	    	}
	    };
	    
	    /*
	     Function: detachEverything	     
	     	Remove all Connections from all elements, but leaves Endpoints in place.	     
	     Returns:	     
	     	void	     
	     See Also:	     
	     	<removeEveryEndpoint>
	     */
	    this.detachEverything = function() {
	    	for(var id in endpointsByElement) {	    	
		    	var endpoints = endpointsByElement[id];
		    	if (endpoints && endpoints.length) {
			    	for (var i = 0; i < endpoints.length; i++) {
			    		var c = endpoints[i].connections.length;
			    		if (c > 0) {
			    			for (var j = 0; j < c; j++) {
			    				var jpc = endpoints[i].connections[0];
			    				_removeElement(jpc.canvas, jpc.container);
			    				jpc.endpoints[0].removeConnection(jpc);
			    				jpc.endpoints[1].removeConnection(jpc);
			    			}
			    		}
			    	}
		    	}
	    	}
	    	delete connectionsByScope;
	    	connectionsByScope = {};
	    };
	    
	    /*
	     Function: draggable 
	     	initialises the draggability of some element or elements.
	     Parameters:
	     	el - either an element id, a list of element ids, or a selector.
	     	options - options to pass through to the underlying library
	     Returns:
	     	void
	     */
	    this.draggable = function(el, options) {
	    	if (typeof el == 'object' && el.length) {
	    		for (var i = 0; i < el.length; i++)
	    		{
	    			var ele = _getElementObject(el[i]);
		    		if (ele) _initDraggableIfNecessary(ele, true, options);
	    		}
	    	}	    	
	    	else {
	    		var ele = _getElementObject(el);
	    		if (ele)
	    			_initDraggableIfNecessary(ele, true, options);
	    	}
	    };
	    
	    /*
	     Function: extend
	     	Wraps the underlying library's extend functionality.
	     Parameters:
	     	o1 - object to extend
	     	o2 - object to extend o1 with
	     Returns:
	     	o1, extended with all properties from o2.
	     */
	    this.extend = function(o1, o2) {
			return jsPlumb.CurrentLibrary.extend(o1, o2);
		};
		
		/*
		 Function: getConnections
		 	Gets all or a subset of connections currently managed by this jsPlumb instance.  
		 Parameters:
		    options - a JS object that holds options defining what sort of connections you're looking for.  Valid values are:
		    	scope		this may be a String or a list of Strings. jsPlumb will only return Connections whose scope matches what this option
		    	            defines.  If you omit it, you will be given Connections of every scope.
		    	source			may be a string or a list of strings; constraints results to have only Connections whose source is this object.
		    	target			may be a string or a list of strings; constraints results to have only Connections whose target is this object.
		 	
		 	The return value is a dictionary in this format:
		 	
		 	{
		 		'scope1': [ 
		 			{sourceId:'window1', targetId:'window2'},
		 			{sourceId:'window3', targetId:'window4'},
		 			{sourceId:'window1', targetId:'window3'}
		 		],
		 		'scope2': [
		 			{sourceId:'window1', targetId:'window3'}
		 		]
		 	}
		 	
		 */
	    this.getConnections = function(options) {
	    	var r = {};
	    	options = options || {};
	    	var prepareList = function(input) {
	    		var r = [];
	    		if (input) {
	    			if (typeof input == 'string') r.push(input);
	    			else r = input;
	    		}
	    		return r;
	    	};
	    	var scopes = prepareList(options.scope);
	    	var sources = prepareList(options.source);
	    	var targets = prepareList(options.target);
	    	var filter = function(list, value) {
	    		return list.length > 0 ? _findIndex(list, value) != -1 : true;
	    	};
	    	for (var i in connectionsByScope) {
	    		if (filter(scopes, i)) {
	    			r[i] = [];
	    			for (var j = 0; j < connectionsByScope[i].length; j++) {
	    				var c = connectionsByScope[i][j];
	    				if (filter(sources, c.sourceId) && filter(targets, c.targetId))
	    					r[i].push({sourceId:c.sourceId, targetId:c.targetId});
	    			}
	    		}
	    	}
	    	return r;	    	
	    };
	    
	    /*
	     Function: getDefaultScope
	     	Gets the default scope for connections and endpoints. a scope defines a type of endpoint/connection; supplying a scope to an endpoint
	     	or connection allows you to support different types of connections in the same UI.  but if you're only interested in one type of connection,
	     	you don't need to supply a scope.  this method will probably be used by very few people; it's good for testing though.
	     */
	    this.getDefaultScope = function() {
	    	return DEFAULT_SCOPE;
	    };
		
	    /*
	     Function: hide 	     
	     	Sets an element's connections to be hidden.	     
	     Parameters:	     
	     	el - either the id of the element, or a selector for the element.	     	
	     Returns:	     
	     	void
	     */
		this.hide = function(el) {
	    	_setVisible(el, "none");
	    };
	        	    		    
	    /*
	     Function: makeAnchor	     
	     	Creates an anchor with the given params.	     
	     Parameters:	     
	     	x - the x location of the anchor as a fraction of the total width.  
	     	y - the y location of the anchor as a fraction of the total height.
	     	xOrientation - value indicating the general direction a connection from the anchor should go in, in the x direction.
	     	yOrientation - value indicating the general direction a connection from the anchor should go in, in the y direction.
	     	xOffset - a fixed offset that should be applied in the x direction that should be applied after the x position has been figured out.  optional. defaults to 0. 
	     	yOffset - a fixed offset that should be applied in the y direction that should be applied after the y position has been figured out.  optional. defaults to 0.	     	
	     Returns:	     
	     	The newly created Anchor.
	     */
	    this.makeAnchor = function(x, y, xOrientation, yOrientation, xOffset, yOffset) {
	    	// backwards compatibility here.  we used to require an object passed in but that makes the call very verbose.  easier to use
	    	// by just passing in four/six values.  but for backwards compatibility if we are given only one value we assume it's a call in the old form.
	    	var params = {};
	    	if (arguments.length == 1) jsPlumb.extend(params, x);
	    	else {
	    		params = {x:x, y:y};
	    		if (arguments.length >= 4) {
	    			params.orientation = [arguments[2], arguments[3]];
	    		}
	    		if (arguments.length == 6) params.offsets = [arguments[4], arguments[5]];
	    	}
	    	var a = new Anchor(params);
	    	a.clone = function() { return new Anchor(params); };
	    	return a;
	    };
	        	    
	    /*
	     Function: repaint	     
	     	Repaints an element and its connections. This method gets new sizes for the elements before painting anything.	     
	     Parameters:	      
	     	el - either the id of the element or a selector representing the element.	     	
	     Returns:	     
	     	void	     	
	     See Also:	     
	     	<repaintEverything>
	     */
	    this.repaint = function(el) {
	    	
	    	var _processElement = function(el) {
	    		var ele = _getElementObject(el);
		    	_draw(ele);
	    	};
	    	
	    	// TODO: support a jQuery result object too!
	    	
	    	// support both lists...
	    	if (typeof el =='object') {
	    		for (var i = 0; i < el.length; i++)
	    			_processElement(el[i]);
	    	} // ...and single strings.
	    	else _processElement(el);
	    };     
	    
	    /*
	     Function: repaintEverything	     
	     	Repaints all connections.	     
	     Returns:	     
	     	void	     	
	     See Also:	     
	     	<repaint>
	     */
	    this.repaintEverything = function() {
	    	for (var elId in endpointsByElement) {
	    		_draw(_getElementObject(elId));
	    	}
	    };
	    
	    /*	     
	     Function: removeAllEndpoints	     
	     	Removes all Endpoints associated with a given element.  Also removes all Connections associated with each Endpoint it removes.	    
	     Parameters:	     
	    	el - either an element id, or a selector for an element.	    	
	     Returns:	     
	     	void	     	
	     See Also:	     
	     	<removeEndpoint>
	    */
	    this.removeAllEndpoints = function(el) {
	    	var elId = _getAttribute(el, "id");
	    	// first remove all Connections.
	    	jsPlumb.detachAll(elId);
	    	var ebe = endpointsByElement[elId];
	    	for (var i in ebe) {
			_removeElement(ebe[i].canvas);	    	
	    	}	    
	    	endpointsByElement[elId] = [];
	    };
	    
	    /*	     
	     Function: removeEveryEndpoint	     
	     	Removes every Endpoint in this instance of jsPlumb.	    	
	     Returns:	     
	     	void	     	
	     See Also:	     
	     	<removeAllEndpoints> <removeEndpoint>
	    */
	    this.removeEveryEndpoint = function() {
	    	for(var id in endpointsByElement) {	    	
		    	var endpoints = endpointsByElement[id];
		    	if (endpoints && endpoints.length) {
			    	for (var i = 0; i < endpoints.length; i++) {			
				    	_removeElement(endpoints[i].canvas, endpoints[i].container);	    					    		   
			    	}			    	
		    	}
	    	}
	    	delete endpointsByElement;
	    	endpointsByElement = {};
	    };
	    
	    /*
	     Function: removeEndpoint	     
	     	Removes the given Endpoint from the given element.	    
	     Parameters:	     
	    	el - either an element id, or a selector for an element.
	    	endpoint - Endpoint to remove.  this is an Endpoint object, such as would have been returned from a call to addEndpoint.	    	
	    Returns:	    
	    	void	    	
	    See Also:	    
	    	<removeAllEndpoints> <removeEveryEndpoint>
	    */
	    this.removeEndpoint = function(el, endpoint) {
	        var elId = _getAttribute(el, "id");
	    	var ebe = endpointsByElement[elId];
	    	if (ebe) {
	    		if(_removeFromList(endpointsByElement, elId, endpoint))
	    			_removeElement(endpoint.canvas);
	    	}
	    };
	    
	    /*
	     Function:reset
	     	removes all endpoints and connections and clears the element cache.
	     */
	    this.reset = function() {
	    	this.detachEverything();
			this.removeEveryEndpoint();
			this.clearCache();
	    };
	    
	    /*
	     Function: setAutomaticRepaint	     
	     	Sets/unsets automatic repaint on window resize.	     
	     Parameters:	     
	     	value - whether or not to automatically repaint when the window is resized.	     	
	     Returns:	     
	     	void
	     */
	    this.setAutomaticRepaint = function(value) {
	    	automaticRepaint = value;
	    };
	    
	    /*
	     Function: setDefaultNewCanvasSize	     
	     	Sets the default size jsPlumb will use for a new canvas (we create a square canvas so one value is all that is required).  
	     	This is a hack for IE, because ExplorerCanvas seems to need for a canvas to be larger than what you are going to draw on 
	     	it at initialisation time.  The default value of this is 1200 pixels, which is quite large, but if for some reason you're 
	     	drawing connectors that are bigger, you should adjust this value appropriately.	     
	     Parameters:	     
	     	size - The default size to use. jsPlumb will use a square canvas so you need only supply one value.	     	
	     Returns:	     
	     	void
	     */
	    this.setDefaultNewCanvasSize = function(size) {
	    	DEFAULT_NEW_CANVAS_SIZE = size;    	
	    };
	    
	    /*
	     Function: setDefaultScope
	     	Sets the default scope for connections and endpoints. a scope defines a type of endpoint/connection; supplying a scope to an endpoint
	     	or connection allows you to support different types of connections in the same UI.  but if you're only interested in one type of connection,
	     	you don't need to supply a scope.  this method will probably be used by very few people; it just instructs jsPlumb to use a different key
	     	for the default scope.
	     */
	    this.setDefaultScope = function(scope) {
	    	DEFAULT_SCOPE = scope;
	    };
	    
	    /*
	     Function: setDraggable	     
	     	Sets whether or not a given element is draggable, regardless of what any plumb command may request.	     
	     Parameters:	      
	      	el - either the id for the element, or a selector representing the element.	      	
	     Returns:	     
	      	void
	     */
	    this.setDraggable = _setDraggable; 
	    
	    /*
	     Function: setDraggableByDefault	     
	     	Sets whether or not elements are draggable by default.  Default for this is true.	     
	     Parameters:
	     	draggable - value to set	     	
	     Returns:	     
	     	void
	     */
	    this.setDraggableByDefault = function(draggable) {
	    	_draggableByDefault = draggable;
	    };
	    
	    this.setDebugLog = function(debugLog) {
	    	log = debugLog;
	    };
	    
	    /*
	     Function: setRepaintFunction	     
	     	Sets the function to fire when the window size has changed and a repaint was fired.	     
	     Parameters:	     
	     	f - Function to execute.	     	
	     Returns:	     
	     	void
	     */
	    this.setRepaintFunction = function(f) {
	    	repaintFunction = f;
	    };
	        
	    /*
	     Function: show	     	     
	     	Sets an element's connections to be visible.	     
	     Parameters:	     
	     	el - either the id of the element, or a selector for the element.	     	
	     Returns:
	     	void	     
	     */
	    this.show = function(el) {
	    	_setVisible(el, "block");
	    };
	    
	    /*
	     Function: sizeCanvas	     
	     	Helper to size a canvas. You would typically use this when writing your own Connector or Endpoint implementation.	     
	     Parameters:
	     	x - [int] x position for the Canvas origin
	     	y - [int] y position for the Canvas origin
	     	w - [int] width of the canvas
	     	h - [int] height of the canvas	     	
	     Returns:
	     	void	     
	     */
	    this.sizeCanvas = function(canvas, x, y, w, h) {
	    	if (canvas) {
		        canvas.style.height = h + "px"; canvas.height = h;
		        canvas.style.width = w + "px"; canvas.width = w; 
		        canvas.style.left = x + "px"; canvas.style.top = y + "px";
		       // _currentInstance.CurrentLibrary.setPosition(canvas, x, y);
	    	}
	    };
	    
	    /**
	     * gets some test hooks.  nothing writable.
	     */
	    this.getTestHarness = function() {
	    	return {
	    		endpointCount : function(elId) {
	    			var e = endpointsByElement[elId];
	    			return e ? e.length : 0;
	    		},
	    		connectionCount : function(scope) {
	    			scope = scope || DEFAULT_SCOPE;
	    			var c = connectionsByScope[scope];
	    			return c ? c.length : 0; 
	    		},	    		
	    		findIndex : _findIndex,
	    		getId : _getId
	    	};	    	
	    };
	    
	    /**
	     * Toggles visibility of an element's connections. kept for backwards compatibility
	     */
	    this.toggle = _toggleVisible;
	    
	    /*
	     Function: toggleVisible	     
	     	Toggles visibility of an element's connections. 	     
	     Parameters:
	     	el - either the element's id, or a selector representing the element.	     	
	     Returns:
	     	void, but should be updated to return the current state
	     */
	    //TODO: update this method to return the current state.
	    this.toggleVisible = _toggleVisible;
	    
	    /*
	     Function: toggleDraggable	     
	     	Toggles draggability (sic) of an element's connections. 	     
	     Parameters:
	     	el - either the element's id, or a selector representing the element.	     	
	     Returns:
	     	The current draggable state.
	     */
	    this.toggleDraggable = _toggleDraggable; 
	    
	    /*
	     Function: unload	     
	     	Unloads jsPlumb, deleting all storage.  You should call this from an onunload attribute on the <body> element	     
	     Returns:
	     	void
	     */
	    this.unload = function() {
	    	delete endpointsByElement;
			delete offsets;
			delete sizes;
			delete floatingConnections;
			delete draggableStates;		
	    };
	    
	    /*
	     Function: wrap
	     Helper method to wrap an existing function with one of your own.  This is used by the various
	     implementations to wrap event callbacks for drag/drop etc; it allows jsPlumb to be
	     transparent in its handling of these things.  If a user supplies their own event callback,
	     for anything, it will always be called.
	     Parameters:	     	
	     */
	    this.wrap = _wrap;	    
	    this.trace = _trace;
	    this.clearTrace = _clearTrace;
	    this.clearAllTraces = _clearAllTraces;
	    this.getTrace = _getTrace;
	    
	};
	
	var jsPlumb = window.jsPlumb = new jsPlumbInstance();
	jsPlumb.getInstance = function(_defaults) {
		var j = new jsPlumbInstance();
		if (_defaults)
			jsPlumb.extend(j.Defaults, _defaults);
		return j;
	};

})();
