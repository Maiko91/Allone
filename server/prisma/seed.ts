import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Limpiar base de datos (Opcional, ten cuidado en producción)
    // await prisma.list.deleteMany();
    // await prisma.product.deleteMany();
    // await prisma.category.deleteMany();

    // 2. Crear categoría base
    const generalCategory = await prisma.category.upsert({
        where: { name: 'General' },
        update: {},
        create: { name: 'General' },
    });

    // 3. Crear lista base
    const defaultList = await prisma.list.upsert({
        where: {
            name_categoryId: {
                name: 'Top 10 General',
                categoryId: generalCategory.id,
            },
        },
        update: {},
        create: {
            name: 'Top 10 General',
            categoryId: generalCategory.id,
        },
    });

    console.log({ generalCategory, defaultList });
    console.log('✅ Seed finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
