var webVitals=function(e){"use strict";var n,t,r,i,o,a=-1,c=function(e){addEventListener("pageshow",(function(n){n.persisted&&(a=n.timeStamp,e(n))}),!0)},u=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},f=function(){var e=u();return e&&e.activationStart||0},s=function(e,n){var t=u(),r="navigate";return a>=0?r="back-forward-cache":t&&(r=document.prerendering||f()>0?"prerender":document.wasDiscarded?"restore":t.type.replace(/_/g,"-")),{name:e,value:void 0===n?-1:n,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:r}},d=function(e,n,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var r=new PerformanceObserver((function(e){Promise.resolve().then((function(){n(e.getEntries())}))}));return r.observe(Object.assign({type:e,buffered:!0},t||{})),r}}catch(e){}},l=function(e,n){var t=function t(r){"pagehide"!==r.type&&"hidden"!==document.visibilityState||(e(r),n&&(removeEventListener("visibilitychange",t,!0),removeEventListener("pagehide",t,!0)))};addEventListener("visibilitychange",t,!0),addEventListener("pagehide",t,!0)},v=function(e,n,t,r){var i,o;return function(a){n.value>=0&&(a||r)&&((o=n.value-(i||0))||void 0===i)&&(i=n.value,n.delta=o,n.rating=function(e,n){return e>n[1]?"poor":e>n[0]?"needs-improvement":"good"}(n.value,t),e(n))}},p=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},m=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},h=-1,g=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},y=function(e){"hidden"===document.visibilityState&&h>-1&&(h="visibilitychange"===e.type?e.timeStamp:0,E())},T=function(){addEventListener("visibilitychange",y,!0),addEventListener("prerenderingchange",y,!0)},E=function(){removeEventListener("visibilitychange",y,!0),removeEventListener("prerenderingchange",y,!0)},C=function(){return h<0&&(h=g(),T(),c((function(){setTimeout((function(){h=g(),T()}),0)}))),{get firstHiddenTime(){return h}}},L=function(e,n){n=n||{},m((function(){var t,r=[1800,3e3],i=C(),o=s("FCP"),a=d("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(a.disconnect(),e.startTime<i.firstHiddenTime&&(o.value=Math.max(e.startTime-f(),0),o.entries.push(e),t(!0)))}))}));a&&(t=v(e,o,r,n.reportAllChanges),c((function(i){o=s("FCP"),t=v(e,o,r,n.reportAllChanges),p((function(){o.value=performance.now()-i.timeStamp,t(!0)}))})))}))},b=function(e,n){n=n||{},m((function(){var t,r=[.1,.25],i=s("CLS"),o=-1,a=0,u=[],f=function(n){o>-1&&e(n)},m=function(e){e.forEach((function(e){if(!e.hadRecentInput){var n=u[0],r=u[u.length-1];a&&e.startTime-r.startTime<1e3&&e.startTime-n.startTime<5e3?(a+=e.value,u.push(e)):(a=e.value,u=[e]),a>i.value&&(i.value=a,i.entries=u,t())}}))},h=d("layout-shift",m);h&&(t=v(f,i,r,n.reportAllChanges),L((function(e){o=e.value,i.value<0&&(i.value=0,t())})),l((function(){m(h.takeRecords()),t(!0)})),c((function(){a=0,o=-1,i=s("CLS",0),t=v(f,i,r,n.reportAllChanges),p((function(){return t()}))})))}))},S={passive:!0,capture:!0},w=new Date,P=function(e,i){n||(n=i,t=e,r=new Date,F(removeEventListener),A())},A=function(){if(t>=0&&t<r-w){var e={entryType:"first-input",name:n.type,target:n.target,cancelable:n.cancelable,startTime:n.timeStamp,processingStart:n.timeStamp+t};i.forEach((function(n){n(e)})),i=[]}},I=function(e){if(e.cancelable){var n=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,n){var t=function(){P(e,n),i()},r=function(){i()},i=function(){removeEventListener("pointerup",t,S),removeEventListener("pointercancel",r,S)};addEventListener("pointerup",t,S),addEventListener("pointercancel",r,S)}(n,e):P(n,e)}},F=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(n){return e(n,I,S)}))},M=function(e,r){r=r||{},m((function(){var o,a=[100,300],u=C(),f=s("FID"),p=function(e){e.startTime<u.firstHiddenTime&&(f.value=e.processingStart-e.startTime,f.entries.push(e),o(!0))},m=function(e){e.forEach(p)},h=d("first-input",m);o=v(e,f,a,r.reportAllChanges),h&&l((function(){m(h.takeRecords()),h.disconnect()}),!0),h&&c((function(){var c;f=s("FID"),o=v(e,f,a,r.reportAllChanges),i=[],t=-1,n=null,F(addEventListener),c=p,i.push(c),A()}))}))},k=0,D=1/0,O=0,R=function(e){e.forEach((function(e){e.interactionId&&(D=Math.min(D,e.interactionId),O=Math.max(O,e.interactionId),k=O?(O-D)/7+1:0)}))},x=function(){return o?k:performance.interactionCount||0},B=function(){"interactionCount"in performance||o||(o=d("event",R,{type:"event",buffered:!0,durationThreshold:0}))},N=0,H=function(){return x()-N},_=[],j={},q=function(e){var n=_[_.length-1],t=j[e.interactionId];if(t||_.length<10||e.duration>n.latency){if(t)t.entries.push(e),t.latency=Math.max(t.latency,e.duration);else{var r={id:e.interactionId,latency:e.duration,entries:[e]};j[r.id]=r,_.push(r)}_.sort((function(e,n){return n.latency-e.latency})),_.splice(10).forEach((function(e){delete j[e.id]}))}},U=function(e,n){n=n||{},m((function(){var t=[200,500];B();var r,i=s("INP"),o=function(e){e.forEach((function(e){(e.interactionId&&q(e),"first-input"===e.entryType)&&(!_.some((function(n){return n.entries.some((function(n){return e.duration===n.duration&&e.startTime===n.startTime}))}))&&q(e))}));var n,t=(n=Math.min(_.length-1,Math.floor(H()/50)),_[n]);t&&t.latency!==i.value&&(i.value=t.latency,i.entries=t.entries,r())},a=d("event",o,{durationThreshold:n.durationThreshold||40});r=v(e,i,t,n.reportAllChanges),a&&(a.observe({type:"first-input",buffered:!0}),l((function(){o(a.takeRecords()),i.value<0&&H()>0&&(i.value=0,i.entries=[]),r(!0)})),c((function(){_=[],N=x(),i=s("INP"),r=v(e,i,t,n.reportAllChanges)})))}))},V={},z=function(e,n){n=n||{},m((function(){var t,r=[2500,4e3],i=C(),o=s("LCP"),a=function(e){var n=e[e.length-1];if(n){var r=Math.max(n.startTime-f(),0);r<i.firstHiddenTime&&(o.value=r,o.entries=[n],t())}},u=d("largest-contentful-paint",a);if(u){t=v(e,o,r,n.reportAllChanges);var m=function(){V[o.id]||(a(u.takeRecords()),u.disconnect(),V[o.id]=!0,t(!0))};["keydown","click"].forEach((function(e){addEventListener(e,m,{once:!0,capture:!0})})),l(m,!0),c((function(i){o=s("LCP"),t=v(e,o,r,n.reportAllChanges),p((function(){o.value=performance.now()-i.timeStamp,V[o.id]=!0,t(!0)}))}))}}))},G=function e(n){document.prerendering?m((function(){return e(n)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0)},J=function(e,n){n=n||{};var t=[800,1800],r=s("TTFB"),i=v(e,r,t,n.reportAllChanges);G((function(){var o=u();if(o){var a=o.responseStart;if(a<=0||a>performance.now())return;r.value=Math.max(a-f(),0),r.entries=[o],i(!0),c((function(){r=s("TTFB",0),(i=v(e,r,t,n.reportAllChanges))(!0)}))}}))},K=function e(n){document.prerendering?addEventListener("prerenderingchange",(function(){return e(n)}),!0):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0)};return e.getCLS=b,e.getFCP=L,e.getFID=M,e.getINP=U,e.getLCP=z,e.getTTFB=J,e.onCLS=b,e.onFCP=L,e.onFID=M,e.onINP=U,e.onLCP=z,e.onResource=function(e,n){n=n||{};var t=[100,300];K((function(){var r=function(r){var i;if(-1==r.name.indexOf("dataplane.rum")&&-1==r.name.indexOf("cognito-identity.")&&-1==r.name.indexOf("sts.")){var o,a=s("RESOURCE");o=v(e,a,t,null===(i=n)||void 0===i?void 0:i.reportAllChanges),a.value=r.responseEnd-r.startTime,a.entries=[r],o(!0)}},i=function(e){e.forEach(r)},o=d("resource",i);void 0!==performance?o&&l((function(){i(o.takeRecords()),o.disconnect()}),!0):console.log("= Calculate Load Times: performance NOT supported")}))},e.onTTFB=J,Object.defineProperty(e,"__esModule",{value:!0}),e}({});
