export function sendToAnalytics(metric) {

    let attr = {};
    if (metric.attribution.serverTiming) {
        metric.attribution.serverTiming.map(sth => {
            // console.log("sth :%j", sth);
            var name = sth.name.replaceAll("-", "").replaceAll("_", "");
            attr[`sth${name}`] = sth.description ? sth.description : sth.name;
            if (sth.duration) {
                attr[`sth${name}duration`] = sth.duration;
            }
        });
        delete (metric.attribution.serverTiming);
    }
    let payload = { ...metric.attribution, ...attr };
    // delete (payload.serverTiming);
    payload['delta'] = metric.delta;
    payload['value'] = metric.value;
    payload['rating'] = metric.rating;

    cwr('recordEvent', {
        type: 'cdn_metrics',
        data: payload,
    });
    console.log("Sent Metric :%j", payload);
}

// onCLS(console.log);
// onFID(console.log);
// onLCP(sendToAnalytics);
// onFCP(sendToAnalytics);
// // onINP(console.log);
// onTTFB(sendToAnalytics);
// onResource(sendToAnalytics);