import { getBurgerById } from "@/mocks/burger-store";

interface BurgerRouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: BurgerRouteParams) {
  const { id } = await params;
  const burger = getBurgerById(id);

  if (!burger) {
    return new Response(null, { status: 404 });
  }

  return Response.json(burger);
}
