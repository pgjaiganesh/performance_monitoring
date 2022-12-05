!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).webVitals={})}(this,(function(e){"use strict";var t,n,i,r,a,o=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},c=function(e){if("loading"===document.readyState)return"loading";var t=o();if(t){if(e<t.domInteractive)return"loading";if(0===t.domContentLoadedEventStart||e<t.domContentLoadedEventStart)return"dom-interactive";if(0===t.domComplete||e<t.domComplete)return"dom-content-loaded"}return"complete"},u=function(e){var t=e.nodeName;return 1===e.nodeType?t.toLowerCase():t.toUpperCase().replace(/^#/,"")},s=function(e,t){var n="";try{for(;e&&9!==e.nodeType;){var i=e,r=i.id?"#"+i.id:u(i)+(i.className&&i.className.length?"."+i.className.replace(/\s+/g,"."):"");if(n.length+r.length>(t||100)-1)return n||r;if(n=n?r+">"+n:r,i.id)break;e=i.parentNode}}catch(e){}return n},d=-1,f=function(){return d},m=function(e){addEventListener("pageshow",(function(t){t.persisted&&(d=t.timeStamp,e(t))}),!0)},l=function(){var e=o();return e&&e.activationStart||0},v=function(e,t){var n=o(),i="navigate";return f()>=0?i="back-forward-cache":n&&(i=document.prerendering||l()>0?"prerender":document.wasDiscarded?"restore":n.type.replace(/_/g,"-")),{name:e,value:void 0===t?-1:t,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:i}},p=function(e,t,n){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var i=new PerformanceObserver((function(e){Promise.resolve().then((function(){t(e.getEntries())}))}));return i.observe(Object.assign({type:e,buffered:!0},n||{})),i}}catch(e){}},h=function(e,t){var n=function n(i){"pagehide"!==i.type&&"hidden"!==document.visibilityState||(e(i),t&&(removeEventListener("visibilitychange",n,!0),removeEventListener("pagehide",n,!0)))};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0)},g=function(e,t,n,i){var r,a;return function(o){t.value>=0&&(o||i)&&((a=t.value-(r||0))||void 0===r)&&(r=t.value,t.delta=a,t.rating=function(e,t){return e>t[1]?"poor":e>t[0]?"needs-improvement":"good"}(t.value,n),e(t))}},T=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},y=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},S=-1,E=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},b=function(e){"hidden"===document.visibilityState&&S>-1&&(S="visibilitychange"===e.type?e.timeStamp:0,C())},L=function(){addEventListener("visibilitychange",b,!0),addEventListener("prerenderingchange",b,!0)},C=function(){removeEventListener("visibilitychange",b,!0),removeEventListener("prerenderingchange",b,!0)},w=function(){return S<0&&(S=E(),L(),m((function(){setTimeout((function(){S=E(),L()}),0)}))),{get firstHiddenTime(){return S}}},x=function(e,t){t=t||{},y((function(){var n,i=[1800,3e3],r=w(),a=v("FCP"),o=p("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(o.disconnect(),e.startTime<r.firstHiddenTime&&(a.value=Math.max(e.startTime-l(),0),a.entries.push(e),n(!0)))}))}));o&&(n=g(e,a,i,t.reportAllChanges),m((function(r){a=v("FCP"),n=g(e,a,i,t.reportAllChanges),T((function(){a.value=performance.now()-r.timeStamp,n(!0)}))})))}))},M=function(e){var t={cacheStatus:"NA",cdn:"NA"};return e.map((function(e){switch(e.name){case"cdn-cache-miss":t.cacheStatus="MISS";break;case"cdn-cache-hit":t.cacheStatus="HIT";break;case"cdn-rid":t.cdn="cloudfront"}})),t},A={passive:!0,capture:!0},F=new Date,P=function(e,r){t||(t=r,n=e,i=new Date,k(removeEventListener),B())},B=function(){if(n>=0&&n<i-F){var e={entryType:"first-input",name:t.type,target:t.target,cancelable:t.cancelable,startTime:t.timeStamp,processingStart:t.timeStamp+n};r.forEach((function(t){t(e)})),r=[]}},I=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){P(e,t),r()},i=function(){r()},r=function(){removeEventListener("pointerup",n,A),removeEventListener("pointercancel",i,A)};addEventListener("pointerup",n,A),addEventListener("pointercancel",i,A)}(t,e):P(t,e)}},k=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,I,A)}))},R=function(e,i){i=i||{},y((function(){var a,o=[100,300],c=w(),u=v("FID"),s=function(e){e.startTime<c.firstHiddenTime&&(u.value=e.processingStart-e.startTime,u.entries.push(e),a(!0))},d=function(e){e.forEach(s)},f=p("first-input",d);a=g(e,u,o,i.reportAllChanges),f&&h((function(){d(f.takeRecords()),f.disconnect()}),!0),f&&m((function(){var c;u=v("FID"),a=g(e,u,o,i.reportAllChanges),r=[],n=-1,t=null,k(addEventListener),c=s,r.push(c),B()}))}))},D=0,N=1/0,z=0,q=function(e){e.forEach((function(e){e.interactionId&&(N=Math.min(N,e.interactionId),z=Math.max(z,e.interactionId),D=z?(z-N)/7+1:0)}))},O=function(){return a?D:performance.interactionCount||0},H=function(){"interactionCount"in performance||a||(a=p("event",q,{type:"event",buffered:!0,durationThreshold:0}))},j=0,_=function(){return O()-j},U=[],V={},G=function(e){var t=U[U.length-1],n=V[e.interactionId];if(n||U.length<10||e.duration>t.latency){if(n)n.entries.push(e),n.latency=Math.max(n.latency,e.duration);else{var i={id:e.interactionId,latency:e.duration,entries:[e]};V[i.id]=i,U.push(i)}U.sort((function(e,t){return t.latency-e.latency})),U.splice(10).forEach((function(e){delete V[e.id]}))}},J=function(e,t){t=t||{},y((function(){var n=[200,500];H();var i,r=v("INP"),a=function(e){e.forEach((function(e){(e.interactionId&&G(e),"first-input"===e.entryType)&&(!U.some((function(t){return t.entries.some((function(t){return e.duration===t.duration&&e.startTime===t.startTime}))}))&&G(e))}));var t,n=(t=Math.min(U.length-1,Math.floor(_()/50)),U[t]);n&&n.latency!==r.value&&(r.value=n.latency,r.entries=n.entries,i())},o=p("event",a,{durationThreshold:t.durationThreshold||40});i=g(e,r,n,t.reportAllChanges),o&&(o.observe({type:"first-input",buffered:!0}),h((function(){a(o.takeRecords()),r.value<0&&_()>0&&(r.value=0,r.entries=[]),i(!0)})),m((function(){U=[],j=O(),r=v("INP"),i=g(e,r,n,t.reportAllChanges)})))}))},K={},Q=function e(t){document.prerendering?y((function(){return e(t)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(t)}),!0):setTimeout(t,0)},W=function(e,t){t=t||{};var n=[800,1800],i=v("TTFB"),r=g(e,i,n,t.reportAllChanges);Q((function(){var a=o();if(a){var c=a.responseStart;if(c<=0||c>performance.now())return;i.value=Math.max(c-l(),0),i.entries=[a],r(!0),m((function(){i=v("TTFB",0),(r=g(e,i,n,t.reportAllChanges))(!0)}))}}))},X=function e(t){document.prerendering?addEventListener("prerenderingchange",(function(){return e(t)}),!0):"complete"!==document.readyState?addEventListener("load",(function(){return e(t)}),!0):setTimeout(t,0)},Y=function(e,t){t=t||{};var n=[100,300];X((function(){var i=function(i){var r;if(-1==i.name.indexOf("dataplane.rum")&&-1==i.name.indexOf("cognito-identity.")&&-1==i.name.indexOf("sts.")){var a,o=v("RESOURCE");a=g(e,o,n,null===(r=t)||void 0===r?void 0:r.reportAllChanges),o.value=i.responseEnd-i.startTime,o.entries=[i],a(!0)}},r=function(e){e.forEach(i)},a=p("resource",r);void 0!==performance?a&&h((function(){r(a.takeRecords()),a.disconnect()}),!0):console.log("= Calculate Load Times: performance NOT supported")}))};e.onCLS=function(e,t){!function(e,t){t=t||{},y((function(){var n,i=[.1,.25],r=v("CLS"),a=-1,o=0,c=[],u=function(t){a>-1&&e(t)},s=function(e){e.forEach((function(e){if(!e.hadRecentInput){var t=c[0],i=c[c.length-1];o&&e.startTime-i.startTime<1e3&&e.startTime-t.startTime<5e3?(o+=e.value,c.push(e)):(o=e.value,c=[e]),o>r.value&&(r.value=o,r.entries=c,n())}}))},d=p("layout-shift",s);d&&(n=g(u,r,i,t.reportAllChanges),x((function(e){a=e.value,r.value<0&&(r.value=0,n())})),h((function(){s(d.takeRecords()),n(!0)})),m((function(){o=0,a=-1,r=v("CLS",0),n=g(u,r,i,t.reportAllChanges),T((function(){return n()}))})))}))}((function(t){!function(e){if(e.entries.length){var t=e.entries.reduce((function(e,t){return e&&e.value>t.value?e:t}));if(t&&t.sources&&t.sources.length){var n=(i=t.sources).find((function(e){return e.node&&1===e.node.nodeType}))||i[0];if(n)return void(e.attribution={largestShiftTarget:s(n.node),largestShiftTime:t.startTime,largestShiftValue:t.value,largestShiftSource:n,largestShiftEntry:t,loadState:c(t.startTime)})}}var i;e.attribution={}}(t),e(t)}),t)},e.onFCP=function(e,t){x((function(t){!function(e){if(e.entries.length){var t=o(),n=e.entries[e.entries.length-1];if(t){var i=t.activationStart||0,r=Math.max(0,t.responseStart-i),a=t.serverTiming.find((function(e){return"stage"===e.name})),u=M(t.serverTiming);return void(e.attribution={timeToFirstByte:r,firstByteToFCP:e.value-r,loadState:c(e.entries[0].startTime),cdn:u.cdn,env:a?a.description:"prod",name:t.name,metricType:e.name,fcpEntry:n})}}e.attribution={timeToFirstByte:0,firstByteToFCP:e.value,loadState:c(f()),metricType:e.name}}(t),e(t)}),t)},e.onFID=function(e,t){R((function(t){!function(e){var t=e.entries[0];e.attribution={eventTarget:s(t.target),eventType:t.name,eventTime:t.startTime,eventEntry:t,loadState:c(t.startTime)}}(t),e(t)}),t)},e.onINP=function(e,t){J((function(t){!function(e){if(e.entries.length){var t=e.entries.sort((function(e,t){return t.duration-e.duration||t.processingEnd-t.processingStart-(e.processingEnd-e.processingStart)}))[0];e.attribution={eventTarget:s(t.target),eventType:t.name,eventTime:t.startTime,eventEntry:t,loadState:c(t.startTime)}}else e.attribution={}}(t),e(t)}),t)},e.onLCP=function(e,t){!function(e,t){t=t||{},y((function(){var n,i=[2500,4e3],r=w(),a=v("LCP"),o=function(e){var t=e[e.length-1];if(t){var i=Math.max(t.startTime-l(),0);i<r.firstHiddenTime&&(a.value=i,a.entries=[t],n())}},c=p("largest-contentful-paint",o);if(c){n=g(e,a,i,t.reportAllChanges);var u=function(){K[a.id]||(o(c.takeRecords()),c.disconnect(),K[a.id]=!0,n(!0))};["keydown","click"].forEach((function(e){addEventListener(e,u,{once:!0,capture:!0})})),h(u,!0),m((function(r){a=v("LCP"),n=g(e,a,i,t.reportAllChanges),T((function(){a.value=performance.now()-r.timeStamp,K[a.id]=!0,n(!0)}))}))}}))}((function(t){!function(e){if(e.entries.length){var t=o();if(t){var n=t.activationStart||0,i=e.entries[e.entries.length-1],r=i.url&&performance.getEntriesByType("resource").filter((function(e){return e.name===i.url}))[0],a=Math.max(0,t.responseStart-n),c=Math.max(a,r?(r.requestStart||r.startTime)-n:0),u=Math.max(c,r?r.responseEnd-n:0),d=Math.max(u,i?i.startTime-n:0),f=t.serverTiming.find((function(e){return"stage"===e.name})),m=M(t.serverTiming),l={element:s(i.element),timeToFirstByte:a,resourceLoadDelay:c-a,resourceLoadTime:u-c,elementRenderDelay:d-u,cdn:m.cdn,env:f?f.description:"prod",name:t.name,metricType:e.name};return i.url&&(l.url=i.url),void(e.attribution=l)}}e.attribution={timeToFirstByte:0,resourceLoadDelay:0,resourceLoadTime:0,elementRenderDelay:e.value,metricType:e.name}}(t),e(t)}),t)},e.onResource=function(e,t){Y((function(t){!function(e){var t;if(null!==(t=e.entries)&&void 0!==t&&t.length){var n=e.entries[0],i=n.startTime||0,r=Math.max(n.domainLookupStart-i,0),a=Math.max(n.connectStart-i,0),o=Math.max(n.requestStart-i,0),c=n.serverTiming.find((function(e){return"stage"===e.name})),u=M(n.serverTiming);e.attribution={waitingTime:r,dnsTime:a-r,connectionTime:o-a,requestTime:e.value-o,transferSize:n.transferSize,compressRate:1-n.encodedBodySize/n.decodedBodySize,cacheStatus:u.cacheStatus,cdn:u.cdn,env:c?c.description:"prod",initiatorType:n.initiatorType,nextHopProtocol:n.nextHopProtocol,name:n.name,serverTiming:n.serverTiming,metricType:e.name}}else e.attribution={waitingTime:0,dnsTime:0,connectionTime:0,requestTime:0,transferSize:0,metricType:e.name}}(t),e(t)}),t)},e.onTTFB=function(e,t){W((function(t){!function(e){if(e.entries.length){var t=e.entries[0],n=t.activationStart||0,i=Math.max(t.domainLookupStart-n,0),r=Math.max(t.connectStart-n,0),a=Math.max(t.requestStart-n,0),o=t.serverTiming.find((function(e){return"stage"===e.name})),c=M(t.serverTiming);e.attribution={waitingTime:i,dnsTime:r-i,connectionTime:a-r,requestTime:e.value-a,transferSize:t.transferSize,compressRate:1-t.encodedBodySize/t.decodedBodySize,cacheStatus:c.cacheStatus,cdn:c.cdn,env:o?o.description:"prod",initiatorType:t.entryType,name:t.name,serverTiming:t.serverTiming,metricType:e.name}}else e.attribution={waitingTime:0,dnsTime:0,connectionTime:0,requestTime:0,transferSize:0,metricType:e.name}}(t),e(t)}),t)},Object.defineProperty(e,"__esModule",{value:!0})}));
