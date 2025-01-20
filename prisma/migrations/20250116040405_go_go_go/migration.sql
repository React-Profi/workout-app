/*
  Warnings:

  - You are about to drop the column `exercise_log_id` on the `Exercise` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_exercise_log_id_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "exercise_log_id";

-- CreateTable
CREATE TABLE "_ExerciseToExerciseLog" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExerciseToExerciseLog_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ExerciseToExerciseLog_B_index" ON "_ExerciseToExerciseLog"("B");

-- AddForeignKey
ALTER TABLE "_ExerciseToExerciseLog" ADD CONSTRAINT "_ExerciseToExerciseLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToExerciseLog" ADD CONSTRAINT "_ExerciseToExerciseLog_B_fkey" FOREIGN KEY ("B") REFERENCES "Exercise_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;
