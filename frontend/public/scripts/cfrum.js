import{onCLS,onFID,onLCP,onFCP,onINP,onTTFB,onResource}from"./web-vitals.attribution.js";function sendToAnalytics(n){let t={};n.attribution.serverTiming&&(n.attribution.serverTiming.map(n=>{var e=n.name.replaceAll("-","").replaceAll("_","");t[`sth${e}`]=n.description?n.description:n.name,n.duration&&(t[`sth${e}duration`]=n.duration)}),delete n.attribution.serverTiming);let e={...n.attribution,...t};e.delta=n.delta,e.value=n.value,e.rating=n.rating,cwr("recordEvent",{type:"cdn_metrics",data:e}),console.log("Sent Metric :%j",e)}onLCP(sendToAnalytics),onFCP(sendToAnalytics),onTTFB(sendToAnalytics),onResource(sendToAnalytics);