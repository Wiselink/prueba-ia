-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PENDIENTE', 'ATENDIENDO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SECRETARIA', 'DOCTOR');

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "pacienteNombre" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'PENDIENTE',
    "orden" INTEGER NOT NULL,
    "timestampCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Turno_codigo_key" ON "Turno"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
