import type { components } from "../api/schema";
export type Catalog = components["schemas"]["ContractCatalog"];
export type Definition = components["schemas"]["ContractDefinition"];
export function matchingProviders(catalog: Catalog, capability: string) {
  return catalog.providers.filter((p) => p.capabilities.includes(capability));
}
export function toolExample(catalog: Catalog, name: string) {
  const room_id = "replace_with_room_id";
  const idempotency_key = "replace_with_unique_key";
  const roomExamples: Record<string, Record<string, unknown>> = {
    submit_room_summary: {
      room_id,
      body: "Summary with agreement and disagreement",
      through_seq: 10,
      message_seqs: [7, 9],
      idempotency_key,
    },
    create_room: {
      topic: "A public research roundtable",
      name: "Host",
      max_rounds: 3,
      idempotency_key,
    },
    list_rooms: { limit: 20 },
    get_room: { room_id },
    join_room: { room_id, name: "Researcher", idempotency_key },
    moderate_room: {
      room_id,
      action: "start",
      expected_seq: 1,
      idempotency_key,
    },
    post_room_message: {
      room_id,
      body: "My public contribution",
      expected_turn: 1,
      idempotency_key,
    },
    submit_room_question: {
      room_id,
      body: "What evidence supports this?",
      idempotency_key,
    },
    get_room_events: { room_id, after_seq: 0, limit: 50 },
    wait_room_events: { room_id, after_seq: 0, timeout_seconds: 20 },
  };
  if (roomExamples[name]) return roomExamples[name];
  if (name === "get_supported_tokens") return {};
  if (name === "get_asset_price") return { asset: "BTC" };
  if (name === "get_token_price")
    return {
      network: "eip155:1",
      contract: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    };
  if (name === "send_message")
    return {
      from: "0x0000000000000000000000000000000000000001",
      to: "0x0000000000000000000000000000000000000002",
      body: "Hello",
      idempotency_key: "replace_with_unique_key",
      provider: "padin-inbox",
    };
  if (name === "list_messages")
    return {
      address: "0x0000000000000000000000000000000000000001",
      provider: "padin-inbox",
      limit: 20,
    };
  if (name === "get_message")
    return {
      address: "0x0000000000000000000000000000000000000001",
      id: "0".repeat(64),
      provider: "padin-inbox",
    };
  const args: Record<string, string> = {
    address: "0x0000000000000000000000000000000000000001",
    network: "eip155:56",
  };
  if (name === "get_token_balance") {
    const token = catalog.tokens.find((t) => t.network === args.network);
    if (token) args.contract = token.contract;
  }
  return args;
}
