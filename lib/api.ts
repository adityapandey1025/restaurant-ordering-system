import { AuthError } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof AuthError) return Response.json({ error: error.message }, { status: error.status });
  if (error instanceof ZodError) return Response.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return Response.json({ error: "That value is already in use" }, { status: 409 });
  }
  console.error("API error", error instanceof Error ? error.message : error);
  return Response.json({ error: "Something went wrong" }, { status: 500 });
}

export async function body(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON body");
  }
}
