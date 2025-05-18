const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAllProducts() {
  const all = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  console.log('✅ Total products in DB:', all.length);
  console.log('🆔 All product IDs:', all.map(p => p.id));
  process.exit(); // Close script after running
}

listAllProducts().catch((err) => {
  console.error('Error running script:', err);
  process.exit(1);
});
