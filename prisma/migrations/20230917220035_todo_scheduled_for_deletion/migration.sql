-- CreateTable
CREATE TABLE "TodoScheduledForDeletion" (
    "todo_id" INTEGER NOT NULL,
    "to_be_deleted_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TodoScheduledForDeletion_todo_id_key" ON "TodoScheduledForDeletion"("todo_id");
