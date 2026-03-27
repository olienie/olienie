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

curl -X POST "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID/execute" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "agent-browser snapshot",
    "language": "bash"
  }'
