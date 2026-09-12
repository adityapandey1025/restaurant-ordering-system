import { PrismaClient, Role, Permission, TransactionType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const images = [
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=900&q=80",
];

async function main() {
  const passwordHash = await bcrypt.hash("Demo123!", 12);
  const users = [
    { name: "Asha Admin", email: "admin@table.test", role: Role.ADMIN, balance: 0 },
    { name: "Samir Staff", email: "staff@table.test", role: Role.STAFF, balance: 0 },
    { name: "Kavya Customer", email: "customer@table.test", role: Role.CUSTOMER, balance: 2500 },
    { name: "Rohan Customer", email: "rohan@table.test", role: Role.CUSTOMER, balance: 1200 },
  ];
  for (const data of users) {
    const user = await prisma.user.upsert({
      where: { email: data.email }, update: { name: data.name, role: data.role, passwordHash, isSuspended: false },
      create: { name: data.name, email: data.email, role: data.role, passwordHash },
    });
    const wallet = await prisma.wallet.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, balance: data.balance } });
    await prisma.cart.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
    if (data.balance > 0 && !(await prisma.transaction.count({ where: { walletId: wallet.id, type: TransactionType.TOPUP } }))) {
      await prisma.transaction.create({ data: { walletId: wallet.id, type: TransactionType.TOPUP, amount: data.balance } });
    }
    if (data.role === Role.STAFF) {
      for (const permission of [Permission.MANAGE_MENU, Permission.MANAGE_ORDERS]) await prisma.staffPermission.upsert({ where: { staffId_permission: { staffId: user.id, permission } }, update: {}, create: { staffId: user.id, permission } });
    }
  }
  await prisma.platformLedger.upsert({ where: { id: "PLATFORM" }, update: {}, create: { id: "PLATFORM" } });
  const mains = await prisma.category.upsert({ where: { name: "Mains" }, update: {}, create: { name: "Mains" } });
  const snacks = await prisma.category.upsert({ where: { name: "Small Plates" }, update: {}, create: { name: "Small Plates" } });
  const menu = [
    ["Samosa Chaat", "Crisp samosas, chickpeas, tamarind and mint chutney.", 180, snacks.id],
    ["Paneer Tikka", "Charred paneer with peppers, onion and coriander chutney.", 320, snacks.id],
    ["Dahi Puri", "Crisp puris filled with potato, yogurt and bright chutneys.", 210, snacks.id],
    ["Masala Corn", "Sweet corn tossed with lime, chilli and toasted cumin.", 160, snacks.id],
    ["Butter Chicken", "Tandoor-roasted chicken in a silky tomato and fenugreek gravy.", 460, mains.id],
    ["Dal Makhani", "Black lentils slow-cooked overnight with butter and cream.", 340, mains.id],
    ["Palak Paneer", "Cottage cheese folded through a garlicky spinach gravy.", 380, mains.id],
    ["Chicken Biryani", "Fragrant basmati rice, saffron and spiced chicken, served with raita.", 440, mains.id],
  ] as const;
  for (let index = 0; index < menu.length; index++) {
    const [name, description, price, categoryId] = menu[index];
    const existing = await prisma.menuItem.findFirst({ where: { name } });
    if (existing) await prisma.menuItem.update({ where: { id: existing.id }, data: { description, price, categoryId, imageUrl: images[index], isAvailable: true } });
    else await prisma.menuItem.create({ data: { name, description, price, categoryId, imageUrl: images[index] } });
  }
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
