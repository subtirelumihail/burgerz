import { listBurgers, parseListBurgersParams } from "@/mocks/burger-store";

export async function GET(request: Request) {
  const url = new URL(request.url);

  return Response.json(listBurgers(parseListBurgersParams(url.searchParams)));
}
