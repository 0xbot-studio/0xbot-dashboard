export const contractCopy = {
  en: {
    intro:
      "One capability contract. Multiple provider adapters. The same result for REST and MCP.",
    readonly:
      "Read-only · code-owned contracts. Changes require review, tests and a release; this page cannot enable unsupported capabilities.",
    search: "Filter by name or ID",
    empty: "No matching definitions",
    input: "Input schema",
    output: "Unified output schema",
    rules: "Contract rules",
    mapping: "Provider coverage",
    instructions: "Server-wide MCP instructions",
    linked: "Capability contract",
    registry: "Token registry helper · not a routed balance capability",
    example: "Example arguments (illustrative, not executed)",
    status: "Observed route state",
    enabled: "Enabled",
    disabled: "Disabled",
    priority: "Priority",
    network: "Network",
    schemaNote:
      "REST schemas below are from OpenAPI. References resolve against the schema bundle; MCP schemas come from actual tool registration.",
    bundle: "OpenAPI schema bundle",
    standard: "Output standard v1",
    standardText:
      "Successful routed queries share id, provider, status, latency_ms, fee_usd and data. Data remains capability-specific: one balance or a three-asset list. Amounts and fees are exact strings, never floating-point values.",
    errors: "Errors and transport boundaries",
    errorsText:
      "REST uses HTTP status plus error.code and error.request_id. MCP tool failures use isError and safe text; protocol/authentication errors are separate. They share business semantics, not an identical wire envelope. Zero balance is success; unavailable data is never zero.",
    adapters: "Adapter obligations",
    adapterText:
      "Normalize upstream fields, verify chain and token decimals, preserve asset identity and observation block, reject malformed results, propagate cancellation, and never expose credentials or raw vendor errors. Free public routes have no paid fallback or SLA.",
    tests: "Verification evidence",
    testsText:
      "Adapter fixture and routing tests run in CI. This page shows registered support and observed circuit state, not a live certification or test-run history.",
    manage: "Manage provider routing",
    noProvider: "No registered provider for this capability.",
    docs: "Download contract snapshot",
    refresh: "Refresh",
    tools: "MCP tools",
    details: "Definition",
    address: "Example owner address",
    limitations:
      "Only the three released balance contracts are shown. NFT, receipts, swaps and payments are not executable contracts.",
  },
  zh: {
    intro: "一份能力契约，多家供应商适配，REST 与 MCP 共享同一业务结果。",
    readonly:
      "只读 · 契约由代码维护。变更须经过评审、测试与发布；此页面不能启用尚未实现的能力。",
    search: "按名称或 ID 筛选",
    empty: "没有匹配的定义",
    input: "输入 Schema",
    output: "统一输出 Schema",
    rules: "契约规则",
    mapping: "供应商覆盖",
    instructions: "MCP 服务级使用说明",
    linked: "关联能力契约",
    registry: "代币注册表辅助工具 · 不是路由余额能力",
    example: "参数示例（仅演示，未执行）",
    status: "路由观测状态",
    enabled: "已启用",
    disabled: "已停用",
    priority: "优先级",
    network: "网络",
    schemaNote:
      "REST Schema 来自 OpenAPI；引用以完整 Schema 包解析。MCP Schema 来自实际工具注册。",
    bundle: "OpenAPI Schema 包",
    standard: "统一输出标准 v1",
    standardText:
      "成功的路由查询统一包含 id、provider、status、latency_ms、fee_usd 和 data。data 保留能力语义：单个余额或三资产列表。金额和费用使用精确字符串，禁止浮点数。",
    errors: "错误与传输边界",
    errorsText:
      "REST 使用 HTTP 状态码及 error.code、error.request_id；MCP 工具失败使用 isError 和安全文本，协议或认证错误单独处理。共享业务语义，不伪装成完全相同的传输格式。零余额是成功，查询失败不能转换成零。",
    adapters: "适配器义务",
    adapterText:
      "转换上游字段、核验链和代币精度、保留资产身份与观测区块、拒绝畸形结果、传播取消信号；不暴露凭证及原始供应商错误。免费公共线路无付费兜底，不提供 SLA。",
    tests: "验证说明",
    testsText:
      "适配器固定样本和路由测试在 CI 中执行。此处展示已注册能力和熔断观测状态，不是实时认证结果或测试运行历史。",
    manage: "管理供应商路由",
    noProvider: "此能力没有已注册的供应商。",
    docs: "下载契约快照",
    refresh: "刷新",
    tools: "MCP 工具",
    details: "定义",
    address: "示例持有者地址",
    limitations:
      "仅展示三项已发布的余额契约。NFT、交易回执、兑换与支付尚不是可执行契约。",
  },
};
