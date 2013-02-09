'use strict';
/*
* jLiveTime
*   jQuery plugin for live timestamps, countdowns, time-ago, and timers.
*/
(function($){

    var lt = $.livetime = $.livetime || {};
    lt.version = '0.0.8';

    lt.localTimeOffset = null;
    var options = lt.options = lt.options || {};
    options.datetimeSelector = '[datetime]';
    options.datetimeAttribute = 'datetime';
    options.durationAttribute = 'data-duration';
    options.bpm = 'data-bpm';
    options.beats = 'data-beats';
    options.dateLabelSelector = '[data-time-label]';
    options.triggerRefreshComplete = true;
    options.serverTimeUrl = null; //'empty.txt';
    options.formats = options.formats || {};
    options.formats.seconds = options.formats.seconds || [
        [0, 'in td_hh:d_mm:d_ss'],
        ['td_hh:d_mm:d_ss ago']
    ];
    options.formats.beatsperminute = options.formats.beatsperminute || [
        [0, 'td_rrr Measures d_bb Beats d_tttt Ticks(ms)'],
        ['td_rrr Measures d_bb Beats d_tttt Ticks(ms)']
    ];
    options.formats.beatTicks = options.formats.beatTicks || 'd_tttt TICKS(ms)';
    options.formats.beatBlinker = options.formats.beatBlinker || 'd_bb BEATS';

    options.formats.measureBlinker = options.formats.measureBlinker || 'td_rrr MEASURES';

    options.formats.milliseconds = options.formats.milliseconds || [
        [0, 'in td_hh:d_mm:d_ss.d_fff'],
        ['td_hh:d_mm:d_ss.d_fff ago']
    ];
    options.formats.millisecondsonly = options.formats.millisecondsonly || [
        [0, 'in td_fff'],
        ['td_fff ago']
    ];

    options.formats.custom = options.formats.custom || [
            [-120, 'td_pp measures remaining'],
            [-30, 'td_rr bars remaining'],
            [-15, 'in a moment'],
            [-5, 'td_bb beats remaining'],
            [-4, 'Four!'],
            [-3, 'THREE!'],
            [-2, 'TWO!'],
            [-1, 'ONE!'],
            [0, 'ZERO!'],
            [3, 'Preparing'],
            [5, 'Almost ready'],
            [10, 'Working'],
            [14, 'Almost complete'],
            ['Completed']
        ];
    options.formats.fulldate = options.formats.fulldate || 'eee MMM d yyyy at h:mm:ss tt';
    options.formats.shortdate = options.formats.shortdate || 'MMM d yyyy';
    options.formats._default_tooltip = options.formats.fulldate;
    options.formats._in = options.formats._in || [[0,'in'],['']];
    options.formats.remaining = options.formats.remaining || [[0,'remaining'],['']];
    options.formats.ago = options.formats.ago || [[0,''],['ago']];
    options.formats.elapsed = options.formats.elapsed || [[0,''],['elapsed']];

    var padLeft = function(num, digits) {
        if (digits < 2) {
            return num;
        }
        var str = num+'';
        while (str.length < digits) {
            str = '0' + str;
        }
        return str;
    };

    var timeUnits = {};

    var parentTimeUnits = {
        M: 'y',
        w: 'M',
        d: 'M',
        e: 'w',
        h: 'd',
        m: 'h',
        s: 'm',
        f: 's',
        t: 'b',
        b: 'r',
        r: 'p',
        p: 'c'
    };

    var unitNames = {
        M: ['January','February','March','April','May','June','July','August','September','October','November','December'],
        e: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    };

    var log = (window.console && typeof window.console.log == 'function') ?
            function(){ console.log.call(console, arguments); } :
            function(){};

    var datetimeRegex = /^(\d{4})\-(\d{2})\-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(.*))?$/;
    var timezoneRegex = /^([+\-]?)(\d{2}):(\d{2})$/;

    // alternative strin date parsers, the first supported by browser will be used
    var dateStringParsers = [
        // use native constructor (fastest)
        function(str) {
            return new Date(str);
        },
        // use native constructor, allowing space instead of T
        function(str) {
            return new Date(str.slice(10,11)!==' ' ? str : str.slice(0,10) + 'T' + str.slice(11));
        },
        // use regex (slowest, but safe)
        function(str) {
            var match = datetimeRegex.exec(str);
            var timezoneOffset = 0;
            if (match) {
                // remove leading zeros
                for (var i=1; i < 8; i++) {
                    var matchString = match[i];
                    if (typeof matchString == 'string' && matchString.length > 1 && matchString.slice(0,1) === '0') {
                        match[i] = matchString.slice(0,-1).replace(/^0+/, '') + matchString.slice(-1);
                    }
                }
                if (typeof match[4] == 'undefined' || match[4] === '' || match[4] === null) {
                    return new Date(Date.UTC(parseInt(match[1]), parseInt(match[2])-1, parseInt(match[3])));
                }
                if (match[8] && match[8] !== 'Z' && match[8] !== 'GMT' && match[8] !== 'UTC') {
                    var timezoneMatch = timezoneRegex.exec(match[8]);
                    if (timezoneMatch) {
                        timezoneOffset = (timezoneMatch[0] === '-' ? -1 : 1) * (parseInt(timezoneMatch[2]) * 60 + parseInt(timezoneMatch[3])) * 60000;
                    } else {
                        throw new Error('invalid datetime format');
                    }
                }
                return new Date(Date.UTC(parseInt(match[1]), parseInt(match[2])-1, parseInt(match[3]),
                    parseInt(match[4]), parseInt(match[5]), parseInt(match[6]), match[7] ? parseInt(match[7]) : 0) + timezoneOffset);
            }
            throw new Error('invalid datetime format');
        }
    ];
    var validDateStringParser = dateStringParsers[dateStringParsers.length-1];

    var detectValidDateParser = function(){
        var valid = false;
        var index = 0;
        var tests = {};
        tests['2012-12-04 23:59:59.999Z'] = Date.UTC(2012,11,4,23,59,59,999);
        tests['2012-01-31T00:54:02'] = Date.UTC(2012,0,31,0,54,2);
        tests['2012-12-22T18:30:00-03:00'] = Date.UTC(2012,11,22,21,30,0);
        tests['1987-02-28'] = Date.UTC(1987,1,28);

        while (!valid && index < dateStringParsers.length) {
            try {
                valid = true;
                for (var str in tests) {
                    if (tests[str] !== dateStringParsers[index](str).getTime()) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    validDateStringParser = dateStringParsers[index];
                }
            } catch(err) {
                valid = false;
            }
            if (!valid) {
                index++;
            }
        }
    };

    detectValidDateParser();

    lt.parseDate = function(timestamp) {
        if (typeof str == 'number' || /^[0-9]+$/.test(timestamp)) {
            return new Date(parseInt(timestamp,10));
        } else {
            try {
                return validDateStringParser(timestamp);
            } catch(err) {
                throw new Error('error parsing datetime "' + timestamp + '": ' + err);
            }
        }
    };

    lt.now = function(){
        if (lt.localTimeOffset === null){
            // local time offset unknown yet
            lt.getLocalTimeOffset();
        }
        var localTimeOffset = lt.localTimeOffset || 0;
        var now = new Date();
        var nowUTC = now.getTime() - now.getTimezoneOffset()*60*1000 + localTimeOffset;
        return nowUTC;
    };

    lt.getLocalTimeOffset = function(){
        var cookieOffset, now, dateHeader, match, serverTime;

        if (!options.serverTimeUrl) {
            lt.localTimeOffset = 0;
            return;
        }

        if (!lt.localTimeOffsetRequested && (typeof lt.localTimeOffset == 'undefined' || lt.localTimeOffset === null)) {
            // get milliseconds of time diff between server and client. positive means client ahead
            lt.localTimeOffsetRequested = true;
            lt.localTimeOffset = 0;
            
            var storedOffset = null;
            if (window.sessionStorage) {
                storedOffset = window.sessionStorage.getItem('jlivetime-localtimeoffset');
            } else {
                try {
                    storedOffset = /localtimeoffset=([0-9]+)[^0-9]?/i.exec(document.cookie)[1];
                } catch (err) {
                    storedOffset = null;
                }
            }
            console.log("requesting time 1 " + JSON.stringify(window.sessionStorage, null, 2));
            //if (typeof storedOffset !='undefined' && storedOffset !== null) {
            //    lt.localTimeOffset = parseInt(storedOffset, 10);
            //} else {
                // offset not obtained yet, calculate with an ajax request
                $.ajax({
                    //url: options.serverTimeUrl,
                    url: "empty.txt",
                    method: 'jsonp',
                    cache: false,
                    success: function (data, status, req) {
                        // local time
                        now = new Date();
                        // try to get server time from response Date header
                        dateHeader = req.getResponseHeader('Date');
                        var serverTime = new Date(dateHeader);
                        console.log("server time: " + serverTime.getTime() + " client time: " + now.getTime());
                        // milliseconds of time diff between server and client.  positive means client ahead
                        lt.localTimeOffset = now.getTime() - serverTime.getTime();
                        // save offset for this browser session
                        if (window.sessionStorage) {
                            window.sessionStorage.setItem('jlivetime-localtimeoffset', lt.localTimeOffset);
                        } else {
                            document.cookie = 'localtimeoffset='+lt.localTimeOffset;
                        }
                        if (lt.localTimeOffset > 10000) {
                            log('WARNING: local time offset is ' + Math.round(lt.localTimeOffset  / 1000) + 's');
                        }
                    }
                });
                console.log("requesting time 2 " + JSON.stringify(window.sessionStorage, null, 2));
           // }
        }
    };

    lt.millisecondsFromNow = function(date){
        var ts = date;
        if (date instanceof Date){
            ts = (date.getTime() + date.getTimezoneOffset()*60*1000);
        }
        return lt.now() - ts;
    };

    lt.refresh = function(element) {

        var start = new Date().getTime();

        var root = $(element);
        root.addClass('jlivetime-active');
        // if there's a pending refresh, cancel it
        var timerTimeout = root.data('jlivetime-timeout');
        if (typeof timerTimeout !== 'undefined'){
            clearTimeout(timerTimeout);
        }

        var nextRefreshMs = 500;
        var timestamps = root.find(options.datetimeSelector);
        if (root.is(options.datetimeSelector)) {
            timestamps = timestamps.add(root);
        }
        timestamps.each(function(){
            var tsElem = $(this);
            var bpm = tsElem.attr(options.bpm);
            var beats = tsElem.attr(options.beats);
            if (bpm != 0) {
                var tsNextRefreshMs = 60000/bpm;
                var tsString = tsElem.attr(options.datetimeAttribute);
                timeUnits = {
                    // years
                    y: 1000 * 3600 * 24 * 365.25,
                    // months
                    M: 1000 * 3600 * 24 * 30,
                    // weeks
                    w: 1000 * 3600 * 24 * 7,
                    // days (from month)
                    d: 1000 * 3600 * 24,
                    // days (from week) to be sec
                    e: 1000 * 3600 * 24,
                    // hours to be phrases
                    h: 1000 * 3600,
                    // minutes to be measures
                    m: 1000 * 60,
                    // seconds to be beats
                    s: 1000,
                    // milliseconds to be ticks
                    f: 1, 
                    //ticks
                    t: 1,
                    //beats
                    b: (60000/bpm),
                    //measures
                    r: (beats*60000/bpm),
                    //phrases
                    p: (4*beats*60000/bpm),
                    //section
                    c: (4*4*beats*60000/bpm)
                };
                if (tsString) {
                    var ts;
                    try {
                        if (tsString.indexOf('-') > 0) {
                            var date = lt.parseDate(tsString);
                            ts = date.getTime() - date.getTimezoneOffset() * 60000;
                        } else {
                            ts = parseInt(tsString, 10);
                        }
                    } catch (err) {
                        // error parsing timestamp
                        log('error parsing timestamp: '+err);
                        ts = 0;
                    }
                    if (ts > 0) {
                        var timeDiff = lt.millisecondsFromNow(ts);
                        var duration = 0;
                        try {
                            var durationString = tsElem.attr(options.durationAttribute);
                            if (durationString) {
                                duration = parseInt(durationString, 10);
                            }
                        } catch (err) {
                            // error parsing timestamp
                            log('error parsing duration: '+err);
                            duration = 0;
                        }
                        tsElem.data('time-diff', timeDiff);

                        var labels = tsElem.find(options.dateLabelSelector);
                        if (tsElem.is(options.dateLabelSelector)) {
                            labels = labels.add(tsElem);
                        }
                        labels.each(function() {
                            var label = $(this);
                            var htmlChanged = false;
                            var tooltipChanged = false;
                            var formatResult = lt.format(ts, timeDiff, duration, bpm, beats, label.data('time-label') || '#_default');
                            if (formatResult.value !== null && typeof formatResult.value !== 'undefined') {
                                if (label.html()!==formatResult.value) {
                                    label.html(formatResult.value);
                                    htmlChanged = true;
                                }
                            }
                            if (formatResult.nextRefreshMs) {
                                // next refresh detected when formatting (eg. when format rule will change)
                                tsNextRefreshMs = Math.min(tsNextRefreshMs, formatResult.nextRefreshMs);
                            }
                            if (typeof label.data('time-tooltip') !== 'undefined') {
                                formatResult = lt.format(ts, timeDiff, duration, bpm, beats, label.data('time-tooltip') || '#_default_tooltip');
                                if (formatResult.value !== null && typeof formatResult.value !== 'undefined') {
                                    if (label.attr('title') !== formatResult.value) {
                                        label.attr('title', formatResult.value);
                                        if (typeof label.attr('data-original-title') != 'undefined') {
                                            label.attr('data-original-title', formatResult.value);
                                        }
                                        tooltipChanged = true;
                                    }
                                }
                                if (formatResult.nextRefreshMs) {
                                    // next refresh detected when formatting (eg. when format rule will change)
                                    tsNextRefreshMs = Math.min(tsNextRefreshMs, formatResult.nextRefreshMs);
                                }
                            }

                            if ((htmlChanged || tooltipChanged) && options.triggerRefreshComplete) {
                                label.trigger('refreshComplete', {
                                    nextRefreshMs: tsNextRefreshMs,
                                    htmlChanged: htmlChanged,
                                    tooltipChanged: tooltipChanged,
                                    refreshElapsedTime: new Date().getTime() - start
                                });
                            }
                        });
                        if (timeDiff < 0){
                            // refresh when time comes
                            tsNextRefreshMs = Math.min(tsNextRefreshMs, -timeDiff);
                        }
                        nextRefreshMs = Math.min(nextRefreshMs, tsNextRefreshMs);
                    }
                }
            }
            else {
                log('bpm cannot be zero');
            }
            tsElem.data('jlivetime-nextrefresh',new Date().getTime()+nextRefreshMs);
        });
        nextRefreshMs = Math.max(nextRefreshMs, 65);

        // schedule the next refresh
        root.data('jlivetime-timeout', setTimeout(function(){
            lt.refresh(element);
        }, nextRefreshMs));
    };

    lt.disable = function(element) {
        var root = $(element);

        // if there's a pending refresh, cancel it
        var timerTimeout = root.data('jlivetime-timeout');
        if (typeof timerTimeout !== 'undefined'){
            clearTimeout(timerTimeout);
        }
        root.removeClass('jlivetime-active');
    };

    lt.formatPart = function(ts, timeDiff, bpm, beats, format){
        if (format==='[]'){
            return {value: ''};
        }
        var match = /^(t?d_)?(([yMdewHhmsftbrpc])\3*)$/.exec(format);
        if (match) {
            if (!match[1]) {
                // regular date format
                var date = new Date(ts + new Date().getTimezoneOffset()*60*1000);
                switch (match[3]) {
                    case 'y':
                        return {
                            value: padLeft(date.getFullYear(), match[2].length)
                        };
                    case 'M':
                        // use name if length > 2
                        var month =  match[2].length > 2 ? unitNames.M[date.getMonth()] : padLeft(date.getMonth() + 1, match[2].length);
                        if (match[2].length === 3) {
                            month = month.slice(0,3);
                        }
                        return {
                            value: month
                        };
                    case 'w':
                        return {
                            value: padLeft(Math.floor(date.getDate() / 7) + 1, match[2].length)
                        };
                    case 'd':
                        return {
                            value: padLeft(date.getDate(), match[2].length)
                        };
                    case 'e':
                        // use name if length > 1
                        var weekday =  match[2].length > 1 ? unitNames.e[date.getDay()] : date.getDay() + 1;
                        if (match[2].length > 1 && match[2].length <= 3) {
                            weekday = weekday.slice(0,match[2].length);
                        }
                        return {
                            value: weekday
                        };
                    case 'h':
                        return {
                            value: padLeft(date.getHours() > 12 ? date.getHours() - 12 : date.getHours(), match[2].length)
                        };
                    case 'H':
                        return {
                            value: padLeft(date.getHours(), match[2].length)
                        };
                    case 'm':
                        return {
                            value: padLeft(date.getMinutes(), match[2].length)
                        };
                    case 's':
                        return {
                            value: padLeft(date.getSeconds(), match[2].length)
                        };
                    case 'f':
                        return {
                            value: padLeft(date.getMilliseconds(), match[2].length)
                        };
                    /*case 't':
                        var ampm = date.getHours() >= 12 ? 'pm' : 'am';
                        return {
                            value: match[2].length > 1 ? ampm : ampm.slice(0,1)
                        };*/
                    case 't':
                        return {
                            value: padLeft(date.getMilliseconds(), match[2].length)
                        };
                    case 'b':
                        return {
                            value: padLeft(date.getMilliseconds()/(60000/bpm), match[2].length)

                        };
                    case 'r':
                        return {
                            value: padLeft(date.getMilliseconds()/(beats*60000/bpm), match[2].length)
                        };
                    case 'p':
                        return {
                            value: padLeft(date.getMilliseconds()/(4*beats*60000/bpm), match[2].length)
                        };
                    case 'c':
                        return {
                            value: padLeft(date.getMilliseconds()/(4*4*beats*60000/bpm), match[2].length)
                        };
                }
            } else {
                var timeUnit = timeUnits[match[3]];
                if (timeUnit) {
                    var nextRefreshMs;
                    // time difference format
                    nextRefreshMs = Math.max(65, timeDiff > 0 ? timeUnit - timeDiff % timeUnit : -timeDiff % timeUnit);
                    if (match[1] == 'td_') {
                        // total in unit
                        return {
                            value: padLeft(Math.floor((Math.abs(timeDiff / timeUnit))+1), match[2].length),
                            nextRefreshMs: nextRefreshMs
                        };
                    } else if (match[1] == 'd_') {
                        var parentTimeUnit = timeUnits[parentTimeUnits[match[3]]];
                        return {
                            value: padLeft(Math.floor((Math.abs(parentTimeUnit ? timeDiff % parentTimeUnit : timeDiff) / timeUnit)+1), match[2].length),
                            nextRefreshMs: nextRefreshMs
                        };
                    }
                }
            }
        }
        return {
            value: format
        };
    };

    lt.getFormatExpression = function(ts, timeDiff, duration, format) {
        var nextRefreshMs = 500;
        var format_expression = format;
        if (format_expression === null || format_expression === 'null') {
            format_expression = null;
        } else {
            if (typeof format_expression == 'string' && format_expression.slice(0,1) === '#') {
                format_expression = options.formats[format_expression.slice(1)];
                if (typeof format_expression == 'undefined') {
                    throw new Error('time format not found: ' + format);
                }
            }
            if (format_expression instanceof Array) {
                var fmtLength = format_expression.length;
                for (var i=0; i< fmtLength; i++) {
                    if (format_expression[i].length === 1) {
                        format_expression = format_expression[i][0];
                        break;
                    } else {
                        var rangeLimit = format_expression[i][0];
                        if (typeof rangeLimit == 'string') {
                            if (rangeLimit.slice(0,3) === 'end') {
                                if (rangeLimit.length > 3) {
                                    try {
                                        rangeLimit = duration + parseInt(rangeLimit.slice(3), 10) * 1000;
                                    } catch(err) {
                                        log('error parsing format range: '+err);
                                    }
                                } else {
                                    rangeLimit = duration;
                                }
                            }
                        } else {
                            rangeLimit = rangeLimit * 1000;
                        }
                        if (rangeLimit >= timeDiff) {
                            // refresh when format range changes
                            nextRefreshMs = Math.min(nextRefreshMs, rangeLimit - timeDiff);
                            format_expression = format_expression[i][1];
                            break;
                        }
                    }
                }
                if (format_expression instanceof Array) {
                    format_expression = '<unknown>';
                }
            }
            if (typeof format_expression == 'string' && format_expression.slice(0,1) === '#') {
                return lt.getFormatExpression(ts, timeDiff, duration, format_expression);
            }
        }
        return {
            expression: format_expression,
            nextRefreshMs: nextRefreshMs
        }
    };

    lt.format = function(ts, timeDiff, duration, bpm, beats, format){
        var partRegex = /\[?([a-z_]+)\]?/gim;
        var value = [];
        var lastindex = 0;
        var fmt = lt.getFormatExpression(ts, timeDiff, duration, format);
        //console.log("format " + JSON.stringify(fmt, null, 2));

        if (fmt.expression === null) {
            return fmt;
        }
        var match = partRegex.exec(fmt.expression);
        while (match) {
            value.push(fmt.expression.slice(lastindex, match.index));
            if (match[0].length != match[1].length){
                value.push(match[1]);
            }else{
                var format_expression = match[0];
                var ts_offset = 0;
                if (format_expression.slice(0,4) === 'end_') {
                    format_expression = format_expression.slice(4);
                    ts_offset = duration;
                }
                var formatPartResult = lt.formatPart(ts + ts_offset, timeDiff - ts_offset, bpm, beats, format_expression);
                value.push(formatPartResult.value);
                if (formatPartResult.nextRefreshMs){
                    fmt.nextRefreshMs = Math.min(fmt.nextRefreshMs, formatPartResult.nextRefreshMs);
                }
            }
            lastindex = match.index + match[0].length;
            match = partRegex.exec(fmt.expression);
        }
        value.push(fmt.expression.slice(lastindex));

        fmt.value = value.join('');
        //console.log("format " + JSON.stringify(fmt, null, 2));
        return fmt;

    };

    $.fn.livetime = function(enable){
        this.each(function(){
            var elem = $(this);
            if (!elem.is('.jlivetime-active')) {
                // if element is an active livetime container, call livetime() on that container
                var activeParent = $(this).parent('.jlivetime-active');
                if (activeParent.length) {
                    elem = activeParent;
                }
            }
            if (enable === false) {
                lt.disable(elem.get(0));
            } else {
                lt.refresh(elem.get(0));
            }
        });
    };

})(jQuery);