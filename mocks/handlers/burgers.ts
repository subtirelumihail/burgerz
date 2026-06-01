import { http, HttpResponse } from "msw";

import {
  addBurger,
  getBurgerById,
  listBurgers,
  parseListBurgersParams,
} from "@/mocks/burger-store";
import type { CreateBurgerRequest } from "@/types/burger";

export const burgerHandlers = [
  http.get("/api/burgers/:id", ({ params }) => {
    const id = params.id;

    if (typeof id !== "string") {
      return new HttpResponse(null, { status: 400 });
    }

    const burger = getBurgerById(id);

    if (!burger) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(burger);
  }),

  http.get("/api/burgers", ({ request }) => {
    const url = new URL(request.url);

    return HttpResponse.json(
      listBurgers(parseListBurgersParams(url.searchParams)),
    );
  }),

  http.post("/api/burgers", async ({ request }) => {
    const body = (await request.json()) as CreateBurgerRequest;
    const newBurger = addBurger(body);

    return HttpResponse.json(newBurger, { status: 201 });
  }),
];
