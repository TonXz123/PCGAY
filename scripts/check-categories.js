const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            category: true,
        }
    });

    console.log('Product Categories:');
    products.forEach(p => {
        console.log(`- [${p.id}] ${p.name}: category="${p.category}"`);
    });

    const categories = await prisma.product.groupBy({
        by: ['category'],
        _count: {
            id: true
        }
    });

    console.log('\nCategory Summary:');
    categories.forEach(c => {
        console.log(`- "${c.category}": ${c._count.id} products`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
