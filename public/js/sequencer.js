    ////////////////////////////////////////////
    // magic square sequencer
    ////////////////////////////////////////////
//    var score = require('./score');
//    var c = require('./chronometer');
var nodescore = require('./nodescore');
var sio = nodescore.sio 
var io = nodescore.io


//    var mm = score.mm
var sequencerState = 0;



io.sockets.on('connection', function (socket) {  
    
  //  var srcsqr = score.srcsqr
    var srcsqr = []
    srcsqr[0] = [22,21,24,25,06,07];
    srcsqr[1] = [20,23,27,26,05,04];
    srcsqr[2] = [03,00,17,16,35,34];
    srcsqr[3] = [01,02,19,18,33,32];

//    var seqA = score.seqA
//    var seqB = score.seqB
//    var seqC = score.seqC
//    var seqD = score.seqD

    var seqA = { metrobeat:0, voice:1, name: "A", counter: 0, mm: 60, beatsinbar: 4, durations: srcsqr[0], units: [1,2,3,1,2,4]};
    var seqB = { metrobeat:0, voice:2, name: "B", counter: 0, mm: 120, beatsinbar: 4, durations: srcsqr[1], units: [3,2,1,1,2,3]};
    var seqC = { metrobeat:0, voice:3, name: "C", counter: 0, mm: 90, beatsinbar: 4, durations: srcsqr[2], units: [4,5,6,5,4,2]};
    var seqD = { metrobeat:0, voice:4, name: "D", counter: 0, mm: 105, beatsinbar: 4, durations: srcsqr[3], units: [2,3,4,2,3,1]};
  

     var countdowntick = function(seq){
	// var tempoms = Math.floor(60000/seq.mm)
	 var tempoms = Math.floor(60000/seq.mm)
	 //console.log(tempoms)
	 var timemultiplier=1
	 var outcount = 4; var incount=4;
	 var time = ((seq.durations[seq.counter]+1) *timemultiplier) + 30000 + (outcount*tempoms);
	 var time = Math.floor(time)
	 var ztime = time; 
	 var totaltime = Math.floor(time/tempoms)
	 var unit = seq.units[seq.counter];
	 
	 // initiate first page here
	 socket.broadcast.emit("pageFlipfromserver", seq.voice, unit, time, seq.mm,seq.counter);
	 socket.emit("pageFlipfromserver", seq.voice, unit, time, seq.mm,seq.counter);
	 
	 function sequenCer() {
	 //    console.log(ztime)
	     if (ztime >= 0 ){
		 
		// basic unit is still the second/1000ms - change this to tempoms? no i dont think so
		// count in and count out
		////////////////////////////////////////////
		
		 var counter = Math.floor(ztime/tempoms)
		 //console.log(counter)
		 if (counter >= 0 ){
		     socket.broadcast.emit('counterText', seq.voice, seq.counter, counter);
		     socket.emit('counterText', seq.voice, seq.counter, counter);
		     
		     if (counter <= outcount ) {              
			 socket.broadcast.emit('countinFromServer', seq.voice, counter, "","stop in: ", "red", "transparent");
		     }
		     
		     if (counter > (totaltime)-incount  && counter <= totaltime ) {
			 socket.broadcast.emit('countinFromServer', seq.voice, counter-(totaltime-incount), "","play in: ", "green","transparent");
			 socket.emit('countinFromServer', seq.voice, counter-(totaltime-incount), "","play in: ", "green","transparent");
			 
		     }
		     
		     if (counter == (totaltime)-incount ) {
			 socket.broadcast.emit('countinFromServer', seq.voice, "+", "","playing.. ", "green","transparent");
			socket.emit('countinFromServer', seq.voice, "+", "","playing.. ", "green","transparent");
		     }
		     
		     // remove displayed number with " " at end of both countin/out
		     
		     if (counter == 0 ) {
			 socket.broadcast.emit('countinFromServer', seq.voice, "", "","", "green","transparent");
			 socket.broadcast.emit('counterText', seq.voice, seq.counter, "");
			 socket.emit('counterText', seq.voice, seq.counter, "");
		     }
		 }		    
				
		 // on each beat do:
		 
		 // push out the pulse to metronome	
		 seq.metrobeat = (seq.metrobeat+1)%seq.beatsinbar ;
     		 socket.broadcast.emit('metroPulse', tempoms, seq.voice,seq.metrobeat); 
		 socket.emit('metroPulse', tempoms, seq.voice,seq.metrobeat);
	     }
	     
	     // flip the page 
	     if (counter == 0){

		 seq.counter = (seq.counter + 1) % seq.durations.length	    		
		socket.broadcast.emit("pageFlipfromserver", seq.voice, unit, time, seq.mm,seq.counter);
		 //delete tockTock;	
		 step(seq);     
	     }
	     
	     // decrement the time 
	     ztime -= tempoms
	 }
	 
	 var pulse = setInterval(sequenCer, tempoms);
	 
	 socket.on('stopSeq', function () {
	     //donaldduck = mickeymouse + 7
	     sequenCer.clearInterval
	     console.log("sequencer stopping...")	    
	     // grrr why wont this clearInterval work
	     sequencerState = 0
	     clearInterval(pulse)
	     stopChr();
	 });

     };

    step = function (seq) {
	//clearInterval(seq.boo);
	//clearInterval(countdowntick);
	countdowntick(seq)
	sequencerState=1;
    };

startMss = function () {
	    step(seqA);step(seqB); step(seqC); step(seqD);	    
	    ztime =-1;
}

exports.startMss = startMss;
});



