import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: "fc-YOUR-API-KEY" });

const session = await firecrawl.browser({
  ttl: 600,
  profile: {
    name: "my-profile",
    saveChanges: true,
  },
});

const result = await firecrawl.browserExecute(session.id, {
  code: `
import base64

async with page.expect_download() as download_info:
    await page.click('a#download-link')  # Click the element that triggers the download

download = download_info.value
path = await download.path()

# Optionally save to a known path
# await download.save_as('/tmp/myfile.pdf')

# Read and output file content as base64
with open(path, "rb") as f:
    content = base64.b64encode(f.read()).decode()
    print(content)
`,
  language: "python",
});

console.log(result.success);
console.log(result.stdout);
console.log(result.result);
console.log(result.stderr);
console.log(result.exitCode);
console.log(result.killed);
