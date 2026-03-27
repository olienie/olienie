import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const { sessions } = await firecrawl.listBrowsers();

for (const s of sessions) {
  console.log(s.id);
  console.log(s.status);
  console.log(s.cdpUrl);
  console.log(s.liveViewUrl);
  console.log(s.interactiveLiveViewUrl);
  console.log(s.createdAt);
  console.log(s.lastActivity);
}

// Filter by status
const { sessions: active } = await firecrawl.listBrowsers({ status: "active" });
console.log(active);
