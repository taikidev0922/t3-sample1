/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Control` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Control` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Control" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Control_code_key" ON "Control"("code");
