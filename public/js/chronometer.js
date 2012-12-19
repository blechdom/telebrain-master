////////////////////////////////////////////
// Chronometer
////////////////////////////////////////////

// number padding: 0 to 00
function pad(number) { return (number < 10 ? '0' : '') + number }

function xdateTime() { 
    var xdatetime= new Date(); 
    var now=xdatetime.toString()
    return now
}


// the chronometer initial states
function zeroChron(){
    zecsec = 0;  seconds = 0; 
    mins = 0;  hours = 0;
    zero = pad(hours) +":"+pad(mins)+ ':'+ pad(seconds)
    chron = zero
   return zero
}

zeroChron()

function chronometer(divisor) {
    zecsec += divisor;       // set tenths of a second
    if(zecsec > 9) { zecsec = 0; seconds += 1;}
    if(seconds > 59) { seconds = 0;mins += 1;}
    if(mins > 59) { mins = 0; hours += 1; }
    chron = pad(hours) +":"+pad(mins)+ ':'+ pad(seconds)+ ":"+ zecsec
    chronsec = pad(hours) +":"+pad(mins)+ ':'+ pad(seconds)
    if ( divisor !== 1000 ){
	return chron
    }
    else {    return chronsec }
};

exports.chronometer =chronometer;
exports.xdateTime = xdateTime;
exports.zeroChron = zeroChron;
