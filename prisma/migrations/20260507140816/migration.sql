-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AlbumImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "albumId" INTEGER NOT NULL,
    CONSTRAINT "AlbumImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AlbumImage" ("albumId", "created_at", "id", "image", "is_shown") SELECT "albumId", "created_at", "id", "image", "is_shown" FROM "AlbumImage";
DROP TABLE "AlbumImage";
ALTER TABLE "new_AlbumImage" RENAME TO "AlbumImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
