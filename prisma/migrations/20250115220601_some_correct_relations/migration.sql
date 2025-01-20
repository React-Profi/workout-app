/*
  Warnings:

  - You are about to drop the `_ExerciseToExerciseLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExerciseToExerciseLog" DROP CONSTRAINT "_ExerciseToExerciseLog_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseToExerciseLog" DROP CONSTRAINT "_ExerciseToExerciseLog_B_fkey";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "exercise_log_id" INTEGER;

-- DropTable
DROP TABLE "_ExerciseToExerciseLog";

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_exercise_log_id_fkey" FOREIGN KEY ("exercise_log_id") REFERENCES "Exercise_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;
