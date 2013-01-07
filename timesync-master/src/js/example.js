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
*
* Javascript usage
* 1. Add a reference to the required dependencies: 
*   Jquery 1.5.* or later
*   Non required, but to make it easier to parse dates on Javascript, we use the https://github.com/csnover/js-iso8601, but is up
*   to you.
* 2. Add a reference to the file on your page src\foranyone.timeSync.js:
*   <script src="yourpath/4n1.timeSync.js" type="text/javascript"></script>
* 3. Set the timeSync options if necessary. Below is the list of options with their default values: 
*/

// Used to write debug data 
foranyone.timeSync.debug = false;

// The url that returns the desired computer time. This request should only return the server date in a format supported by the Date.parse() method. For more details check 
// go to http://codemadesimple.wordpress.com/2012/06/18/timesync-with-asp-net-mvc-4/
foranyone.timeSync.url = "www.somedomain.com/urlThatWillReturnTheTime";

// The http method used 
foranyone.timeSync.httpMethod = "POST";

// The request content type 
foranyone.timeSync.contentType = "application/json; charset=utf-8";

// Call the foranyone.timeSync.getTimeDifference function. It will return you positive or negative difference in milliseconds. 
// It will also set the foranyone.timeSync.timeDifference variable with the value returned (easier to reference in other scripts):
var timeDifference = foranyone.timeSync.getTimeDifference();

// This is true
if (timeDifference != foranyone.timeSync.timeDifference)
    throw "Values should be equal!"