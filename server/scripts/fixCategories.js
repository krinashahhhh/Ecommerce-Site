const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCategoriesToLowerCase() {
  const allProducts = await prisma.product.findMany();

  for (const product of allProducts) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        category: product.category.toLowerCase(),
      },
    });
  }

  console.log('✅ Categories normalized to lowercase');
  process.exit();
}

fixCategoriesToLowerCase();
