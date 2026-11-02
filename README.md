# 0xbot dashboard

Independent React/TypeScript administrator console. Warm cream design, English and Chinese.

## Develop

Node 22.21+; npm ci, npm run dev. npm run build creates dist/. npm run typecheck validates types. Set VITE_API_URL for non-default APIs; development defaults to http://localhost:8095 and production to https://api.0xbot.org. Your exact browser origin must be allowed by the API.

Generate the client with OPENAPI_SOURCE=/path/to/versioned/openapi.json npm run generate:api; if omitted it reads the published contract. Do not edit src/api/schema.d.ts.

The Dockerfile performs an independent production build and serves on port 8080 as the unprivileged nginx user. No backend credentials are part of frontend configuration.

Administrator wallet allowlist and TOTP are both enforced by the API. The first release supports Provider enable/priority settings and audit history. Public registration grants no administrator role.

The read-only contract center adds `#contracts`, `#mcp-tools`, and `#adapters`, with optional `/id` selection. It reads `/v1/admin/contracts` from API 0.4.0: versioned capability rules, REST schemas, actual MCP schemas/instructions, and provider/network mappings. Snapshot export contains public contract metadata and route settings, not credentials. Planned capabilities, online schema editing, adapter certification and CI run history are not implemented. `npm test` covers bilingual page rendering and mapping examples; this is not browser interaction QA. Deploy API 0.4.0 before publishing these pages.

Engineering policy: root AGENTS.md baseline 2026-09-07 is mirrored in docs/engineering-policy.md for independent checkouts. Local AGENTS.md defines project-specific boundaries.

## License

Apache-2.0, see [LICENSE](LICENSE). The 0xbot name, logo and 0xbot.org domains are project trademarks and are not licensed for third-party deployments — please rebrand self-hosted forks. Platform overview, architecture and ADRs: [0xbot-studio/0xbot](https://github.com/0xbot-studio/0xbot).
