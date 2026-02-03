const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    try {
        console.log('Starting cleanup...');

        // 1. Find the General category
        const generalCat = await prisma.category.findUnique({
            where: { name: 'General' }
        });

        if (generalCat) {
            console.log('Found General category. Deleting associated lists and the category itself...');

            // Delete will fail if there are products associated without cascading?
            // Prisma schema for Product has categories @relation("CategoryToProduct") which is N:N.
            // We should disconnect products first if they exist.

            await prisma.category.update({
                where: { id: generalCat.id },
                data: {
                    products: { set: [] },
                    lists: { deleteMany: {} }
                }
            });

            await prisma.category.delete({
                where: { id: generalCat.id }
            });

            console.log('General category and its lists deleted successfully.');
        } else {
            console.log('General category not found.');
        }

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
