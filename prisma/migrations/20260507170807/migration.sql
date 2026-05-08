-- CreateTable
CREATE TABLE "profile_app_profile_friends" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileOneId" INTEGER NOT NULL,
    "profileTwoId" INTEGER NOT NULL,
    CONSTRAINT "profile_app_profile_friends_profileOneId_fkey" FOREIGN KEY ("profileOneId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "profile_app_profile_friends_profileTwoId_fkey" FOREIGN KEY ("profileTwoId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
