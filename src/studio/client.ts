import { api, result } from "../api/client";
import type { components } from "../api/schema";
type RawCreateInput = components["schemas"]["RoomStudioCreateInput"];
export type CreateInput = Omit<RawCreateInput, "plan"> & {
  plan: Omit<RawCreateInput["plan"], "guests"> & {
    guests: NonNullable<RawCreateInput["plan"]["guests"]>;
  };
};
export type Guest = CreateInput["plan"]["guests"][number];
export type RoomResult = components["schemas"]["RoomResult"];
export const studio = {
  list: (before_id = "") =>
    api
      .POST("/v1/admin/rooms/list", { body: { before_id, limit: 20 } })
      .then(result),
  get: (room_id: string) =>
    api.POST("/v1/admin/rooms/get", { body: { room_id } }).then(result),
  create: (body: CreateInput, signal: AbortSignal) =>
    api.POST("/v1/admin/rooms/create", { body, signal }).then(result),
  moderate: (
    body: components["schemas"]["RoomModerateInput"],
    signal: AbortSignal,
  ) => api.POST("/v1/admin/rooms/moderate", { body, signal }).then(result),
  summary: (
    body: components["schemas"]["RoomSummaryInput"],
    signal: AbortSignal,
  ) => api.POST("/v1/admin/rooms/summary", { body, signal }).then(result),
};
