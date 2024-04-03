const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Blockchain" },
                { name: "Music" },
                { name: "Business" },
                { name: "Engineering" },
                { name: "Computer Science" },
                { name: "Hardware" },
                { name: "Other" }
            ]
        });
        console.log("seeded categories");
    } catch (error) {
        console.log("failed to seed categories", error);
    } finally {
        await db.$disconnect();
    }
}
main();
