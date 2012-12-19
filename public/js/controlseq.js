//////////////////////////////////////////////

var socket = io.connect();

//////////////////////////////////////////////
// Sequencer Controls

function startSeq() { socket.emit("startSeq") }
function stopSeq() { socket.emit("stopSeq") }
function resetSeq() { socket.emit("resetSeq") }


//////////////////////////////////////////////
// Chron Controls

function stopWatch(value) { socket.emit("stopWatch", value) }

//////////////////////////////////////////////
// Metronome Controls

//socket.on("metroPulse", metronomeTick);
function metroStart(pulse) {  socket.emit("metroStart", pulse);}
function metroStop() {  socket.emit("metroStop");}

//////////////////////////////////////////////
// Latency "Pong"

socket.on("timeFromServer", function(n) { 
    socket.emit("clientTimeResponse",n);
    //console.log(n);
});
socket.on("latencyFromServer", function(latency) {
    $("#client_latency").text(latency+"ms.")
});

function getLatencies(x) { socket.emit("getLatencies", x); }

//////////////////////////////////////////////
// Chronometer Controls

function startChr() { socket.emit("startChr"); }
function stopChr() { socket.emit("stopChr"); }
function resetChr() { 
    socket.emit("resetChr"); 
    $("div#client_chronometer").text("00:00:00.0");
}
socket.on("chronFromServer", function(chron){
    //console.log(chron);
    $("div#client_chronometer").text(chron);
});

//////////////////////////////////////////////
// SEQUENCER MONITOR

socket.on("pageFlipfromserver", sequenceMonitor);
function sequenceMonitor(group, unit,time,mm,seq){
    var n=6; var x=seq-1; var off=((x%n)+n)%n // thanks claudiusmaximus
    seqnow = "#"+group+"magicsquare"+seq
    turnmeoff = "#"+group+"magicsquare"+off 
    $(seqnow).css('background', 'transparent');
    $(turnmeoff).css('background', 'transparent')
    //console.log("#"+group+"magicsquare"+seq +"     time: " +time + "   %:" + off)

}

socket.on("counterText", function(group,unit,counter){
    $("#"+group+"magicsquare"+unit).text(counter);
    //console.log(group+"magicsquare"+unit+"count:"+counter)
});


//////////////////////////////////////////////
// CLient Popup window code

function newPopup(url) {
    popupWindow = window.open(
	url,'popUpWindow','height=400,width=800,left=10,top=10,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,titlebar=no,directories=no,status=yes')}