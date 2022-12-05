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

import { Metric, ReportCallback } from './base.js';

/**
 * A CLS-specific version of the Metric object.
 */
export interface ResourceMetric extends Metric {
  name: 'RESOURCE';
  entries: PerformanceResourceTiming[];
}

/**
 * A CLS-specific version of the ReportCallback function.
 */
export interface ResourceReportCallback extends ReportCallback {
  (metric: ResourceMetric): void;
}

export interface ResourceAttribution {

  waitingTime: number;
  /**
   * The total time to resolve the DNS for the current request.
   */
  dnsTime: number;
  /**
   * The total time to create the connection to the requested domain.
   */
  connectionTime: number;
  /**
   * The time time from when the request was sent until the first byte of the
   * response was received. This includes network time as well as server
   * processing time.
   */
  requestTime: number;
  /**
     * The transfer size
     */
  transferSize: number;
  /**
     * The compression rate
     */
  compressRate?: number;
  /**
       * The compression rate
       */
  cacheStatus?: string;
  //HTTP protocol used
  nextHopProtocol?: string;

  //caller of this resource, image,link,script
  initiatorType?: string;

  cdn?: string;
  //environment whether staging or prod..no value implies its prod
  env?: string;

  // name of the resource
  name?: string;

  serverTiming?: object;

  //metric Type whether resource, navigation, ttfb, lcp 
  metricType: string;
  /**
   * The `PerformanceResourceTiming` entry used to determine TTFB (or the
   * polyfill entry in browsers that don't support Navigation Timing).
   */
  // performanceEntry?: PerformanceResourceTiming;
}

/**
 * A Resource-specific version of the Metric object with attribution.
 */
export interface ResourceMetricWithAttribution extends ResourceMetric {
  attribution?: ResourceAttribution;
}

/**
 * A Resource-specific version of the ReportCallback function with attribution.
 */
export interface ResourceReportCallbackWithAttribution extends ResourceReportCallback {
  (metric: ResourceMetricWithAttribution): void;
}