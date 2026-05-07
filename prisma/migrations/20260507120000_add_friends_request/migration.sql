CREATE TABLE "FriendsRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromProfileId" INTEGER NOT NULL,
    "toProfileId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FriendsRequest_fromProfileId_fkey" FOREIGN KEY ("fromProfileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FriendsRequest_toProfileId_fkey" FOREIGN KEY ("toProfileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "FriendsRequest_fromProfileId_toProfileId_key" ON "FriendsRequest"("fromProfileId", "toProfileId");
CREATE INDEX "FriendsRequest_fromProfileId_idx" ON "FriendsRequest"("fromProfileId");
CREATE INDEX "FriendsRequest_toProfileId_idx" ON "FriendsRequest"("toProfileId");
