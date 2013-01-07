/*!
* 4N1 timeSync JavaScript Library v0.1.0
* http://www.4n1.pt/
*
* THIS CODE IS PROVIDED AS IS WITH NO WARRANTY EXPRESSED OR IMPLIED. 
* 4N1 AM NOT LIABLE FOR ANYTHING THAT RESULTS FROM YOUR USE OF THIS CODE. 
* YOU CAN DISTRIBUTE THIS FREELY PROVIDED THE HEADER AND THE README FILE.
*
* Copyright 2012, 4N1
*
* Date: Mon Jun 18 19:11:00 2012 +0100
*/
foranyone = window.foranyone || {};
foranyone.timeSync = {};
foranyone.timeSync.debug = false;
foranyone.timeSync.url = "";
foranyone.timeSync.httpMethod = "POST";
foranyone.timeSync.dataType = "json";
foranyone.timeSync.contentType = "application/json; charset=utf-8";

foranyone.timeSync.getTimeDifference = function () {

    foranyone.timeSync.clientTime = new Date();
    foranyone.timeSync.timeDifference = 0;
    foranyone.timeSync.roundTrip = 0;
    foranyone.timeSync.roundTripStart = new Date();
    foranyone.timeSync.serverTime = null;

    $.ajax({
        type: foranyone.timeSync.httpMethod,
        url: foranyone.timeSync.url,
        dataType: foranyone.timeSync.dataType,
        contentType: foranyone.timeSync.contentType,
        success: function (data) {

            foranyone.timeSync.roundTrip = new Date().getTime() - foranyone.timeSync.roundTripStart.getTime();

            foranyone.timeSync.serverTime = new Date(Date.parse(data));

            foranyone.timeSync.timeDifference = (foranyone.timeSync.serverTime.getTime() - foranyone.timeSync.roundTrip) - foranyone.timeSync.clientTime.getTime();

            if (foranyone.timeSync.debug) {

                document.write("Server time:" + foranyone.timeSync.serverTime.getTime());
                document.write("<br/>Client time: " + foranyone.timeSync.clientTime.getTime());
                document.write("<br/>Roundtrip: " + foranyone.timeSync.roundTrip);
                document.write("<br/>Time diff: " + foranyone.timeSync.timeDifference);
            }
        },
        async: false
    });

    return foranyone.timeSync.timeDifference;
}