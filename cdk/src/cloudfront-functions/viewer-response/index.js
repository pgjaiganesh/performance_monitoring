function handler(event) {
    console.log(JSON.stringify(event));
    var response = event.response;
    var headers = response.headers;

    // Set HTTP security headers
    // Since JavaScript doesn't allow for hyphens in variable names, we use the dict["key"] notation 
    if (getRandomInt(2) == 0) {
        var valueStr = "cdn;desc=cloudfront,";
        if (getRandomInt(2) == 0) {
            valueStr = valueStr.concat("cdn-cache-miss");
        }
        else {
            valueStr = valueStr.concat("cdn-cache-hit");
        }
        headers['server-timing'] = { value: valueStr };
    }
    else {
        var valueStr = "edge; dur=1,";
        if (getRandomInt(2) == 0) {
            valueStr = valueStr.concat("cdn-cache; desc=MISS");
        }
        else {
            valueStr = valueStr.concat("cdn-cache; desc=HIT");
        }
        headers['server-timing'] = { value: valueStr };
    }

    // Return the response to viewers 
    return response;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}