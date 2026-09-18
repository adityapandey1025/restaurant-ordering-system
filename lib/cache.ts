import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getCachedMenuItems = unstable_cache(
  async () => {
    return await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
    });
  },
  ["menu-items"],
  { tags: ["menu", "categories"] }
);

export const getCachedCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },
  ["categories"],
  { tags: ["categories"] }
);
