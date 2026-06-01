import {
  addBurger,
  listBurgers,
  parseListBurgersParams,
} from "@/mocks/burger-store";
import type { CreateBurgerRequest } from "@/types/burger";

export async function GET(request: Request) {
  const url = new URL(request.url);

  return Response.json(listBurgers(parseListBurgersParams(url.searchParams)));
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateBurgerRequest;
  const newBurger = addBurger(body);

  return Response.json(newBurger, { status: 201 });
}
