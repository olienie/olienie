firecrawl browser execute "open https://example.com"
firecrawl browser execute "snapshot"

curl --request POST \
  --url https://api.firecrawl.dev/v2/browser \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '
{
  "ttl": 300,
  "activityTtl": 1805,
  "streamWebView": true,
  "profile": {
    "name": "<string>",
    "saveChanges": true
  }
}
'

curl -X POST "https://api.firecrawl.dev/v2/browser/YOUR_SESSION_ID/execute" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "agent-browser snapshot",
    "language": "bash"
  }'
