/*
 * Copyright 2020 Google LLC
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

// import { onBFCacheRestore } from './lib/bfcache.js';
import { bindReporter } from './lib/bindReporter.js';
// import { getVisibilityWatcher } from './lib/getVisibilityWatcher.js';
import { initMetric } from './lib/initMetric.js';
import { observe } from './lib/observe.js';
import { onHidden } from './lib/onHidden.js';
import { ResourceMetric, ReportCallback, ReportOpts } from './types.js';

/**
 * Runs in the next task after the page is done loading and/or prerendering.
 * @param callback
 */
const whenReady = (callback: () => void) => {
  if (document.prerendering) {
    addEventListener('prerenderingchange', () => whenReady(callback), true);
  } else if (document.readyState !== 'complete') {
    addEventListener('load', () => whenReady(callback), true);
  } else {
    // Queue a task so the callback runs after `loadEventEnd`.
    setTimeout(callback, 0);
  }
}

/**
 * Calculates the [FID](https://web.dev/fid/) value for the current page and
 * calls the `callback` function once the value is ready, along with the
 * relevant `first-input` performance entry used to determine the value. The
 * reported value is a `DOMHighResTimeStamp`.
 *
 * _**Important:** since FID is only reported after the user interacts with the
 * page, it's possible that it will not be reported for some page loads._
 */
export const onResource = (onReport: ReportCallback, opts?: ReportOpts) => {
  // Set defaults
  opts = opts || {};

  // https://web.dev/fid/#what-is-a-good-fid-score
  const thresholds = [100, 300];

  whenReady(() => {

    const handleEntry = (entry: PerformanceResourceTiming) => {
      if (entry.name.indexOf("dataplane.rum") != -1 ||
        entry.name.indexOf("cognito-identity.") != -1 ||
        entry.name.indexOf("sts.") != -1) {
        return;
      }
      let metric = initMetric('RESOURCE');
      let report: ReturnType<typeof bindReporter>;
      report = bindReporter(onReport, metric, thresholds, opts?.reportAllChanges);
      // Only report if the page wasn't hidden prior to the first input.
      // console.log("Entry :%j", entry);
      metric.value = entry.responseEnd - entry.startTime;
      metric.entries = [entry];
      report(true);
    }

    const handleEntries = (entries: ResourceMetric['entries']) => {
      (entries as PerformanceResourceTiming[]).forEach(handleEntry);
    }

    const po = observe('resource', handleEntries);

    if (performance === undefined) {
      console.log("= Calculate Load Times: performance NOT supported");
      return;
    }

    // Get a list of "resource" performance entries
    // let resources = performance.getEntriesByType("resource");
    // (resources as PerformanceResourceTiming[]).forEach(handleEntry)

    if (po) {
      onHidden(() => {
        handleEntries(po.takeRecords() as ResourceMetric['entries']);
        po.disconnect();
      }, true);
    }
  });
};
