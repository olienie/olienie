import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const result = await firecrawl.deleteBrowser("YOUR_SESSION_ID");

console.log(result.success);
console.log(result.id);
console.log(result.cdpUrl);
console.log(result.liveViewUrl);
console.log(result.interactiveLiveViewUrl);
console.log(result.expiresAt);
