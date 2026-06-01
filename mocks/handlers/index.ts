import { http, HttpResponse } from "msw";

import { burgerHandlers } from "./burgers";
import { reviewHandlers } from "./reviews";

export const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({ status: "ok", mocked: true });
  }),
  ...burgerHandlers,
  ...reviewHandlers,
];
