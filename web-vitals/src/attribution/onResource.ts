/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { onResource as unattributedOnResource } from '../onResource.js';
import { getCDNProviderCacheStatus } from '../lib/getCDNProvider.js';
import { ResourceMetric, ResourceMetricWithAttribution, ResourceReportCallback, ResourceReportCallbackWithAttribution, ReportOpts } from '../types.js';

const attributeResource = (metric: ResourceMetric): void => {
  if (metric.entries?.length) {
    const performanceEntry = metric.entries[0];
    const activationStart = performanceEntry.startTime || 0;

    const dnsStart = Math.max(
      performanceEntry.domainLookupStart - activationStart, 0);
    const connectStart = Math.max(
      performanceEntry.connectStart - activationStart, 0);
    const requestStart = Math.max(
      performanceEntry.requestStart - activationStart, 0);
    const responseStart = Math.max(
      performanceEntry.responseStart - activationStart, 0);

    const env = performanceEntry.serverTiming.find(el => el.name === 'stage');
    const cdnCacheStatus = getCDNProviderCacheStatus(performanceEntry.serverTiming);

    // console.log("Response status ", performanceEntry.responseStatus);
    (metric as ResourceMetricWithAttribution).attribution = {
      waitingTime: dnsStart,
      dnsTime: connectStart - dnsStart,
      connectionTime: requestStart - connectStart,
      requestTime: responseStart - requestStart,
      // requestTime: metric.value - requestStart,
      transferSize: performanceEntry.transferSize,
      // performanceEntry: performanceEntry,
      compressRate: 1 - (performanceEntry.encodedBodySize / performanceEntry.decodedBodySize),
      cacheStatus: cdnCacheStatus.cacheStatus,
      cdn: cdnCacheStatus.cdn,
      env: env ? env.description : "prod",
      initiatorType: performanceEntry.initiatorType,
      nextHopProtocol: performanceEntry.nextHopProtocol,
      name: performanceEntry.name,
      serverTiming: performanceEntry.serverTiming,
      metricType: metric.name,
    };
    // delete metric.entries;
  } else {
    (metric as ResourceMetricWithAttribution).attribution = {
      waitingTime: 0,
      dnsTime: 0,
      connectionTime: 0,
      requestTime: 0,
      transferSize: 0,
      metricType: metric.name,
    };
  }
};

/**
 * Calculates the [TTFB](https://web.dev/time-to-first-byte/) value for the
 * current page and calls the `callback` function once the page has loaded,
 * along with the relevant `navigation` performance entry used to determine the
 * value. The reported value is a `DOMHighResTimeStamp`.
 *
 * Note, this function waits until after the page is loaded to call `callback`
 * in order to ensure all properties of the `navigation` entry are populated.
 * This is useful if you want to report on other metrics exposed by the
 * [Navigation Timing API](https://w3c.github.io/navigation-timing/). For
 * example, the TTFB metric starts from the page's [time
 * origin](https://www.w3.org/TR/hr-time-2/#sec-time-origin), which means it
 * includes time spent on DNS lookup, connection negotiation, network latency,
 * and server processing time.
 */
export const onResource = (onReport: ResourceReportCallbackWithAttribution, opts?: ReportOpts) => {
  unattributedOnResource(((metric: ResourceMetricWithAttribution) => {
    attributeResource(metric);
    onReport(metric);
  }) as ResourceReportCallback, opts);
};