const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleAutoTranslate = (text) => {
    if (!text) return '';
    return `${text} (EN)`;
};

async function main() {
    console.log('🚀 Starting Database Translation Repair...');

    // 1. Translate Categories
    const categories = await prisma.category.findMany({
        include: { translations: true }
    });

    for (const cat of categories) {
        if (!cat.translations.find(t => t.lang === 'en')) {
            console.log(`Translating Category: ${cat.name}`);
            await prisma.categoryTranslation.create({
                data: {
                    lang: 'en',
                    name: handleAutoTranslate(cat.name),
                    categoryId: cat.id
                }
            });
        }
        if (!cat.translations.find(t => t.lang === 'es')) {
            await prisma.categoryTranslation.create({
                data: {
                    lang: 'es',
                    name: cat.name,
                    categoryId: cat.id
                }
            });
        }
    }

    // 2. Translate Lists
    const lists = await prisma.list.findMany({
        include: { translations: true }
    });

    for (const list of lists) {
        if (!list.translations.find(t => t.lang === 'en')) {
            console.log(`Translating List: ${list.name}`);
            await prisma.listTranslation.create({
                data: {
                    lang: 'en',
                    name: handleAutoTranslate(list.name),
                    listId: list.id
                }
            });
        }
        if (!list.translations.find(t => t.lang === 'es')) {
            await prisma.listTranslation.create({
                data: {
                    lang: 'es',
                    name: list.name,
                    listId: list.id
                }
            });
        }
    }

    // 3. Translate Products
    const products = await prisma.product.findMany({
        include: { translations: true }
    });

    for (const prod of products) {
        if (!prod.translations.find(t => t.lang === 'en')) {
            console.log(`Translating Product: ${prod.title}`);
            await prisma.productTranslation.create({
                data: {
                    lang: 'en',
                    title: handleAutoTranslate(prod.title),
                    description: handleAutoTranslate(prod.description),
                    productId: prod.id
                }
            });
        }
        if (!prod.translations.find(t => t.lang === 'es')) {
            await prisma.productTranslation.create({
                data: {
                    lang: 'es',
                    title: prod.title,
                    description: prod.description || '',
                    productId: prod.id
                }
            });
        }
    }

    console.log('✅ Database Translation Repair Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
