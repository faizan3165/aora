import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.faizan.aora",
  projectId: "669c732f0023e625d9a5",
  databaseId: "669c771600240f96e53d",
  userCollectionId: "669c773000083955ced8",
  videoCollectionId: "669c7745001c8192ec89",
  storageId: "669c7840003311042d41",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
