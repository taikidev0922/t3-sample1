-- CreateTable
CREATE TABLE "Control" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Control_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlDetail" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "controlId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Control_name_key" ON "Control"("name");

-- CreateIndex
CREATE INDEX "Control_name_idx" ON "Control"("name");

-- CreateIndex
CREATE INDEX "ControlDetail_code_idx" ON "ControlDetail"("code");

-- CreateIndex
CREATE INDEX "ControlDetail_name_idx" ON "ControlDetail"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ControlDetail_controlId_code_key" ON "ControlDetail"("controlId", "code");

-- AddForeignKey
ALTER TABLE "ControlDetail" ADD CONSTRAINT "ControlDetail_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
