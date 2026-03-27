import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const session = await firecrawl.browser({
  ttl: 120,
  activityTtl: 60,
});

console.log(session.id);
console.log(session.cdpUrl);                  // wss://browser.firecrawl.dev/cdp/...
console.log(session.liveViewUrl);             // https://liveview.firecrawl.dev/...
console.log(session.interactiveLiveViewUrl);  // https://liveview.firecrawl.dev/...
console.log(session.expiresAt);               // 2025-01-15T10:40:00Z
