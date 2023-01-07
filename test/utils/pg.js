const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main(body) {
  try {
    const users = await prisma.user.createMany({
      data: body,
      skipDuplicates: true,
    });
    return users;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = { main, prisma };
