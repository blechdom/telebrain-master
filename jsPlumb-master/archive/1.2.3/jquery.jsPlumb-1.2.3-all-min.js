(function(){var a=function(){var j=this;var S=(/MSIE/.test(navigator.userAgent)&&!window.opera);var m=null;var Y=function(){b.repaintEverything()};var f=true;function X(){if(f){Y()}}var W=null;var ad=function(){var ah={};this.bind=function(aj,ak){var ai=ah[aj];if(!ai){ai=[];ah[aj]=ai}ai.push(ak)};this.fireUpdate=function(aj,ak){if(ah[aj]){for(var ai=0;ai<ah[aj].length;ai++){try{ah[aj][ai](ak)}catch(al){}}}}};var U={};var C={};var s={};var F=[];var I={};var T={};var H=true;var y=[];var Z={};var g="DEFAULT";var L=1200;var Q=function(aj,ak,ah,an){var am=function(aq,ap){if(aq===ap){return true}else{if(typeof aq=="object"&&typeof ap=="object"){var ar=true;for(var ao in aq){if(!am(aq[ao],ap[ao])){ar=false;break}}for(var ao in ap){if(!am(ap[ao],aq[ao])){ar=false;break}}return ar}}};for(var al=+ah||0,ai=aj.length;al<ai;al++){if(am(aj[al],ak)){return al}}return -1};var t=function(aj,ak){var ah=function(am,al){B(Z,am,al)};if(typeof aj=="object"&&aj.length){for(var ai=0;ai<aj.length;ai++){ah(aj[ai],ak)}}else{ah(aj,ak)}};var B=function(ak,ai,aj){var ah=ak[ai];if(ah==null){ah=[];ak[ai]=ah}ah.push(aj);return ah};var A=function(ah,ai){if(!ai){document.body.appendChild(ah)}else{b.CurrentLibrary.appendElement(ah,ai)}};var ae=function(am,aw){var ah=o(am,"id");var ai=U[ah];if(ai){var aq=""+(new Date().getTime());k(ah,aw);var ar=F[ah];var ao=y[ah];for(var an=0;an<ai.length;an++){var ap=ai[an];var aj=ap.connections;if(ap.anchor.isSelective&&aj.length>0){var au=aj[0];var ay=au.endpoints[0]==ap?1:0;var al=ay==0?au.sourceId:au.targetId;var at=F[al],av=y[al];var ax=ap.anchor.compute([ar.left,ar.top],ao,ap,[at.left,at.top],av,au.endpoints[ay]);ap.paint(ax)}else{var ax=ap.anchor.compute([ar.left,ar.top],ao,ap);ap.paint(ax)}for(var ak=0;ak<aj.length;ak++){aj[ak].paint(ah,aw,false,aq);var ay=aj[ak].endpoints[0]==ap?1:0;if(aj[ak].endpoints[ay].anchor.isSelective){var al=ay==0?aj[ak].sourceId:aj[ak].targetId;var at=F[al],av=y[al];var ax=aj[ak].endpoints[ay].anchor.compute([at.left,at.top],av,aj[ak].endpoints[ay],[ar.left,ar.top],ao,ap);aj[ak].endpoints[ay].paint(ax)}}}}};var q=function(ai,ak){var al=null;if(typeof ai=="object"&&ai.length){al=[];for(var ah=0;ah<ai.length;ah++){var aj=V(ai[ah]);var am=o(aj,"id");al.push(ak(aj,am))}}else{var aj=V(ai);var am=o(aj,"id");al=ak(aj,am)}return al};var K=function(aj,ak){var ah=Z[aj];if(ah){for(var ai in ah){try{ah[ai][aj](ak)}catch(al){l("while firing event ["+aj+"]; listener failed like this: "+al)}}}};var l=function(ah){};var N=function(ai,ah){};var i={};var w=function(ah){if(typeof(ah)=="string"){var ai=i[ah];if(!ai){ai=b.CurrentLibrary.getElementObject(ah);i[ah]=ai}return ai}else{return b.CurrentLibrary.getElementObject(ah)}};var o=function(ah,aj){var ai=w(ah);return b.CurrentLibrary.getAttribute(ai,aj)};var R=function(ai,ak,ah){var aj=w(ai);b.CurrentLibrary.setAttribute(aj,ak,ah)};var af=function(ai,ah){var aj=w(ai);b.CurrentLibrary.addClass(aj,ah)};var V=function(ah){return w(ah)};var d=function(ah){var ai=w(ah);return b.CurrentLibrary.getOffset(ai)};var h=function(ah){var ai=w(ah);return b.CurrentLibrary.getSize(ai)};var ag=function(ah,ai){var aj=V(ah);var ak=o(aj,"id");if(!ak){if(arguments.length==2){ak=ai}else{ak="_jsPlumb_"+new String((new Date()).getTime())}R(aj,"id",ak)}return ak};var G=function(ah){return C[ah]};var x=function(al,ak,aj){var ah=ak==null?H:ak;if(ah){if(b.CurrentLibrary.isDragSupported(al)){var ai=aj||j.Defaults.DragOptions||b.Defaults.DragOptions;ai=b.extend({},ai);var am=b.CurrentLibrary.dragEvents.drag;ai[am]=aa(ai[am],function(){var an=b.CurrentLibrary.getUIPosition(arguments);ae(al,an);af(al,"jsPlumb_dragged")});var ah=T[ag(al)];ai.disabled=ah==null?false:!ah;b.CurrentLibrary.initDraggable(al,ai)}}};var E=function(ai,ak,aj){var ah=document.createElement("canvas");A(ah,ak);ah.style.position="absolute";if(ai){ah.className=ai}ag(ah,aj);if(S){b.sizeCanvas(ah,0,0,L,L);ah=G_vmlCanvasManager.initElement(ah)}return ah};var D=function(aj,al){var ah=U[aj];if(ah&&ah.length){for(var ak=0;ak<ah.length;ak++){for(var ai=0;ai<ah[ak].connections.length;ai++){var am=al(ah[ak].connections[ai]);if(am){return}}}}};var r=function(ai){for(var ah in U){D(ah,ai)}};var P=function(ah,ai){if(ah!=null){if(!ai){try{document.body.removeChild(ah)}catch(aj){}}else{b.CurrentLibrary.removeElement(ah,ai)}}};var z=function(aj,ai){for(var ah=0;ah<aj.length;ah++){P(aj[ah],ai)}};var u=function(al,aj,ak){var ah=al[aj];if(ah!=null){var ai=Q(ah,ak);if(ai>=0){delete (ah[ai]);ah.splice(ai,1);return true}}return false};var c=function(ai,ah){var aj=function(ak,al){T[al]=ah;if(b.CurrentLibrary.isDragSupported(ak)){b.CurrentLibrary.setDraggable(ak,ah)}};return q(ai,aj)};var ab=function(ai,ak){var ah=o(ai,"id");var aj=function(al){al.canvas.style.display=ak};D(ah,aj)};var v=function(ai){var ah=function(ak,aj){var al=T[aj]==null?H:T[aj];al=!al;T[aj]=al;b.CurrentLibrary.setDraggable(ak,al);return al};return q(ai,ah)};var e=function(ah){var ai=function(ak){var aj=("none"==ak.canvas.style.display);ak.canvas.style.display=aj?"block":"none"};D(ah,ai)};var k=function(ai,ak,ah){if(ah||ak==null){var aj=V(ai);y[ai]=h(aj);F[ai]=d(aj)}else{F[ai]=ak}};var aa=function(ai,ah){ai=ai||function(){};ah=ah||function(){};return function(){var aj=null;try{aj=ah.apply(this,arguments)}catch(ak){l("jsPlumb function failed : "+ak)}try{ai.apply(this,arguments)}catch(ak){l("wrapped function failed : "+ak)}return aj}};var M=function(al){var aj=this;this.x=al.x||0;this.y=al.y||0;var ai=al.orientation||[0,0];var ak=null;var ah=null;this.offsets=al.offsets||[0,0];this.compute=function(ay,an,av,aq,au,ar){ah=[ay[0]+(aj.x*an[0])+aj.offsets[0],ay[1]+(aj.y*an[1])+aj.offsets[1]];var ao=av?av.container:null;var aw={left:0,top:0};if(ao!=null){var am=V(ao);var ap=d(am);var at=b.CurrentLibrary.getScrollLeft(am);var ax=b.CurrentLibrary.getScrollTop(am);aw.left=ap.left-at;aw.top=ap.top-ax;ah[0]=ah[0]-aw.left;ah[1]=ah[1]-aw.top}return ah};this.getOrientation=function(){return ai};this.equals=function(am){if(!am){return false}var an=am.getOrientation();var ap=this.getOrientation();return this.x==am.x&&this.y==am.y&&this.offsets[0]==am.offsets[0]&&this.offsets[1]==am.offsets[1]&&ap[0]==an[0]&&ap[1]==an[1]}};var p=function(am){var ak=am.reference;var al=am.referenceCanvas;var aj=h(V(al));var ai=0,an=0;var ah=null;this.compute=function(aq,ao,ap,ar){ai=0;an=0;return[aq[0]+(aj[0]/2),aq[1]+(aj[1]/2)]};this.getOrientation=function(){if(ah){return ah}else{var ao=ak.getOrientation();return[Math.abs(ao[0])*ai*-1,Math.abs(ao[1])*an*-1]}};this.over=function(ao){ah=ao.getOrientation()};this.out=function(){ah=null}};var J=function(am){this.isSelective=true;this.isDynamic=true;var ak=am||[];this.addAnchor=function(an){ak.push(an)};var aj=ak.length>0?ak[0]:null;var al=ak.length>0?0:-1;this.locked=false;var ai=this;var ah=function(ap,an,au,at,ao){var ar=at[0]+(ap.x*ao[0]),aq=at[1]+(ap.y*ao[1]);return Math.sqrt(Math.pow(an-ar,2)+Math.pow(au-aq,2))};this.compute=function(aA,an,av,ao,aq,ap){if(ai.locked||ao==null||aq==null){return aj.compute(aA,an,av,ao,aq,ap)}var at=ao[0]+(aq[0]/2),ar=ao[1]+(aq[1]/2);var aw=-1,az=Infinity;for(var au=0;au<ak.length;au++){var ax=ah(ak[au],at,ar,aA,an);if(ax<az){aw=au+0;az=ax}}aj=ak[aw];var ay=aj.compute(aA,an,av,ao,aq,ap);return ay};this.getOrientation=function(){return aj!=null?aj.getOrientation():[0,0]};this.over=function(an){if(aj!=null){aj.over(an)}};this.out=function(){if(aj!=null){aj.out()}}};var n=function(al){ad.apply(this);var ar=this;var ah=new String("_jsplumb_c_"+(new Date()).getTime());this.getId=function(){return ah};this.container=al.container||j.Defaults.Container;this.source=V(al.source);this.target=V(al.target);if(al.sourceEndpoint){this.source=al.sourceEndpoint.getElement()}if(al.targetEndpoint){this.target=al.targetEndpoint.getElement()}this.sourceId=o(this.source,"id");this.targetId=o(this.target,"id");this.endpointsOnTop=al.endpointsOnTop!=null?al.endpointsOnTop:true;this.scope=al.scope;this.endpoints=[];this.endpointStyles=[];var ao=function(at,aw,au,av){if(at){ar.endpoints[aw]=at;at.addConnection(ar)}else{if(!au.endpoints){au.endpoints=[null,null]}var aB=au.endpoints[aw]||au.endpoint||j.Defaults.Endpoints[aw]||b.Defaults.Endpoints[aw]||j.Defaults.Endpoint||b.Defaults.Endpoint||new b.Endpoints.Dot();if(!au.endpointStyles){au.endpointStyles=[null,null]}var az=au.endpointStyles[aw]||au.endpointStyle||j.Defaults.EndpointStyles[aw]||b.Defaults.EndpointStyles[aw]||j.Defaults.EndpointStyle||b.Defaults.EndpointStyle;var ay=au.anchors?au.anchors[aw]:j.Defaults.Anchors[aw]||b.Defaults.Anchors[aw]||j.Defaults.Anchor||b.Defaults.Anchor||b.Anchors.BottomCenter;var aA=au.uuids?au.uuids[aw]:null;if(au.uuids){var ax=new ac({style:az,endpoint:aB,connections:[ar],uuid:aA,anchor:ay,source:av,container:ar.container})}else{var ax=new ac({style:az,endpoint:aB,connections:[ar],anchor:ay,source:av,container:ar.container})}ar.endpoints[aw]=ax;return ax}};var ak=ao(al.sourceEndpoint,0,al,ar.source);if(ak){B(U,this.sourceId,ak)}var aj=ao(al.targetEndpoint,1,al,ar.target);if(aj){B(U,this.targetId,aj)}if(!this.scope){this.scope=this.endpoints[0].scope}this.connector=this.endpoints[0].connector||this.endpoints[1].connector||al.connector||j.Defaults.Connector||b.Defaults.Connector||new b.Connectors.Bezier();this.paintStyle=this.endpoints[0].connectorStyle||this.endpoints[1].connectorStyle||al.paintStyle||j.Defaults.PaintStyle||b.Defaults.PaintStyle;this.backgroundPaintStyle=this.endpoints[0].connectorBackgroundStyle||this.endpoints[1].connectorBackgroundStyle||al.backgroundPaintStyle||j.Defaults.BackgroundPaintStyle||b.Defaults.BackgroundPaintStyle;this.overlays=al.overlays||[];this.addOverlay=function(at){overlays.push(at)};this.labelStyle=al.labelStyle||j.Defaults.LabelStyle||b.Defaults.LabelStyle;this.label=al.label;if(this.label){this.overlays.push(new b.Overlays.Label({labelStyle:this.labelStyle,label:this.label}))}k(this.sourceId);k(this.targetId);this.distanceFrom=function(at){return ar.connector.distanceFrom(at)};this.setLabel=function(at){ar.label=at;j.repaint(ar.source)};var an=F[this.sourceId],am=y[this.sourceId];var aq=F[this.targetId];otherWH=y[this.targetId];var ap=this.endpoints[0].anchor.compute([an.left,an.top],am,this.endpoints[0],[aq.left,aq.top],otherWH,this.endpoints[1]);this.endpoints[0].paint(ap);ap=this.endpoints[1].anchor.compute([aq.left,aq.top],otherWH,this.endpoints[1],[an.left,an.top],am,this.endpoints[0]);this.endpoints[1].paint(ap);var ai=E(b.connectorClass,ar.container);this.canvas=ai;this.paint=function(aH,aJ,aE,av){var ay=ar.floatingAnchorIndex;var aK=false;var aR=aK?this.sourceId:this.targetId,aD=aK?this.targetId:this.sourceId;var aw=aK?0:1,aS=aK?1:0;var au=aK?this.target:this.source;if(this.canvas.getContext){k(aH,aJ,aE);k(aR);var aC=F[aD];var at=F[aR];var az=y[aD];var aF=y[aR];var aM=ai.getContext("2d");var aA=this.endpoints[aS].anchor.compute([aC.left,aC.top],az,this.endpoints[aS],[at.left,at.top],aF,this.endpoints[aw]);var aB=this.endpoints[aS].anchor.getOrientation();var aP=this.endpoints[aw].anchor.compute([at.left,at.top],aF,this.endpoints[aw],[aC.left,aC.top],az,this.endpoints[aS]);var aQ=this.endpoints[aw].anchor.getOrientation();var ax=0;for(var aO=0;aO<ar.overlays.length;aO++){var aL=ar.overlays[aO];var aI=aL.computeMaxSize(ar.connector,aM);if(aI>ax){ax=aI}}var aN=this.connector.compute(aA,aP,this.endpoints[aS].anchor,this.endpoints[aw].anchor,this.paintStyle.lineWidth,ax);b.sizeCanvas(ai,aN[0],aN[1],aN[2],aN[3]);var aG=function(aT,aW){aT.save();b.extend(aT,aW);if(aW.gradient&&!S){var aV=ar.connector.createGradient(aN,aT,(aH==this.sourceId));for(var aU=0;aU<aW.gradient.stops.length;aU++){aV.addColorStop(aW.gradient.stops[aU][0],aW.gradient.stops[aU][1])}aT.strokeStyle=aV}ar.connector.paint(aN,aT);aT.restore()};if(this.backgroundPaintStyle!=null){aG(aM,this.backgroundPaintStyle)}aG(aM,this.paintStyle);for(var aO=0;aO<ar.overlays.length;aO++){var aL=ar.overlays[aO];aL.draw(ar.connector,aM)}}};this.repaint=function(){this.paint(this.sourceId,null,true)};x(ar.source,al.draggable,al.dragOptions);x(ar.target,al.draggable,al.dragOptions);if(this.source.resize){this.source.resize(function(at){b.repaint(ar.sourceId)})}};var ac=function(aJ){aJ=aJ||{};b.extend({},aJ);var aw=this;var ay=new String("_jsplumb_e_"+(new Date()).getTime());this.getId=function(){return ay};aw.anchor=aJ.anchor||b.Anchors.TopCenter;var au=aJ.endpoint||new b.Endpoints.Dot();var ao=aJ.style||j.Defaults.EndpointStyle||b.Defaults.EndpointStyle;this.connectorStyle=aJ.connectorStyle;this.connector=aJ.connector;this.isSource=aJ.isSource||false;this.isTarget=aJ.isTarget||false;var av=aJ.source;var aq=aJ.uuid;if(aq){C[aq]=aw}this.container=aJ.container||j.Defaults.Container||b.Defaults.Container;var an=o(av,"id");var aD=aJ.maxConnections||1;this.canvas=aJ.canvas||E(b.endpointClass,this.container,aJ.uuid);this.connections=aJ.connections||[];this.scope=aJ.scope||g;var at=aJ.reattach||false;var aH=null;var ak=null;this.dragAllowedWhenFull=aJ.dragAllowedWhenFull||true;this.addConnection=function(aL){aw.connections.push(aL)};this.detach=function(aM){var aL=Q(aw.connections,aM);if(aL>=0){var aN=aM.endpoints[0]==aw?aM.endpoints[1]:aM.endpoints[0];aw.connections.splice(aL,1);aN.detach(aM)}};this.detachAll=function(){while(aw.connections.length>0){aw.detach(aw.connections[0])}};this.detachFrom=function(aM){var aN=[];for(var aL=0;aL<aw.connections.length;aL++){if(aw.connections[aL].endpoints[1]==aM||aw.connections[aL].endpoints[0]==aM){aN.push(aw.connections[aL])}}for(var aL=0;aL<aN.length;aL++){aM.detach(aN[aL]);aw.detach(aN[aL])}};this.getElement=function(){return av};this.getUuid=function(){return aq};this.makeInPlaceCopy=function(){var aL=new ac({anchor:aw.anchor,source:av,style:ao,endpoint:au});return aL};this.isConnectedTo=function(aN){var aM=false;if(aN){for(var aL=0;aL<aw.connections.length;aL++){if(aw.connections[aL].endpoints[1]==aN){aM=true;break}}}return aM};this.isFloating=function(){return aH!=null};var aG=function(){if(aw.connections.length<aD){return null}else{return aw.connections[0]}};this.isFull=function(){return aD<1?false:(aw.connections.length>=aD)};this.setDragAllowedWhenFull=function(aL){aw.dragAllowedWhenFull=aL};this.equals=function(aL){return this.anchor.equals(aL.anchor)&&true};this.paint=function(aP,aN,aM){if(m){m.debug("Painting Endpoint with elementId ["+an+"]; anchorPoint is ["+aP+"]")}if(aP==null){var aO=F[an];var aL=y[an];if(aO==null||aL==null){k(an);aO=F[an];aL=y[an]}aP=aw.anchor.compute([aO.left,aO.top],aL,aw)}au.paint(aP,aw.anchor.getOrientation(),aM||aw.canvas,ao,aN||ao)};this.removeConnection=this.detach;if(aJ.isSource&&b.CurrentLibrary.isDragSupported(av)){var aC=null,ay=null,aB=null,ah=false,aj=null;var al=function(){aB=aG();if(aw.isFull()&&!aw.dragAllowedWhenFull){return false}k(an);ak=aw.makeInPlaceCopy();ak.paint();aC=document.createElement("div");var aN=V(aC);A(aC,aw.container);var aO=""+new String(new Date().getTime());R(aN,"id",aO);k(aO);R(V(aw.canvas),"dragId",aO);R(V(aw.canvas),"elId",an);var aM=new p({reference:aw.anchor,referenceCanvas:aw.canvas});aH=new ac({style:{fillStyle:"rgba(0,0,0,0)"},endpoint:au,anchor:aM,source:aN});if(aB==null){aw.anchor.locked=true;aB=new n({sourceEndpoint:aw,targetEndpoint:aH,source:V(av),target:V(aC),anchors:[aw.anchor,aM],paintStyle:aJ.connectorStyle,connector:aJ.connector})}else{ah=true;var aL=aB.sourceId==an?0:1;aB.floatingAnchorIndex=aL;aw.removeConnection(aB);if(aL==0){aj=[aB.source,aB.sourceId];aB.source=V(aC);aB.sourceId=aO}else{aj=[aB.target,aB.targetId];aB.target=V(aC);aB.targetId=aO}aB.endpoints[aL==0?1:0].anchor.locked=true;aB.suspendedEndpoint=aB.endpoints[aL];aB.endpoints[aL]=aH}I[aO]=aB;aH.addConnection(aB);B(U,aO,aH)};var aE=aJ.dragOptions||{};var az=b.extend({},b.CurrentLibrary.defaultDragOptions);aE=b.extend(az,aE);aE.scope=aE.scope||aw.scope;var aA=b.CurrentLibrary.dragEvents.start;var aI=b.CurrentLibrary.dragEvents.stop;var ap=b.CurrentLibrary.dragEvents.drag;aE[aA]=aa(aE[aA],al);aE[ap]=aa(aE[ap],function(){var aL=b.CurrentLibrary.getUIPosition(arguments);b.CurrentLibrary.setOffset(aC,aL);ae(V(aC),aL)});aE[aI]=aa(aE[aI],function(){u(U,ay,aH);z([aC,aH.canvas],av);P(ak.canvas,av);var aL=aB.floatingAnchorIndex==null?1:aB.floatingAnchorIndex;aB.endpoints[aL==0?1:0].anchor.locked=false;if(aB.endpoints[aL]==aH){if(ah&&aB.suspendedEndpoint){if(at){aB.floatingAnchorIndex=null;if(aL==0){aB.source=aj[0];aB.sourceId=aj[1]}else{aB.target=aj[0];aB.targetId=aj[1]}aB.endpoints[aL]=aB.suspendedEndpoint;aB.suspendedEndpoint.addConnection(aB);b.repaint(aj[1])}else{aB.endpoints[0].removeConnection(aB);aB.endpoints[1].removeConnection(aB);P(aB.canvas,aw.container);u(s,aB.scope,aB);K("jsPlumbConnectionDetached",{source:aB.source,target:aB.target,sourceId:aB.sourceId,targetId:aB.targetId,sourceEndpoint:aB.endpoints[0],targetEndpoint:aB.endpoints[1]})}}else{P(aB.canvas,aw.container);aw.removeConnection(aB)}}aw.anchor.locked=false;aB=null;delete aH;delete ak;aw.paint()});var aF=V(aw.canvas);b.CurrentLibrary.initDraggable(aF,aE)}if(aJ.isTarget&&b.CurrentLibrary.isDropSupported(av)){var aK=aJ.dropOptions||j.Defaults.DropOptions||b.Defaults.DropOptions;aK=b.extend({},aK);aK.scope=aK.scope||aw.scope;var ar=null;var ax=b.CurrentLibrary.dragEvents.drop;var am=b.CurrentLibrary.dragEvents.over;var ai=b.CurrentLibrary.dragEvents.out;aK[ax]=aa(aK[ax],function(){var aM=b.CurrentLibrary.getDragObject(arguments);var aQ=o(V(aM),"dragId");var aN=o(V(aM),"elId");var aP=I[aQ];var aL=aP.floatingAnchorIndex==null?1:aP.floatingAnchorIndex;var aO=aL==0?1:0;if(!aw.isFull()&&!(aL==0&&!aw.isSource)&&!(aL==1&&!aw.isTarget)){if(aL==0){aP.source=av;aP.sourceId=an}else{aP.target=av;aP.targetId=an}aP.endpoints[aL].removeConnection(aP);if(aP.suspendedEndpoint){aP.suspendedEndpoint.removeConnection(aP)}aP.endpoints[aL]=aw;aw.addConnection(aP);aP.endpoints[aO].addConnection(aP);B(s,aP.scope,aP);x(av,aJ.draggable,{});b.repaint(aN);K("jsPlumbConnection",{source:aP.source,target:aP.target,sourceId:aP.sourceId,targetId:aP.targetId,sourceEndpoint:aP.endpoints[0],targetEndpoint:aP.endpoints[1]})}delete I[aQ]});aK[am]=aa(aK[am],function(){var aM=b.CurrentLibrary.getDragObject(arguments);var aO=o(V(aM),"dragId");var aN=I[aO];var aL=aN.floatingAnchorIndex==null?1:aN.floatingAnchorIndex;aN.endpoints[aL].anchor.over(aw.anchor)});aK[ai]=aa(aK[ai],function(){var aM=b.CurrentLibrary.getDragObject(arguments);var aO=o(V(aM),"dragId");var aN=I[aO];var aL=aN.floatingAnchorIndex==null?1:aN.floatingAnchorIndex;aN.endpoints[aL].anchor.out()});b.CurrentLibrary.initDroppable(V(aw.canvas),aK)}return aw};this.Defaults={Anchor:null,Anchors:[null,null],BackgroundPaintStyle:null,Connector:null,Container:null,DragOptions:{},DropOptions:{},Endpoint:null,Endpoints:[null,null],EndpointStyle:{fillStyle:null},EndpointStyles:[null,null],LabelStyle:{fillStyle:"rgba(0,0,0,0)",color:"black"},MaxConnections:null,PaintStyle:{lineWidth:10,strokeStyle:"red"},Scope:"_jsPlumb_DefaultScope"};this.connectorClass="_jsPlumb_connector";this.endpointClass="_jsPlumb_endpoint";this.Anchors={};this.Connectors={};this.Endpoints={};this.Overlays={};this.addEndpoint=function(am,an){an=b.extend({},an);var ak=V(am);var ao=o(ak,"id");an.source=ak;k(ao);var al=new ac(an);B(U,ao,al);var ah=F[ao];var aj=y[ao];var ai=al.anchor.compute([ah.left,ah.top],aj,al);al.paint(ai);return al};this.addEndpoints=function(ak,ah){var aj=[];for(var ai=0;ai<ah.length;ai++){aj.push(j.addEndpoint(ak,ah[ai]))}return aj};this.animate=function(aj,ai,ah){var ak=V(aj);var an=o(aj,"id");ah=ah||{};var am=b.CurrentLibrary.dragEvents.step;var al=b.CurrentLibrary.dragEvents.complete;ah[am]=aa(ah[am],function(){j.repaint(an)});ah[al]=aa(ah[al],function(){j.repaint(an)});b.CurrentLibrary.animate(ak,ai,ah)};this.clearCache=function(){delete i;i={}};this.autoConnect=function(am){var aj=[],aq=[],ah=am.endpoint||j.Defaults.EndpointStyle||b.Defaults.EndpointStyle,av=ak||j.Defaults.DynamicAnchors||b.Defaults.DynamicAnchors;var an=function(ay,ax){for(var aw=0;aw<ay.length;aw++){ax.push(ay[aw])}};var ai=am.source,ar=am.target,ak=am.anchors;if(typeof ai=="string"){aj.push(V(ai))}else{an(ai,aj)}if(typeof ar=="string"){aq.push(V(ar))}else{an(ar,aq)}var al=b.extend(am,{source:null,target:null,anchors:null});for(var ap=0;ap<aj.length;ap++){for(var ao=0;ao<aq.length;ao++){var au=b.addEndpoint(aj[ap],b.extend({anchor:b.makeDynamicAnchor(av)},ah));var at=b.addEndpoint(aq[ao],b.extend({anchor:b.makeDynamicAnchor(av)},ah));j.connect(b.extend(al,{sourceEndpoint:au,targetEndpoint:at}))}}};this.connect=function(ak){var ai=b.extend({},ak);if(ak.uuids){var ah=function(al){var am=G(ak.uuids[al]);if(!am){throw ("Endpoint with UUID "+ak.uuids[al]+" not found.")}return am};ai.sourceEndpoint=ah(0);ai.targetEndpoint=ah(1)}if(ai.sourceEndpoint&&ai.sourceEndpoint.isFull()){l("could not add connection; source endpoint is full");return}if(ai.targetEndpoint&&ai.targetEndpoint.isFull()){l("could not add connection; target endpoint is full");return}var aj=new n(ai);B(s,aj.scope,aj);K("jsPlumbConnection",{source:aj.source,target:aj.target,sourceId:aj.sourceId,targetId:aj.targetId,sourceEndpoint:aj.endpoints[0],targetEndpoint:aj.endpoints[1]});ae(aj.source);return aj};var O=function(ah){K("jsPlumbConnectionDetached",{source:ah.source,target:ah.target,sourceId:ah.sourceId,targetId:ah.targetId,sourceEndpoint:ah.endpoints[0],targetEndpoint:ah.endpoints[1]})};this.detach=function(ak,ai){if(arguments.length==2){var aj=function(al){if((al.sourceId==ak&&al.targetId==ai)||(al.targetId==ak&&al.sourceId==ai)){P(al.canvas,al.container);al.endpoints[0].removeConnection(al);al.endpoints[1].removeConnection(al);u(s,al.scope,al);O(al);return true}};D(ak,aj)}else{if(arguments.length==1){var ah=b.extend({},ak);if(ah.uuids){G(ah.uuids[0]).detachFrom(G(ah.uuids[1]))}else{if(ah.sourceEndpoint&&ah.targetEndpoint){ah.sourceEndpoint.detachFrom(ah.targetEndpoint)}else{ak=ag(ah.source);ai=ag(ah.target);var aj=function(al){if((al.sourceId==ak&&al.targetId==ai)||(al.targetId==ak&&al.sourceId==ai)){P(al.canvas,al.container);al.endpoints[0].removeConnection(al);al.endpoints[1].removeConnection(al);u(s,al.scope,al);O(al);return true}};D(ak,aj)}}}}};this.detachAll=function(ak){var an=o(ak,"id");var ah=U[an];if(ah&&ah.length){for(var aj=0;aj<ah.length;aj++){var am=ah[aj].connections.length;if(am>0){for(var ai=0;ai<am;ai++){var al=ah[aj].connections[0];P(al.canvas,al.container);al.endpoints[0].removeConnection(al);al.endpoints[1].removeConnection(al);u(s,al.scope,al);O(al)}}}}};this.detachEverything=function(){for(var am in U){var ah=U[am];if(ah&&ah.length){for(var aj=0;aj<ah.length;aj++){var al=ah[aj].connections.length;if(al>0){for(var ai=0;ai<al;ai++){var ak=ah[aj].connections[0];P(ak.canvas,ak.container);ak.endpoints[0].removeConnection(ak);ak.endpoints[1].removeConnection(ak);O(ak)}}}}}delete s;s={}};this.draggable=function(aj,ah){if(typeof aj=="object"&&aj.length){for(var ai=0;ai<aj.length;ai++){var ak=V(aj[ai]);if(ak){x(ak,true,ah)}}}else{var ak=V(aj);if(ak){x(ak,true,ah)}}};this.extend=function(ai,ah){return b.CurrentLibrary.extend(ai,ah)};this.getConnections=function(aq){var ah={};aq=aq||{};var ap=function(ar){var at=[];if(ar){if(typeof ar=="string"){at.push(ar)}else{at=ar}}return at};var ao=ap(aq.scope);var ai=ap(aq.source);var am=ap(aq.target);var aj=function(at,ar){return at.length>0?Q(at,ar)!=-1:true};for(var al in s){if(aj(ao,al)){ah[al]=[];for(var ak=0;ak<s[al].length;ak++){var an=s[al][ak];if(aj(ai,an.sourceId)&&aj(am,an.targetId)){ah[al].push({sourceId:an.sourceId,targetId:an.targetId,source:an.source,target:an.target,sourceEndpoint:an.endpoints[0],targetEndpoint:an.endpoints[1]})}}}}return ah};this.getDefaultScope=function(){return g};this.getEndpoint=G;this.getId=ag;this.hide=function(ah){ab(ah,"none")};this.makeAnchor=function(ah,ao,ak,an,aj,am){var al={};if(arguments.length==1){b.extend(al,ah)}else{al={x:ah,y:ao};if(arguments.length>=4){al.orientation=[arguments[2],arguments[3]]}if(arguments.length==6){al.offsets=[arguments[4],arguments[5]]}}var ai=new M(al);ai.clone=function(){return new M(al)};return ai};this.makeDynamicAnchor=function(ah){return new J(ah)};this.repaint=function(ai){var aj=function(ak){var al=V(ak);ae(al)};if(typeof ai=="object"){for(var ah=0;ah<ai.length;ah++){aj(ai[ah])}}else{aj(ai)}};this.repaintEverything=function(){for(var ah in U){ae(V(ah))}};this.removeAllEndpoints=function(aj){var ah=o(aj,"id");b.detachAll(ah);var ak=U[ah];for(var ai in ak){P(ak[ai].canvas,ak[ai].getElement())}U[ah]=[]};this.removeEveryEndpoint=function(){for(var aj in U){var ah=U[aj];if(ah&&ah.length){for(var ai=0;ai<ah.length;ai++){P(ah[ai].canvas,ah[ai].container)}}}delete U;U={}};this.removeEndpoint=function(ai,ak){var ah=o(ai,"id");var aj=U[ah];if(aj){if(u(U,ah,ak)){P(ak.canvas,ak.getElement())}}};this.reset=function(){this.detachEverything();this.removeEveryEndpoint();this.clearCache()};this.setAutomaticRepaint=function(ah){f=ah};this.setDefaultNewCanvasSize=function(ah){L=ah};this.setDefaultScope=function(ah){g=ah};this.setDraggable=c;this.setDraggableByDefault=function(ah){H=ah};this.setDebugLog=function(ah){m=ah};this.setRepaintFunction=function(ah){Y=ah};this.show=function(ah){ab(ah,"block")};this.sizeCanvas=function(aj,ah,al,ai,ak){if(aj){aj.style.height=ak+"px";aj.height=ak;aj.style.width=ai+"px";aj.width=ai;aj.style.left=ah+"px";aj.style.top=al+"px"}};this.getTestHarness=function(){return{endpointCount:function(ah){var ai=U[ah];return ai?ai.length:0},connectionCount:function(ah){ah=ah||g;var ai=s[ah];return ai?ai.length:0},findIndex:Q,getId:ag}};this.toggle=e;this.toggleVisible=e;this.toggleDraggable=v;this.unload=function(){delete U;delete F;delete y;delete I;delete T};this.wrap=aa;this.addListener=t};var b=window.jsPlumb=new a();b.getInstance=function(d){var c=new a();if(d){b.extend(c.Defaults,d)}return c}})();(function(){jsPlumb.Anchors.TopCenter=jsPlumb.makeAnchor(0.5,0,0,-1);jsPlumb.Anchors.BottomCenter=jsPlumb.makeAnchor(0.5,1,0,1);jsPlumb.Anchors.LeftMiddle=jsPlumb.makeAnchor(0,0.5,-1,0);jsPlumb.Anchors.RightMiddle=jsPlumb.makeAnchor(1,0.5,1,0);jsPlumb.Anchors.Center=jsPlumb.makeAnchor(0.5,0.5,0,0);jsPlumb.Anchors.TopRight=jsPlumb.makeAnchor(1,0,0,-1);jsPlumb.Anchors.BottomRight=jsPlumb.makeAnchor(1,1,0,1);jsPlumb.Anchors.TopLeft=jsPlumb.makeAnchor(0,0,0,-1);jsPlumb.Anchors.BottomLeft=jsPlumb.makeAnchor(0,1,0,1);jsPlumb.Anchors.AutoDefault=function(){return jsPlumb.makeDynamicAnchor([jsPlumb.Anchors.TopCenter,jsPlumb.Anchors.RightMiddle,jsPlumb.Anchors.BottomCenter,jsPlumb.Anchors.LeftMiddle])};jsPlumb.Defaults.DynamicAnchors=[jsPlumb.Anchors.TopCenter,jsPlumb.Anchors.RightMiddle,jsPlumb.Anchors.BottomCenter,jsPlumb.Anchors.LeftMiddle];jsPlumb.Connectors.Straight=function(){var m=this;var g=null;var c,h,k,j,i,d,l,f,e,b,a;this.compute=function(q,E,A,n,u,p){var D=Math.abs(q[0]-E[0]);var t=Math.abs(q[1]-E[1]);var v=false,r=false;var s=0.45*D,o=0.45*t;D*=1.9;t*=1.9;var B=Math.min(q[0],E[0])-s;var z=Math.min(q[1],E[1])-o;var C=Math.max(2*u,p);if(D<C){D=C;B=q[0]+((E[0]-q[0])/2)-(C/2);s=(D-Math.abs(q[0]-E[0]))/2}if(t<C){t=C;z=q[1]+((E[1]-q[1])/2)-(C/2);o=(t-Math.abs(q[1]-E[1]))/2}f=q[0]<E[0]?s:D-s;e=q[1]<E[1]?o:t-o;b=q[0]<E[0]?D-s:s;a=q[1]<E[1]?t-o:o;g=[B,z,D,t,f,e,b,a];j=b-f,i=(a-e);c=i/j,h=-1/c;k=-1*((c*f)-e);d=Math.atan(c);l=Math.atan(h);return g};this.paint=function(o,n){n.beginPath();n.moveTo(o[4],o[5]);n.lineTo(o[6],o[7]);n.stroke()};this.pointOnPath=function(n){var o=f+(n*j);var p=c==Infinity?o+k:(c*o)+k;return[o,p]};this.gradientAtPoint=function(n){return c};this.pointAlongPathFrom=function(o,t){var r=m.pointOnPath(o);var q=t>0?1:-1;var s=Math.abs(t*Math.sin(d));if(e>a){s=s*-1}var n=Math.abs(t*Math.cos(d));if(f>b){n=n*-1}return[r[0]+(q*n),r[1]+(q*s)]};this.perpendicularToPathAt=function(r,v,s){var t=m.pointAlongPathFrom(r,v);var q=m.gradientAtPoint(t.location);var o=Math.atan(-1/q);var u=s/2*Math.sin(o);var n=s/2*Math.cos(o);return[[t[0]+n,t[1]+u],[t[0]-n,t[1]-u]]};this.createGradient=function(o,n){return n.createLinearGradient(o[4],o[5],o[6],o[7])}};jsPlumb.Connectors.Bezier=function(a){var n=this;this.majorAnchor=a||150;this.minorAnchor=10;var g=null;this._findControlPoint=function(y,o,t,w,q){var v=w.getOrientation(),x=q.getOrientation();var s=v[0]!=x[0]||v[1]==x[1];var r=[];var z=n.majorAnchor,u=n.minorAnchor;if(!s){if(v[0]==0){r.push(o[0]<t[0]?y[0]+u:y[0]-u)}else{r.push(y[0]-(z*v[0]))}if(v[1]==0){r.push(o[1]<t[1]?y[1]+u:y[1]-u)}else{r.push(y[1]+(z*x[1]))}}else{if(x[0]==0){r.push(t[0]<o[0]?y[0]+u:y[0]-u)}else{r.push(y[0]+(z*x[0]))}if(x[1]==0){r.push(t[1]<o[1]?y[1]+u:y[1]-u)}else{r.push(y[1]+(z*v[1]))}}return r};var m,k,h,b,h,e,d,c,j,f;this.compute=function(I,r,G,p,o,C){o=o||0;j=Math.abs(I[0]-r[0])+o;f=Math.abs(I[1]-r[1])+o;d=Math.min(I[0],r[0])-(o/2);c=Math.min(I[1],r[1])-(o/2);h=I[0]<r[0]?j-(o/2):(o/2);e=I[1]<r[1]?f-(o/2):(o/2);b=I[0]<r[0]?(o/2):j-(o/2);_ty=I[1]<r[1]?(o/2):f-(o/2);m=n._findControlPoint([h,e],I,r,G,p);k=n._findControlPoint([b,_ty],r,I,p,G);var B=Math.min(h,b);var A=Math.min(m[0],k[0]);var w=Math.min(B,A);var H=Math.max(h,b);var E=Math.max(m[0],k[0]);var t=Math.max(H,E);if(t>j){j=t}if(w<0){d+=w;var x=Math.abs(w);j+=x;m[0]+=x;h+=x;b+=x;k[0]+=x}var F=Math.min(e,_ty);var D=Math.min(m[1],k[1]);var s=Math.min(F,D);var y=Math.max(e,_ty);var v=Math.max(m[1],k[1]);var q=Math.max(y,v);if(q>f){f=q}if(s<0){c+=s;var u=Math.abs(s);f+=u;m[1]+=u;e+=u;_ty+=u;k[1]+=u}if(C&&j<C){var z=(C-j)/2;j=C;d-=z;h=h+z;b=b+z;m[0]=m[0]+z;k[0]=k[0]+z}g=[d,c,j,f,h,e,b,_ty,m[0],m[1],k[0],k[1]];return g};this.paint=function(p,o){o.beginPath();o.moveTo(p[4],p[5]);o.bezierCurveTo(p[8],p[9],p[10],p[11],p[6],p[7]);o.stroke()};var i=function(p){function s(u){return u*u}function r(u){return 2*u*(1-u)}function q(u){return(1-u)*(1-u)}var o=h*s(p)+m[0]*r(p)+k[0]*q(p);var t=e*s(p)+m[1]*r(p)+k[1]*q(p);return[o,t]};this.pointOnPath=function(p){function t(v){return v*v*v}function s(v){return 3*v*v*(1-v)}function r(v){return 3*v*(1-v)*(1-v)}function q(v){return(1-v)*(1-v)*(1-v)}var o=h*t(p)+m[0]*s(p)+k[0]*r(p)+b*q(p);var u=e*t(p)+m[1]*s(p)+k[1]*r(p)+_ty*q(p);return[o,u]};this.gradientAtPoint=function(p){var t=n.pointOnPath(p);var s=i(p);var o=s[1]-t[1],q=s[0]-t[0];var r=Math.atan(o/q);return r};var l=function(p,v){var s=function(x,w){return Math.sqrt(Math.pow(x[0]-w[0],2)+Math.pow(x[1]-w[1],2))};var r=n.pointOnPath(p),o=0,q=p,t=v>0?1:-1,u=null;while(o<Math.abs(v)){q+=(0.005*t);u=n.pointOnPath(q);o+=s(u,r);r=u}return{point:u,location:q}};this.pointAlongPathFrom=function(o,p){return l(o,p).point};this.perpendicularToPathAt=function(s,w,t){var u=l(s,w);var r=n.gradientAtPoint(u.location);var q=Math.atan(-1/r);var v=t/2*Math.sin(q);var o=t/2*Math.cos(q);return[[u.point[0]+o,u.point[1]+v],[u.point[0]-o,u.point[1]-v]]};this.createGradient=function(q,o,p){return(p)?o.createLinearGradient(q[4],q[5],q[6],q[7]):o.createLinearGradient(q[6],q[7],q[4],q[5])}};jsPlumb.Endpoints.Dot=function(f){f=f||{radius:10};var d=this;this.radius=f.radius;var e=0.5*this.radius;var b=this.radius/3;var c=function(g){try{return parseInt(g)}catch(h){if(g.substring(g.length-1)=="%"){return parseInt(g.substring(0,g-1))}}};var a=function(i){var g=e;var h=b;if(i.offset){g=c(i.offset)}if(i.innerRadius){h=c(i.innerRadius)}return[g,h]};this.paint=function(w,l,n,m,p){var t=m.radius||d.radius;var v=w[0]-t;var u=w[1]-t;jsPlumb.sizeCanvas(n,v,u,t*2,t*2);var z=n.getContext("2d");var k=jsPlumb.extend({},m);if(k.fillStyle==null){k.fillStyle=p.strokeStyle}jsPlumb.extend(z,k);var j=(/MSIE/.test(navigator.userAgent)&&!window.opera);if(m.gradient&&!j){var o=a(m.gradient);var r=l[1]==1?o[0]*-1:o[0];var h=l[0]==1?o[0]*-1:o[0];var s=z.createRadialGradient(t,t,t,t+h,t+r,o[1]);for(var q=0;q<m.gradient.stops.length;q++){s.addColorStop(m.gradient.stops[q][0],m.gradient.stops[q][1])}z.fillStyle=s}z.beginPath();z.arc(t,t,t,0,Math.PI*2,true);z.closePath();z.fill()}};jsPlumb.Endpoints.Rectangle=function(b){b=b||{width:20,height:20};var a=this;this.width=b.width;this.height=b.height;this.paint=function(c,h,f,k,m){var p=k.width||a.width;var n=k.height||a.height;var l=c[0]-(p/2);var j=c[1]-(n/2);jsPlumb.sizeCanvas(f,l,j,p,n);var q=f.getContext("2d");var s=jsPlumb.extend({},k);if(s.fillStyle==null){s.fillStyle=m.strokeStyle}jsPlumb.extend(q,s);var o=(/MSIE/.test(navigator.userAgent)&&!window.opera);if(k.gradient&&!o){var e=h[1]==1?n:h[1]==0?n/2:0;var d=h[1]==-1?n:h[1]==0?n/2:0;var v=h[0]==1?p:h[0]==0?p/2:0;var t=h[0]==-1?p:h[0]==0?n/2:0;var u=q.createLinearGradient(v,e,t,d);for(var r=0;r<k.gradient.stops.length;r++){u.addColorStop(k.gradient.stops[r][0],k.gradient.stops[r][1])}q.fillStyle=u}q.beginPath();q.rect(0,0,p,n);q.closePath();q.fill()}};jsPlumb.Endpoints.Triangle=function(b){b=b||{width:15,height:15};var a=this;this.width=b.width;this.height=b.height;this.paint=function(m,d,f,e,h){var c=e.width||a.width;var n=e.height||a.height;var l=m[0]-c/2;var k=m[1]-n/2;jsPlumb.sizeCanvas(f,l,k,c,n);var o=f.getContext("2d");var j=0,i=0,g=0;if(d[0]==1){j=c;i=n;g=180}if(d[1]==-1){j=c;g=90}if(d[1]==1){i=n;g=-90}o.fillStyle=e.fillStyle;o.translate(j,i);o.rotate(g*Math.PI/180);o.beginPath();o.moveTo(0,0);o.lineTo(c/2,n/2);o.lineTo(0,n);o.closePath();o.fill()}};jsPlumb.Endpoints.Image=function(d){var a=this;this.img=new Image();var b=false;this.img.onload=function(){a.ready=true};this.img.src=d.url;var c=function(l,f,h,g,i){var e=a.img.width||g.width;var m=a.img.height||g.height;var k=l[0]-(e/2);var j=l[1]-(m/2);jsPlumb.sizeCanvas(h,k,j,e,m);var n=h.getContext("2d");n.drawImage(a.img,0,0)};this.paint=function(h,e,f,i,g){if(a.ready){c(h,e,f,i,g)}else{window.setTimeout(function(){a.paint(h,e,f,i,g)},200)}}};jsPlumb.Overlays.Arrow=function(c){c=c||{};var i=this;var b=c.length||20;var a=c.width||20;var g=c.fillStyle||"black";var f=c.strokeStyle;var d=c.lineWidth||1;this.loc=c.location||0.5;var h=c.foldback||0.623;var e=function(j,l){if(h==0.5){return j.pointOnPath(l)}else{var k=0.5-h;return j.pointAlongPathFrom(l,b*k)}};this.computeMaxSize=function(){return a*1.5};this.draw=function(m,l){var q=m.pointAlongPathFrom(i.loc,b/2);var o=m.pointAlongPathFrom(i.loc,-b/2),k=o[0],j=o[1];var n=m.perpendicularToPathAt(i.loc,-b/2,a);var p=e(m,i.loc);l.lineWidth=d;l.beginPath();l.moveTo(q[0],q[1]);l.lineTo(n[0][0],n[0][1]);l.lineTo(p[0],p[1]);l.lineTo(n[1][0],n[1][1]);l.lineTo(q[0],q[1]);l.closePath();if(f){l.strokeStyle=f;l.stroke()}l.fillStyle=g;l.fill()}};jsPlumb.Overlays.PlainArrow=function(b){b=b||{};var a=jsPlumb.extend(b,{foldback:1});jsPlumb.Overlays.Arrow.call(this,a)};jsPlumb.Overlays.Diamond=function(c){c=c||{};var a=c.length||40;var b=jsPlumb.extend(c,{length:a/2,foldback:2});jsPlumb.Overlays.Arrow.call(this,b)};jsPlumb.Overlays.Label=function(f){this.labelStyle=f.labelStyle||jsPlumb.Defaults.LabelStyle;this.label=f.label;var b=this;var a=null,e=null,c=null,d=null;this.location=f.location||0.5;this.computeMaxSize=function(i,g){if(c){g.save();if(b.labelStyle.font){g.font=b.labelStyle.font}var j=g.measureText(c).width;var k=g.measureText("M").width;d=b.labelStyle.padding||0.25;a=j+(2*j*d);e=k+(2*k*d);g.restore();return Math.max(a,e)*1.5}return 0};this.draw=function(i,g){c=typeof b.label=="function"?b.label(b):b.label;if(c){if(b.labelStyle.font){g.font=b.labelStyle.font}var j=g.measureText(c).width;var k=g.measureText("M").width;d=b.labelStyle.padding||0.25;a=j+(2*j*d);e=k+(2*k*d);var l=i.pointOnPath(b.location);if(b.labelStyle.font){g.font=b.labelStyle.font}if(b.labelStyle.fillStyle){g.fillStyle=b.labelStyle.fillStyle}else{g.fillStyle="rgba(0,0,0,0)"}g.fillRect(l[0]-(a/2),l[1]-(e/2),a,e);if(b.labelStyle.color){g.fillStyle=b.labelStyle.color}g.textBaseline="middle";g.textAlign="center";g.fillText(c,l[0],l[1]);if(b.labelStyle.borderWidth>0){g.strokeStyle=b.labelStyle.borderStyle||"black";g.strokeRect(l[0]-(a/2),l[1]-(e/2),a,e)}}}}})();(function(a){a.fn.plumb=function(b){var b=a.extend({},b);return this.each(function(){var c=a.extend({source:a(this)},b);jsPlumb.connect(c)})};a.fn.detach=function(b){return this.each(function(){if(b){var d=a(this).attr("id");if(typeof b=="string"){b=[b]}for(var c=0;c<b.length;c++){jsPlumb.detach(d,b[c])}}})};a.fn.detachAll=function(){return this.each(function(){var b=a(this).attr("id");jsPlumb.detachAll(b)})};a.fn.addEndpoint=function(b){var c=[];this.each(function(){c.push(jsPlumb.addEndpoint(a(this).attr("id"),b))});return c[0]};a.fn.addEndpoints=function(b){var c=[];return this.each(function(){var f=jsPlumb.addEndpoints(a(this).attr("id"),b);for(var d=0;d<f.length;d++){c.push(f[d])}})};a.fn.removeEndpoint=function(b){this.each(function(){jsPlumb.removeEndpoint(a(this).attr("id"),b)})}})(jQuery);(function(a){jsPlumb.CurrentLibrary={dragEvents:{start:"start",stop:"stop",drag:"drag",step:"step",over:"over",out:"out",drop:"drop",complete:"complete"},bind:function(b,c,d){b=jsPlumb.CurrentLibrary.getElementObject(b);b.bind(c,d)},appendElement:function(c,b){jsPlumb.CurrentLibrary.getElementObject(b).append(c)},extend:function(c,b){return a.extend(c,b)},getElementObject:function(b){return typeof(b)=="string"?a("#"+b):a(b)},getOffset:function(b){return b.offset()},getSize:function(b){return[b.outerWidth(),b.outerHeight()]},getAttribute:function(b,c){return b.attr(c)},setAttribute:function(c,d,b){c.attr(d,b)},addClass:function(c,b){c.addClass(b)},initDraggable:function(c,b){b.helper=null;b.scope=b.scope||jsPlumb.Defaults.Scope;c.draggable(b)},isDragSupported:function(c,b){return c.draggable},setDraggable:function(c,b){c.draggable("option","disabled",!b)},initDroppable:function(c,b){b.scope=b.scope||jsPlumb.Defaults.Scope;c.droppable(b)},isDropSupported:function(c,b){return c.droppable},animate:function(d,c,b){d.animate(c,b)},getUIPosition:function(b){var c=b[1];return c.offset||c.absolutePosition},getDragObject:function(b){return b[1].draggable},removeElement:function(b,c){jsPlumb.CurrentLibrary.getElementObject(b).remove()},getScrollLeft:function(b){return b.scrollLeft()},getScrollTop:function(b){return b.scrollTop()},setOffset:function(b,c){jsPlumb.CurrentLibrary.getElementObject(b).offset(c)}}})(jQuery);