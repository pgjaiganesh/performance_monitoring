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

export const getCDNProviderCacheStatus = (serverTiming: readonly PerformanceServerTiming[]) => {
  // let el = serverTiming.find(el => el.name === '');
  let response = { cacheStatus: "NA", cdn: "NA" };
  serverTiming.map(el => {
    switch (el.name) {
      case 'cdn-cache-miss':
        response.cacheStatus = "MISS";
        response.cdn = "Cloudfront";
        break;
      case 'cdn-cache-hit':
        response.cacheStatus = "HIT";
        response.cdn = "Cloudfront";
        break;
      // header signifies its CloudFront
      // case 'cdn-rid':
      //   response.cdn = "Cloudfront";
      //   break;
      // header signifies its Akamai
      case 'cdn-cache':
        response.cdn = "Akamai";
        response.cacheStatus = el.description;
        break;
    }
  });

  return response;
};
