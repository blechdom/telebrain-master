
(function (root) {

  var ntp  = {}
    , offsets = []
    , socket;

  ntp.init = function (sock, options) {
    options = options || {};
    console.log("ntp init");
    socket = sock;
    socket.on('ntp_server_sync', onSync);
    setInterval(sync, options.interval || 1000);
  };

  var onSync = function (data) {

    var diff = (data.t1 - data.t0) + (data.t1 - Date.now()) / 2;

    offsets.unshift(diff);

    if (offsets.length > 10)
      offsets.pop();
  };


  ntp.offset = function () {
    var sum = 0;
    for (var i = 0; i < offsets.length; i++)
      sum += offsets[i];

    sum /= offsets.length;

    return sum;
  };


  var sync = function () {
    socket.emit('ntp_client_sync', { t0 : Date.now() });
  };

  // AMD/requirejs
  if (typeof define === 'function' && define.amd) {
    define('ntp', [], function () {
      return ntp;
    });
  } else {
    root.ntp = ntp;
  }

})(window);