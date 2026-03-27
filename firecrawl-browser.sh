firecrawl browser execute "open https://example.com"
firecrawl browser execute "snapshot"

curl -X POST "https://api.firecrawl.dev/v2/browser" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ttl": 120
  }'
# {
#   "success": true,
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "cdpUrl": "wss://cdp-proxy.firecrawl.dev/cdp/550e8400-e29b-41d4-a716-446655440000",
#   "liveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000",
#   "interactiveLiveViewUrl": "https://liveview.firecrawl.dev/550e8400-e29b-41d4-a716-446655440000?interactive=true"
# }

curl -X POST "https://api.firecrawl.dev/v2/browser/550e8400-e29b-41d4-a716-446655440000/execute" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "await page.goto(\"https://example.com\")\ntitle = await page.title()\nprint(title)",
    "language": "python"
  }'
# {
#   "success": true,
#   "result": "Example Domain"
# }

# {
#   "success": true,
#   "error": "TimeoutError: page.goto: Timeout 30000ms exceeded."
# }
