import { http, HttpResponse } from "msw";

import { burgerHandlers } from "./burgers";
import { restaurantHandlers } from "./restaurants";
import { reviewHandlers } from "./reviews";

export const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({ status: "ok", mocked: true });
  }),
  ...burgerHandlers,
  ...restaurantHandlers,
  ...reviewHandlers,
];
