var webVitals=function(e){"use strict";var t,n,r,i,a,o=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},c=function(e){if("loading"===document.readyState)return"loading";var t=o();if(t){if(e<t.domInteractive)return"loading";if(0===t.domContentLoadedEventStart||e<t.domContentLoadedEventStart)return"dom-interactive";if(0===t.domComplete||e<t.domComplete)return"dom-content-loaded"}return"complete"},u=function(e){var t=e.nodeName;return 1===e.nodeType?t.toLowerCase():t.toUpperCase().replace(/^#/,"")},s=function(e,t){var n="";try{for(;e&&9!==e.nodeType;){var r=e,i=r.id?"#"+r.id:u(r)+(r.className&&r.className.length?"."+r.className.replace(/\s+/g,"."):"");if(n.length+i.length>(t||100)-1)return n||i;if(n=n?i+">"+n:i,r.id)break;e=r.parentNode}}catch(e){}return n},d=-1,f=function(){return d},m=function(e){addEventListener("pageshow",(function(t){t.persisted&&(d=t.timeStamp,e(t))}),!0)},l=function(){var e=o();return e&&e.activationStart||0},v=function(e,t){var n=o(),r="navigate";return f()>=0?r="back-forward-cache":n&&(r=document.prerendering||l()>0?"prerender":document.wasDiscarded?"restore":n.type.replace(/_/g,"-")),{name:e,value:void 0===t?-1:t,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:r}},p=function(e,t,n){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var r=new PerformanceObserver((function(e){Promise.resolve().then((function(){t(e.getEntries())}))}));return r.observe(Object.assign({type:e,buffered:!0},n||{})),r}}catch(e){}},g=function(e,t){var n=function n(r){"pagehide"!==r.type&&"hidden"!==document.visibilityState||(e(r),t&&(removeEventListener("visibilitychange",n,!0),removeEventListener("pagehide",n,!0)))};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0)},h=function(e,t,n,r){var i,a;return function(o){t.value>=0&&(o||r)&&((a=t.value-(i||0))||void 0===i)&&(i=t.value,t.delta=a,t.rating=function(e,t){return e>t[1]?"poor":e>t[0]?"needs-improvement":"good"}(t.value,n),e(t))}},T=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},y=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},S=-1,b=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},E=function(e){"hidden"===document.visibilityState&&S>-1&&(S="visibilitychange"===e.type?e.timeStamp:0,C())},w=function(){addEventListener("visibilitychange",E,!0),addEventListener("prerenderingchange",E,!0)},C=function(){removeEventListener("visibilitychange",E,!0),removeEventListener("prerenderingchange",E,!0)},L=function(){return S<0&&(S=b(),w(),m((function(){setTimeout((function(){S=b(),w()}),0)}))),{get firstHiddenTime(){return S}}},P=function(e,t){t=t||{},y((function(){var n,r=[1800,3e3],i=L(),a=v("FCP"),o=p("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(o.disconnect(),e.startTime<i.firstHiddenTime&&(a.value=Math.max(e.startTime-l(),0),a.entries.push(e),n(!0)))}))}));o&&(n=h(e,a,r,t.reportAllChanges),m((function(i){a=v("FCP"),n=h(e,a,r,t.reportAllChanges),T((function(){a.value=performance.now()-i.timeStamp,n(!0)}))})))}))},O=function(e){var t={cacheStatus:"NA",cdn:"NA"};return e.map((function(e){switch(e.name){case"cdn-cache-miss":t.cacheStatus="MISS",t.cdn="Cloudfront";break;case"cdn-cache-hit":t.cacheStatus="HIT",t.cdn="Cloudfront";break;case"cdn-cache":t.cdn="Akamai",t.cacheStatus=e.description}})),t},M={passive:!0,capture:!0},x=new Date,A=function(e,i){t||(t=i,n=e,r=new Date,k(removeEventListener),j())},j=function(){if(n>=0&&n<r-x){var e={entryType:"first-input",name:t.type,target:t.target,cancelable:t.cancelable,startTime:t.timeStamp,processingStart:t.timeStamp+n};i.forEach((function(t){t(e)})),i=[]}},F=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){A(e,t),i()},r=function(){i()},i=function(){removeEventListener("pointerup",n,M),removeEventListener("pointercancel",r,M)};addEventListener("pointerup",n,M),addEventListener("pointercancel",r,M)}(t,e):A(t,e)}},k=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,F,M)}))},B=function(e,r){r=r||{},y((function(){var a,o=[100,300],c=L(),u=v("FID"),s=function(e){e.startTime<c.firstHiddenTime&&(u.value=e.processingStart-e.startTime,u.entries.push(e),a(!0))},d=function(e){e.forEach(s)},f=p("first-input",d);a=h(e,u,o,r.reportAllChanges),f&&g((function(){d(f.takeRecords()),f.disconnect()}),!0),f&&m((function(){var c;u=v("FID"),a=h(e,u,o,r.reportAllChanges),i=[],n=-1,t=null,k(addEventListener),c=s,i.push(c),j()}))}))},D=0,I=1/0,R=0,N=function(e){e.forEach((function(e){e.interactionId&&(I=Math.min(I,e.interactionId),R=Math.max(R,e.interactionId),D=R?(R-I)/7+1:0)}))},z=function(){return a?D:performance.interactionCount||0},q=function(){"interactionCount"in performance||a||(a=p("event",N,{type:"event",buffered:!0,durationThreshold:0}))},H=0,_=function(){return z()-H},U=[],V={},G=function(e){var t=U[U.length-1],n=V[e.interactionId];if(n||U.length<10||e.duration>t.latency){if(n)n.entries.push(e),n.latency=Math.max(n.latency,e.duration);else{var r={id:e.interactionId,latency:e.duration,entries:[e]};V[r.id]=r,U.push(r)}U.sort((function(e,t){return t.latency-e.latency})),U.splice(10).forEach((function(e){delete V[e.id]}))}},J=function(e,t){t=t||{},y((function(){var n=[200,500];q();var r,i=v("INP"),a=function(e){e.forEach((function(e){(e.interactionId&&G(e),"first-input"===e.entryType)&&(!U.some((function(t){return t.entries.some((function(t){return e.duration===t.duration&&e.startTime===t.startTime}))}))&&G(e))}));var t,n=(t=Math.min(U.length-1,Math.floor(_()/50)),U[t]);n&&n.latency!==i.value&&(i.value=n.latency,i.entries=n.entries,r())},o=p("event",a,{durationThreshold:t.durationThreshold||40});r=h(e,i,n,t.reportAllChanges),o&&(o.observe({type:"first-input",buffered:!0}),g((function(){a(o.takeRecords()),i.value<0&&_()>0&&(i.value=0,i.entries=[]),r(!0)})),m((function(){U=[],H=z(),i=v("INP"),r=h(e,i,n,t.reportAllChanges)})))}))},K={},Q=function e(t){document.prerendering?y((function(){return e(t)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(t)}),!0):setTimeout(t,0)},W=function(e,t){t=t||{};var n=[800,1800],r=v("TTFB"),i=h(e,r,n,t.reportAllChanges);Q((function(){var a=o();if(a){var c=a.responseStart;if(c<=0||c>performance.now())return;r.value=Math.max(c-l(),0),r.entries=[a],i(!0),m((function(){r=v("TTFB",0),(i=h(e,r,n,t.reportAllChanges))(!0)}))}}))},X=function e(t){document.prerendering?addEventListener("prerenderingchange",(function(){return e(t)}),!0):"complete"!==document.readyState?addEventListener("load",(function(){return e(t)}),!0):setTimeout(t,0)},Y=function(e,t){t=t||{};var n=[100,300];X((function(){var r=function(r){var i;if(-1==r.name.indexOf("dataplane.rum")&&-1==r.name.indexOf("cognito-identity.")&&-1==r.name.indexOf("sts.")){var a,o=v("RESOURCE");a=h(e,o,n,null===(i=t)||void 0===i?void 0:i.reportAllChanges),o.value=r.responseEnd-r.startTime,o.entries=[r],a(!0)}},i=function(e){e.forEach(r)},a=p("resource",i);void 0!==performance?a&&g((function(){i(a.takeRecords()),a.disconnect()}),!0):console.log("= Calculate Load Times: performance NOT supported")}))};function Z(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function $(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(n),!0).forEach((function(t){ee(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Z(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function ee(e,t,n){return(t=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}return e.onCLS=function(e,t){!function(e,t){t=t||{},y((function(){var n,r=[.1,.25],i=v("CLS"),a=-1,o=0,c=[],u=function(t){a>-1&&e(t)},s=function(e){e.forEach((function(e){if(!e.hadRecentInput){var t=c[0],r=c[c.length-1];o&&e.startTime-r.startTime<1e3&&e.startTime-t.startTime<5e3?(o+=e.value,c.push(e)):(o=e.value,c=[e]),o>i.value&&(i.value=o,i.entries=c,n())}}))},d=p("layout-shift",s);d&&(n=h(u,i,r,t.reportAllChanges),P((function(e){a=e.value,i.value<0&&(i.value=0,n())})),g((function(){s(d.takeRecords()),n(!0)})),m((function(){o=0,a=-1,i=v("CLS",0),n=h(u,i,r,t.reportAllChanges),T((function(){return n()}))})))}))}((function(t){!function(e){if(e.entries.length){var t=e.entries.reduce((function(e,t){return e&&e.value>t.value?e:t}));if(t&&t.sources&&t.sources.length){var n=(r=t.sources).find((function(e){return e.node&&1===e.node.nodeType}))||r[0];if(n)return void(e.attribution={largestShiftTarget:s(n.node),largestShiftTime:t.startTime,largestShiftValue:t.value,largestShiftSource:n,largestShiftEntry:t,loadState:c(t.startTime)})}}var r;e.attribution={}}(t),e(t)}),t)},e.onFCP=function(e,t){P((function(t){!function(e){if(e.entries.length){var t=o(),n=e.entries[e.entries.length-1];if(t){var r=t.activationStart||0,i=Math.max(0,t.responseStart-r),a=t.serverTiming.find((function(e){return"stage"===e.name})),u=O(t.serverTiming);return void(e.attribution={timeToFirstByte:i,firstByteToFCP:e.value-i,loadState:c(e.entries[0].startTime),cdn:u.cdn,env:a?a.description:"prod",name:t.name,metricType:e.name,fcpEntry:n})}}e.attribution={timeToFirstByte:0,firstByteToFCP:e.value,loadState:c(f()),metricType:e.name}}(t),e(t)}),t)},e.onFID=function(e,t){B((function(t){!function(e){var t=e.entries[0];e.attribution={eventTarget:s(t.target),eventType:t.name,eventTime:t.startTime,eventEntry:t,loadState:c(t.startTime)}}(t),e(t)}),t)},e.onINP=function(e,t){J((function(t){!function(e){if(e.entries.length){var t=e.entries.sort((function(e,t){return t.duration-e.duration||t.processingEnd-t.processingStart-(e.processingEnd-e.processingStart)}))[0];e.attribution={eventTarget:s(t.target),eventType:t.name,eventTime:t.startTime,eventEntry:t,loadState:c(t.startTime)}}else e.attribution={}}(t),e(t)}),t)},e.onLCP=function(e,t){!function(e,t){t=t||{},y((function(){var n,r=[2500,4e3],i=L(),a=v("LCP"),o=function(e){var t=e[e.length-1];if(t){var r=Math.max(t.startTime-l(),0);r<i.firstHiddenTime&&(a.value=r,a.entries=[t],n())}},c=p("largest-contentful-paint",o);if(c){n=h(e,a,r,t.reportAllChanges);var u=function(){K[a.id]||(o(c.takeRecords()),c.disconnect(),K[a.id]=!0,n(!0))};["keydown","click"].forEach((function(e){addEventListener(e,u,{once:!0,capture:!0})})),g(u,!0),m((function(i){a=v("LCP"),n=h(e,a,r,t.reportAllChanges),T((function(){a.value=performance.now()-i.timeStamp,K[a.id]=!0,n(!0)}))}))}}))}((function(t){!function(e){if(e.entries.length){var t=o();if(t){var n=t.activationStart||0,r=e.entries[e.entries.length-1],i=r.url&&performance.getEntriesByType("resource").filter((function(e){return e.name===r.url}))[0],a=Math.max(0,t.responseStart-n),c=Math.max(a,i?(i.requestStart||i.startTime)-n:0),u=Math.max(c,i?i.responseEnd-n:0),d=Math.max(u,r?r.startTime-n:0),f=t.serverTiming.find((function(e){return"stage"===e.name})),m=O(t.serverTiming),l={element:s(r.element),timeToFirstByte:a,resourceLoadDelay:c-a,resourceLoadTime:u-c,elementRenderDelay:d-u,cdn:m.cdn,env:f?f.description:"prod",name:t.name,metricType:e.name};return r.url&&(l.url=r.url),void(e.attribution=l)}}e.attribution={timeToFirstByte:0,resourceLoadDelay:0,resourceLoadTime:0,elementRenderDelay:e.value,metricType:e.name}}(t),e(t)}),t)},e.onResource=function(e,t){Y((function(t){!function(e){var t;if(null!==(t=e.entries)&&void 0!==t&&t.length){var n=e.entries[0],r=n.startTime||0,i=Math.max(n.domainLookupStart-r,0),a=Math.max(n.connectStart-r,0),o=Math.max(n.requestStart-r,0),c=Math.max(n.responseStart-r,0),u=n.serverTiming.find((function(e){return"stage"===e.name})),s=O(n.serverTiming);e.attribution={waitingTime:i,dnsTime:a-i,connectionTime:o-a,requestTime:c-o,transferSize:n.transferSize,compressRate:1-n.encodedBodySize/n.decodedBodySize,cacheStatus:s.cacheStatus,cdn:s.cdn,env:u?u.description:"prod",initiatorType:n.initiatorType,nextHopProtocol:n.nextHopProtocol,name:n.name,serverTiming:n.serverTiming,metricType:e.name}}else e.attribution={waitingTime:0,dnsTime:0,connectionTime:0,requestTime:0,transferSize:0,metricType:e.name}}(t),e(t)}),t)},e.onTTFB=function(e,t){W((function(t){!function(e){if(e.entries.length){var t=e.entries[0],n=t.activationStart||0,r=Math.max(t.domainLookupStart-n,0),i=Math.max(t.connectStart-n,0),a=Math.max(t.requestStart-n,0),o=t.serverTiming.find((function(e){return"stage"===e.name})),c=O(t.serverTiming);e.attribution={waitingTime:r,dnsTime:i-r,connectionTime:a-i,requestTime:e.value-a,transferSize:t.transferSize,compressRate:1-t.encodedBodySize/t.decodedBodySize,cacheStatus:c.cacheStatus,cdn:c.cdn,env:o?o.description:"prod",initiatorType:t.entryType,name:t.name,serverTiming:t.serverTiming,metricType:e.name}}else e.attribution={waitingTime:0,dnsTime:0,connectionTime:0,requestTime:0,transferSize:0,metricType:e.name}}(t),e(t)}),t)},e.sendToAnalytics=function(e){var t={};e.attribution.serverTiming&&(e.attribution.serverTiming.map((function(e){var n=e.name.replaceAll("-","").replaceAll("_","");t["sth".concat(n)]=e.description?e.description:e.name,e.duration&&(t["sth".concat(n,"duration")]=e.duration)})),delete e.attribution.serverTiming);var n=$($({},e.attribution),t);n.delta=e.delta,n.value=e.value,n.rating=e.rating,cwr("recordEvent",{type:"cdn_metrics",data:n}),console.log("Sent Metric :%j",n)},Object.defineProperty(e,"__esModule",{value:!0}),e}({});
