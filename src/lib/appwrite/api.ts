import { ID } from "appwrite";
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";

export const createUserAccount = async (user: INewUser) => {
   try {
      const newAccount = await account.create(
         ID.unique(),
         user.email,
         user.password,
         user.name
      );
      if (!newAccount) {
         throw new Error("Failed to create user account");
      }

      const avatarUrl = avatars.getInitials(user.name);
      const newUser = await saveUserToDB({
         accountId: newAccount.$id,
         email: user.email,
         name: user.name,
         imageUrl: new URL(avatarUrl),
         username: user.username,
      });
      return newUser;
   } catch (error) {
      console.error("Error creating user account: ", error);
      throw new Error("Failed to create user account");
   }
};

export const saveUserToDB = async (user: {
   accountId: string;
   email: string;
   name: string;
   imageUrl: URL;
   username?: string;
}) => {
   try {
      const newUser = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         user
      );
      return newUser;
   } catch (error) {
      console.error("Error saving user to database: ", error);
      throw new Error("Failed to save user to database");
   }
};

export const signInAccount = async (user: {
   email: string;
   password: string;
}) => {
   try {
      const session = await account.createEmailPasswordSession(
         user.email,
         user.password
      );
      return session;
   } catch (error) {
      console.error("Error signing in: ", error);
      throw new Error("Failed to sign in");
   }
};
