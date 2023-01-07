-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "surname" TEXT,
    "dob" TEXT,
    "gender" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
