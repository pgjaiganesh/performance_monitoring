function sendToAnalytics(metric) {

    cwr('recordEvent', {
        type: 'cdn_metrics',
        data: metric,
    });
    console.log("Sent Metric :%j", metric);
}

/**
 * Runs in the next task after the page is done loading and/or prerendering.
 * @param callback
 */
// const whenReady = (callback) => {
//     if (document.prerendering) {
//         addEventListener('prerenderingchange', () => whenReady(callback), true);
//     } else if (document.readyState !== 'complete') {
//         addEventListener('load', () => whenReady(callback), true);
//     } else {
//         // Queue a task so the callback runs after `loadEventEnd`.
//         setTimeout(callback, 0);
//     }
// }

// whenReady(() => {
console.log("Ready");
if (performance === undefined) {
    console.log("Calculate Load Times: performance NOT supported");
    // return;
}

const handleEntry = (entry) => {
    console.log("Entry :%j", entry);
    if (entry.name.indexOf("dataplane.rum.") != -1 ||
        entry.name.indexOf("cognito-identity.") != -1) {
        console.log("Skipping...");
        return;
    }

    let metric = {};
    if (entry.serverTiming.length > 0) {
        metric['type'] = entry.initiatorType;
        let cdn = entry.serverTiming.find(el => el.name === 'cdn-rid');
        if (cdn) {
            metric['cdn'] = "cloudfront";
            metric['cachestatus'] = entry.serverTiming.find(el => el.name === 'cdn-cache-miss') ? "MISS" : "HIT";
        }
        else {
            metric['cdn'] = 'akamai';
            metric['cachestatus'] = entry.serverTiming.find(el => el.name === 'cdn-cache')?.description;
        }

        if (entry.initiatorType === 'link' || entry.initiatorType === 'script' ||
            entry.initiatorType === 'navigation') {
            metric['compRate'] = 1 - (entry.encodedBodySize / entry.decodedBodySize);
        }
        metric['transfersize'] = entry.transferSize;
        metric['protocol'] = entry.nextHopProtocol;
        metric['name'] = entry.name;
        metric['tlstime'] = entry.requestStart - entry.connectStart;
        metric['ttfb'] = entry.responseStart - entry.requestStart;
        metric['ttlb'] = entry.responseEnd - entry.requestStart;
        if (entry.entryType === 'navigation') {
            metric['pageload'] = entry.duration;
        }
    }
    else {
        console.log("Skipping...");
        return;
    }

    sendToAnalytics(metric);
}

const handleEntries = (entries) => {
    (entries).forEach(handleEntry);
}

const observe_all = new PerformanceObserver((list, obs) => {
    const perfEntries = list.getEntries();
    perfEntries
        // .filter(res => (res.initiatorType == 'xmlhttprequest'))
        .map((entry) => handleEntry(entry));

});
// observe_all.observe({ entryTypes: ["resource", "navigation", "largest-contentful-paint"] });
observe_all.observe({ entryTypes: ["resource", "navigation"] });