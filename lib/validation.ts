import { z } from "zod";

const money = z.coerce.number().positive().max(1_000_000).multipleOf(0.01);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(72),
});

export const cartItemSchema = z.object({
  menuItemId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(25),
});

export const cartQuantitySchema = z.object({ quantity: z.coerce.number().int().min(1).max(25) });
export const topUpSchema = z.object({ amount: money });

export const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5).max(500),
  price: money,
  categoryId: z.string().cuid(),
  imageUrl: z.string().url(),
  isAvailable: z.boolean().default(true),
});

export const menuItemUpdateSchema = menuItemSchema.partial().refine((data) => Object.keys(data).length > 0);
export const categorySchema = z.object({ name: z.string().trim().min(2).max(50) });
export const suspendSchema = z.object({ isSuspended: z.boolean() });
export const staffSchema = registerSchema.extend({
  permissions: z.array(z.enum(["MANAGE_MENU", "MANAGE_ORDERS"])).min(1),
});
export const staffUpdateSchema = z.object({
  role: z.enum(["STAFF", "ADMIN"]),
  permissions: z.array(z.enum(["MANAGE_MENU", "MANAGE_ORDERS"])),
});
export const orderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"]),
});
