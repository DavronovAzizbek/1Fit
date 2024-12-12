-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "user_platform_id" INTEGER NOT NULL,
    "firstName" TEXT,
    "email" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gyms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "gyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gymsSport" (
    "id" SERIAL NOT NULL,
    "gymsId" INTEGER NOT NULL,
    "sportsId" INTEGER NOT NULL,

    CONSTRAINT "gymsSport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gyms_name_key" ON "gyms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sports_name_key" ON "sports"("name");

-- AddForeignKey
ALTER TABLE "gymsSport" ADD CONSTRAINT "gymsSport_gymsId_fkey" FOREIGN KEY ("gymsId") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gymsSport" ADD CONSTRAINT "gymsSport_sportsId_fkey" FOREIGN KEY ("sportsId") REFERENCES "sports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
